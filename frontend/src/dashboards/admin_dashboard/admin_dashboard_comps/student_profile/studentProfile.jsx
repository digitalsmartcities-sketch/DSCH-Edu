import { useEffect, useState } from "react";
import {
    FaUserGraduate,
    FaUser,
    FaBookOpen,
    FaFileAlt,
    FaFilePdf,
    FaCreditCard,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaIdCard,
    FaArrowLeft,
    FaLock,
    FaImage,
    FaGraduationCap
} from "react-icons/fa";
import "./studentProfile.css";
import { getStudentById } from "../../../../apicalls/admin_apicalls";

const isPdfUrl = (url) => Boolean(url && url.split("?")[0].toLowerCase().endsWith(".pdf"));

export const StudentProfile = ({ setSubpage, id }) => {
    const [student, setStudent] = useState(null);
    const [admission_application, setAdmissionApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudentById(id, setStudent, setLoading, setAdmissionApplication);
    }, [id]);

    if (loading) {
        return (
            <div className="studentProfileLoading">
                <FaClock />
                <p>Loading student profile...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="studentProfileEmpty">
                <FaUserGraduate />
                <h2>Student Not Found</h2>
                <p>The requested student profile could not be found.</p>
                <button onClick={() => setSubpage("Students")}>
                    <FaArrowLeft />
                    Go Back
                </button>
            </div>
        );
    }

    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();
    const percentage = student.totalMarks > 0
        ? ((student.obtainedMarks / student.totalMarks) * 100).toFixed(1)
        : "0";

    const formatDate = (date) => {
        if (!date) return "Not provided";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    const formatDateTime = (date) => {
        if (!date) return "Not reviewed";
        return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const paymentStatus = admission_application?.paymentStatus || "NOT_SUBMITTED";
    const receipt = admission_application?.admissionReceiptData || {};

    return (
        <div className="studentProfilePage">

            {/* =========================================
                HEADER
            ========================================= */}
            <div className="studentProfileHeader">
                <div>
                    <span className="studentProfileEyebrow">
                        STUDENT MANAGEMENT
                    </span>
                    <h1>
                        Student Profile
                    </h1>
                    <p>
                        View and manage the complete record of this student.
                    </p>
                </div>
                <button
                    className="studentProfileBackBtn"
                    onClick={() => setSubpage("Students")}
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>
            {/* =========================================
                PROFILE SUMMARY
            ========================================= */}
            <section className="studentProfileSummary">
                <div className="studentProfileIdentity">
                    <div className="studentProfileAvatar">
                        {student.firstName?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div>
                        <span>Student</span>
                        <h2>
                            {fullName || "Unnamed Student"}
                        </h2>
                        <p>
                            Class {student.class || "N/A"} · {student.email || "No email"}
                        </p>
                    </div>
                </div>
                <div className="studentProfileStatusGroup">
                    <span className={`studentAccountBadge ${student.status?.toLowerCase()}`}>
                        {student.status === "ACTIVE"
                            ? <FaCheckCircle />
                            : <FaClock />
                        }
                        {student.status || "UNKNOWN"}
                    </span>
                    <span className={`studentApprovalBadge ${student.approved ? "approved" : "pending"}`}>
                        {student.approved
                            ? <FaCheckCircle />
                            : <FaClock />
                        }
                        {student.approved ? "APPROVED" : "NOT APPROVED"}
                    </span>
                </div>
            </section>
            {/* =========================================
                PERSONAL INFORMATION
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaUser />}
                    title="Personal Information"
                    description="Basic information of the student."
                    color="green"
                />
                <div className="studentProfileInfoGrid">
                    <InfoItem
                        label="First Name"
                        value={student.firstName}
                    />
                    <InfoItem
                        label="Last Name"
                        value={student.lastName}
                    />
                    <InfoItem
                        label="Email"
                        value={student.email}
                    />
                    <InfoItem
                        label="Phone"
                        value={student.phone}
                    />
                    <InfoItem
                        label="Gender"
                        value={student.gender}
                    />
                    <InfoItem
                        label="Date of Birth"
                        value={formatDate(student.dateOfBirth)}
                    />
                    <InfoItem
                        label="Student Role"
                        value={student.role}
                    />
                    <InfoItem
                        label="Student ID"
                        value={student._id}
                    />
                </div>
            </section>
            {/* =========================================
                ACADEMIC INFORMATION
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaBookOpen />}
                    title="Academic Information"
                    description="Previous academic record and current class information."
                    color="blue"
                />
                <div className="studentProfileInfoGrid">
                    <InfoItem
                        label="Current Class"
                        value={student.class ? `Class ${student.class}` : null}
                    />
                    <InfoItem
                        label="Previous School"
                        value={student.previousSchool}
                    />
                    <InfoItem
                        label="Last Qualification"
                        value={student.lastQualification}
                    />
                    <InfoItem
                        label="Passing Year"
                        value={student.passingYear}
                    />
                    <InfoItem
                        label="Obtained Marks"
                        value={student.obtainedMarks}
                    />
                    <InfoItem
                        label="Total Marks"
                        value={student.totalMarks}
                    />
                    <InfoItem
                        label="Percentage"
                        value={`${percentage}%`}
                    />
                </div>
            </section>
            {/* =========================================
                GUARDIAN INFORMATION
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaIdCard />}
                    title="Guardian Information"
                    description="Parent or guardian details."
                    color="purple"
                />
                <div className="studentProfileInfoGrid">
                    <InfoItem
                        label="Guardian Name"
                        value={student.guardianName}
                    />
                    <InfoItem
                        label="Guardian Phone"
                        value={student.guardianPhone}
                    />
                    <InfoItem
                        label="Guardian CNIC"
                        value={student.guardianCnic}
                    />
                    <InfoItem
                        label="Guardian Relation"
                        value={student.guardianRelation}
                    />
                </div>
            </section>
            {/* =========================================
                ADMISSION INFORMATION
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaGraduationCap />}
                    title="Admission Information"
                    description="Admission application and fee information."
                    color="orange"
                />
                <div className="studentProfileInfoGrid">
                    <InfoItem
                        label="Admission Application For"
                        value={admission_application.applyingFor}
                    />
                    <InfoItem
                        label="Admission Application ID"
                        value={admission_application._id}
                    />
                    <InfoItem
                        label="Admission Fee"
                        value={
                            student.admissionFee != null
                                ? `PKR ${Number(admission_application.admissionReceiptData.admissionFee).toLocaleString()}`
                                : null
                        }
                    />
                    <InfoItem
                        label="Monthly Fee"
                        value={
                            student.monthlyFee != null
                                ? `PKR ${Number(student.monthlyFee).toLocaleString()}`
                                : null
                        }
                    />
                    <InfoItem
                        label="Student Approved"
                        value={admission_application.status === "APPROVED" ? "Yes" : "No"}
                    />
                    <InfoItem
                        label="Student Active"
                        value={student.status === "ACTIVE" ? "Yes" : "No"}
                    />
                </div>
            </section>
            {/* =========================================
                ADMISSION PAYMENT
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaCreditCard />}
                    title="Admission Payment"
                    description="Admission fee payment submitted by the student."
                    color="blue"
                />
                <div className="studentPaymentReviewGrid">
                    <div className={`studentPaymentStatus ${paymentStatus.toLowerCase()}`}>
                        {paymentStatus === "PAID" && <FaCheckCircle />}
                        {paymentStatus === "PENDING" && <FaClock />}
                        {paymentStatus === "REJECTED" && <FaTimesCircle />}
                        {paymentStatus === "NOT_SUBMITTED" && <FaCreditCard />}
                        {paymentStatus === "SUBMITTED" && <FaCreditCard />}
                        <div>
                            <span>Payment Status</span>
                            <strong>{paymentStatus}</strong>
                        </div>
                    </div>
                    <InfoItem
                        label="Payment Method"
                        value={admission_application?.paymentMethod}
                    />
                    <InfoItem
                        label="Transaction ID"
                        value={admission_application?.transactionId}
                    />
                    <InfoItem
                        label="Submitted At"
                        value={formatDateTime(admission_application?.createdAt)}
                    />
                    <InfoItem
                        label="Application Reviewed At"
                        value={formatDateTime(admission_application?.reviewedAt)}
                    />
                </div>
                {admission_application?.rejectionReason && (
                    <div className="studentPaymentRejection">
                        <strong>Application Rejection Reason</strong>
                        <p>{admission_application?.rejectionReason}</p>
                    </div>
                )}
            </section>
            {/* =========================================
                ADMISSION RECEIPT
            ========================================= */}
            {receipt && (
                <section className="studentProfileCard">
                    <SectionHeader
                        icon={<FaFileAlt />}
                        title="Admission Receipt"
                        description="Receipt generated for the approved admission."
                        color="green"
                    />
                    <div className="studentProfileInfoGrid">
                        <InfoItem
                            label="Receipt Number"
                            value={receipt.receiptNo}
                        />
                        <InfoItem
                            label="Receipt Date"
                            value={formatDate(receipt.date)}
                        />
                        <InfoItem
                            label="Application Status"
                            value={admission_application.status}
                        />
                        <InfoItem
                            label="Payment Status"
                            value={paymentStatus}
                        />
                    </div>
                </section>
            )}
            {/* =========================================
                DOCUMENTS
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaImage />}
                    title="Student Documents"
                    description="Documents submitted during the admission process."
                    color="purple"
                />
                <div className="studentDocumentsGrid">
                    {student.documents?.length ? (
                        student.documents.map((document, index) => (
                            <div
                                className="studentDocumentCard"
                                key={document._id || index}
                            >
                                <div className="studentDocumentHeader">
                                    <strong>
                                        {document.title || `Document ${index + 1}`}
                                    </strong>
                                </div>
                                {document.imageUrl ? (
                                    isPdfUrl(document.imageUrl) ? (
                                        <a
                                            className="studentDocumentPdfLink"
                                            href={document.imageUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FaFilePdf />
                                            <span>
                                                Open PDF
                                            </span>
                                        </a>
                                    ) : (
                                        <img
                                            src={document.imageUrl}
                                            alt={document.title || "Student document"}
                                        />
                                    )
                                ) : (
                                    <div className="missingDocument">
                                        <FaFileAlt />
                                        <span>
                                            Document unavailable
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="noDocuments">
                            <FaFileAlt />
                            <p>No documents available.</p>
                        </div>
                    )}
                </div>
            </section>
            {/* =========================================
                FEE RECORD
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaCreditCard />}
                    title="Fee Record"
                    description="Fee records associated with this student."
                    color="orange"
                />
                {student.feeRecord?.length ? (
                    <div className="studentFeeTableWrapper">
                        <table className="studentFeeTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Month</th>
                                    <th>Year</th>
                                    <th>Fee ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.feeRecord.map((fee, index) => (
                                    <tr key={fee.feeDocId || index}>
                                        <td>{index + 1}</td>
                                        <td>{fee.month || "N/A"}</td>
                                        <td>{fee.year || "N/A"}</td>
                                        <td>{fee.feeDocId || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="emptyFeeRecord">
                        <FaCreditCard />
                        <p>No fee records available yet.</p>
                    </div>
                )}
            </section>
            {/* =========================================
                ACCOUNT INFORMATION
            ========================================= */}
            <section className="studentProfileCard">
                <SectionHeader
                    icon={<FaLock />}
                    title="Account Information"
                    description="Student account and access status."
                    color="gray"
                />
                <div className="studentProfileInfoGrid">
                    <InfoItem
                        label="Account Status"
                        value={student.status}
                    />
                    <InfoItem
                        label="Approved"
                        value={student.approved ? "Yes" : "No"}
                    />
                </div>
            </section>
            {/* =========================================
                ACTIONS
            ========================================= */}
            <div className="studentProfileActions">
                <button
                    className="studentProfileSecondaryBtn"
                    onClick={() => setSubpage("Students")}
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon, title, description, color }) => (
    <div className="studentProfileSectionHeader">
        <div className={`studentProfileSectionIcon ${color}`}>
            {icon}
        </div>
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    </div>
);


const InfoItem = ({ label, value }) => (
    <div className="studentProfileInfoItem">
        <span>{label}</span>
        <strong>
            {value !== undefined && value !== null && value !== ""
                ? value
                : "Not provided"}
        </strong>
    </div>
);