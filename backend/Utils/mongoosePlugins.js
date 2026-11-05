import mongoose from "mongoose";

// ===========================================
// Cloudinary URL normalisation
// ===========================================

const INSECURE_URL_PREFIX = "http://";

/**
 * Forces every `http://` URL that leaves the API to `https://`.
 *
 * Cloudinary answers with an `http://` link in `url` and an `https://` link in
 * `secure_url`. Records created before this normalisation was introduced may
 * still hold the insecure variant, which browsers refuse to load on an https
 * page (mixed content). Upgrading them on the way out keeps already stored
 * documents renderable without a data migration.
 */
export const normalizeUrls = (value) => {
    if (typeof value === "string") {
        return value.startsWith(INSECURE_URL_PREFIX)
            ? "https://" + value.slice(INSECURE_URL_PREFIX.length)
            : value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => normalizeUrls(item));
    }

    // Only plain objects are traversed. ObjectId, Date, Buffer, Map, ... are
    // left untouched so their serialisation is not corrupted.
    if (value && typeof value === "object" && value.constructor === Object) {
        for (const key of Object.keys(value)) {
            value[key] = normalizeUrls(value[key]);
        }
        return value;
    }

    return value;
};

/**
 * Mongoose plugin that normalises every outgoing URL of a schema.
 */
export const cloudinaryHttpsPlugin = (schema) => {
    schema.set("toJSON", {
        transform: (doc, ret) => normalizeUrls(ret),
    });
};

/**
 * Registers the plugin for every schema of the application.
 */
export const applyGlobalPlugins = () => {
    mongoose.plugin(cloudinaryHttpsPlugin);
};
