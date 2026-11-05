import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./register.css";
import { Navbar } from "../../components/navbar/navbar";
import { registerAdmin, verifyEmail } from "../../apicalls/public_apicalls";
import { Footer } from "../../components/footer/Footer";
import { Link } from "react-router-dom";

const STEP_LABELS = ["Owner", "Institute", "Documents", "Account", "Payment"];

const STEP_FIELDS = {
    1: ["ownerName", "fatherName", "email", "phone", "cnic", "dateOfBirth", "gender", "city", "address"],
    2: ["instituteName", "instituteType", "registrationNumber", "establishedYear", "institutePhone", "instituteEmail", "instituteProvince", "instituteCity", "instituteAddress"],
    4: ["password", "confirmPassword"],
    5: ["paymentMethod", "transactionId"],
};

const STEP_DOCUMENTS = ["ownerCnicFront", "ownerCnicBack", "instituteRegistration", "ownerPhoto"];

// Payment details are deployment specific, so they come from Vite environment
// variables instead of hardcoded placeholder values.
const REGISTRATION_FEE = import.meta.env.VITE_REGISTRATION_FEE || "";
const PAYMENT_ACCOUNT_TITLE = import.meta.env.VITE_PAYMENT_ACCOUNT_TITLE || "";
const PAYMENT_ACCOUNT_NUMBER = import.meta.env.VITE_PAYMENT_ACCOUNT_NUMBER || "";
const PAYMENT_IBAN = import.meta.env.VITE_PAYMENT_IBAN || "";
const HAS_PAYMENT_ACCOUNT = Boolean(
    PAYMENT_ACCOUNT_TITLE || PAYMENT_ACCOUNT_NUMBER || PAYMENT_IBAN
);

