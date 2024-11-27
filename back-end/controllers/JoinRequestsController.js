const transporter = require('../config/mailConfig');
const JoinRequests = require('../models/JoinRequests');
const User = require('../models/users');
const Groups = require('../models/groups');
const moment = require('moment');
const userGroup = require('../models/userGroups');

// Send join request function
exports.sendJoinRequest = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        console.log("User ID from request:", userId);

        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const existingRequest = await JoinRequests.findOne({ group_id: groupId, user_id: userId });
        if (existingRequest) {
            return res.status(400).json({ message: 'Join request already sent' });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found with ID:', userId);  
            return res.status(404).json({ message: 'User not found' });
        }

        const joinRequest = new JoinRequests({
            group_id: groupId,
            user_id: userId,
            status: 'pending',
        });
        await joinRequest.save();

        const adminEmail = process.env.ADMIN_EMAIL;

        const mailOptions = {
            from: user.email,
            to: adminEmail, 
            subject: 'New Join Request',
            html: `
            <p>Hello Admin,</p>
            <p>The user <strong>${user.name}</strong> (<a href="mailto:${user.email}">${user.email}</a>) has requested to join the group "<strong>${group.title}</strong>".</p>
            <p>Please review the request and take appropriate action:</p>
            <div style="display: flex; gap: 10px;">

                <form action="http://localhost:8000/api/JoinRequests/approve-join-request" method="POST">
                    <button type="submit" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        Accept
                    </button>
                </form>
            </div>


             <div style="display: flex; gap: 10px;">

                <form action="http://localhost:8000/api/JoinRequests/reject-Join-request" method="POST">
                    <button type="submit" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        Reject
                    </button>
                </form>
            </div>



             <div style="display: flex; gap: 10px;">

                <form action="http://localhost:8000/api/JoinRequests/delet-join-request" method="POST">
                    <button type="submit" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        Delet
                    </button>
                </form>
            </div>
        `,
    };
        transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                console.error('Error sending email: ', error);
                return res.status(500).json({ message: 'Request saved but failed to send email', error: error.message });
            }
            console.log('Email sent', data.response);
        });

        res.status(201).json({ message: 'Join request sent successfully and email notification sent to admin', joinRequest });

    } catch (error) {
        console.error('Error creating join request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Show all join requests only pending
exports.getAllJoinRequests = async(req, res) => {
    try{
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
    
        const pendingJoinRequests = await JoinRequests.find({ status: 'pending' }).populate('user_id group_id');
        if (pendingJoinRequests.length === 0) {
            return res.status(404).json({ message: 'There are no join requests currently in "pending" status' });
        }
        res.status(200).json(pendingJoinRequests);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// accept request
exports.approveJoinRequest = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
          }
        const { requestId, startDate, endDate, lifetimeAccess } = req.body;

        // Find the join request
        const joinRequest = await JoinRequests.findById(requestId);
        if (!joinRequest) {
            return res.status(404).json({ message: 'Join request not found' });
        }

        if (joinRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Request is already processed' });
        }

        // Find the group
        const group = await Groups.findById(joinRequest.group_id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Validate the dates if not lifetime access
        const momentStartDate = moment(startDate);
        const momentEndDate = moment(endDate);

        if (!momentStartDate.isValid() || (!lifetimeAccess && !momentEndDate.isValid())) {
            return res.status(400).json({ message: 'Invalid start or end date' });
        }

        if (!lifetimeAccess && momentEndDate.isBefore(momentStartDate)) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        joinRequest.status = 'approved';
        joinRequest.startDate = momentStartDate;
        joinRequest.endDate = lifetimeAccess ? null : momentEndDate;
        joinRequest.lifetimeAccess = lifetimeAccess;
        await joinRequest.save();

        if (!group.members.some(member => member._id.toString() === joinRequest.user_id.toString())) {
            group.members.push(joinRequest.user_id);
            await group.save();
        }


        const userGroupRecord = new userGroup({
            user_id: joinRequest.user_id,
            group_id: joinRequest.group_id,
            status: 'active', 
        });
        await userGroupRecord.save();
        console.log(`userGroupRecord ${userGroupRecord.status}`);
        const user = await User.findById(joinRequest.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const mailOptions = {
            from: adminEmail,
            to: user.email,
            subject: 'Your Join Request is Approved',
            text: `Hello ${user.name},
      
Your request to join the group "${group.title}" has been approved.

${lifetimeAccess ? 'You have lifetime access to this group.' : `You can access the group until ${momentEndDate.format('YYYY-MM-DD')}.`}

Best Regards,  
Your App Team`
        };

        transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                return res.status(500).json({ message: 'Request approved but failed to send email', error: error.message });
            }
            console.log('Email sent:', data.response);
        });

        res.status(200).json({ message: 'Join request approved successfully', joinRequest });

    } catch (error) {
        console.error('Error approving join request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Reject the join request and remove from userGroup
exports.rejectJoinRequest = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { requestId } = req.body;
        const request = await JoinRequests.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Join request not found' });
        }

        // Update the join request status to 'rejected'
        request.status = 'rejected';
        await request.save();

        // Check if the user is already in the userGroup collection and delete the entry
        const userGroupRecord = await userGroup.findOneAndDelete({
            user_id: request.user_id,
            group_id: request.group_id
        });
        
        if (!userGroupRecord) {
            return res.status(404).json({ message: 'User is not a member of this group' });
        }

        res.status(200).json({ message: 'Join request rejected and user removed from group', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete the join request and the related userGroup
exports.deletJoinRequest = async(req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { requestId } = req.body;
        const request = await JoinRequests.findByIdAndDelete(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Join request not found' });
        }
        await userGroup.deleteOne({ user_id: request.user_id, group_id: request.group_id });

        res.status(200).json({ message: 'Join request and related userGroup entry deleted', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateJoinRequestStatus = async (req, res) => {
    const { userId, groupId, status, startDate, endDate } = req.body;
    console.log('userId:', userId, 'groupId:', groupId); // For debugging

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const joinRequest = await JoinRequests.findOne({ user_id: userId, group_id: groupId });
        if (!joinRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Request status is invalid' });
        }

        if (startDate || endDate) {
            const momentStartDate = moment(startDate);
            const momentEndDate = moment(endDate);

            if (!momentStartDate.isValid() || (endDate && !momentEndDate.isValid())) {
                return res.status(400).json({ message: 'Invalid start or end date' });
            }

            if (endDate && momentEndDate.isBefore(momentStartDate)) {
                return res.status(400).json({ message: 'End date must be after start date' });
            }

            joinRequest.startDate = momentStartDate.toDate();
            joinRequest.endDate = endDate ? momentEndDate.toDate() : null;
        }

        joinRequest.status = status;
        joinRequest.updated_at = Date.now();
        await joinRequest.save();

        const userGroupRecord = await userGroup.findOne({ user_id: userId, group_id: groupId });
        if (userGroupRecord) {
            if (status === 'approved') {
                userGroupRecord.status = 'active';
                if (startDate) userGroupRecord.startDate = joinRequest.startDate;
                if (endDate) userGroupRecord.endDate = joinRequest.endDate;
            } else {
                userGroupRecord.status = 'inactive';
            }
            await userGroupRecord.save();
        } else if (status === 'approved') {
            const newUserGroup = new userGroup({
                user_id: userId,
                group_id: groupId,
                status: 'active',
                startDate: joinRequest.startDate,
                endDate: joinRequest.endDate,
            });
            await newUserGroup.save();
        }

        return res.status(200).json({
            message: 'Status and membership duration updated successfully',
            joinRequest,
        });
    } catch (error) {
        console.error('Error updating join request status:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
