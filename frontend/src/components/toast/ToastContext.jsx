import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { setToastHandler } from "./toastBus";
import "./toast.css";

// ===========================================
// Toast notifications
// ===========================================
// Replaces the native `alert()` calls, which block the main thread and look
// out of place in the rest of the interface.

const ToastContext = createContext(null);

const TOAST_DURATION = 4500;

const ICONS = {
    success: "\u2713",
    error: "\u26A0",
    info: "\u2139",
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const counter = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback(
        (text, type = "info") => {
            if (!text) return;

            counter.current += 1;
            const id = counter.current;

            setToasts((current) => [...current, { id, text: String(text), type }]);

            window.setTimeout(() => dismiss(id), TOAST_DURATION);
        },
        [dismiss]
    );

    const toast = useMemo(
        () => ({
            success: (text) => push(text, "success"),
            error: (text) => push(text, "error"),
            info: (text) => push(text, "info"),
            dismiss,
        }),
        [push, dismiss]
    );

    // Let the plain API modules publish notifications through the bus.
    useEffect(() => {
        setToastHandler((text, type) => push(text, type));
        return () => setToastHandler(null);
    }, [push]);

    return (
        <ToastContext.Provider value={toast}>
            {children}

            <div className="toastStack" role="status" aria-live="polite">
                {toasts.map((item) => (
                    <div key={item.id} className={`toast toast--${item.type}`}>
                        <span className="toast__icon" aria-hidden="true">
                            {ICONS[item.type] || ICONS.info}
                        </span>
                        <span className="toast__text">{item.text}</span>
                        <button
                            type="button"
                            className="toast__close"
                            onClick={() => dismiss(item.id)}
                            aria-label="Dismiss notification"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        // The provider is optional so a component can be rendered in
        // isolation (tests, storybook) without crashing.
        return {
            success: () => {},
            error: () => {},
            info: () => {},
            dismiss: () => {},
        };
    }

    return context;
};

export default ToastContext;
