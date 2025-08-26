import bcrypt from 'bcrypt';

async function isPasswordMatched(password, dbPassword) {
    try {
        return await bcrypt.compare(password, dbPassword);
    } catch (error) {
        console.error("Error comparing password: ", error);
        return false;
    }
}

async function encryptPassword(password) {
    try {
        return await bcrypt.hash(password, 8);
    } catch (error) {
        console.error("Error in bcrypt(encryptPassword) while hashing password: ", error);
        return null;
    }
}

export { isPasswordMatched, encryptPassword };
