import authModel from './src/models/authModel.js';
import { encryptPassword } from './src/config/bcrypt.js';
import connectDB from './src/config/mongodb.js';

connectDB("mongodb://localhost:27017/resume_ai");
async function runMigrate() {
    try {
        const hashPassword = await encryptPassword("admin123");
        const user = await authModel.create({ email: "admin@gmail.com", password: hashPassword, mobileNumber: "9068057560", role: "admin", isAccountActive: true });
        console.log("Admin Created Successfully: ", user);
    }
    catch (e) {
        console.log("Error in migrate.js: ", e);
    }
    finally {
        process.exit(0);
    }
}

runMigrate();