import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: Number,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        createdBy: {
            type: String,
            default: null
        },
        isAccountActive: {
            type: Boolean, // False -> not active, True -> active
            default: false
        },
        stage: {
            type: Number,
            default: 1,
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            // 2(early),4(profeesional),6(current) -> record 
            // 1->basic form, 3->early life form, 5-> professional life form, 7-> current life form, 8-> prifle preview
            // 9->after profile completed
        },
        isSendForApproval: {
            type: Number,
            default: 0,
            enum: [0, 1, 2, 3] // 0->no working,1->send for approval, 2->approve, 3->reject
        },
        otp: {
            token: {
                type: String,
                default: null
            },
            time: {
                type: Date,
                default: Date.now
            }
        }
    },
    {
        timestamps: true
    }
);

const authModel = mongoose.model('auth', authSchema);

export default authModel;