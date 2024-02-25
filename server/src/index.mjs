import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import routes from "./routes/index.mjs";
import mongoose from "mongoose";
import cors from "cors";


const app = express();

mongoose.connect("mongodb://localhost:27017/express_tutorial")
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(routes);

app.use(cors({
    origin: 'http://localhost:5173' // Only allow requests from this origin
}));

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})