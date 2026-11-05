import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaBookOpen,
    FaCheckCircle,
    FaCreditCard,
    FaFileUpload,
    FaLock,
    FaUserGraduate
} from "react-icons/fa";
import "./enrollment_form.css";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, submitCourseEnrollment } from "../../apicalls/public_apicalls";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/Footer";

export const CourseEnrollment = () => {
    const navigate = useNavigate()
    let { id } = useParams();
    let [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        qualification: "",
        institution: "",
        motivation: "",
        paymentMethod: "",
        transactionId: "",
        agreement: false
    });

    useEffect(() => {
        getCourseById(id, setCourse, setLoading);
    }, [id])

    const [paymentProof, setPaymentProof] = useState(null);
    const [message, setMessage] = useState({
        text: "",
        type: ""
    });

    const isPaidCourse = course?.price > 0 ? true : false;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setMessage({
            text: "",
            type: ""
        });
    };

    const handlePaymentProof = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setPaymentProof(file);

        setMessage({
            text: "",
            type: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (paymentProof === null || paymentProof === undefined) {
            setMessage({
                text: `Please upload payment proof`,
                type: "error"
            });
            return;
        }
        let formData = new FormData();

        for (const key in form) {
            const value = form[key];
            if (value === "" || value === null || value === undefined || value === false) {
                setMessage({
                    text: `Please fill all the fields`,
                    type: "error"
                });
                return;
            }
            formData.append(key, form[key])
        }
        formData.append("paymentProof", paymentProof);
        formData.append("id", id);

        const result = await submitCourseEnrollment(formData, setLoading, navigate);

        if (!result.success) {
            setMessage({
                text: result.message || "Something went wrong, Please try again.",
                type: "error"
            });
        }
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <div className="courseEnrollmentPage">

                    {/* =========================================
                HEADER
            ========================================== */}
                    <div className="courseEnrollmentHeader">
                        <button
                            type="button"
                            className="courseEnrollmentBackBtn"
                            onClick={() => navigate(`/course/${course?._id}`)}
                        >
                            <FaArrowLeft />
                            Back to Course
                        </button>
                        <span>
                            COURSE ENROLLMENT
                        </span>
                        <h1>
                            Enroll in {course?.title || "Course"}
                        </h1>
                        <p>
                            Complete the form below to submit your course
                            enrollment application.
                        </p>
                    </div>
                    <form
                        className="courseEnrollmentForm"
                        onSubmit={handleSubmit}
                    >
                        {/* =====================================
                    PERSONAL INFORMATION
                ====================================== */}
                        <section className="courseEnrollmentSection">
                            <div className="enrollmentSectionHeading">
                                <div className="enrollmentSectionIcon">
                                    <FaUserGraduate />
                                </div>
                                <div>
                                    <h2>
                                        Personal Information
                                    </h2>
                                    <p>
                                        Enter the information required for
                                        your enrollment record.
                                    </p>
                                </div>
                            </div>
                            <div className="enrollmentFormGrid">
                                <FormField
                                    label="Full Name"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                                <FormField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter active email address"
                                    required
                                />
                                <FormField
                                    label="Phone Number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                                <div className="enrollmentFormGroup">
                                    <label>
                                        Gender <span>*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select gender
                                        </option>
                                        <option value="MALE">
                                            Male
                                        </option>
                                        <option value="FEMALE">
                                            Female
                                        </option>
                                        <option value="OTHER">
                                            Other
                                        </option>
                                    </select>
                                </div>
                                <FormField
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>
                        {/* =====================================
                    EDUCATIONAL INFORMATION
                ====================================== */}
                        <section className="courseEnrollmentSection">
                            <div className="enrollmentSectionHeading">
                                <div className="enrollmentSectionIcon">
                                    <FaBookOpen />
                                </div>
                                <div>
                                    <h2>
                                        Educational Information
                                    </h2>
                                    <p>
                                        Provide your current academic background.
                                    </p>
                                </div>
                            </div>
                            <div className="enrollmentFormGrid">
                                <FormField
                                    label="Highest Qualification"
                                    name="qualification"
                                    value={form.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g. Intermediate, BS, Diploma"
                                    required
                                />
                                <FormField
                                    label="Current / Previous Institution"
                                    name="institution"
                                    value={form.institution}
                                    onChange={handleChange}
                                    placeholder="Enter institution name"
                                />
                            </div>
                        </section>
                        {/* =====================================
                    COURSE INFORMATION
                ====================================== */}
                        <section className="courseEnrollmentSection">
                            <div className="enrollmentSectionHeading">
                                <div className="enrollmentSectionIcon">
                                    <FaBookOpen />
                                </div>
                                <div>
                                    <h2>
                                        Course Information
                                    </h2>
                                    <p>
                                        Review the course you are applying for.
                                    </p>
                                </div>
                            </div>
                            <div className="enrollmentCourseSummary">
                                <img
                                    src={course?.thumbnail}
                                    alt={course?.title || "Course"}
                                />
                                <div>
                                    <span>
                                        {course?.category || "Course"}
                                    </span>
                                    <h3>
                                        {course?.title || "Course"}
                                    </h3>
                                    <p>
                                        Course Code:{" "}
                                        <strong>
                                            {course?.courseCode || "N/A"}
                                        </strong>
                                    </p>
                                    <p>
                                        Offered by{" "}
                                        <strong>
                                            {course?.offeredByInstitute || "N/A"}
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        </section>
                        {/* =====================================
                    ADDITIONAL INFORMATION
                ====================================== */}
                        <section className="courseEnrollmentSection">
                            <div className="enrollmentSectionHeading">
                                <div className="enrollmentSectionIcon">
                                    <FaUserGraduate />
                                </div>
                                <div>
                                    <h2>
                                        Additional Information
                                    </h2>
                                    <p>
                                        This information is optional.
                                    </p>
                                </div>
                            </div>
                            <div className="enrollmentFormGroup">
                                <label>
                                    Why do you want to take this course?
                                    <span>Optional</span>
                                </label>
                                <textarea
                                    name="motivation"
                                    value={form.motivation}
                                    onChange={handleChange}
                                    placeholder="Briefly explain your reason for enrolling..."
                                    rows="5"
                                />
                            </div>
                        </section>
                        {/* =====================================
                    PAYMENT
                ====================================== */}
                        <section className="courseEnrollmentSection">
                            <div className="enrollmentSectionHeading">
                                <div className="enrollmentSectionIcon">
                                    <FaCreditCard />
                                </div>
                                <div>
                                    <h2>
                                        Payment Information
                                    </h2>
                                    <p>
                                        {
                                            isPaidCourse
                                                ? "Provide your payment details for verification."
                                                : "This course is free and does not require payment."
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="enrollmentFeeBox">
                                <span>
                                    Course Fee
                                </span>
                                <strong>
                                    {
                                        isPaidCourse
                                            ? `PKR ${course?.price.toLocaleString()}`
                                            : "FREE"
                                    }
                                </strong>
                            </div>
                            {isPaidCourse && (
                                <div className="enrollmentPaymentGrid">
                                    <div className="enrollmentFormGroup">
                                        <label>
                                            Payment Method <span>*</span>
                                        </label>
                                        <select
                                            name="paymentMethod"
                                            value={form.paymentMethod}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select payment method
                                            </option>
                                            <option value="EASYPAISA">
                                                EasyPaisa
                                            </option>
                                        </select>
                                    </div>
                                    <FormField
                                        label="Transaction ID"
                                        name="transactionId"
                                        value={form.transactionId}
                                        onChange={handleChange}
                                        placeholder="Enter transaction ID"
                                        required
                                    />
                                    <div className="enrollmentFileGroup">
                                        <label>
                                            Payment Proof <span>*</span>
                                        </label>
                                        <label className="paymentProofUpload">
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={handlePaymentProof}
                                            />
                                            <FaFileUpload />
                                            <span>
                                                {
                                                    paymentProof
                                                        ? paymentProof.name
                                                        : "Upload payment proof"
                                                }
                                            </span>
                                            <small>
                                                JPG, PNG or PDF
                                            </small>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </section>
                        {/* =====================================
                    AGREEMENT
                ====================================== */}
                        <label className="enrollmentAgreement">
                            <input
                                type="checkbox"
                                name="agreement"
                                checked={form.agreement}
                                onChange={handleChange}
                            />
                            <span>
                                I confirm that the information provided in this
                                enrollment form is accurate and I agree to the
                                course enrollment terms and conditions.
                            </span>
                        </label>
                        {/* =====================================
                    MESSAGE
                ====================================== */}
                        {message.text && (
                            <div
                                className={`enrollmentMessage ${message.type}`}
                            >
                                {message.type === "success" && (
                                    <FaCheckCircle />
                                )}
                                <span>
                                    {message.text}
                                </span>
                            </div>
                        )}
                        {/* =====================================
                    SUBMIT
                ====================================== */}
                        <div className="enrollmentSubmitArea">
                            <button
                                type="submit"
                                className="enrollmentSubmitBtn"
                                disabled={loading}
                            >
                                <FaLock />
                                {loading
                                    ? "Submitting..."
                                    : "Submit Enrollment"}
                            </button>
                            <p>
                                Your application will be reviewed and approved. You’ll be notified via email upon approval.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
};

/* =====================================================
   FORM FIELD
===================================================== */

const FormField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false
}) => {
    return (
        <div className="enrollmentFormGroup">
            <label>
                {label}
                {required && (
                    <span>
                        *
                    </span>
                )}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
};