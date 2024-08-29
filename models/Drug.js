const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
    stock: {
        type: number,
        required: true,
        default: 1
    },
    total: number,
    date: {
        type: Date,
        default: new Date(),
    }
});

const dosesSchema = mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    takenDates: [Date],
    timer: Number,
    takeTime: Date,
    unit: String,
    quantity: Number,
    type: String
});

const todayDrugSchema = mongoose.Schema({
    date: Date,
    taken: Boolean
});

const drugSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: String,
    type: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    stock: [stockSchema],
    doses: [dosesSchema],
    todayDrug: todayDrugSchema
});