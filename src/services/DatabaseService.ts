import { AppDataSource } from "../config/database"
import { Contact } from "../models/Contact"

export const getAllData=()=>
{
    return AppDataSource.manager.find(Contact)

}
export const clearDatabase=()=>
{
    return AppDataSource.manager.clear(Contact);

}