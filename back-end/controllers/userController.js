
const transporter = require('../config/mailConfig');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const EMAIL_VERIFICATION_TIMEOUT = 180 * 60 * 1000; // 3 hours

// Function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

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
        console.log(newUser.name);
        console.log(newUser.password);
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
exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Validate the verification code and its expiry
        if (!user.emailVerificationCode || user.emailVerificationCode !== code || new Date() > user.verificationCodeExpiry) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Update user's verification status
        user.isVerified = true;
        user.emailVerificationCode = null; // Clear the verification code
        user.verificationCodeExpiry = null; // Clear the expiry date
        await user.save(); // Save changes

        // Send success response
        res.status(200).json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error('Error verifying email: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // استخدم bcrypt للمقارنة بين كلمة المرور المدخلة وكلمة المرور المجزأة في قاعدة البيانات
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async(req, res) => {
    try{
        const {email , password} = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        // Use bcrypt to compare the password entered with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        if(!user.isVerified){
            return res.status(400).json({ message : 'Please verify your email first'});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '3h'}
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const exists_user = await User.findOne({ email });
        if (exists_user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
            isVerified: true,
        });

        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error('Error adding user: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

  exports.getUser = async (req, res) => {
    try {
      const { id } = req.params;
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      let userResponse;
      
      if (req.user.role === 'admin') {
        userResponse = { ...user._doc, password: undefined };
      } else if (req.user.id === id) {
        userResponse = { ...user._doc };
      }
  
      res.status(200).json(userResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getAllUsers = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const users = await User.find().select('-password'); 
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;
      const updates = {};
      if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (req.user.id === id) {
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (req.body.password) updates.password = req.body.password; 
        if (role) {
          return res.status(403).json({ message: 'You cannot change your role' });
        }
      }
      if (req.user.role === 'admin') {
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (req.body.password) {
          return res.status(403).json({ message: 'Admin cannot change user password' });
        }
      }
  
      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      // Verify that the user performing the delet is the same as the specified user or an admin.
      if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };