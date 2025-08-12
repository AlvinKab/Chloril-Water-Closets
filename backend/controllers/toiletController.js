import Toilet from '../models/toilet.js';
import mongoose from 'mongoose';

const getOneToilet = async (req, res) => {
    try {
        const { name } = req.params;

        const toilet = await Toilet.findOne({ branchName: name }).exec();
        if (!toilet) {
            return res.status(404).json({ message: "Could not find specified toilet." });
        }
        return res.status(200).json(toilet);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when retrieving specified toilet." });
        console.error("Could not retrieve specified toilet: " + err);
    }
}

const getAllToilets = async (req, res) => {
    try {
        const toilets = await Toilet.find();
        if (toilets.length === 0) {
            return res.status(200).json({ message: "No toilets added." });
        }
        return res.status(200).json(toilets);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when retrieving toilets." });
        console.error("Could not retrieve toilets: " + err);
    }
}

const updateMenToilet = async (req, res) => {
    try {
        const { name } = req.params;
        const { menToiletStallNo, menToiletStallStatus, menToiletStallStatusDetails, menToiletUrinalNo, menToiletUrinalStatus, menToiletUrinalStatusDetails, menToiletSinkNo, menToiletSinkStatus, menToiletSinkStatusDetails } = req.body;

        if (!menToiletStallNo || !menToiletStallStatus || !menToiletStallStatusDetails || !menToiletUrinalNo || !menToiletUrinalStatus || !menToiletUrinalStatusDetails || !menToiletSinkNo || !menToiletSinkStatus || !menToiletSinkStatusDetails) {
            return res.status(400).json({ message: "Missing info!" });
        }

        if (!menToiletStallStatus.bowlAndCisternStatus || !menToiletStallStatus.bidetStatus || !menToiletStallStatus.toiletPaperStatus || !menToiletUrinalStatus.urinalStatus || !menToiletSinkStatus.tapAndDrainStatus || !menToiletSinkStatus.soapStatus || !menToiletSinkStatus.paperTowelStatus) {
            return res.status(400).json({ message: "Missing info!" });
        }

        if (menToiletStallNo < 0 || menToiletUrinalNo < 0 || menToiletSinkNo < 0) {
            return res.status(400).json({ message: "Numbers must be nonnegative." });
        }
        
        const statusArr = ["Good", "Acceptable", "Bad", "Critical"];
        if (!statusArr.includes(menToiletStallStatus.bowlAndCisternStatus) || !statusArr.includes(menToiletStallStatus.bidetStatus) || !statusArr.includes(menToiletStallStatus.toiletPaperStatus) || !statusArr.includes(menToiletUrinalStatus.urinalStatus) || !statusArr.includes(menToiletSinkStatus.tapAndDrainStatus) || !statusArr.includes(menToiletSinkStatus.soapStatus) || !statusArr.includes(menToiletSinkStatus.paperTowelStatus)) {
            return res.status(400).json({ message: "Invalid status(es)." });
        }

        if (menToiletStallStatusDetails.length > 3 || menToiletUrinalStatusDetails.length > 1 || menToiletSinkStatusDetails.length > 3) {
            return res.status(400).json({ message: "Details array too long." });
        }
        
        const toilet = await Toilet.findOne({ branchName: name }).exec();
        if (!toilet) {
            return res.status(404).json({ message: "Could not find toilet." });
        }
        
        toilet.menToiletStallNo = menToiletStallNo;
        toilet.menToiletStallStatus = menToiletStallStatus;
        toilet.menToiletStallStatusDetails = menToiletStallStatusDetails;
        toilet.menToiletUrinalNo = menToiletUrinalNo;
        toilet.menToiletUrinalStatus = menToiletUrinalStatus;
        toilet.menToiletUrinalStatusDetails = menToiletUrinalStatusDetails;
        toilet.menToiletSinkNo = menToiletSinkNo;
        toilet.menToiletSinkStatus = menToiletSinkStatus;
        toilet.menToiletSinkStatusDetails = menToiletSinkStatusDetails;

        const updatedToilet = await toilet.save();
        if (!updatedToilet) {
            return res.status(500).json({ message: "An error occurred when saving toilet details." });
        }
        return res.status(200).json({ message: "Toilet updated successfully." });
    } catch(err) {
        res.status(500).json({ message: "An error occurred when updating toilet." });
        console.error("Could not update toilet: " + err);
    }
}

