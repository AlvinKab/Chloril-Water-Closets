import { Schema, model } from 'mongoose';

const branchSchema = new Schema({
    branchName: {
        type: String,
        required: true,
        unique: true
    },
    branchRevenue: {
        type: Number,
        set: val => Math.round(val * 100) / 100,
        default: 0
    },
    branchBudget: {
        type: Number,
        set: val => Math.round(val * 100) / 100,
        default: 0
    }
}, {timestamps: true});

export default model('branch', branchSchema);