const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/patients
// @desc    Get all patients with pagination, search, and filters
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            gender = '',
            startDate = '',
            endDate = '',
        } = req.query;

        const query = {};

        // Optional: Filter by createdBy if you want user-specific patients
        // Commented out to show all patients (including seeded ones)
        // if (req.user && req.user._id) {
        //     query.createdBy = req.user._id;
        // }

        // Search by name or phone
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phoneNo: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by gender
        if (gender) {
            query.gender = gender;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const patients = await Patient.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Patient.countDocuments(query);

        res.json({
            patients,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/patients/:id
// @desc    Get single patient
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/patients
// @desc    Create new patient
// @access  Private
router.post(
    '/',
    protect,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('phoneNo').notEmpty().withMessage('Phone number is required'),
        body('age').isInt({ min: 0, max: 150 }).withMessage('Valid age is required'),
        body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
        body('consent').isBoolean().withMessage('Consent must be a boolean'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Create first visit with medical information
            const firstVisit = {
                visitDate: new Date(),
                notes: req.body.caseTaking || '',
                diagnosis: req.body.diagnosis || '',
                protocol: req.body.protocol || '',
                symptoms: req.body.caseTaking || '', // Use case taking as initial symptoms
                createdBy: req.user._id,
            };

            const patient = await Patient.create({
                name: req.body.name,
                address: req.body.address,
                phoneNo: req.body.phoneNo,
                age: req.body.age,
                gender: req.body.gender,
                consent: req.body.consent,
                visits: [firstVisit], // Add first visit automatically
                createdBy: req.user._id,
            });

            res.status(201).json(patient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            createdBy: req.user._id,
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedPatient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/patients/:id
// @desc    Delete patient
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            createdBy: req.user._id,
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        await Patient.findByIdAndDelete(req.params.id);

        res.json({ message: 'Patient removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/patients/:id/visits
// @desc    Add a new visit to patient
// @access  Private
router.post('/:id/visits', protect, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const newVisit = {
            visitDate: req.body.visitDate || new Date(),
            notes: req.body.notes,
            diagnosis: req.body.diagnosis,
            protocol: req.body.protocol,
            symptoms: req.body.symptoms,
            createdBy: req.user._id,
        };

        patient.visits.push(newVisit);
        await patient.save();

        res.status(201).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/patients/:id/visits
// @desc    Get all visits for a patient
// @access  Private
router.get('/:id/visits', protect, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Sort visits by date (most recent first)
        const visits = patient.visits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

        res.json(visits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/patients/:id/visits/:visitId
// @desc    Delete a visit from patient
// @access  Private
router.delete('/:id/visits/:visitId', protect, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.visits = patient.visits.filter(
            (visit) => visit._id.toString() !== req.params.visitId
        );

        await patient.save();

        res.json({ message: 'Visit removed', patient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
