import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaBookOpen,
    FaCheckCircle,
    FaCreditCard,
    FaEye,
    FaFileUpload,
    FaLock,
    FaTimes,
    FaTimesCircle,
    FaUserGraduate
} from "react-icons/fa";
import "./enrollment_payment.css";
import { approveCourseEnrollment, getEnrollmentById, rejectCourseEnrollment, resubmitCourseEnrollmentPayment } from "../../../../../apicalls/superadmin_apicalls";

export const EnrollmentPaymentView = ({ id, onBack }) => {
    let [enrollment, setEnrollment] = useState(null);

    const [paymentProof, setPaymentProof] = useState(null);
    const [showProof, setShowProof] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editedFields, setEditedFields] = useState({});
    const [message, setMessage] = useState({
        text: "",
        type: ""
    });

    useEffect(() => {
        getEnrollmentById(id, setEnrollment, setLoading, setMessage);
    }, []);

    const isEditable =
        enrollment?.status === "REJECTED" ||
        enrollment?.payment?.status === "REJECTED";

    const handleChange = (e, section) => {
        if (!isEditable) return;
        if (section === "payment") {
            const { name, value } = e.target;
            setEnrollment(prev => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    [name]: value
                }
            }));
            setEditedFields(prev => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    [name]: value
                }
            }));
        }
        const { name, value } = e.target;
        setEnrollment(prev => ({
            ...prev,
            [name]: value
        }));
        setEditedFields(prev => ({
            ...prev,
            [name]: value
        }));
        setMessage({
            text: "",
            type: ""
        });
    };

    const handlePaymentProof = (e) => {
        if (!isEditable) return;
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
        if (!isEditable) return;
        if (paymentProof) {
            setEditedFields(prev => ({
                ...prev,
                paymentProof: paymentProof
            }));
        }
        let data = new FormData();
        data.append("editedFields", JSON.stringify(editedFields));
        data.append("paymentProof", paymentProof);
        resubmitCourseEnrollmentPayment(id, data, setLoading, setMessage, onBack);
    };

    const handleApprove = () => {
        approveCourseEnrollment(enrollment._id, setLoading, onBack)
    };

    const handleReject = () => {
        rejectCourseEnrollment(enrollment._id, setLoading, onBack)
    };

    if (!enrollment) {
        return (
            <div className="enrollmentViewEmpty">
                <h2>
                    Enrollment not found
                </h2>

                <button onClick={onBack}>
                    <FaArrowLeft />
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="enrollmentPaymentView">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="enrollmentViewHeader">

                <div>

                    <button
                        type="button"
                        className="enrollmentViewBackBtn"
                        onClick={onBack}
                    >
                        <FaArrowLeft />
                        Back to Enrollments
                    </button>

                    <span className="enrollmentViewEyebrow">
                        ENROLLMENT REVIEW
                    </span>

                    <h1>
                        Enrollment Details
                    </h1>

                    <p>
                        Review the applicant information and payment
                        details before making a decision.
                    </p>

                </div>


                <div className="enrollmentViewStatuses">

                    <span
                        className={`viewStatusBadge ${enrollment.status.toLowerCase()}`}
                    >
                        {enrollment.status === "APPROVED"
                            ? <FaCheckCircle />
                            : enrollment.status === "REJECTED"
                                ? <FaTimesCircle />
                                : <FaLock />
                        }

                        Enrollment {enrollment.status}
                    </span>

                    <span
                        className={`viewStatusBadge ${enrollment.payment?.status?.toLowerCase()}`}
                    >
                        {enrollment.payment?.status === "PAID"
                            ? <FaCheckCircle />
                            : enrollment.payment?.status === "REJECTED"
                                ? <FaTimesCircle />
                                : <FaCreditCard />
                        }

                        Payment {enrollment.payment?.status}
                    </span>

                </div>

            </div>


            {/* =========================================
                EDIT MODE NOTICE
            ========================================= */}

            <div
                className={
                    isEditable
                        ? "enrollmentEditNotice editable"
                        : "enrollmentEditNotice"
                }
            >

                {
                    isEditable
                        ? (
                            <>
                                <FaFileUpload />

                                <div>
                                    <strong>
                                        Correction Required
                                    </strong>

                                    <p>
                                        Both the enrollment and payment were
                                        rejected. The applicant information
                                        and payment details can be corrected
                                        and resubmitted for review.
                                    </p>
                                </div>
                            </>
                        )
                        : (
                            <>
                                <FaLock />

                                <div>
                                    <strong>
                                        Read-Only Review
                                    </strong>

                                    <p>
                                        This enrollment is not currently in
                                        correction mode. Its submitted
                                        information is read-only.
                                    </p>
                                </div>
                            </>
                        )
                }

            </div>


            <form
                className="enrollmentViewForm"
                onSubmit={handleSubmit}
            >

                {/* =====================================
                    PERSONAL INFORMATION
                ====================================== */}

                <section className="enrollmentViewSection">

                    <SectionHeading
                        icon={<FaUserGraduate />}
                        title="Applicant Information"
                        description="Personal information submitted with the enrollment."
                    />

                    <div className="enrollmentViewGrid">

                        <ViewField
                            label="Full Name"
                            name="fullName"
                            value={enrollment.fullName}
                            onChange={handleChange}
                            disabled={!isEditable}
                            required
                        />

                        <ViewField
                            label="Email"
                            name="email"
                            type="email"
                            value={enrollment.email}
                            onChange={handleChange}
                            disabled={!isEditable}
                            required
                        />

                        <ViewField
                            label="Phone"
                            name="phone"
                            value={enrollment.phone}
                            onChange={handleChange}
                            disabled={!isEditable}
                            required
                        />

                        <div className="enrollmentViewField">

                            <label>
                                Gender
                                <span>*</span>
                            </label>

                            <select
                                name="gender"
                                value={enrollment.gender}
                                onChange={handleChange}
                                disabled={!isEditable}
                            >

                                <option value="">
                                    Select Gender
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


                        <ViewField
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={enrollment.dateOfBirth}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />

                    </div>
                </section>
                {/* =====================================
                    EDUCATION
                ====================================== */}

                <section className="enrollmentViewSection">

                    <SectionHeading
                        icon={<FaBookOpen />}
                        title="Educational Information"
                        description="Academic background provided by the applicant."
                    />

                    <div className="enrollmentViewGrid">

                        <ViewField
                            label="Highest Qualification"
                            name="qualification"
                            value={enrollment.qualification}
                            onChange={handleChange}
                            disabled={!isEditable}
                            required
                        />

                        <ViewField
                            label="Institution"
                            name="institution"
                            value={enrollment.institution}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />

                        <div className="enrollmentViewField full">

                            <label>
                                Motivation
                            </label>

                            <textarea
                                name="motivation"
                                value={enrollment.motivation}
                                onChange={handleChange}
                                disabled={!isEditable}
                                rows="4"
                                placeholder="No motivation provided."
                            />

                        </div>

                    </div>

                </section>


                {/* =====================================
                    COURSE
                ====================================== */}

                <section className="enrollmentViewSection">

                    <SectionHeading
                        icon={<FaBookOpen />}
                        title="Course Information"
                        description="Course selected by the applicant."
                    />

                    <div className="enrollmentCourseView">

                        <div>

                            <span>
                                COURSE
                            </span>

                            <h3>
                                {enrollment.courseTitle ||
                                    "Course unavailable"}
                            </h3>

                            <p>
                                Course Code:
                                {" "}
                                <strong>
                                    {enrollment.courseCode || "N/A"}
                                </strong>
                            </p>

                            <p>
                                Offered By:
                                {" "}
                                <strong>
                                    {enrollment.courseProvider || "N/A"}
                                </strong>
                            </p>

                        </div>


                        <div className="courseLockedLabel">
                            <FaLock />
                            Course cannot be changed
                        </div>

                    </div>

                </section>


                {/* =====================================
                    PAYMENT
                ====================================== */}

                <section className="enrollmentViewSection">

                    <SectionHeading
                        icon={<FaCreditCard />}
                        title="Payment Information"
                        description="Payment details submitted with this enrollment."
                    />


                    <div className="enrollmentPaymentAmount">

                        <span>
                            Payment Amount
                        </span>

                        <strong>
                            PKR{" "}
                            {Number(
                                enrollment.payment?.amount || 0
                            ).toLocaleString()}
                        </strong>

                    </div>


                    <div className="enrollmentViewGrid">

                        <div className="enrollmentViewField">

                            <label>
                                Payment Method
                            </label>

                            <select
                                name="paymentMethod"
                                value={enrollment.payment?.paymentMethod}
                                onChange={(e) => handleChange(e, "payment")}
                                disabled={!isEditable}
                            >

                                <option value="">
                                    Select Method
                                </option>

                                <option value="EASYPAISA">
                                    EasyPaisa
                                </option>
                            </select>

                        </div>


                        <ViewField
                            label="Transaction ID"
                            name="transactionId"
                            value={enrollment.payment?.transactionId}
                            onChange={(e) => handleChange(e, "payment")}
                            disabled={!isEditable}
                        />

                        <ViewField
                            label="Payment Date"
                            name="paymentDate"
                            type="date"
                            value={enrollment.payment?.paymentDate.slice(0, 10)}
                            onChange={(e) => handleChange(e, "payment")}
                            disabled={!isEditable}
                        />

                    </div>


                    {/* PAYMENT PROOF */}

                    <div className="paymentProofView">

                        <div className="paymentProofHeader">

                            <div>

                                <span>
                                    PAYMENT PROOF
                                </span>

                                <strong>
                                    {enrollment.payment?.paymentProof?.title ||
                                        "Payment Proof"}
                                </strong>

                            </div>

                            {
                                enrollment.payment?.paymentProof?.imageUrl && (
                                    <button
                                        type="button"
                                        className="proofViewBtn"
                                        onClick={() =>
                                            setShowProof(true)
                                        }
                                    >
                                        <FaEye />
                                        View
                                    </button>
                                )
                            }

                        </div>


                        {
                            isEditable && (
                                <label className="paymentProofReplace">

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
                                                : "Replace payment proof"
                                        }
                                    </span>

                                </label>
                            )
                        }

                    </div>

                </section>
                {/* =====================================
                    MESSAGE
                ====================================== */}
                {message.text && (
                    <div
                        className={`enrollmentViewMessage ${message.type}`}
                    >
                        {message.type === "success"
                            ? <FaCheckCircle />
                            : <FaTimesCircle />
                        }
                        <span>
                            {message.text}
                        </span>
                    </div>
                )}
                {/* =====================================
                    ACTIONS
                ====================================== */}
                <div className="enrollmentViewActions">
                    <button
                        type="button"
                        className="enrollmentCancelBtn"
                        onClick={onBack}
                    >
                        <FaArrowLeft />
                        Back
                    </button>
                    {
                        isEditable ? (
                            <button
                                type="submit"
                                className="enrollmentResubmitBtn"
                                disabled={loading}
                            >
                                <FaCheckCircle />
                                {
                                    loading
                                        ? "Saving..."
                                        : "Save & Resubmit"
                                }
                            </button>
                        ) : (
                            <>
                                {
                                    enrollment.status === "PENDING" && (
                                        <button
                                            type="button"
                                            className="enrollmentRejectBtn"
                                            onClick={handleReject}
                                        >
                                            <FaTimes />
                                            Reject
                                        </button>
                                    )
                                }
                                {
                                    enrollment.status === "PENDING" && (
                                        <button
                                            type="button"
                                            className="enrollmentApproveBtn"
                                            onClick={handleApprove}
                                        >
                                            <FaCheckCircle />
                                            Approve Enrollment
                                        </button>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </form>
            {/* =========================================
                PAYMENT PROOF MODAL
            ========================================== */}

            {
                showProof &&
                enrollment.payment?.paymentProof?.imageUrl && (
                    <div className="enrollmentProofOverlay">
                        <div className="enrollmentProofModal">
                            <div className="enrollmentProofModalHeader">
                                <div>
                                    <span>
                                        PAYMENT PROOF
                                    </span>
                                    <h3>
                                        Submitted Payment Proof
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowProof(false)
                                    }
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="enrollmentProofContent">
                                {
                                    enrollment.payment.paymentProof.imageUrl
                                        .toLowerCase() ? (
                                        <img
                                            src={
                                                enrollment.payment.paymentProof.imageUrl
                                            }
                                            alt="Payment proof"
                                        />
                                    ) : (
                                        <a
                                            href={
                                                enrollment.payment.paymentProof.imageUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open payment document
                                        </a>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};


/* =====================================================
   SECTION HEADING
===================================================== */

const SectionHeading = ({
    icon,
    title,
    description
}) => (
    <div className="enrollmentViewSectionHeading">
        <div className="enrollmentViewSectionIcon">
            {icon}
        </div>
        <div>
            <h2>
                {title}
            </h2>
            <p>
                {description}
            </p>
        </div>
    </div>
);

/* =====================================================
   FIELD
===================================================== */

const ViewField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    disabled,
    required = false
}) => (
    <div className="enrollmentViewField">
        <label>
            {label}
            {required && (
                <span>*</span>
            )}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    </div>
);