const updateWomenToilet = async (req, res) => {
    try {
        const { name } = req.params;
        const { womenToiletStallNo, womenToiletStallStatus, womenToiletStallStatusDetails, womenToiletSinkNo, womenToiletSinkStatus, womenToiletSinkStatusDetails } = req.body;

        if (!womenToiletStallNo || !womenToiletStallStatus || !womenToiletStallStatusDetails || !womenToiletSinkNo || !womenToiletSinkStatus || !womenToiletSinkStatusDetails) {
            return res.status(400).json({ message: "Missing info!" });
        }

        if (!womenToiletStallStatus.bowlAndCisternStatus || !womenToiletStallStatus.bidetStatus || !womenToiletStallStatus.toiletPaperStatus || !womenToiletSinkStatus.tapAndDrainStatus || !womenToiletSinkStatus.soapStatus || !womenToiletSinkStatus.paperTowelStatus) {
            return res.status(400).json({ message: "Missing info!" });
        }

        if (womenToiletStallNo < 0 || womenToiletSinkNo < 0) {
            return res.status(400).json({ message: "Numbers must be nonnegative." });
        }
        
        const statusArr = ["Good", "Acceptable", "Bad", "Critical"];
        if (!statusArr.includes(womenToiletStallStatus.bowlAndCisternStatus) || !statusArr.includes(womenToiletStallStatus.bidetStatus) || !statusArr.includes(womenToiletStallStatus.toiletPaperStatus) || !statusArr.includes(womenToiletSinkStatus.tapAndDrainStatus) || !statusArr.includes(womenToiletSinkStatus.soapStatus) || !statusArr.includes(womenToiletSinkStatus.paperTowelStatus)) {
            return res.status(400).json({ message: "Invalid status(es)." });
        }

        if (womenToiletStallStatusDetails.length > 3 || womenToiletSinkStatusDetails.length > 3) {
            return res.status(400).json({ message: "Details array too long." });
        }
        
        const toilet = await Toilet.findOne({ branchName: name }).exec();
        if (!toilet) {
            return res.status(404).json({ message: "Could not find toilet." });
        }
        
        toilet.womenToiletStallNo = womenToiletStallNo;
        toilet.womenToiletStallStatus = womenToiletStallStatus;
        toilet.womenToiletStallStatusDetails = womenToiletStallStatusDetails;
        toilet.womenToiletSinkNo = womenToiletSinkNo;
        toilet.womenToiletSinkStatus = womenToiletSinkStatus;
        toilet.womenToiletSinkStatusDetails = womenToiletSinkStatusDetails;

        const updatedToilet = await toilet.save();
        if (!updatedToilet) {
            return res.status(500).json({ message: "An error occurred when saving toilet details." });
        }
        return res.status(200).json({ message: "Toilet updated successfully." });
    } catch(err) {
        res.status(500).json({ message: "An error occurred when updating toilet." });
        console.error("Could not update toilet: " + err);
    }
}

const getTotalMenStallNo = async (req, res) => {
    try {
        const totalMenStalls = await Toilet.aggregate([
            {
                $group: {
                    _id: null,
                    totalMenStalls: { $sum: "$menToiletStallNo" }
                }
            }
        ]);
        if (!totalMenStalls) {
            return res.status(500).json({ message: "An error occurred when calculating total number of men's stalls." });
        }
        return res.status(200).json(totalMenStalls);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total number of men's stalls." });
        console.error("Could not compute total number of men's stalls: " + err);
    }    
}

