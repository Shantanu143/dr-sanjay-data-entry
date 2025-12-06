const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const initializeUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'dr.sanjay@gmail.com' });

        if (existingUser) {
            console.log('User already exists!');
            process.exit(0);
        }

        // Create new user
        const user = await User.create({
            email: 'dr.sanjay@gmail.com',
            password: 'Dr.sanjay@123',
        });

        console.log('User created successfully!');
        console.log('Email:', user.email);
        console.log('You can now login with these credentials.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

initializeUser();
