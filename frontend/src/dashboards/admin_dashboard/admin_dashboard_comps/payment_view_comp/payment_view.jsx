import { useState, useEffect } from "react";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaTimes,
    FaUserGraduate,
    FaCreditCard,
    FaFileImage,
    FaClock,
    FaReceipt
} from "react-icons/fa";
import "./payment_view.css";
import { approveStudentAdmissionPayment, getStudentPaymentById, rejectStudentPayment } from "../../../../apicalls/admin_apicalls";

export const PaymentView = ({ setSubpage, id }) => {

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRejectBox, setShowRejectBox] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        getStudentPaymentById(id, setStudent, setLoading);
    }, [id]);

    const fullName = student
        ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
        : "";

    const handleApprove = async () => {
        if (!student) return;
        approveStudentAdmissionPayment(id, setLoading);
    };

    const handleReject = async () => {
        rejectStudentPayment(id, rejectionReason, () => setSubpage("Admissions"), setLoading);
    };

    if (loading) {
        return (
            <div className="paymentViewLoading">
                <FaClock />
                <p>Loading payment details...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="paymentViewEmpty">
                <FaCreditCard />
                <h2>Payment Not Found</h2>
                <p>The requested payment information could not be found.</p>
                <button onClick={() => setSubpage("Admissions")}>
                    <FaArrowLeft />
                    Go Back
                </button>
            </div>
        );
    }

    const paymentProof = student.paymentProof || {};

    return (
        <div className="paymentViewPage">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="paymentViewHeader">
                <div>
                    <span className="paymentViewEyebrow">
                        ADMISSION PAYMENT
                    </span>
                    <h1>
                        Payment Review
                    </h1>
                    <p>
                        Review the student's admission fee payment before
                        approving or rejecting it.
                    </p>
                </div>
                <button
                    className="paymentViewBackBtn"
                    onClick={() => setSubpage("Admissions")}
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>
            {/* =========================================
                PAYMENT STATUS
            ========================================= */}
            <div className="paymentReviewStatus">
                <div className="paymentReviewStatusLeft">
                    <div className="paymentReviewStatusIcon">
                        <FaClock />
                    </div>
                    <div>
                        <span>
                            Payment Status
                        </span>
                        <strong>
                            {student.paymentStatus || "PENDING"}
                        </strong>
                        <p>
                            This payment is awaiting institute
                            administration review.
                        </p>
                    </div>
                </div>
                <span className="paymentPendingBadgeLarge">
                    {student.paymentStatus || "PENDING"}
                </span>
            </div>
            {/* =========================================
                STUDENT INFORMATION
            ========================================= */}
            <section className="paymentViewCard">
                <div className="paymentViewSectionHeader">
                    <div className="paymentViewSectionIcon green">
                        <FaUserGraduate />
                    </div>
                    <div>
                        <h2>
                            Student Information
                        </h2>
                        <p>
                            Student and admission information associated
                            with this payment.
                        </p>
                    </div>
                </div>
                <div className="paymentInfoGrid">
                    <InfoItem
                        label="Student Name"
                        value={fullName}
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
                        label="Class"
                        value={student.applyingFor || ""}
                    />
                    <InfoItem
                        label="Guardian Name"
                        value={student.guardianName}
                    />
                    <InfoItem
                        label="Guardian Phone"
                        value={student.guardianPhone}
                    />
                    <InfoItem
                        label="Institute"
                        value={student.instituteName}
                    />
                    <InfoItem
                        label="Admission Application"
                        value={student.admissionApplication || "APPROVED"}
                    />
                </div>
            </section>
            {/* =========================================
                PAYMENT INFORMATION
            ========================================= */}
            <section className="paymentViewCard">
                <div className="paymentViewSectionHeader">
                    <div className="paymentViewSectionIcon blue">
                        <FaCreditCard />
                    </div>
                    <div>
                        <h2>
                            Payment Information
                        </h2>
                        <p>
                            Details submitted by the student.
                        </p>
                    </div>
                </div>
                <div className="paymentInfoGrid">
                    <InfoItem
                        label="Payment Type"
                        value="Admission Fee"
                    />
                    <InfoItem
                        label="Amount"
                        value={
                            student.admissionReceiptData?.admissionFee != null
                                ? `PKR ${Number(student.admissionReceiptData?.admissionFee + student.admissionReceiptData?.monthlyFee).toLocaleString()}`
                                : null
                        }
                    />

                    <InfoItem
                        label="Payment Method"
                        value={student.paymentMethod}
                    />

                    <InfoItem
                        label="Transaction ID"
                        value={student.transactionId}
                    />
                    <InfoItem
                        label="Submitted At"
                        value={student.paymentSubmittedAt.slice(0,10)}
                    />
                    <InfoItem
                        label="Payment Status"
                        value={student.paymentStatus}
                    />
                </div>
            </section>
            {/* =========================================
                PAYMENT PROOF
            ========================================= */}
            <section className="paymentViewCard">
                <div className="paymentViewSectionHeader">
                    <div className="paymentViewSectionIcon purple">
                        <FaFileImage />
                    </div>
                    <div>
                        <h2>
                            Payment Proof
                        </h2>
                        <p>
                            Verify that the uploaded payment proof
                            matches the transaction details.
                        </p>
                    </div>
                </div>
                <div className="paymentProofReview">
                    <div className="paymentProofImageBox">
                        { 
                            paymentProof.imageUrl ? (
                                <img
                                    src={paymentProof.imageUrl}
                                    alt={paymentProof.title || "Payment proof"}
                                />
                            ) : (
                                <div className="paymentProofMissing">
                                    <FaFileImage />
                                    <span>
                                        Payment proof not available
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </section>
            {/* =========================================
                ADMISSION RECEIPT SUMMARY
            ========================================= */}
            {
                student.admissionReceiptData && (
                    <section className="paymentViewCard">
                        <div className="paymentViewSectionHeader">
                            <div className="paymentViewSectionIcon orange">
                                <FaReceipt />
                            </div>
                            <div>
                                <h2>
                                    Admission Receipt
                                </h2>
                                <p>
                                    Receipt associated with the approved
                                    admission application.
                                </p>
                            </div>
                        </div>
                        <div className="receiptReviewGrid">
                            <InfoItem
                                label="Receipt Number"
                                value={student.admissionReceiptData.receiptNo}
                            />
                            <InfoItem
                                label="Application Status"
                                value={student.status}
                            />
                            <InfoItem
                                label="Receipt Payment Status"
                                value={student.paymentStatus}
                            />

                            <InfoItem
                                label="Admission Fee"
                                value={
                                    student.admissionReceiptData.admissionFee != null
                                        ? `PKR ${Number(student.admissionReceiptData.admissionFee + student.admissionReceiptData.monthlyFee).toLocaleString()}`
                                        : null
                                }
                            />
                        </div>
                    </section>
                )
            }
            {/* =========================================
                REJECTION PANEL
            ========================================= */}
            {
                showRejectBox && (
                    <section className="paymentRejectCard">
                        <h2>
                            Reject Payment
                        </h2>
                        <p>
                            Provide a clear reason so the student knows
                            why the payment was rejected and what needs
                            to be corrected.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) =>
                                setRejectionReason(e.target.value)
                            }
                            placeholder="Enter the payment rejection reason..."
                            rows="5"
                        />
                        <div className="paymentRejectActions">
                            <button
                                className="cancelPaymentRejectBtn"
                                onClick={() => {
                                    setShowRejectBox(false);
                                    setRejectionReason("");
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirmPaymentRejectBtn"
                                onClick={handleReject}
                                disabled={loading}
                            >
                                <FaTimes />
                                {loading ? "Processing..." : "Reject Payment"}
                            </button>
                        </div>
                    </section>
                )
            }
            {/* =========================================
                DECISION BAR
            ========================================= */}
            {
                !showRejectBox && student.paymentStatus === "SUBMITTED" && (
                    <section className="paymentDecisionBar">
                        <div>
                            <h2>
                                Payment Decision
                            </h2>

                            <p>
                                Verify the transaction ID, amount and proof
                                before approving this payment.
                            </p>
                        </div>
                        <div className="paymentDecisionButtons">
                            <button
                                className="paymentRejectBtn"
                                onClick={() => setShowRejectBox(true)}
                                disabled={loading}
                            >
                                <FaTimes />
                                Reject Payment
                            </button>
                            <button
                                className="paymentApproveBtn"
                                onClick={handleApprove}
                                disabled={loading}
                            >
                                <FaCheckCircle />
                                {loading ? "Processing..." : "Approve Payment"}
                            </button>
                        </div>
                    </section>
                )
            }
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="paymentInfoItem">
        <span>{label}</span>
        <strong>
            {value !== undefined && value !== null && value !== ""
                ? value
                : "Not provided"}
        </strong>
    </div>
);