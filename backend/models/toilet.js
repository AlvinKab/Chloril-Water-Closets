import { Schema, model } from 'mongoose';
import { type } from 'os';

const toiletSchema = new Schema({
    branchName: {
        type: String,
        ref: 'branch',
        required: true,
    },
    menToiletStallNo: {
        type: Number
    },
    menToiletStallStatus: {
        bowlAndCisternStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        bidetStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        toiletPaperStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        }
    },
    menToiletStallStatusDetails: {
        type: [String],
        default: ["All Good", "All Good", "All Good"]
    },
    menToiletUrinalNo: Number,
    menToiletUrinalStatus: {
        urinalStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        }
    },
    menToiletUrinalStatusDetails: {
        type: [String],
        default: ["All Good"]
    },
    menToiletSinkNo: Number,
    menToiletSinkStatus: {
        tapAndDrainStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        soapStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        paperTowelStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        }
    },
    menToiletSinkStatusDetails: {
        type: [String],
        default: ["All Good", "All Good", "All Good"]
    },
    womenToiletStallNo: Number,
    womenToiletStallStatus: {
        bowlAndCisternStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        bidetStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        toiletPaperStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        }
    },
    womenToiletStallStatusDetails: {
        type: [String],
        default: ["All Good", "All Good", "All Good"]
    },
    womenToiletSinkNo: Number,
    womenToiletSinkStatus: {
        tapAndDrainStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        soapStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        },
        paperTowelStatus: {
            type: String,
            enum: ["Good", "Acceptable", "Bad", "Critical"],
            default: "Good"
        }
    },
    womenToiletSinkStatusDetails: {
        type: [String],
        default: ["All Good", "All Good", "All Good"]
    }
}, {timestamps: true});

export default model('toilet', toiletSchema);