const transporter = require('../config/mailConfig');
const JoinRequests = require('../models/JoinRequests');
const User = require('../models/users');
const Groups = require('../models/groups');
const moment = require('moment');
const userGroup = require('../models/userGroups');
const mongoose = require('mongoose');

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

        let userGroupRecord = await userGroup.findOne({
            user_id: userId,
            group_id: groupId
        });

        if (!userGroupRecord) {
            userGroupRecord = new userGroup({
                user_id: userId,
                group_id: groupId,
                status: 'inactive',
            });
            await userGroupRecord.save();
        } else {
            // If the userGroup exists, just update the status to 'inactive'
            userGroupRecord.status = 'inactive';
            await userGroupRecord.save();
        }

        // Send email to admin
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



// Approve join request
exports.approveJoinRequest = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { requestId, startDate, endDate, lifetimeAccess } = req.body;
        
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

        // Validate the dates if lifetimeAccess is false
        const momentStartDate = moment(startDate);

        if (!momentStartDate.isValid()) {
            return res.status(400).json({ message: 'Invalid start date' });
        }

        if (!lifetimeAccess) {
            const momentEndDate = moment(endDate);

            if (!momentEndDate.isValid()) {
                return res.status(400).json({ message: 'Invalid end date' });
            }

            if (momentEndDate.isBefore(momentStartDate)) {
                return res.status(400).json({ message: 'End date must be after start date' });
            }

            joinRequest.endDate = momentEndDate.toDate();
        } else {
            joinRequest.endDate = null; // No end date for lifetime access
        }

        joinRequest.status = 'approved';
        joinRequest.startDate = momentStartDate.toDate();
        joinRequest.lifetimeAccess = lifetimeAccess;
        await joinRequest.save();

        if (!group.members.some(member => member.toString() === joinRequest.user_id.toString())) {
            group.members.push(joinRequest.user_id);
            await group.save();
        }

        const userGroupRecord = await userGroup.findOne({
            user_id: joinRequest.user_id,
            group_id: joinRequest.group_id
        });

        if (userGroupRecord) {
            userGroupRecord.status = 'active';
            await userGroupRecord.save();
        } else {
            const newUserGroupRecord = new userGroup({
                user_id: joinRequest.user_id,
                group_id: joinRequest.group_id,
                status: 'active',
            });
            await newUserGroupRecord.save();
        }

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

${lifetimeAccess ? 'You have lifetime access to this group.' : `You can access the group until ${moment(endDate).format('YYYY-MM-DD')}.`}

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

        request.status = 'rejected';
        await request.save();

        let userGroupRecord = await userGroup.findOne({
            user_id: request.user_id,
            group_id: request.group_id
        });

        if (!userGroupRecord) {
            userGroupRecord = new userGroup({
                user_id: request.user_id,
                group_id: request.group_id,
                status: 'inactive',
            });
            await userGroupRecord.save();
        } else {
            userGroupRecord.status = 'inactive';
            await userGroupRecord.save();
        }

        const group = await Groups.findById(request.group_id);
        if (group) {
            if (group.members.includes(request.user_id)) {
                group.members = group.members.filter(member => member.toString() !== request.user_id.toString());
                await group.save();
            }
        }

        res.status(200).json({ message: 'Join request rejected and user removed from group (if present)', request });
    } catch (error) {
        console.error('Error rejecting join request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Delete the join request, related userGroup, and remove user from group members
exports.deleteJoinRequest = async (req, res) => {
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
        const group = await Groups.findById(request.group_id);
        if (group) {
            group.members = group.members.filter(member => member.toString() !== request.user_id.toString());
            await group.save();
        }

        res.status(200).json({ message: 'Join request, related userGroup entry, and user removed from group members', request });
    } catch (error) {
        console.error('Error deleting join request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.updateJoinRequestStatus = async (req, res) => {
    const { userId, groupId, status, startDate, endDate } = req.body;

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const joinRequest = await JoinRequests.findOne({ user_id: userId, group_id: groupId });
        if (!joinRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        if (startDate || endDate) {
            const momentStartDate = moment(startDate, 'YYYY-MM-DD', true);
            const momentEndDate = moment(endDate, 'YYYY-MM-DD', true);

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
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (status === 'approved') {
            const userGroupRecord = await userGroup.findOne({ user_id: userId, group_id: groupId });
            if (!userGroupRecord) {
                const newUserGroup = new userGroup({
                    user_id: userId,
                    group_id: groupId,
                    status: 'active',
                    startDate: joinRequest.startDate,
                    endDate: joinRequest.endDate,
                });

                await newUserGroup.save();
                console.log("New user group added:", newUserGroup);
                if (!Array.isArray(group.members)) {
                    group.members = [];
                }

                const userObjectId = mongoose.Types.ObjectId(userId);
                const memberExists = group.members.some(member =>
                    member.user_id && member.user_id.toString() === userObjectId.toString()
                );

                if (!memberExists) {
                    group.members.push({ user_id: userObjectId });
                    group.updated_at = Date.now();
                    await group.save();
                    console.log("User added to group:", userId);
                } else {
                    console.log("User already a member of the group.");
                }
            } else if (userGroupRecord.status !== 'active') {
                userGroupRecord.status = 'active';
                await userGroupRecord.save();
            }
        } else {
            const userGroupRecord = await userGroup.findOne({ user_id: userId, group_id: groupId });
            if (userGroupRecord) {
                userGroupRecord.status = 'inactive';
                await userGroupRecord.save();
            }
            group.members = group.members.filter(member =>
                member.user_id && member.user_id.toString() !== userId.toString()
            );

            group.updated_at = Date.now();
            await group.save();
        }

        return res.status(200).json({
            message: 'Status and membership updated successfully',
            joinRequest,
        });
    } catch (error) {
        console.error('Error updating join request status:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
