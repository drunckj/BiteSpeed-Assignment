import "reflect-metadata"
import { DataSource } from "typeorm"
import { Contact } from "../models/Contact"

export const AppDataSource = new DataSource({
    type:  'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'nigga',
    database: process.env.DB_DATABASE || 'BiteSpeed',
    synchronize: true,
    logging: false,
    entities: [Contact],
    migrations: [],
    subscribers: [],
})
export const userRepository = AppDataSource.getRepository(Contact);

