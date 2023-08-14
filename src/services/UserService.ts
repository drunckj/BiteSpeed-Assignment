import { SelectQueryBuilder, getRepository } from "typeorm";
import { AppDataSource, userRepository } from "../config/database";
import { Contact } from "../models/Contact";
type Data = {
  email: string;
  phoneNumber: string;
};
type Result = {
  contact: object;
};

export const identifyUserService = async (body: Data) => {
  if (body.email === null || body.phoneNumber === null) {
   return NullCheck(body)
  }

  const contacts = await userRepository
    .createQueryBuilder("contact")
    .where(
      "(contact.email = :email OR contact.phoneNumber = :phoneNumber) AND contact.linkPrecedence = :linkPrecedence",
      {
        email: body.email,
        phoneNumber: body.phoneNumber,
        linkPrecedence: "primary",
      }
    )
    .getMany();

  if (contacts.length === 0) {
    const newContact = new Contact();
    newContact.linkPrecedence = "primary";
    newContact.email = body.email;
    newContact.phoneNumber = body.phoneNumber;
    const newuser = await userRepository.save(newContact);
    return {
      contact: {
        primaryContatctId: newuser.id,
        emails: [newuser.email],
        phoneNumbers: [newuser.phoneNumber],
        secondaryContactIds: [],
      },
    };
  } else if (contacts.length > 1) {                   //checks if more than one exists
    if (contacts[0].createdAt < contacts[1].createdAt) {  // sets primary to old field
      contacts[1].linkPrecedence = "secondary";
      contacts[1].linkedContact = contacts[0].id;
      await userRepository.save(contacts[1]);
      return fetchAllValues(contacts[0]);
    } else {
      contacts[0].linkPrecedence = "secondary";
      contacts[0].linkedContact = contacts[1].id;
      await userRepository.save(contacts[0]);
      return fetchAllValues(contacts[1]);
    }
  } else if (
    (contacts[0]?.phoneNumber === String(body.phoneNumber) &&
      contacts[0]?.email === body.email) ||
    (contacts[1]?.phoneNumber === String(body.phoneNumber) &&
      contacts[1]?.email === body.email)
  ) {
    return fetchAllValues(contacts[0]);
  } else {
    const newContact = new Contact();
    newContact.linkPrecedence = "secondary";
    newContact.email = body.email;
    newContact.phoneNumber = String(body.phoneNumber);
    newContact.linkedContact = contacts[0].id;
    await userRepository.save(newContact);
    return fetchAllValues(contacts[0]);
  }
};

const fetchAllValues = async (contact: Contact) => {
  const queryBuilder: SelectQueryBuilder<Contact> =
    userRepository.createQueryBuilder("c");
  queryBuilder
    .select([
      "c.linkedContact AS primaryContatctId",
      "ARRAY_AGG(DISTINCT c.email) AS emails",
      "ARRAY_AGG(DISTINCT c.phoneNumber) AS phoneNumbers",
      "ARRAY_AGG(c.id) AS secondaryContactIds",
    ])
    .where(
      "(c.linkPrecedence = :linkPrecedence AND c.linkedContact = :linkedContact)",
      { linkPrecedence: "secondary", linkedContact: contact.id }
    )
    .groupBy("c.linkedContact");

  const queryResult = await queryBuilder.getRawOne();
  // // to remove null values
  // queryResult.phonenumbers=queryResult.phonenumbers.filter(value => value !== null);
  // queryResult.emails=queryResult.emails.filter(value => value !== null);
  //adding primary values to start
  if (queryResult.emails && !queryResult.emails.includes(contact.email))
    queryResult.emails.unshift(contact.email);
  if (
    queryResult.phonenumbers &&
    !queryResult.phonenumbers.includes(contact.phoneNumber)
  )
    queryResult.phonenumbers.unshift(contact.phoneNumber);
  let result: Result = {
    contact: {
      ...queryResult,
    },
  };

  return result;
};
const NullCheck = async (body: Data) => {
  const result = await userRepository.findOne({
    where: [
      {
        email: body.email,
        linkPrecedence: "primary",
      },
      {
        phoneNumber: body.phoneNumber,
        linkPrecedence: "primary",
      },
      {
        email: body.email,
        linkPrecedence: "secondary",
      },
      {
        phoneNumber: body.phoneNumber,
        linkPrecedence: "secondary",
      },
    ],
  });

  if (result) {
    if (result.linkPrecedence === "primary") return fetchAllValues(result);
    else {
      const secondaryresult = await userRepository.findOne({
        where: [
          {
            id: result.linkedContact,
            linkPrecedence: "primary",
          },
        ],
      });
      return fetchAllValues(secondaryresult);
    }
  } else return "Not found";
};
