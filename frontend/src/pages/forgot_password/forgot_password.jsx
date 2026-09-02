import { useState } from "react";
import {
    FaEnvelope,
    FaLock,
    FaKey,
    FaArrowRight,
    FaCheckCircle,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";
import "./forgot_password.css";
import { Navbar } from "../../components/navbar/navbar";
import { resetPassword, sendOTPToVerifyEmailToResetPass, verifyOTPToResetPass } from "../../apicalls/public_apicalls";
import { Footer } from "../../components/footer/Footer";

export const ForgotPassword = () => {

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        text: "",
        type: ""
    });

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* =========================================
       SEND OTP
    ========================================= */

    const handleSendOtp = async (e) => {
        e.preventDefault();
        sendOTPToVerifyEmailToResetPass(setLoading, setMessage, setStep, email)
    };


    /* =========================================
       VERIFY OTP
    ========================================= */

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        verifyOTPToResetPass(setLoading, setMessage, setStep, otp);
    };


    /* =========================================
       RESET PASSWORD
    ========================================= */

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({
                text: "Passwords do not match",
                type: "error"
            });
            return;
        }
        resetPassword(setLoading, setMessage, setStep, password, confirmPassword ,email);
    };


    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <div className="forgotPasswordPage">
                    <div className="forgotPasswordWrapper">
                        <div className="forgotPasswordCard">
                            {step < 4 && (
                                <div className="forgotPasswordSteps">
                                    <div
                                        className={`forgotStep ${step >= 1 ? "active" : ""
                                            }`}
                                    >
                                        <span>1</span>
                                        <small>Email</small>
                                    </div>
                                    <div className="forgotStepLine"></div>
                                    <div
                                        className={`forgotStep ${step >= 2 ? "active" : ""
                                            }`}
                                    >
                                        <span>2</span>
                                        <small>Verify</small>
                                    </div>
                                    <div className="forgotStepLine"></div>
                                    <div
                                        className={`forgotStep ${step >= 3 ? "active" : ""
                                            }`}
                                    >
                                        <span>3</span>
                                        <small>Password</small>
                                    </div>
                                </div>
                            )}
                            {step === 1 && (
                                <form
                                    className="forgotPasswordForm"
                                    onSubmit={handleSendOtp}
                                >
                                    <div className="forgotPasswordHeader">
                                        <div className="forgotPasswordIcon">
                                            <FaEnvelope />
                                        </div>
                                        <h1>
                                            Forgot your password?
                                        </h1>
                                        <p>
                                            Enter the email address associated
                                            with your account and we'll send you
                                            a verification code.
                                        </p>
                                    </div>
                                    <div className="forgotFormGroup">
                                        <label>
                                            Registered Email
                                        </label>
                                        <div className="forgotInput">
                                            <FaEnvelope />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                placeholder="Enter your email address"
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="forgotPrimaryBtn"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Sending..."
                                            : "Send Verification Code"}

                                        {!loading && <FaArrowRight />}
                                    </button>
                                </form>
                            )}
                            {step === 2 && (
                                <form
                                    className="forgotPasswordForm"
                                    onSubmit={handleVerifyOtp}
                                >
                                    <div className="forgotPasswordHeader">
                                        <div className="forgotPasswordIcon">
                                            <FaKey />
                                        </div>
                                        <h1>
                                            Verify your email
                                        </h1>
                                        <p>
                                            Enter the verification code sent to
                                            <strong>
                                                {" "}{email}
                                            </strong>.
                                        </p>
                                    </div>
                                    <div className="forgotOtpInfo">
                                        <span>
                                            Verification code
                                        </span>
                                        <strong>
                                            Sent to your email
                                        </strong>
                                    </div>
                                    <div className="forgotFormGroup">
                                        <label>
                                            Verification Code
                                        </label>
                                        <div className="forgotInput">
                                            <FaKey />
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(
                                                        e.target.value
                                                            .replace(/\D/g, "")
                                                            .slice(0, 6)
                                                    )
                                                }
                                                placeholder="Enter verification code"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="forgotPrimaryBtn"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Verifying..."
                                            : "Verify Code"}
                                        {!loading && <FaArrowRight />}
                                    </button>
                                </form>
                            )}
                            {step === 3 && (
                                <form
                                    className="forgotPasswordForm"
                                    onSubmit={handleResetPassword}
                                >
                                    <div className="forgotPasswordHeader">
                                        <div className="forgotPasswordIcon">
                                            <FaLock />
                                        </div>
                                        <h1>
                                            Create a new password
                                        </h1>
                                        <p>
                                            Your email has been verified.
                                            Enter a new password for your account.
                                        </p>
                                    </div>
                                    <div className="forgotFormGroup">
                                        <label>
                                            New Password
                                        </label>
                                        <div className="forgotInput">
                                            <FaLock />
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className="passwordToggle"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) => !prev
                                                    )
                                                }
                                            >
                                                {showPassword
                                                    ? <FaEyeSlash />
                                                    : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="forgotFormGroup">
                                        <label>
                                            Confirm Password
                                        </label>
                                        <div className="forgotInput">
                                            <FaLock />
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className="passwordToggle"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (prev) => !prev
                                                    )
                                                }
                                            >
                                                {showConfirmPassword
                                                    ? <FaEyeSlash />
                                                    : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="passwordRequirement">
                                        Password must contain at least 8 characters.
                                    </div>
                                    <button
                                        type="submit"
                                        className="forgotPrimaryBtn"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update Password"}

                                        {!loading && <FaCheckCircle />}
                                    </button>
                                </form>
                            )}
                            {step === 4 && (
                                <div className="forgotSuccess">
                                    <div className="forgotSuccessIcon">
                                        <FaCheckCircle />
                                    </div>
                                    <h1>
                                        Password updated
                                    </h1>
                                    <p>
                                        Your password has been changed successfully.
                                        You can now sign in using your new password.
                                    </p>
                                    <button
                                        className="forgotPrimaryBtn"
                                        onClick={() =>
                                            window.location.href = "/auth/login"
                                        }
                                    >
                                        Continue to Login
                                        <FaArrowRight />
                                    </button>
                                </div>
                            )}
                            {message.text && step < 4 && (
                                <div
                                    className={`forgotMessage ${message.type}`}
                                >
                                    {message.text}
                                </div>
                            )}
                        </div>
                        <p className="forgotPasswordFooter">
                            Digital Smart City Hub
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};