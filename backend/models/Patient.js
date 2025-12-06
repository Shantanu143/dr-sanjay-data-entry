const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide patient name'],
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        phoneNo: {
            type: String,
            required: [true, 'Please provide phone number'],
            trim: true,
        },
        age: {
            type: Number,
            required: [true, 'Please provide age'],
            min: 0,
            max: 150,
        },
        gender: {
            type: String,
            required: [true, 'Please provide gender'],
            enum: ['Male', 'Female', 'Other'],
        },
        caseTaking: {
            type: String,
            trim: true,
        },
        diagnosis: {
            type: String,
            trim: true,
        },
        protocol: {
            type: String,
            trim: true,
        },
        consent: {
            type: Boolean,
            required: [true, 'Patient consent is required'],
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster searches
patientSchema.index({ name: 'text', phoneNo: 'text' });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ gender: 1 });

module.exports = mongoose.model('Patient', patientSchema);
