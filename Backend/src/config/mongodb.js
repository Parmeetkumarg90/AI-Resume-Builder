import mongoose from "mongoose";

export default async function connectDB(url) {
    mongoose.connect(url)
        .then(() => {
            console.log("Database Connected Successfully");
        })
        .catch((err) => {
            console.log(`Error while connecting mongodb: ${err}`);
        });
}