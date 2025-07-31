import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import errorHandler from './utils/errorHandler.js';

const app = express();
const PORT = process.env.PORT;

// app.use(express.static(path.join(__dirname, '../frontend/')));
app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

import authRoute from './routes/authRoute.js';
import branchRoutes from './routes/branchRoutes.js';
import toiletRoutes from './routes/toiletRoutes.js';
import userRoutes from './routes/userRoutes.js';

app.use('/auth', authRoute);
app.use('/branches', branchRoutes);
app.use('/toilets', toiletRoutes);
app.use('/users', userRoutes);

connectDB();

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on("error", err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})