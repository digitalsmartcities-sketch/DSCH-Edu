import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaCheck,
    FaTimes,
    FaUserGraduate,
    FaPhone,
    FaCalendarAlt,
    FaFileAlt,
    FaFilePdf
} from "react-icons/fa";

import "./studentView.css";
import { approveAdmission, GetApplicationByIdApi, rejectAdmission } from "../../../../apicalls/admin_apicalls";
import { StudentRejectedEdit } from "../edit_student_applications/student_rejected_edit";
import notify from "../../../../components/toast/toastBus";

const isPdfUrl = (url) => Boolean(url && url.split("?")[0].toLowerCase().endsWith(".pdf"));

export const StudentView = ({ id, setSubpage }) => {
    const [showRejectBox, setShowRejectBox] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [applyMonthlyFee, setApplyMonthlyFee] = useState(true);
    let [loading, setLoading] = useState(true);
    let [student, setStudent] = useState();

    useEffect(() => {
        GetApplicationByIdApi(id, setLoading, setStudent);
    }, [id]);

    if (loading) {
        return (
            <div className="adminComponentLoading">
                <div className="adminComponentLoader"></div>
                <p>Loading, Please wait...</p>
            </div>
        );
    }
    
    const handleApprove = () => {
        approveAdmission(student._id, setSubpage, setLoading, applyMonthlyFee);
    };

    const handleRejectSubmit = () => {
        if (!rejectionReason.trim()) {
            notify.error("Please provide a rejection reason.");
            return;
        }
        rejectAdmission(student._id, rejectionReason, setSubpage, setLoading);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    };

    if (student.status === "REJECTED" || student?.paymentStatus === "REJECTED") {
        return (
            <StudentRejectedEdit
                admission={student}
                onCancel={() => setSubpage("Admissions")}
                loading={loading}
            />
        )
    }

    return (
        <div className="studentViewPage">
            {/* =========================================
                HEADER
            ========================================= */}
            <div className="studentViewHeader">
                <div>
                    <span className="studentViewEyebrow">
                        ADMISSION APPLICATION
                    </span>
                    <h1>
                        Student Application
                    </h1>
                    <p>
                        Review the student's information and
                        submitted documents before making a decision.
                    </p>
                </div>
                <button
                    className="studentBackBtn"
                    onClick={() => setSubpage("Admissions")}
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>
            {/* =========================================
                STATUS
            ========================================= */}
            {
                student.status !== "APPROVED"
                    ?
                    <div className="studentReviewStatus">
                        <div className="reviewStatusContent">
                            <div className="reviewStatusIcon">
                                <FaUserGraduate />
                            </div>
                            <div>
                                <strong>
                                    Application Pending Review
                                </strong>
                                <p>
                                    Review all submitted information
                                    before approving or rejecting the application.
                                </p>
                            </div>
                        </div>
                        <span className="studentPendingBadge">
                            PENDING
                        </span>
                    </div>
                    :
                    <></>
            }
            {/* =========================================
                STUDENT BASIC INFORMATION
            ========================================= */}
            <section className="studentViewCard">
                <div className="studentSectionHeading">
                    <div className="studentSectionIcon">
                        <FaUserGraduate />
                    </div>
                    <div>
                        <h2>
                            Student Information
                        </h2>
                        <p>
                            Personal information submitted by the student.
                        </p>
                    </div>
                </div>
                <div className="studentInfoGrid">
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
                        value={student.dateOfBirth}
                    />
                </div>
            </section>
            {/* =========================================
                ACADEMIC INFORMATION
            ========================================= */}
            <section className="studentViewCard">
                <div className="studentSectionHeading">
                    <div className="studentSectionIcon">
                        <FaFileAlt />
                    </div>
                    <div>
                        <h2>
                            Academic Information
                        </h2>
                        <p>
                            Previous education and admission details.
                        </p>
                    </div>
                </div>
                <div className="studentInfoGrid">
                    <InfoItem
                        label="Applying For"
                        value={`Class ${student.applyingFor}`}
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
                        label="Admission Fee"
                        value={`Rs. ${student.admissionFee}`}
                    />
                    <InfoItem
                        label="Monthly Fee"
                        value={`Rs. ${student.monthlyFee}`}
                    />
                </div>
            </section>
            {/* =========================================
                GUARDIAN INFORMATION
            ========================================= */}
            <section className="studentViewCard">
                <div className="studentSectionHeading">
                    <div className="studentSectionIcon">
                        <FaPhone />
                    </div>
                    <div>
                        <h2>
                            Guardian Information
                        </h2>
                        <p>
                            Parent or guardian information submitted
                            with the application.
                        </p>
                    </div>
                </div>
                <div className="studentInfoGrid">
                    <InfoItem
                        label="Guardian Name"
                        value={student.guardianName}
                    />
                    <InfoItem
                        label="Guardian Phone"
                        value={student.guardianPhone}
                    />
                    <InfoItem
                        label="Guardian CNIC / B-Form"
                        value={student.guardianCnic}
                    />
                    <InfoItem
                        label="Relation"
                        value={student.guardianRelation}
                    />
                </div>
            </section>
            {/* =========================================
                DOCUMENTS
            ========================================= */}
            <section className="studentViewCard">
                <div className="studentSectionHeading">
                    <div className="studentSectionIcon">
                        <FaFileAlt />
                    </div>
                    <div>
                        <h2>
                            Submitted Documents
                        </h2>
                        <p>
                            Review the documents provided by the student.
                        </p>
                    </div>
                </div>
                <div className="studentDocumentsGrid">
                    {
                        student.documents.map((document, index) => (
                            <div
                                className="studentDocumentCard"
                                key={index}
                            >
                                <div className="studentDocumentHeader">
                                    <h3>
                                        {document.title}
                                    </h3>
                                    <span>
                                        Document {index + 1}
                                    </span>
                                </div>
                                <div className="studentDocumentImage">
                                    {isPdfUrl(document.imageUrl) ? (
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
                                            alt={document.title}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
            {/* =========================================
                APPLICATION INFORMATION
            ========================================= */}
            <section className="studentViewCard">
                <div className="studentSectionHeading">
                    <div className="studentSectionIcon">
                        <FaCalendarAlt />
                    </div>
                    <div>
                        <h2>
                            Application Information
                        </h2>
                        <p>
                            Current application status and submission details.
                        </p>
                    </div>
                </div>
                <div className="studentInfoGrid">
                    <InfoItem
                        label="Application Status"
                        value={student.status}
                    />
                    <InfoItem
                        label="Payment Status"
                        value={
                            student?.paymentStatus
                                ? student?.paymentStatus
                                : "Not Paid"
                        }
                    />
                    <InfoItem
                        label="Admission Receipt"
                        value={student.admissionReceipt}
                    />
                    <InfoItem
                        label="Submitted On"
                        value={formatDate(student.createdAt)}
                    />
                </div>
            </section>
            {/* =========================================
                REJECTION REASON
            ========================================= */}
            {
                showRejectBox && (
                    <section className="studentRejectCard">
                        <h2>
                            Reject Application
                        </h2>
                        <p>
                            Provide a clear reason. The application and all
                            uploaded documents will be permanently deleted,
                            and the student must resubmit with corrected data.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) =>
                                setRejectionReason(e.target.value)
                            }
                            placeholder="Enter the reason for rejection..."
                            rows="5"
                        />
                        <div className="rejectionActions">
                            <button
                                type="button"
                                className="cancelRejectBtn"
                                disabled={loading}
                                onClick={() => {
                                    setShowRejectBox(false);
                                    setRejectionReason("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirmRejectBtn"
                                disabled={loading}
                                onClick={handleRejectSubmit}
                            >
                                <FaTimes />
                                Reject & Delete Application
                            </button>
                        </div>
                    </section>
                )
            }
            {/* =========================================
                DECISION BAR
            ========================================= */}
            {
                !showRejectBox && (
                    <section className="studentDecisionBar">
                        <div>
                            <h2>
                                Application Decision
                            </h2>
                            <p>
                                Make sure all information and documents
                                have been reviewed before deciding.
                            </p>
                        </div>
                        <div className="studentDecisionButtons">
                            <label className="studentFeeToggle">
                                <input
                                    type="checkbox"
                                    checked={applyMonthlyFee}
                                    onChange={(e) => setApplyMonthlyFee(e.target.checked)}
                                    disabled={loading}
                                />
                                <span>
                                    Apply monthly fee from institute program
                                </span>
                            </label>
                            <button
                                className="studentRejectBtn"
                                onClick={() => setShowRejectBox(true)}
                                disabled={student.status === "APPROVED" || student.admissionReceipt === "GENERATED" || student.status === "REJECTED" || loading}
                            >
                                <FaTimes />
                                Reject
                            </button>
                            <button
                                className="studentApproveBtn"
                                onClick={handleApprove}
                                disabled={student.status === "APPROVED" || student.paymentStatus === "NOT_SUBMITTED" || loading}
                            >
                                <FaCheck />
                                Approve Application
                            </button>
                        </div>
                    </section>
                )
            }
        </div>
    );
};

/* =========================================
   INFORMATION ITEM
========================================= */
const InfoItem = ({ label, value }) => {
    return (
        <div className="studentInfoItem">
            <span>
                {label}
            </span>
            <strong>
                {value !== undefined &&
                    value !== null &&
                    value !== ""
                    ? value
                    : "Not provided"}
            </strong>
        </div>
    );
};