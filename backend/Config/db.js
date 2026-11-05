import mongoose from "mongoose";
import dns from "dns";

// Some networks cannot resolve the MongoDB SRV records through the default
// resolver. Falling back to public DNS servers fixes those environments.
// Failures are swallowed so an already working resolver is never replaced.
try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (error) {
    console.warn("Could not override the DNS resolver:", error?.message || error);
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Connects to MongoDB.
 *
 * @returns {Promise<boolean>} true when the connection is established.
 */
export const connectDb = async () => {
    const url = process.env.DB_URL;

    if (!url) {
        console.error("DB_URL is not configured - the database connection cannot be established.");
        return false;
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await mongoose.connect(url, {
                serverSelectionTimeoutMS: 10000,
            });

            console.log(`Database connected (attempt ${attempt}).`);
            return true;
        } catch (error) {
            console.error(`Database connection attempt ${attempt}/${MAX_RETRIES} failed:`, error?.message || error);

            if (attempt < MAX_RETRIES) {
                await wait(RETRY_DELAY_MS);
            }
        }
    }

    console.error("Database connection failed after all retries.");
    return false;
};
