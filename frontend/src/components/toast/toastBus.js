// ===========================================
// Global toast bus
// ===========================================
// The API modules are plain functions and cannot use React hooks, so they
// publish their notifications through this tiny event bus. The <ToastProvider>
// subscribes to it and renders the messages.

let handler = null;

export const setToastHandler = (nextHandler) => {
    handler = nextHandler;
};

const emit = (text, type) => {
    if (!text) return;
    if (handler) {
        handler(text, type);
        return;
    }

    // No provider mounted (tests, storybook) - fall back to the console so
    // the information is not lost silently.
    console[type === "error" ? "error" : "log"](`[toast:${type}] ${text}`);
};

export const notify = {
    success: (text) => emit(text, "success"),
    error: (text) => emit(text, "error"),
    info: (text) => emit(text, "info"),
};

export default notify;
