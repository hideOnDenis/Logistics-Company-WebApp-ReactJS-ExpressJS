import mongoose from "mongoose";
import bcrypt from "bcryptjs";



const UserSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    isAdmin: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company' // Assuming a single company per user
    },


})

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

export const User = mongoose.model("User", UserSchema);