import mongoose from 'mongoose';

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch(err) {
        console.error("Error connectiong to MongoDB: ", err);
    }
}

export default connectDB;