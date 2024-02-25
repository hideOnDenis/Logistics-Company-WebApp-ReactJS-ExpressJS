import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import routes from "./routes/index.mjs";
import mongoose from "mongoose";


const app = express();

mongoose.connect("mongodb://localhost:27017/express_tutorial")
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})