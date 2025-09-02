import User from '../models/user.js';
import argon from 'argon2';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { secret, expiresIn } from '../config/jwt.js';

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Missing info!' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Either the username or password is incorrect.' });
        }

        const passwordComparison = await argon.verify(user.password, password);
        if (!passwordComparison) {
            return res.status(401).json({ message: 'Either the username or password is incorrect.' });
        }

        const payload = {
            user: {
              id: user._id,
              role: user.role
           },
        };
      
        jwt.sign(payload, secret, { expiresIn }, (error, token) => {
            if (error) {
                console.error('Error signing token: ', error);
                return res.status(500).json({ message: 'An error occurred during token generation.' });
            }
            return res.status(200).json({ token, id: user._id, role: user.role });
        });

    } catch (err) {
        console.error('Error logging in: ', err);
        res.status(500).json({ message: 'An error occured during attempted login.' });
    }
}

/*
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing info!' });
        }

        if (password.length < 8) {
            return res.status(401).json({ message: 'Password must contain at least 8 chararcters.' });
        }

        if (role !== "Manager" && role !== "Admin") {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await argon.hash(password, saltRounds);

        const newUser = await User.create({ username, email, password: hashedPassword, role });
        await newUser.save();

        if (!newUser) {
            return res.status(500).json({ message: 'An error occurred while adding user!' });
        }

        return res.status(201).json({ message: 'User added successfully' });
    } catch (err) {
        console.error('Error signing up: ', err);
        res.status(500).json({ message: 'An error occurred while adding user.' });
    }
}
*/

const getOneUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        return res.status(200).json(user);
    } catch(err) {
        console.error('Error getting user: ', err);
        res.status(500).json({ message: 'An error occurred when getting specified user.' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            res.status(500).json({ message: 'Cannot load users.' }); // One has to be logged in to execute this function, thus the user array cannot be empty.
        }
        return res.status(200).json(users);
    } catch(err) {
        console.error('Error getting users: ', err);
        res.status(500).json({ message: 'An error occurred when getting users.' });
    }
}

const addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing info!' });
        }

        if (password.length < 8) {
            return res.status(401).json({ message: 'Password must contain at least 8 chararcters.' });
        }

        if (role !== "Manager" && role !== "Admin") {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const saltRounds = 10;
        const hashedPassword = await argon.hash(password, saltRounds);

        const newUser = await User.create({ username, email, password: hashedPassword, role });
        await newUser.save();

        if (!newUser) {
            return res.status(500).json({ message: 'An error occurred while adding user!' });
        }

        return res.status(201).json({ message: 'User added successfully.' });
    } catch (err) {
        console.error('Error signing up: ', err);
        res.status(500).json({ message: 'An error occurred while adding user.' });
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({ message: "Missing info!" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: 'Could not find user.' });
        }

        user.username = username;
        user.email = email;

        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(500).json({ message: 'An error occurred when saving user details.' });
        }
        return res.status(200).json({ message: 'User details updated.' });
    } catch(err) {
        console.error('Error updating user details: ', err);
        res.status(500).json({ message: 'An error occurred while updating user details.' });
    }
}

const changeOwnUserPassword = async (req, res) => {
    try {
        const reqID = req.user?.id;
        const requester = await User.findById(reqID).exec();

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Missing info!' });
        }

        const passwordComparison = await argon.verify(requester.password, oldPassword);
        if (!passwordComparison) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }
        
        if (newPassword.length < 8) {
            return res.status(401).json({ message: 'New password must contain at least 8 chararcters.' });
        }

        if (oldPassword === newPassword) {
            return res.status(401).json({ message: 'New password cannot be the same as the old password.' });
        }
        
        const saltRounds = 10;
        const hashedPassword = await argon.hash(newPassword, saltRounds);
        requester.password = hashedPassword;
        
        const changedUserPass = await requester.save();
        if (!changedUserPass) {
            return res.status(500).json({ message: 'An error occurred when saving changed user password.' });
        }
        return res.status(200).json({ message: `Password changed successfully.` });
    } catch(err) {
        console.error('Error updating user password: ', err);
        res.status(500).json({ message: 'An error occurred while updating user password.' });
    }
}

const changeUserPasswordAsAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).exec();

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Missing info!' });
        }

        const passwordComparison = await argon.verify(user.password, oldPassword);
        if (!passwordComparison) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }
        
        if (newPassword.length < 8) {
            return res.status(401).json({ message: 'New password must contain at least 8 chararcters.' });
        }

        if (oldPassword === newPassword) {
            return res.status(401).json({ message: 'New password cannot be the same as the old password.' });
        }
        
        const saltRounds = 10;
        const hashedPassword = await argon.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        
        const changedUserPass = await user.save();
        if (!changedUserPass) {
            return res.status(500).json({ message: 'An error occurred when saving changed user password.' });
        }
        return res.status(200).json({ message: `User password for user ${user.username} changed successfully.` });
    } catch(err) {
        console.error('Error updating user password: ', err);
        res.status(500).json({ message: 'An error occurred while updating user password.' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (req.user?.id === id) {
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        }

        const deletedUser = await User.deleteOne(user);
        if (!deletedUser) {
            return res.status(500).json({ message: 'An error occurred when deleting user!' });
        }
        return res.status(200).json({ message: 'User deleted successfully.' });
        
    } catch(err) {
        console.error('Could not delete user: ', err);
        res.status(500).json({ message: 'An error occurred when deleting user.' });
    }
}

export default { login, /* register,*/ getOneUser, getAllUsers, addUser, editUser, changeOwnUserPassword, changeUserPasswordAsAdmin, deleteUser };