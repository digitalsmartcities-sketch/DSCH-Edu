import axios from "axios";

// ===========================================
// Centralised API configuration
// ===========================================
// Every request goes through this instance so that the credentials, the base
// URL and the error handling behave identically everywhere. Previously each
// call site created its own request and most of them forgot
// `withCredentials`, which broke every authenticated call when the API is
// hosted on another origin.

const resolveBaseUrl = () => {
    const configured = import.meta.env.VITE_API_URL;
    if (configured) {
        return String(configured).replace(/\/+$/, "");
    }

    // Fall back to the same origin so a missing env var does not produce
    // requests against "undefined/...".
    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin.replace(/\/+$/, "");
    }

    return "";
};

export const API_URL = resolveBaseUrl();

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30000,
    headers: {
        Accept: "application/json",
    },
});

/**
 * Extracts a human readable message from an Axios error.
 * Falls back to a generic message so the UI never shows "undefined".
 */
export const getApiError = (error, fallback = "Something went wrong. Please try again.") => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data.trim();
    }

    if (data && typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
    }

    if (error?.code === "ECONNABORTED") {
        return "The request timed out. Please check your connection and try again.";
    }

    if (error?.message === "Network Error") {
        return "Cannot reach the server. Please check your internet connection.";
    }

    return fallback;
};

/**
 * Returns the response payload of a successful request, or throws an error
 * carrying the backend message when the backend answered with
 * `{ success: false }`.
 */
export const unwrap = (response, fallback = "Something went wrong. Please try again.") => {
    const data = response?.data;

    if (data && data.success === false) {
        throw new Error(data.message || fallback);
    }

    return data;
};

export default apiClient;
