import mongoose from "mongoose"

const userSession = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    refreshToken: {
        type: String, unique: true
    }

}, { timestamps: true })

export const Session = mongoose.model('Session', userSession)