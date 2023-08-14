# BiteSpeed Assignment

[![Hosted URL](https://img.shields.io/badge/Hosted%20URL-bitespeed--assignment--lo9q.onrender.com-blue.svg)](https://bitespeed-assignment-lo9q.onrender.com)

[![Postman](https://img.shields.io/badge/Postman-Run%20in%20Postman-orange.svg)](https://www.postman.com/payload-operator-23565686/workspace/bitespeed-assignment/collection/22904553-659d4ec3-6b29-4316-95b2-4a2c7db487eb?action=share&creator=22904553)

This repository contains the code for the BiteSpeed Assignment, which is a web application for performing various operations with a PostgreSQL database.

## API Endpoints

- Base API URL: `https://bitespeed-assignment-lo9q.onrender.com/api/`

### Get All Data

- **Method:** POST
- **Endpoint:** `/get_all`
- **Description:** Retrieve all values stored in the PostgreSQL database.

### Clear All Data

- **Method:** POST
- **Endpoint:** `/clear_all`
- **Description:** Clear the entire database, removing all stored data.

### Identify

- **Method:** POST
- **Endpoint:** `/identify`
- **Description:** Identify a contact using JSON data. Provide an email and phone number in the request body as follows:

```json
{
  "email": "george@hillvalley.edu",
  "phoneNumber": "717171"
}
