import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        accounctId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'auth',
            required: true,
            unique: true,
        },

        // stage 1
        firstName: {
            type: String,
            required: true,
            default: "",
        },
        middleName: {
            type: String,
            default: ""
        },
        lastName: {
            type: String,
            required: true,
            default: "",
        },
        currentOrganisation: {
            type: String,
            required: true,
            default: "",
        },
        currentRole: {
            type: String,
            required: true,
            default: "",
        },
        phoneNumber: {
            type: String,
            required: true,
            default: "",
        },
        email: {
            type: String,
            default: ""
        },
        currentCity: {
            type: String,
            required: true,
            default: "",
        },
        currentArea: {
            type: String,
            required: true,
            default: "",
        },
        twitterHandle: {
            type: String,
            default: ""
        },
        instagramHandle: {
            type: String,
            default: ""
        },
        linkedinHandle: {
            type: String,
            default: ""
        },
        otherHandler: {
            type: String,
            default: ""
        },
        intro: {
            type: String,
            required: true,
            default: "",
        },
        quote: {
            type: String,
            required: true,
            default: "",
        },
        inspiring: {
            type: String,
            required: true,
            default: "",
        },
        linksContent: {
            type: String,
            required: true,
            default: "",
        },
        userImage: {
            type: String,
            required: true,
            default: ""
        },

        // stage 2
        earlyLifeRecording: {
            type: String,
            default: ""
        },
        earlyLifeAudio: {
            type: String,
            default: ""
        },

        // stage 3
        bornCity: {
            type: String,
            default: ""
        },
        homeTown: {
            type: String,
            default: ""
        },
        school: {
            type: [{
                name: {
                    type: String,
                    default: ""
                },
                address: {
                    type: String,
                    default: ""
                },
            }],
            default: []
        },
        college: {
            type: [{
                name: {
                    type: String,
                    default: ""
                },
                address: {
                    type: String,
                    default: ""
                },
                course: {
                    type: [String],
                    default: []
                },
            }],
            default: []
        },
        earlyTags: {
            type: [String],
            default: [],
        },

        // stage 4
        professionalLifeRecording: {
            type: String,
            default: ""
        },
        professionalLifeAudio: {
            type: String,
            default: ""
        },
        previousCompany: { // from first to last
            type: [{
                name: {
                    type: String,
                    default: ""
                },
                role: {
                    type: String,
                    default: ""
                },
            }],
            default: []
        },
        professionalTags: {
            type: [String],
            default: [],
        },

        // stage 6
        currentLifeRecording: {
            type: String,
            default: ""
        },
        currentLifeAudio: {
            type: String,
            default: ""
        },
        summary: { // summary in 75 words containing current life like -> cities(where live),organisations(worked for including current with name)
            type: String,
            default: "",
        },
        currentCompany: {
            type: {
                name: {
                    type: String,
                    default: ""
                },
                role: {
                    type: String,
                    default: ""
                },
            },
            default: {},
        },
        frequentCityLived: {
            type: String,
            default: ""
        },
        currentTags: {
            type: [String],
            default: []
        },
        skillTags: {
            type: [String],
            default: []
        },
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model('user', userSchema);

export default userModel;