const AdminRegister = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Owner / Service Provider Information
        ownerName: "",
        fatherName: "",
        email: "",
        phone: "",
        cnic: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        // Institute Information
        instituteName: "",
        instituteType: "",
        registrationNumber: "",
        establishedYear: "",
        instituteAddress: "",
        instituteCity: "",
        instituteProvince: "",
        institutePhone: "",
        instituteEmail: "",
        // Account Information
        password: "",
        confirmPassword: "",
        // Payment Information
        paymentMethod: "",
        transactionId: "",
    });
    const [documents, setDocuments] = useState({
        ownerCnicFront: null,
        ownerCnicBack: null,
        instituteRegistration: null,
        instituteOwnership: null,
        ownerPhoto: null,
        paymentProof: null,
    });
    const [otp, setOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    let [message, setMessage] = useState({ text: null, type: null });
    const [submitted, setSubmitted] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email" && otp !== false) {
            setOtp(false);
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDocuments((prev) => ({
            ...prev,
            [name]: files[0],
        }));
    };
    const validateStep = (currentStep) => {
        if (currentStep === 3) {
            for (const key of STEP_DOCUMENTS) {
                if (!documents[key]) {
                    setMessage({
                        text: `Please upload ${key}`,
                        type: "error",
                    });
                    return false;
                }
            }
            return true;
        }
        for (const key of STEP_FIELDS[currentStep] || []) {
            if (!formData[key]) {
                setMessage({
                    text: `Please fill ${key}`,
                    type: "error",
                });
                return false;
            }
        }
        if (currentStep === 5 && !documents.paymentProof) {
            setMessage({
                text: "Please upload paymentProof",
                type: "error",
            });
            return false;
        }
        if (currentStep === 4 && formData.password !== formData.confirmPassword) {
            setMessage({
                text: "Confirm password must match with password",
                type: "error",
            });
            return false;
        }
        return true;
    };
    const handleContinue = () => {
        setMessage({ text: null, type: null });
        if (!validateStep(step)) return;
        setStep((prev) => prev + 1);
    };
    const handleBack = () => {
        setMessage({ text: null, type: null });
        setStep((prev) => prev - 1);
    };
    const buildRegistrationData = () => {
        const admin_data = new FormData();
        for (const key in documents) {
            const file = documents[key];
            if (!file) continue;
            admin_data.append(key, file);
        }
        for (const key in formData) {
            const value = formData[key];
            admin_data.append(key, value);
        }
        return admin_data;
    };
    const handleSendOtp = () => {
        setMessage({ text: null, type: null });
        if (!validateStep(5)) return;
        if (!termsAccepted) {
            setMessage({
                text: "Please accept the terms and conditions",
                type: "error",
            });
            return;
        }
        verifyEmail(buildRegistrationData(), setOtp, setLoading, setMessage);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (step !== 5) return;
        if (otp === false) {
            handleSendOtp();
            return;
        }
        // After the OTP is sent, `otp` is either `true` or the code the user
        // typed. Submitting without typing the code must not send "true".
        const otpValue = String(otp).trim();
        if (!otpValue || otpValue === "true") {
            setMessage({
                text: "Please enter the OTP sent to your email.",
                type: "error",
            });
            return;
        }
        const admin_data = buildRegistrationData();
        admin_data.append("otp", otpValue);
        registerAdmin(admin_data, setLoading, setMessage).then((result) => {
            if (result?.success) {
                setSubmitted(true);
            }
        });
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <div className="admin-register-page">
                <div className="admin-register-container">
                    {/* Header */}
                    <div className="register-header">
                        <h1>Register Your Institute</h1>
                        <p>
                            Create your service provider account and register your
                            school, college, or educational institute.
                        </p>
                        <Link style={{color : "blue", fontWeight : "bold", fontSize : "16px"}} to="/how-it-works">Don't Know how to register</Link>
                    </div>
                    {/* Step Indicator */}
                    <div className="register-steps">
                        {STEP_LABELS.map((label, index) => (
                            <div key={label} style={{ display: "flex", alignItems: "center" }}>
                                <div className={`register-step ${step === index + 1 ? "active" : ""} ${step > index + 1 ? "done" : ""}`}>
                                    <span>{step > index + 1 ? "✓" : index + 1}</span>
                                    <small>{label}</small>
                                </div>
                                {index < STEP_LABELS.length - 1 && <div className="register-step-line"></div>}
                            </div>
                        ))}
                    </div>
                    <form
                        className="admin-register-form"
                        onSubmit={handleSubmit}
                    >
                        {/* =========================================
                        STEP 1: OWNER INFORMATION
                    ========================================== */}
                        {step === 1 && (
                            <div className="form-section">
                                <div className="section-heading">
                                    <span>01</span>
                                    <div>
                                        <h2>Service Provider Information</h2>
                                        <p>
                                            Enter the personal information of the
                                            institute owner or authorized person.
                                        </p>
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            Full Name <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ownerName"
                                            placeholder="Enter full name"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Father / Guardian Name <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fatherName"
                                            placeholder="Enter father / guardian name"
                                            value={formData.fatherName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Email Address <span>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Phone Number <span>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="03XX-XXXXXXX"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            CNIC / National ID <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="cnic"
                                            placeholder="XXXXX-XXXXXXX-X"
                                            value={formData.cnic}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth <span>*</span></label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender <span>*</span></label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="male">
                                                Male
                                            </option>
                                            <option value="female">
                                                Female
                                            </option>
                                            <option value="other">
                                                Other
                                            </option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>City <span>*</span></label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter city"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>
                                            Residential / Permanent Address <span>*</span>
                                        </label>
                                        <textarea
                                            name="address"
                                            placeholder="Enter complete address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* =========================================
                        STEP 2: INSTITUTE INFORMATION
                    ========================================== */}
                        {step === 2 && (
                            <div className="form-section">
                                <div className="section-heading">
                                    <span>02</span>
                                    <div>
                                        <h2>Institute Information</h2>
                                        <p>
                                            Provide the basic information about your
                                            school, college, or educational institute.
                                        </p>
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            Institute Name <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="instituteName"
                                            placeholder="Enter institute name"
                                            value={formData.instituteName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Institute Type <span>*</span>
                                        </label>
                                        <select
                                            name="instituteType"
                                            value={formData.instituteType}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Institute Type
                                            </option>
                                            <option value="school">
                                                School
                                            </option>
                                            <option value="college">
                                                College
                                            </option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Registration Number <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="registrationNumber"
                                            placeholder="Institute registration number"
                                            value={formData.registrationNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Established Year <span>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="establishedYear"
                                            placeholder="e.g. 2015"
                                            value={formData.establishedYear}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Institute Phone <span>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="institutePhone"
                                            placeholder="Institute contact number"
                                            value={formData.institutePhone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Institute Email <span>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="instituteEmail"
                                            placeholder="institute@email.com"
                                            value={formData.instituteEmail}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Province / State <span>*</span></label>
                                        <input
                                            type="text"
                                            name="instituteProvince"
                                            placeholder="Enter province / state"
                                            value={formData.instituteProvince}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>City <span>*</span></label>
                                        <input
                                            type="text"
                                            name="instituteCity"
                                            placeholder="Enter institute city"
                                            value={formData.instituteCity}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>
                                            Complete Institute Address <span>*</span>
                                        </label>
                                        <textarea
                                            name="instituteAddress"
                                            placeholder="Enter complete institute address"
                                            value={formData.instituteAddress}
                                            onChange={handleChange}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* =========================================
                        STEP 3: DOCUMENTS
                    ========================================== */}
                        {step === 3 && (
                            <div className="form-section">
                                <div className="section-heading">
                                    <span>03</span>
                                    <div>
                                        <h2>Required Documents</h2>
                                        <p>
                                            Upload clear and valid documents for
                                            verification.
                                        </p>
                                    </div>
                                </div>
                                <div className="document-grid">
                                    <div className="file-group">
                                        <label>
                                            CNIC / ID Card — Front <span>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="ownerCnicFront"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                        />
                                        <small>
                                            JPG, PNG or PDF
                                        </small>
                                    </div>
                                    <div className="file-group">
                                        <label>
                                            CNIC / ID Card — Back <span>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="ownerCnicBack"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                        />
                                        <small>
                                            JPG, PNG or PDF
                                        </small>
                                    </div>
                                    <div className="file-group">
                                        <label>
                                            Institute Registration Document <span>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="instituteRegistration"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                        />
                                        <small>
                                            Upload official registration document
                                        </small>
                                    </div>
                                    <div className="file-group">
                                        <label>
                                            Ownership / Authorization Document
                                        </label>
                                        <input
                                            type="file"
                                            name="instituteOwnership"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                        />
                                        <small>
                                            Upload ownership or authorization proof
                                        </small>
                                    </div>
                                    <div className="file-group">
                                        <label>
                                            Owner / Authorized Person Photo <span>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="ownerPhoto"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <small>
                                            Recent passport-size photo
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* =========================================
                        STEP 4: ACCOUNT INFORMATION
                    ========================================== */}
                        {step === 4 && (
                            <div className="form-section">
                                <div className="section-heading">
                                    <span>04</span>
                                    <div>
                                        <h2>Account Information</h2>
                                        <p>
                                            These credentials will be used to access
                                            your institute dashboard after approval.
                                        </p>
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.ownerName}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                        />
                                        <small className="field-note">
                                            Registration email will be used for
                                            account communication.
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Password <span>*</span>
                                        </label>
                                        <div className="passwordField">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Create a strong password"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                className="passwordVisibilityBtn"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Confirm Password <span>*</span>
                                        </label>
                                        <div className="passwordField">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                className="passwordVisibilityBtn"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* =========================================
                        STEP 5: REGISTRATION PAYMENT
                    ========================================== */}
                        {step === 5 && (
                            <div className="form-section payment-section">
                                <div className="section-heading">
                                    <span>05</span>
                                    <div>
                                        <h2>Registration Payment</h2>
                                        <p>
                                            Complete the registration payment and
                                            upload the payment proof.
                                        </p>
                                    </div>
                                </div>
                                <div className="registration-fee">
                                    <div>
                                        <span>Registration Fee</span>
                                        <strong>{REGISTRATION_FEE || "Contact support"}</strong>
                                    </div>
                                    <p>
                                        Please pay the above amount using one of the
                                        available payment methods and provide the
                                        transaction details below.
                                    </p>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            Payment Method <span>*</span>
                                        </label>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleChange}
                                            disabled={otp ? true : false}
                                        >
                                            <option value="">
                                                Select Payment Method
                                            </option>
                                            <option value="easypaisa">
                                                Easypaisa
                                            </option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Transaction ID / Reference <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="transactionId"
                                            placeholder="Enter transaction ID"
                                            value={formData.transactionId}
                                            onChange={handleChange}
                                            disabled={otp ? true : false}
                                        />
                                    </div>
                                    <div className="payment-account full-width">
                                        <h3>Payment Account Details</h3>
                                        <div className="account-details">
                                            {HAS_PAYMENT_ACCOUNT ? (
                                                <>
                                                    {PAYMENT_ACCOUNT_TITLE && (
                                                        <p>
                                                            <strong>Account Title:</strong>
                                                            {PAYMENT_ACCOUNT_TITLE}
                                                        </p>
                                                    )}
                                                    {PAYMENT_ACCOUNT_NUMBER && (
                                                        <p>
                                                            <strong>Account Number:</strong>
                                                            {PAYMENT_ACCOUNT_NUMBER}
                                                        </p>
                                                    )}
                                                    {PAYMENT_IBAN && (
                                                        <p>
                                                            <strong>IBAN:</strong>
                                                            {PAYMENT_IBAN}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p>
                                                    Payment account details are not
                                                    configured yet. Please contact
                                                    support before sending any payment.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="file-group full-width payment-upload">
                                        <label>
                                            Payment Proof <span>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="paymentProof"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                            disabled={otp ? true : false}
                                        />
                                        <small>
                                            Upload a clear screenshot or receipt of
                                            your payment.
                                        </small>
                                    </div>
                                </div>
                                {
                                    (otp)
                                        ?
                                        (
                                            <div className="form-group" style={{ marginTop: "20px" }}>
                                                <label>
                                                    OTP <span>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={typeof otp === "string" ? otp : ""}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    placeholder="Enter OTP sent to you email."
                                                />
                                            </div>
                                        )
                                        :
                                        <></>
                                }
                            </div>
                        )}
                        {/* =========================================
                        TERMS
                    ========================================== */}
                        {step === 5 && (
                            <div className="terms-box">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    disabled={otp ? true : false}
                                />
                                <label htmlFor="terms">
                                    I confirm that the information and documents
                                    provided above are accurate and valid. I understand
                                    that my registration will be reviewed by the
                                    platform administrator before my institute account
                                    is approved.
                                </label>
                            </div>
                        )}
                        {message?.text ? (
                            <div className={`message ${message.type}`}>
                                <p>{message.text}</p>
                            </div>
                        ) : (
                            <></>
                        )}
                        {submitted && (
                            <div className="submit-area" style={{ justifyContent: "center" }}>
                                <Link to="/" className="register-submit-btn" style={{ textDecoration: "none" }}>
                                    Back to Home <span>→</span>
                                </Link>
                            </div>
                        )}
                        {/* NAVIGATION */}
                        <div className="submit-area">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="register-back-btn"
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    ← Back
                                </button>
                            )}
                            {step < 5 ? (
                                <button
                                    type="button"
                                    className="register-submit-btn"
                                    onClick={handleContinue}
                                    disabled={loading}
                                >
                                    Continue <span>→</span>
                                </button>
                            ) : otp ? (
                                <button
                                    type="submit"
                                    className="register-submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify OTP & Register"}
                                    <span>→</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="register-submit-btn"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                    <span>→</span>
                                </button>
                            )}
                        </div>
                        {step === 5 && (
                            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
                                Your application will be reviewed by the
                                administrator after submission.
                            </p>
                        )}
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminRegister;
