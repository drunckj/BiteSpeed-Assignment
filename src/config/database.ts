import "reflect-metadata"
import { DataSource } from "typeorm"
import { Contact } from "../models/Contact"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "nigga",
    database: "BiteSpeed",
    synchronize: true,
    logging: false,
    entities: [Contact],
    migrations: [],
    subscribers: [],
})
export const userRepository = AppDataSource.getRepository(Contact);

