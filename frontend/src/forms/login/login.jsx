import "./login.css";

import { Link, useNavigate } from "react-router-dom";

import {
    FaArrowRight,
    FaEnvelope,
    FaLock,
    FaUniversity,
    FaUserGraduate
} from "react-icons/fa";

import {
    FaGraduationCap,
    FaShieldHalved
} from "react-icons/fa6";

import { Navbar } from "../../components/navbar/navbar";

import { loginApi } from "../../apicalls/public_apicalls";

import { useContext, useState } from "react";

import AppContext from "../../app_context/context";


export const Login = () => {

    const navigate = useNavigate();

    const {
        setUserState
    } = useContext(AppContext);


    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState({
        text: "",
        type: ""
    });


    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
    });


    const handleOnChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (message.text) {
            setMessage({
                text: "",
                type: ""
            });
        }
    };


    const handleOnSubmit = (e) => {

        e.preventDefault();

        if (!formData.email.trim()) {
            setMessage({
                text: "Please enter your email address.",
                type: "error"
            });
            return;
        }

        if (!formData.password) {
            setMessage({
                text: "Please enter your password.",
                type: "error"
            });
            return;
        }

        loginApi(
            formData,
            setLoading,
            setMessage,
            navigate,
            setUserState
        );
    };


    return (
        <>
            <Navbar />
            <main className="loginContainer">
                {/* =========================================
                        LEFT / INFORMATION PANEL
                    ========================================== */}
                <section className="loginIntro">
                    <div className="loginIntroOverlay"></div>
                    <div className="loginIntroContent">
                        <div className="loginIntroBadge">
                            <FaGraduationCap />
                            DSCH-EDU PORTAL
                        </div>
                        <h1>
                            Access Your DSCH-Edu Account
                        </h1>
                        <p>
                            Sign in with your verified credentials to access your dedicated
                            student or institute administrator dashboard.
                        </p>
                        <div className="loginFeatureList">

                            <div className="loginFeature">
                                <span>
                                    <FaUniversity />
                                </span>
                                <div>
                                    <strong>Institute Administrators</strong>
                                    <p>
                                        Manage your school or college profile, review admission applications,
                                        verify payments, and manage student records.
                                    </p>
                                </div>
                            </div>

                            <div className="loginFeature">
                                <span>
                                    <FaUserGraduate />
                                </span>
                                <div>
                                    <strong>Enrolled Students</strong>
                                    <p>
                                        Student accounts are provisioned upon admission approval to review
                                        fee records, submit payment proofs, and access certificates.
                                    </p>
                                </div>
                            </div>

                            <div className="loginFeature">
                                <span>
                                    <FaShieldHalved />
                                </span>
                                <div>
                                    <strong>Super Administration</strong>
                                    <p>
                                        Verify incoming institute registrations, document submissions, and
                                        maintain platform integrity.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* =========================================
                        LOGIN PANEL
                    ========================================== */}
                <section className="loginRight">
                    <h2>
                        Sign In
                    </h2>
                    <p className="loginDescription">
                        Enter your registered email address, role, and password.
                    </p>
                    <form
                        onSubmit={handleOnSubmit}
                        className="loginForm"
                    >
                        {/* EMAIL */}
                        <div className="inputGroup">
                            <label htmlFor="login-email">
                                Email Address
                            </label>
                            <div className="inputField">
                                <FaEnvelope />
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleOnChange}
                                    placeholder="Enter your registered email"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* ROLE */}
                        <div className="inputGroup">
                            <label htmlFor="login-role">
                                Role
                            </label>
                            <div className="inputField">
                                <FaUserGraduate />
                                <select
                                    id="login-role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleOnChange}
                                    style={{ border: "none", outline: "none", width: "100%", background: "transparent" }}
                                    required
                                >
                                    <option value="" disabled>Select your account role</option>
                                    <option value="student">Student</option>
                                    <option value="admin">Institute Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="inputGroup">
                            <label htmlFor="login-password">
                                Password
                            </label>
                            <div className="inputField">
                                <FaLock />
                                <input
                                    id="login-password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleOnChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>
                        {/* FORGOT PASSWORD */}
                        <div className="loginOptions">
                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>
                        </div>
                        {/* MESSAGE */}
                        {message.text && (
                            <div
                                className={`loginMessage ${message.type}`}
                            >
                                {message.text}
                            </div>
                        )}
                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="loginSubmit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : (
                                    <>
                                        Sign In
                                        <FaArrowRight />
                                    </>
                                )
                            }
                        </button>
                    </form>
                    <div className="loginSecurityNote">
                        <FaLock />
                        <span>
                            Your credentials are securely authenticated against DSCH-Edu verified accounts.
                        </span>
                    </div>
                    <div className="loginFooter">
                        <span>
                            Don't have an account or need guidance?
                        </span>
                        <Link to="/contact">
                            Contact Support
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
};