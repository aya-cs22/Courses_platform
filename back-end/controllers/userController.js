
const transporter = require('../config/mailConfig');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const EMAIL_VERIFICATION_TIMEOUT = 60 * 60 * 1000; // 1 hours

// Function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone_number } = req.body;

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
            phone_number,
            password,
            isVerified: false,
            emailVerificationCode: generateVerificationCode(),
            verificationCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT)
        });

        await newUser.save();
        console.log(newUser.name);
        console.log(newUser.password);
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: newUser.email,
            subject: 'Email Verification Code from Code Eagles',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <header style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to Code Eagles!</h1>
                </header>
                <div style="padding: 20px;">
                    <h2 style="font-size: 20px; color: #333;">Hello, ${newUser.name}!</h2>
                    <p style="color: #555;">Thank you for joining Code Eagles! To complete your registration, please verify your email address using the code below:</p>
                    <div style="text-align: center; margin: 20px 0; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                        <p style="font-size: 1.5em; font-weight: bold; color: #4CAF50;">${newUser.emailVerificationCode}</p>
                    </div>
                    <p style="color: #555;">This code is valid for the next 1 hour. If you didn’t request this email, please ignore it.</p>
                    <p style="margin-top: 20px; color: #555;">Happy Coding!<br>The Code Eagles Team</p>
                </div>
                <footer style="background-color: #f1f1f1; padding: 10px; text-align: center; color: #777; font-size: 14px;">
                    <p>© 2024 Code Eagles, All rights reserved.</p>
                </footer>
            </div>
            `
        };
        await transporter.sendMail(mailOptions);
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

        if (!user.emailVerificationCode || user.emailVerificationCode !== code || new Date() > user.verificationCodeExpiry) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.emailVerificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error('Error verifying email: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// check time virify email
exports.checkVerificationTimeout = async () => {
    try {
        const now = new Date();
        console.log(`Checking for expired users at: ${now}`);
        const expiredUsers = await User.find({
            isVerified: false,
            verificationCodeExpiry: { $lt: now }
        });

        console.log(`Found ${expiredUsers.length} expired users.`);
        if (expiredUsers.length > 0) {
            await User.deleteMany({
                isVerified: false,
                verificationCodeExpiry: { $lt: now }
            });
            console.log(`Deleted ${expiredUsers.length} expired users.`);
        } else {
            console.log('No expired users to delete.');
        }
    } catch (error) {
        console.error('Error checking verification timeout:', error);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour 
        await user.save();

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: 'Reset Password',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
        <header style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Code Eagles Password Reset</h1>
        </header>
        <div style="padding: 20px;">
            <h2 style="font-size: 20px; color: #333;">Hello, ${user.name}!</h2>
            <p style="color: #555;">We received a request to reset your password. Use the code below to reset it:</p>
            <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                <p style="font-size: 2em; font-weight: bold; color: #4CAF50;">${resetCode}</p>
            </div>
            <p style="color: #555;">This code is valid for the next <strong>1 hour</strong>. If you did not request this reset, please ignore this email or contact support if you have any concerns.</p>
            <p style="margin-top: 20px; color: #555;">Best Regards,<br>The Code Eagles Team</p>
        </div>
        <footer style="background-color: #f1f1f1; padding: 10px; text-align: center; color: #777; font-size: 14px;">
            <p>© 2024 Code Eagles, All rights reserved.</p>
            <p style="margin: 0;">Need help? Contact us at <a href="mailto:codeeagles653@gmail.com" style="color: #4CAF50; text-decoration: none;">support@codeeagles.com</a></p>
        </footer>
    </div>
    `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reset password email sent' });
    } catch (error) {
        console.error('Error sending reset password email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { resetCode, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: resetCode,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updatePassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        if (req.user.id === id) {
            const updates = {};
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(password, salt);
            }
            const user = await User.findByIdAndUpdate(id, updates, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            res.status(403).json({ message: 'You are not authorized to update this password' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

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

exports.addUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { name, email, password, phone_number, role, group_id, date_group } = req.body;
        if (!name || !email || !password || !phone_number || !role) {

            return res.status(400).json({ message: 'All fields are required' });
        }


        const exists_user = await User.findOne({ email });
        if (exists_user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            group_id ,
            name,
            email,
            password,
            phone_number,
            role,
            date_group,
            isVerified: true,
        });
    if (group_id ) {
        newUser.group_id = group_id;
    }

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
} catch (error) {
    console.error('Error adding user: ', error);
    res.status(500).json({ message: 'Server error' });
}
};

// get user by id
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

        if (req.user.id !== id && !(req.user.role === 'admin' || req.user.role === 'assistant')) {
            return res.status(403).json({ message: 'Access denied' });
        }


        let userResponse;

        if (req.user.role === 'admin' || req.user.role === 'assistant') {
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
        if (req.user.role !== 'admin' && req.user.role !== 'assistant') {
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
        const { name, email, password, role, group_id } = req.body;
        const updates = {};

        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.user.id === id) {
            if (name) updates.name = name;
            if (email) {
                const existingUser = await User.findOne({ email });
                if (existingUser && existingUser.id !== id) {
                    return res.status(400).json({ message: 'Email already exists' });
                } else {
                    updates.email = email;
                }
            }

            if (password) {
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(password, salt);
            }

            if (role) {
                return res.status(403).json({ message: 'You cannot change your role' });
            }
            if (group_id) {
                return res.status(403).json({ message: 'You cannot change your Group' });
            }
        }

        if (req.user.role === 'admin') {
            if (role) updates.role = role;
            if(group_id) updates.group_id = group_id;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(password, salt);
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


//the user send your feedback
exports.submitFeedback = async (req, res) => {
    const { email, feedback } = req.body;
  
    if (!email || !feedback) {
      return res.status(400).json({ message: 'Email and feedback are required' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.feedback = feedback;
      await user.save();
  
      res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  exports.getAllFeedback = async (req, res) => {
    try {
      const users = await User.find({ feedback: { $exists: true, $ne: null } });
      if (users.length === 0) {
        return res.status(404).json({ message: 'No feedback found' });
      }
  
      const feedbacks = users.map(user => ({ email: user.email, feedback: user.feedback }));
  
      res.status(200).json({ feedbacks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  // Get feedback by user ID
exports.getFeedbackById = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
    
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.feedback) {
        return res.status(404).json({ message: 'No feedback available for this user' });
      }
  
      res.status(200).json({ email: user.email, feedback: user.feedback });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };