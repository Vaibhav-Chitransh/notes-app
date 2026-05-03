import mongoose from "mongoose";
import { User } from "./user.model";
import { Tag } from "./tag.model";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    colorCode: {
        type: String,
        default: '#0b0b0b'
    },

    userId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true,
        index: true,
    },

    isPinned: {
        type: Boolean,
        default: false,
    },

    tags: [{
        type: mongoose.Types.ObjectId,
        ref: 'Tag',
    }]
}, {timestamps: true});

export const Note = mongoose.model('Note', noteSchema);