import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import errorHandler from './utils/errorHandler.js';

const app = express();
const PORT = process.env.PORT;
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname, '../frontend/')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

import authRoute from './routes/authRoute.js';
import branchRoutes from './routes/branchRoutes.js';
import toiletRoutes from './routes/toiletRoutes.js';
import userRoutes from './routes/userRoutes.js';

app.use('/api/auth', authRoute);
app.use('/api/branches', branchRoutes);
app.use('/api/toilets', toiletRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/home.html'));});
app.get('/auth/login', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/login.html'));});
app.get('/users/admin/add', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/add-user.html'));});
app.get('/users/admin/:id/edit-user', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/edit-user.html'));});
app.get('/users/admin/change-password/:id', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/change-password.html'));});
app.get('/users/change-password', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/change-password.html'));});
app.get('/users/admin/', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/view-users.html'));});
app.get('/users/admin/:id', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/view-users.html'));});
app.get('/branches/add', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/add-branch.html'));});
app.get('/toilets/:name/edit-man', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/edit-man.html'));});
app.get('/toilets/:name/edit-woman', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/edit-woman.html'));});
app.get('/toilets/:name/men', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/edit-man.html'));});
app.get('/toilets/:name/women', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/edit-woman.html'));});
app.get('/branches/', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/view-branches.html'));});
app.get('/branches/update-revenue/:id', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/view-branches.html'));});
app.get('/branches/update-budget/:id', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/view-branches.html'));});
app.get('/branches/:id', (req, res) => {res.sendFile(path.join(__dirname, '../frontend/view-branches.html'));});

connectDB();

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});

app.use(errorHandler);