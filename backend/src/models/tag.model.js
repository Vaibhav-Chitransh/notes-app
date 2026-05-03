import mongoose from 'mongoose';
import { User } from './user.model';

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    userId: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }]
}, {timestamps: true});

export const Tag = mongoose.model('Tag', tagSchema);