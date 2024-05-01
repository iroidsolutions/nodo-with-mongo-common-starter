import mongoose from "mongoose";

const emailVerificationSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
    },
    otp: {
        type: Number,
        trim: true,
    },

}, { timestamps: true });

const EmailVerification = mongoose.model('email_verification', emailVerificationSchema);

export default EmailVerification;  