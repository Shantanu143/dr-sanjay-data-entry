const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

// @route   GET /api/analytics/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const { period = 'daily' } = req.query;

        // Calculate date range based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case 'daily':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'monthly':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            default:
                startDate = new Date(now.setHours(0, 0, 0, 0));
        }

        // Total patients
        const totalPatients = await Patient.countDocuments({});

        // New patients in period
        const newPatients = await Patient.countDocuments({
            createdAt: { $gte: startDate },
        });

        // Gender distribution
        const genderDistribution = await Patient.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json({
            totalPatients,
            newPatients,
            period,
            genderDistribution: genderDistribution.map((item) => ({
                gender: item._id,
                count: item.count,
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/analytics/trends
// @desc    Get patient trends over time
// @access  Private
router.get('/trends', protect, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const trends = await Patient.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            trends: trends.map((item) => ({
                date: item._id,
                count: item.count,
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
