const transporter = require('../config/mailConfig');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const crypto = require('crypto');
const EMAIL_VERIFICATION_TIMEOUT = 180 * 60 * 1000; // 3 hours

// Function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for required fields
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine the role of the user
        const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password, // Consider hashing the password before saving
            isVerified: false,
            emailVerificationCode: generateVerificationCode(), // Call the function to get a code
            verificationCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT)
        });

        // Save the new user to the database
        await newUser.save();

        // Prepare email options
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: newUser.email,
            subject: 'Email Verification',
            text: `Your verification code is: ${newUser.emailVerificationCode}`
        };

        // Send the verification email
        await transporter.sendMail(mailOptions);

        // Send success response
        res.status(200).json({ message: 'Registration successful, please verify your email' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' }); 
    }
};
