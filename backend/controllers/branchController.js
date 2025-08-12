import Branch from '../models/branch.js';
import Toilet from '../models/toilet.js';
import mongoose from 'mongoose';

const getOneBranch = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid branch ID' });
        }

        const branch = await Branch.findById(id).exec();
        if (!branch) {
            return res.status(404).json({ message: "Could not find specified branch." });
        }
        return res.status(200).json(branch);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when retrieving specified branch." });
        console.error("Could not retrieve specified branch: " + err);
    }
}

const getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        if (branches.length === 0) {
            return res.json({ message: "No branches added." });
        }
        return res.status(200).json(branches);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when retrieving branches." });
        console.error("Could not retrieve branches: " + err);
    }
}

const createBranch = async (req, res) => {
    try {      
        const { branchName, menToiletStallNo, menToiletUrinalNo, menToiletSinkNo, womenToiletStallNo, womenToiletSinkNo } = req.body;
        if (!branchName || !menToiletStallNo || !menToiletUrinalNo || !menToiletSinkNo || !womenToiletStallNo || !womenToiletSinkNo) {
            return res.status(400).json({ message: "Missing info!" });
        }

        if (menToiletStallNo < 0 || menToiletUrinalNo < 0 || menToiletUrinalNo < 0 || womenToiletStallNo < 0 || womenToiletSinkNo < 0) {
            return res.status(400).json({ message: "Numbers must be nonnegative." });
        }

        const existingBranch = await Branch.findOne({ branchName });
        if (existingBranch) {
            return res.status(400).json({ message: "A branch already exists with that name." });
        }
        
        const branchObject = { branchName };
        const toiletObject = { branchName, menToiletStallNo, menToiletUrinalNo, menToiletSinkNo, womenToiletStallNo, womenToiletSinkNo };

        const newBranch = await Branch.create(branchObject);
        const newToilet = await Toilet.create(toiletObject);

        if (!newBranch) {
            return res.status(500).json({ message: "An error occurred when creating new branch." });
        }
        if (!newToilet) {
            return res.status(500).json({ message: "An error occurred when creating new toilet." });
        }
        return res.status(201).json({ message: "New branch and toilet creted successfully." });
    } catch(err) {
        res.status(500).json({ message: "An error occurred when creating new branch and toilet." });
        console.error("Could not create new branch and toilet: " + err);
    }
}

const updateRevenue = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid branch ID.' });
        }

        const { branchRevenue } = req.body;
        if (!branchRevenue) {
            return res.status(400).json({ message: "Missing info!" });
        }

        const branch = await Branch.findById(id).exec();
        if (!branch) {
            return res.status(404).json({ message: "Could not find branch." });
        }

        branch.branchRevenue = branchRevenue;

        const savedBranch = await branch.save();
        if (!savedBranch) {
            return res.status(500).json({ message: "An error occurred when saving branch revenue." });
        }
        return res.status(200).json({ message: "Branch updated successfully." });
    } catch(err) {
        res.status(500).json({ message: "An error occurred when updating branch." });
        console.error("Could not update branch: " + err);
    }
}

const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid branch ID.' });
        }

        const { branchBudget } = req.body;
        if (!branchBudget) {
            return res.status(400).json({ message: "Missing info!" });
        }

        if (branchBudget < 0) {
            return res.status(400).json({ message: "Budget must be nonnegative." });
        }

        const branch = await Branch.findById(id).exec();
        if (!branch) {
            return res.status(404).json({ message: "Could not find branch." });
        }

        branch.branchBudget = branchBudget;

        const savedBranch = await branch.save();
        if (!savedBranch) {
            return res.status(500).json({ message: "An error occurred when saving branch budget." });
        }
        return res.status(200).json({ message: "Branch updated successfully." });
    } catch(err) {
        res.status(500).json({ message: "An error occurred when updating branch." });
        console.error("Could not update branch: " + err);
    }
}

const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid branch ID' });
        }

        const branch = await Branch.findById(id).exec();
        if (!branch) {
            return res.status(404).json({ message: "Could not find branch." });
        }
        
        const deletedBranch = await Branch.deleteOne(branch);

        if (!deletedBranch) {
            return res.status(500).json({ message: "An error occurred when deleting branch!" });
        }
        return res.status(200).json({ message: "Branch deleted successfully." });
    } catch(err) {
        res.status(500).json({ message: "An error occurred when deleting branch." });
        console.error("Could not delete branch: " + err);
    }
}

const getTotalRevenue = async (req, res) => {
    try {
        const totalRevenue = await Branch.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$branchRevenue" }
                }
            }
        ]);
        if (!totalRevenue) {
            return res.status(500).json({ message: "An error occurred when calculating total revenue." });
        }
        return res.status(200).json(totalRevenue);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total revenue." });
        console.error("Could not compute total revenue: " + err);
    }
}

const getTotalBudget = async (req, res) => {
    try {
        const totalBudget = await Branch.aggregate([
            {
                $group: {
                    _id: null,
                    totalBudget: { $sum: "$branchBudget" }
                }
            }
        ]);
        if (!totalBudget) {
            return res.status(500).json({ message: "An error occurred when calculating total budget." });
        }
        return res.status(200).json(totalBudget);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total budget." });
        console.error("Could not compute total budget: " + err);
    }
}

export default { getOneBranch, getAllBranches, createBranch, updateRevenue, updateBudget, deleteBranch, getTotalRevenue, getTotalBudget };