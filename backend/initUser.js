const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const initializeUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Delete all existing users to start fresh
        await User.deleteMany({});
        console.log('Deleted all existing users');

        // Create new user
        const user = await User.create({
            email: 'dr.sanjay@gmail.com',
            password: 'Dr.sanjay@123',
        });

        console.log('\n✅ User created successfully!');
        console.log('📧 Email: dr.sanjay@gmail.com');
        console.log('🔑 Password: test123');
        console.log('\n💡 You can now login with these credentials.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

initializeUser();
