const Groups = require('../models/groups');
exports.creatGroups = async (req, res) => {
    try {
        const { title, type_course, location, start_date, end_date } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acess denied' });
        }
        const groups = new Groups({

            title,
            type_course, location,
            location,
            start_date,
            end_date
        });
        await groups.save();
        res.status(201).json(groups);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'server error' });
    }
};

// get all groups
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Groups.find().populate('type_course');
        res.status(200).json(groups)
    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message });
    }
};

// get groups by id
exports.getGroupsById = async (req, res) => {
    try {
        const groups = await Groups.findById(req.params.id).populate('type_course');
        if (!groups) {
            return res.status(404).json({ message: 'groups not found' });
        }
        return res.status(200).json(groups);
    } catch (error) {
        console.error('Error  fetching group');
        res.status(500).json({ message: 'server error' });
    }
};

// update course by id
exports.updateGroupsById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type_course, location, start_date, end_date } = req.body;

        // Check if the user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updateGroupsData = {
            type_course,
            location,   
            title,
            start_date,
            end_date
        };

        // Find and update the group
        const updatedGroup = await Groups.findByIdAndUpdate(id, updateGroupsData, { new: true, runValidators: true });

        // Check if the group was found and updated
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Send back the updated group
        res.status(200).json(updatedGroup);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteGroupsById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const deleteGroups = await Groups.findByIdAndDelete(id);
        if (!deleteGroups) {
            return res.status(404).json({ message: 'course not found' });
        }
        res.status(200).json({ message: 'groups delet successful' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
};