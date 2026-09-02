import { useState } from "react";
import {
    FaLock,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaKey
} from "react-icons/fa";
import "./change_password.css";
import { changePassword } from "../../apicalls/public_apicalls";

// CHANGE PASSWORD = USER KNOWS ITS PASSWORD ALREADY & WANT TO CHANGE;
// FORGET PASSWORD = USER DON'T KNOW ITS PASSWORD.

// THIS COMPONENT IS USING IN BOTH STUDENT AND ADMIN DASHBOARD THAT'S WHY PLACED IN COMMON COMPONENT DIRECTOORY:
// THIS COMPONENT IS NOT USING IN FORGET PASSWORD FLOW:

export const ChangePassword = () => {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        text: "",
        type: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setMessage({
            text: "",
            type: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage({
            text: "",
            type: ""
        });

        if (
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword
        ) {
            setMessage({
                text: "Please fill in all password fields.",
                type: "error"
            });
            return;
        }

        if (form.newPassword.length < 8) {
            setMessage({
                text: "New password must contain at least 8 characters.",
                type: "error"
            });
            return;
        }

        if (form.currentPassword === form.newPassword) {
            setMessage({
                text: "New password must be different from your current password.",
                type: "error"
            });
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setMessage({
                text: "New password and confirmation password do not match.",
                type: "error"
            });
            return;
        }

        changePassword(form, setLoading, setMessage);
    };

    return (
        <section className="changePasswordPage">
            <div className="changePasswordHeader">
                <div>
                    <span className="changePasswordEyebrow">
                        SECURITY
                    </span>
                    <h1>
                        Change Password
                    </h1>
                    <p>
                        Update your account password to keep your
                        account secure.
                    </p>
                </div>
                <div className="changePasswordHeaderIcon">
                    <FaKey />
                </div>
            </div>
            <div className="changePasswordCard">
                <div className="changePasswordSecurityNote">
                    <FaLock />
                    <div>
                        <strong>
                            Keep your password secure
                        </strong>
                        <p>
                            Never share your password with anyone.
                            Use a strong password that you do not use
                            on other websites.
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* CURRENT PASSWORD */}
                    <div className="changePasswordGroup">
                        <label>
                            Current Password
                        </label>
                        <div className="changePasswordInput">
                            <FaLock />
                            <input
                                type={
                                    showCurrent
                                        ? "text"
                                        : "password"
                                }
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter your current password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="passwordVisibilityBtn"
                                onClick={() =>
                                    setShowCurrent(
                                        (prev) => !prev
                                    )
                                }
                            >
                                {showCurrent
                                    ? <FaEyeSlash />
                                    : <FaEye />}
                            </button>
                        </div>
                    </div>
                    {/* NEW PASSWORD */}
                    <div className="changePasswordGroup">
                        <label>
                            New Password
                        </label>
                        <div className="changePasswordInput">
                            <FaLock />
                            <input
                                type={
                                    showNew
                                        ? "text"
                                        : "password"
                                }
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="passwordVisibilityBtn"
                                onClick={() =>
                                    setShowNew(
                                        (prev) => !prev
                                    )
                                }
                            >
                                {showNew
                                    ? <FaEyeSlash />
                                    : <FaEye />}
                            </button>
                        </div>
                        <span className="passwordHint">
                            Use at least 8 characters.
                        </span>
                    </div>
                    {/* CONFIRM PASSWORD */}
                    <div className="changePasswordGroup">
                        <label>
                            Confirm New Password
                        </label>
                        <div className="changePasswordInput">
                            <FaLock />
                            <input
                                type={
                                    showConfirm
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="passwordVisibilityBtn"
                                onClick={() =>
                                    setShowConfirm(
                                        (prev) => !prev
                                    )
                                }
                            >
                                {showConfirm
                                    ? <FaEyeSlash />
                                    : <FaEye />}
                            </button>
                        </div>
                    </div>
                    {/* MESSAGE */}
                    {message.text && (
                        <div
                            className={`changePasswordMessage ${message.type}`}
                        >
                            {message.type === "success" && (
                                <FaCheckCircle />
                            )}
                            <span>
                                {message.text}
                            </span>
                        </div>
                    )}
                    {/* BUTTON */}
                    <div className="changePasswordActions">
                        <button
                            type="submit"
                            className="changePasswordBtnInChangePassComp"
                            disabled={loading}
                        >
                            <FaLock />
                            {loading
                                ? "Updating..."
                                : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};