const UserGroup = require('../models/userGroups');
const Groups = require('../models/groups');
const JoinRequests = require('../models/JoinRequests');
const moment = require('moment');
const { use } = require('../config/mailConfig');

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

        const userGroup = await UserGroup.findOne({ user_id: userId, group_id: groupId });
        if (!userGroup || userGroup.status !== 'active') {
            return res.status(404).json({ message: 'You are not an active member of this group' });
        }

        userGroup.status = 'inactive';
        await userGroup.save();

        const joinRequest = await JoinRequests.findOne({ user_id: userId, group_id: groupId });
        if (joinRequest) {
            joinRequest.status = 'rejected';
            joinRequest.updated_at = Date.now();
            await joinRequest.save();
        } else {
            console.warn('JoinRequest record not found for user leaving the group.');
        }

        res.status(200).json({ 
            message: 'Successfully left the group. Join request status updated to rejected.', 
            userGroup, 
            joinRequest 
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