const getTotalWomenStallNo = async (req, res) => { 
    try {
        const totalWomenStalls = await Toilet.aggregate([
            {
                $group: {
                    _id: null,
                    totalWomenStalls: { $sum: "$womenToiletStallNo" }
                }
            }
        ]);
        if (!totalWomenStalls) {
            return res.status(500).json({ message: "An error occurred when calculating total number of women's stalls." });
        }
        return res.status(200).json(totalWomenStalls);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total number of women's stalls." });
        console.error("Could not compute total number of women's stalls: " + err);
    }    
}

const getTotalStallNo = async (req, res) => {
    try {
        const totalStalls = await Toilet.aggregate([
            {
                $group: {
                    _id: null,
                    totalMenStalls: { $sum: "$menToiletStallNo" },
                    totalWomenStalls: { $sum: "$womenToiletStallNo" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalStalls: { $add: ["$totalMenStalls", "$totalWomenStalls"] }
                }
            }
        ]);
        if (!totalStalls) {
            return res.status(500).json({ message: "An error occurred when calculating total number of stalls." });
        }
        return res.status(200).json(totalStalls);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total number of stalls." });
        console.error("Could not compute total number of stalls: " + err);
    }    
}

const getTotalUrinalNo = async (req, res) => {
    try {
        const totalUrinals = await Toilet.aggregate([
            {
                $group: {
                    _id: null,
                    totalUrinals: { $sum: "$menToiletUrinalNo" }
                }
            }
        ]);
        if (!totalUrinals) {
            return res.status(500).json({ message: "An error occurred when calculating total number of urinals." });
        }
        return res.status(200).json(totalUrinals);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total number of urinals." });
        console.error("Could not compute total number of urinals: " + err);
    }    
}

const getTotalMenSinkNo = async (req, res) => { 
    try {
        const totalMenSinks = await Toilet.aggregate([
            {
                $group: {
                    _id: null,
                    totalMenSinks: { $sum: "$menToiletSinkNo" }
                }
            }
        ]);
        if (!totalMenSinks) {
            return res.status(500).json({ message: "An error occurred when calculating total number of men's sinks." });
        }
        return res.status(200).json(totalMenSinks);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total number of men's sinks." });
        console.error("Could not compute total number of men's sinks: " + err);
    }    
}

const getTotalWomenSinkNo = async (req, res) => {
    try {
        const totalWomenSinks = await Toilet.aggregate([
            {
                $group: {
                    _id: null,
                    totalWomenSinks: { $sum: "$womenToiletSinkNo" }
                }
            }
        ]);
        if (!totalWomenSinks) {
            return res.status(500).json({ message: "An error occurred when calculating total number of women's sinks." });
        }
        return res.status(200).json(totalWomenSinks);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total number of women's sinks." });
        console.error("Could not compute total number of women's sinks: " + err);
    }    
}

const getTotalSinkNo = async (req, res) => {
    try {
        const totalSinks = await Toilet.aggregate([
            {
                $group: {
                    _id: null,
                    totalMenSinks: { $sum: "$menToiletSinkNo" },
                    totalWomenSinks: { $sum: "$womenToiletSinkNo" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSinks: { $add: ["$totalMenSinks", "$totalWomenSinks"] }
                }
            }
        ]);
        if (!totalSinks) {
            return res.status(500).json({ message: "An error occurred when calculating total number of sinks." });
        }
        return res.status(200).json(totalSinks);
    } catch(err) {
        res.status(500).json({ message: "An error occurred when computing total number of sinks." });
        console.error("Could not compute total number of sinks: " + err);
    }    
}

export default { getOneToilet, getAllToilets, updateMenToilet, updateWomenToilet, getTotalMenStallNo, getTotalWomenStallNo, getTotalStallNo, getTotalUrinalNo, getTotalMenSinkNo, getTotalWomenSinkNo, getTotalSinkNo };