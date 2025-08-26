import { encryptPassword, isPasswordMatched } from "../config/bcrypt.js";
import authModel from "../models/authModel.js";
import { generateUniqueText, isValidGmail, isValidMobileNumber } from '../utils/basic utils.js'
import sendMail from '../config/nodemailer.js';

async function loginPostHandler(request, response) {
    try {
        let { email, password } = request.body;
        email = email.trim();
        password = password.trim();
        if (!request.body || !email || !password) {
            return response.status(404).json({ status: "Please fill both Email and Password" });
        }
        if (!isValidGmail(email)) {
            return response.status(404).json({ status: "Invalid Email Address" });
        }
        const user = await authModel.findOne({ email: email });
        if (!user) {
            return response.status(401).json({ status: "Invalid Email and Password" });
        }
        const isPassword = await isPasswordMatched(password, user.password);
        if (!isPassword) {
            return response.status(401).json({ status: "Invalid Email/Password" });
        }
        // if (user?.isEmailVerified === false) {
        //     return response.status(401).json({ status: "Email is not verified yet." });
        // }
        if (user?.isAccountActive === false) {
            return response.status(401).json({ status: "Account is not activated yet." });
        }
        // if (user?.isAccountRejected === true) {
        //     return response.status(401).json({ status: "Account is being rejected by the Admin." });
        // }
        // console.log(user)
        request.session.userId = user.id;
        request.session.email = (user.email).trim();
        request.session.role = user.role;
        request.session.stage = user.stage;
        return response.status(200).json({ status: "Login Successfully" });
    }
    catch (e) {
        console.log("Error in loginPostHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function signUpPostHandler(request, response) {
    try {
        let { email, password, mobileNumber, confirmPassword } = request.body;
        email = email.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();
        if (!request.body || !email || !password || !confirmPassword || !mobileNumber || password !== confirmPassword) {
            return response.status(404).json({ status: "Please fill both Username and Password" });
        }
        if (!isValidGmail(email)) {
            return response.status(404).json({ status: "Invalid Email Address" });
        }
        if (!isValidMobileNumber(mobileNumber)) {
            return response.status(404).json({ status: "Invalid Mobile Number" });
        }
        const hashPassword = await encryptPassword(password);
        const user = await authModel.create({ email: email, password: hashPassword, mobileNumber: mobileNumber, createdBy: request.session.userId, isAccountActive: true });
        sendMail("Hello user", user.email, "Account has been created", "Your accounct has been created now you can login", `<h1>Your Email: ${user.email}</h1><br><h3>Your temporary password: ${user.password}</h3>`);
        console.log(user)
        request.session.userId = user.id;
        request.session.email = (user.email).trim();
        request.session.role = user.role;
        request.session.stage = user.stage;
        return response.status(200).json({ status: "Signup successfull" });
    }
    catch (e) {
        console.log("Error in signUpPostHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}


async function sessionGetHandler(request, response) {
    try {
        // console.log(request.session)
        if (!request.session || !request.session.userId || !request.session.email || !request.session.stage) {
            return response.status(401).json({ status: "Credentials are missing" });
        }
        const user = await authModel.findOne({ id: request.session.userId });
        if (!user) {
            return response.status(400).json({ status: "Invalid User" });
        }
        request.session.userId = user.id;
        request.session.email = (user.email).trim();
        request.session.role = user.role;
        request.session.stage = user.stage;
        return response.status(200).json({
            status: "Currently Logged In Credentials fetched Successfully",
            Credential: {
                userId: request.session.userId,
                email: request.session.email,
                role: request.session.role,
                stage: request.session.stage,
                dbStage: request.session.stage,
            }
        });
    }
    catch (e) {
        console.log("Error in sessionGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function logoutGetHandler(request, response) {
    try {
        if (!request.session.userId) {
            return response.status(401).json({ status: "Please Login First" });
        }
        request.session.destroy((error) => {
            if (error) {
                return response.status(500).json({ status: "Logout Failed" });
            }
            response.clearCookie("connect.sid");
            return response.status(200).json({ status: "Logout Success" });
        });
    }
    catch (e) {
        console.log("Error in logoutGetHandler: \n", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function accountCreationPostHandler(request, response) {
    try {
        let { email, mobileNumber } = request.body;
        email = email.trim();
        if (!request.body || !email || !mobileNumber) {
            return response.status(404).json({ status: "Please fill all Email, Mobile Number and Choose Admin" });
        }
        if (!isValidGmail(email)) {
            return response.status(404).json({ status: "Invalid Email Address" });
        }
        if (!isValidMobileNumber(mobileNumber)) {
            return response.status(404).json({ status: "Invalid Mobile Number" });
        }
        const password = generateUniqueText().toString();
        const hashPassword = await encryptPassword(password);
        const user = await authModel.create({ email: email, password: hashPassword, mobileNumber: mobileNumber, createdBy: request.session.userId, isAccountActive: true });
        await sendMail("Hello user", user.email, "Account has been created", "Your account has been created now you can login", `<h1>Your Email: ${user.email}</h1><br><h3>Your temporary password: ${user.password}</h3>Please reset your password as soon as possible using ${process.env.FRONTEND_URL}/login`);
        // console.log(otpRsult)
        // console.log(user)
        request.session.userId = user.id;
        request.session.email = (user.email).trim();
        request.session.role = user.role;
        request.session.stage = 1;
        return response.status(200).json({ status: "Accounct Created successfully" });
    }
    catch (e) {
        console.log("Error in accountCreationPostHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function adminGetHandler(request, response) {
    try {
        const allAdmins = await authModel.find({ role: 'admin' }, { _id: 0, id: 1, email: 1, mobileNumber: 1 });
        return response.status(200).json({ status: "Please select any one admin", allAdmins });
    }
    catch (e) {
        console.log("Error in adminGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function generateOtpPostHandler(request, response) {
    try {
        const { email } = request.body;
        if (!request.body || !email) {
            return response.status(401).json({ status: "Email not present" });
        }
        const otp = JSON.stringify(generateUniqueText());
        const hashOtp = await encryptPassword(otp);
        const user = await authModel.findOneAndUpdate({ email: email }, { otp: { token: hashOtp, time: Date.now() } });
        if (!user) {
            return response.status(401).json({ status: "Invalid Account" });
        }
        await sendMail(email, email, "Forgot/Reset Password Otp", `Otp to verify your email and reset your password is ${otp}. Remember this is a one time password and will expires in 10 minutes.`, "");
        return response.status(200).json({ status: "Otp has been sent to your Email" });
    }
    catch (e) {
        console.log("Error in generateOtpPostHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function resetPasswordPostHandler(request, response) {
    try {
        let { email, otp, password, confirmPassword } = request.body;
        const time = new Date(Date.now() - 10 * 60 * 1000);
        if (!request.body || !otp || !password || !confirmPassword || !email || password !== confirmPassword) {
            return response.status(404).json({ status: "Received Data is incompleted/Invalid" });
        }
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "Invalid Account" });
        }

        if (user.otp.time < new Date(Date.now() - 10 * 60 * 1000)) {
            return res.status(400).json({ status: "OTP expired" });
        }

        const isMatch = await isPasswordMatched(otp, user.otp.token);

        if (!isMatch) {
            return res.status(400).json({ status: "Invalid OTP" });
        }

        user.password = await encryptPassword(password);
        user.otp = { token: null, time: null };
        await user.save();
        return response.status(200).json({ status: "Your password has been reset successfully" });
    }
    catch (e) {
        console.log("Error in generateOtpPostHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

export { sessionGetHandler, loginPostHandler, logoutGetHandler, signUpPostHandler, accountCreationPostHandler, adminGetHandler, generateOtpPostHandler, resetPasswordPostHandler };