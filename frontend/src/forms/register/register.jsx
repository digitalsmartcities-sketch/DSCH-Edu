import { useState } from "react";
import "./register.css";
import { Navbar } from "../../components/navbar/navbar";
import { registerAdmin, verifyEmail } from "../../apicalls/public_apicalls";
import { Footer } from "../../components/footer/Footer";
import { Link } from "react-router-dom";

const AdminRegister = () => {
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
    const [loading, setLoading] = useState(false);
    let [message, setMessage] = useState({ text: null, type: null });
    const handleChange = (e) => {
        const { name, value } = e.target;
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
    const handleSubmit = (e) => {
        e.preventDefault();
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
        otp ? registerAdmin(admin_data, setLoading, setMessage) : verifyEmail(formData.email, formData.ownerName, setOtp, setLoading, setMessage)
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
                    <form
                        className="admin-register-form"
                        onSubmit={handleSubmit}
                    >
                        {/* =========================================
                        SECTION 1: OWNER INFORMATION
                    ========================================== */}
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
                                        required
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
                                        required
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
                                        required
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
                                        required
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
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
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
                                        required
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
                                        required
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* =========================================
                        SECTION 2: INSTITUTE INFORMATION
                    ========================================== */}
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
                                        required
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
                                        required
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
                                        Registration Number
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
                                        Established Year
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
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Institute Email
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
                                    <label>Province / State</label>
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
                                        required
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
                                        required
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* =========================================
                        SECTION 3: DOCUMENTS
                    ========================================== */}
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
                                        required
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
                                        required
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
                                        required
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
                                        required
                                    />
                                    <small>
                                        Recent passport-size photo
                                    </small>
                                </div>
                            </div>
                        </div>
                        {/* =========================================
                        SECTION 4: ACCOUNT INFORMATION
                    ========================================== */}
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
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Confirm Password <span>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {/* =========================================
                        SECTION 5: REGISTRATION PAYMENT
                    ========================================== */}
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
                                    <strong>PKR 5,000</strong>
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
                                        required
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
                                        required
                                    />
                                </div>
                                <div className="payment-account full-width">
                                    <h3>Payment Account Details</h3>
                                    <div className="account-details">
                                        <p>
                                            <strong>Account Title:</strong>
                                            Your Platform Name
                                        </p>
                                        <p>
                                            <strong>Account Number:</strong>
                                            XXXXXXXX
                                        </p>
                                        <p>
                                            <strong>IBAN:</strong>
                                            PK00 XXXX XXXX XXXX
                                        </p>
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
                                        required
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
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter OTP sent to you email."
                                                required
                                            />
                                        </div>
                                    )
                                    :
                                    <></>
                            }
                        </div>
                        {/* =========================================
                        TERMS
                    ========================================== */}
                        <div className="terms-box">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                            />
                            <label htmlFor="terms">
                                I confirm that the information and documents
                                provided above are accurate and valid. I understand
                                that my registration will be reviewed by the
                                platform administrator before my institute account
                                is approved.
                            </label>
                        </div>
                        {message ? (
                            <div className={`message ${message.type}`}>
                                <p>{message.text}</p>
                            </div>
                        ) : (
                            <></>
                        )}
                        {/* SUBMIT */}
                        <div className="submit-area">
                            <button
                                type="submit"
                                className="register-submit-btn"
                                disabled={loading}
                            >
                                {(otp) ? "Verify OTP" : "Submit Registration"}
                                <span>→</span>
                            </button>
                            <p>
                                Your application will be reviewed by the
                                administrator after submission.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminRegister;