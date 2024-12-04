const UserGroup = require('../models/userGroups');
const Groups = require('../models/groups');
const JoinRequests = require('../models/JoinRequests');
const moment = require('moment');
const { use } = require('../config/mailConfig');
const mongoose = require('mongoose');
const User = require('../models/users');

exports.getUserGroups = async (req, res) => {
    try {
        const userId = req.user.id;
        const userGroups = await UserGroup.find({ user_id: userId, status: 'active' }).populate('group_id');

        if (!userGroups.length) {
            return res.status(404).json({ message: 'You are not a member of any groups' });
        }

        res.status(200).json({ message: 'User groups retrieved successfully', userGroups });
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const userId = req.user.id;

        if (!groupId || !userId) {
            return res.status(400).json({ message: 'Group ID or User ID is missing' });
        }
        const group = await Groups.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const userInGroup = group.members.some(member => {
            return member._id.toString() === userId.toString();
        });

        if (!userInGroup) {
            return res.status(404).json({ message: 'User not found in group members' });
        }

        await Groups.updateOne(
            { _id: groupId },
            { $pull: { members: { _id: new mongoose.Types.ObjectId(userId) } } }
        );

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.groupId = user.groupId.filter(group => group.group_id.toString() !== groupId.toString());
        await user.save();

        await JoinRequests.deleteOne({ user_id: userId, group_id: groupId });

        await UserGroup.deleteOne({ user_id: userId, group_id: groupId });

        res.status(200).json({
            message: 'Successfully left the group, removed from members, and deleted related records.',
        });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.getGroupMembers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { groupId } = req.body;

        const group = await Groups.findById(groupId).populate({
            path: 'members',
            match: { 'status': 'active' },
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Group members retrieved successfully', members: group.members });
    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.getActiveGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            const activeGroups = await UserGroup.find({ status: 'active' }).populate('group_id');
            return res.status(200).json({
                message: 'All active groups retrieved successfully',
                activeGroups
            });
        }
        const userGroup = await UserGroup.findOne({ user_id: userId, status: 'active' });
        if (!userGroup) {
            return res.status(404).json({ message: 'User is not an active member of any group' });
        }

        if (userGroup.endDate && moment(userGroup.endDate).isBefore(moment())) {
            userGroup.status = 'inactive';
            await userGroup.save();
            return res.status(403).json({ message: 'Membership has expired and the status has been updated to inactive' });
        }

        const groupDetails = await Groups.findById(userGroup.group_id);
        if (!groupDetails) {
            return res.status(404).json({ message: 'Group details not found' });
        }

        res.status(200).json({
            message: 'Active group details retrieved successfully',
            groupDetails
        });
    } catch (error) {
        console.error('Error fetching active user group details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
