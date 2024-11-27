const mongoose = require("mongoose");
const userGroupSchema  = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    group_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groups',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    created_at:{
        type: Date,
        default: Date.now,
    },
    updated_at:{
        type: Date,
        default:Date.now,
    }
});
userGroupSchema.pre('save', async function (next) {
    this.updated_at = Date.now();
    next();
});
const userGroups = mongoose.model('userGroups', userGroupSchema);
module.exports = userGroups;