
import express from 'express';
import apiRoutes from './routes/apiRoutes';
import {AppDataSource} from "./config/database"
AppDataSource .initialize().then(async () => {

    console.log("database connection successful")

}).catch(error => console.log(error))

const app = express();
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});