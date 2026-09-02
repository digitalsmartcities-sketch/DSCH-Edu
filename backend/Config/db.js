import mongoose from "mongoose";
import dns from "dns"

dns.setServers(["1.1.1.1", "8.8.8.8"])

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL).then(async () => {
            console.log("Db Connected, Alhumdulilah")
        })
    } catch (error) {
        console.log("Err in DB connection", error);
    }
}