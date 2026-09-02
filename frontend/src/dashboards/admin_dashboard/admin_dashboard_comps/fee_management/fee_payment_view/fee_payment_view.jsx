import { useState } from "react";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaClock,
    FaTimes,
    FaTimesCircle,
    FaUserGraduate,
    FaUniversity,
    FaCreditCard,
    FaFileImage,
    FaMoneyBillWave
} from "react-icons/fa";
import "./fee_payment_view.css";
import { approveMonthlyFeePayment, rejectFeePayment } from "../../../../../apicalls/admin_apicalls";

export const FeePaymentView = ({ fee, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const formatDateTime = (value) => {
        if (!value) return "Not available";
        return new Date(value).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatAmount = (value) => {
        const amount = Number(value);
        return Number.isFinite(amount)
            ? `PKR ${amount.toLocaleString()}`
            : "Not available";
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            return alert("Please enter a rejection reason.");
        }

        rejectFeePayment(fee._id, rejectionReason, onClose, setLoading);
    };

    const isPending = fee.status === "PENDING";
    const isPaid = fee.status === "PAID";
    const isRejected = fee.status === "REJECTED";

    return (
        <div className="feePaymentViewPage">

            {/* HEADER */}

            <div className="feePaymentViewHeader">
                <div>
                    <span className="feePaymentViewEyebrow">
                        FEE MANAGEMENT
                    </span>

                    <h1>
                        Fee Payment Review
                    </h1>

                    <p>
                        Review the student's fee payment and verify the
                        submitted transaction before making a decision.
                    </p>
                </div>

                <button
                    className="feePaymentBackBtn"
                    onClick={onClose}
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>


            {/* STATUS BAR */}

            <div className={`feePaymentStatusBar ${fee.status.toLowerCase()}`}>
                <div className="feePaymentStatusLeft">

                    <div className="feePaymentStatusIcon">
                        {isPaid && <FaCheckCircle />}
                        {isRejected && <FaTimesCircle />}
                        {isPending && <FaClock />}
                        {!isPending && !isPaid && !isRejected && <FaMoneyBillWave />}
                    </div>

                    <div>
                        <span>
                            Current Payment Status
                        </span>

                        <strong>
                            {fee.status}
                        </strong>

                        <p>
                            {isPending &&
                                "This payment is waiting for admin review."}

                            {isPaid &&
                                "This payment has been approved successfully."}

                            {isRejected &&
                                "This payment has been rejected."}
                        </p>
                    </div>
                </div>

                <span className="feePaymentStatusBadge">
                    {fee.status}
                </span>
            </div>


            {/* MAIN GRID */}

            <div className="feePaymentViewGrid">

                {/* STUDENT */}

                <section className="feePaymentCard">

                    <SectionHeader
                        icon={<FaUserGraduate />}
                        color="green"
                        title="Student Information"
                        description="Student associated with this fee payment."
                    />

                    <div className="feePaymentInfoGrid">

                        <InfoItem
                            label="Student Name"
                            value={`${fee.studentId?.firstName || ""} ${fee.studentId?.lastName || ""}`.trim()}
                        />

                        <InfoItem
                            label="Class"
                            value={fee.studentId?.class}
                        />

                        <InfoItem
                            label="Email"
                            value={fee.studentId?.email}
                        />

                        <InfoItem
                            label="Phone"
                            value={fee.studentId?.phone}
                        />

                        <InfoItem
                            label="Student ID"
                            value={fee.studentId?._id}
                        />

                    </div>

                </section>


                {/* INSTITUTE */}

                <section className="feePaymentCard">

                    <SectionHeader
                        icon={<FaUniversity />}
                        color="blue"
                        title="Institute Information"
                        description="Institute associated with this fee."
                    />

                    <div className="feePaymentInfoGrid">

                        <InfoItem
                            label="Institute Name"
                            value={fee.instituteId?.instituteName}
                        />

                        <InfoItem
                            label="Institute Type"
                            value={fee.instituteId?.instituteType}
                        />

                        <InfoItem
                            label="Phone"
                            value={fee.instituteId?.institutePhone}
                        />

                        <InfoItem
                            label="Address"
                            value={fee.instituteId?.instituteAddress}
                        />

                    </div>

                </section>


            </div>


            {/* PAYMENT INFORMATION */}

            <section className="feePaymentCard">

                <SectionHeader
                    icon={<FaCreditCard />}
                    color="orange"
                    title="Payment Information"
                    description="Payment details submitted by the student."
                />

                <div className="feePaymentInfoGrid paymentDetailsGrid">

                    <InfoItem
                        label="Fee Type"
                        value={fee.feeType}
                    />

                    <InfoItem
                        label="Month"
                        value={fee.month}
                    />

                    <InfoItem
                        label="Year"
                        value={fee.year}
                    />

                    <InfoItem
                        label="Amount"
                        value={formatAmount(fee.amount)}
                    />

                    <InfoItem
                        label="Payment Method"
                        value={fee.paymentMethod}
                    />

                    <InfoItem
                        label="Transaction ID"
                        value={fee.transactionId}
                    />

                    <InfoItem
                        label="Submitted At"
                        value={formatDateTime(fee.submittedAt)}
                    />

                    <InfoItem
                        label="Reviewed At"
                        value={formatDateTime(fee.reviewedAt)}
                    />

                    <InfoItem
                        label="Paid At"
                        value={formatDateTime(fee.paidAt)}
                    />

                    <InfoItem
                        label="Included With Admission"
                        value={fee.includedWithAdmission ? "Yes" : "No"}
                    />

                </div>

            </section>


            {/* PAYMENT PROOF */}

            <section className="feePaymentCard">

                <SectionHeader
                    icon={<FaFileImage />}
                    color="purple"
                    title="Payment Proof"
                    description="Review the payment evidence submitted by the student."
                />

                {fee.paymentProof?.imageUrl ? (
                    <div className="feePaymentProofBox">
                        <img
                            src={fee.paymentProof.imageUrl}
                            alt={fee.paymentProof.title || "Payment proof"}
                        />

                        <div className="feePaymentProofInfo">
                            <span>
                                Document
                            </span>

                            <strong>
                                {fee.paymentProof.title || "Payment Proof"}
                            </strong>
                        </div>
                    </div>
                ) : (
                    <div className="feePaymentProofMissing">
                        <FaFileImage />
                        <h3>
                            Payment Proof Not Available
                        </h3>
                        <p>
                            No payment proof was found for this fee.
                        </p>
                    </div>
                )}

            </section>


            {/* EXISTING REJECTION REASON */}

            {fee.rejectionReason && !showReject && (
                <div className="feeExistingRejection">
                    <strong>
                        Rejection Reason
                    </strong>

                    <p>
                        {fee.rejectionReason}
                    </p>
                </div>
            )}


            {/* REJECTION FORM */}

            {showReject && isPending && (
                <section className="feePaymentRejectCard">

                    <h2>
                        Reject Fee Payment
                    </h2>

                    <p>
                        Provide a clear reason for rejecting this payment.
                        The student can use this reason to correct and
                        resubmit the payment.
                    </p>

                    <textarea
                        value={rejectionReason}
                        onChange={(e) =>
                            setRejectionReason(e.target.value)
                        }
                        placeholder="Enter payment rejection reason..."
                        rows="5"
                    />

                    <div className="feeRejectActions">

                        <button
                            className="feeCancelRejectBtn"
                            onClick={() => {
                                setShowReject(false);
                                setRejectionReason("");
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            className="feeConfirmRejectBtn"
                            onClick={handleReject}
                            disabled={loading}
                        >
                            <FaTimes />
                            {loading ? "Processing..." : "Reject Payment"}
                        </button>

                    </div>

                </section>
            )}


            {/* DECISION BAR */}

            {isPending && !showReject && (
                <div className="feePaymentDecisionBar">

                    <div>
                        <h2>
                            Payment Decision
                        </h2>

                        <p>
                            Verify the transaction ID, payment amount and
                            payment proof before approving this payment.
                        </p>
                    </div>

                    <div className="feePaymentDecisionButtons">

                        <button
                            className="feeDecisionRejectBtn"
                            onClick={() => setShowReject(true)}
                            disabled={loading}
                        >
                            <FaTimes />
                            Reject
                        </button>

                        <button
                            className="feeDecisionApproveBtn"
                            onClick={() => approveMonthlyFeePayment(fee._id, setLoading, onClose)}
                            disabled={loading}
                        >
                            <FaCheckCircle />
                            {loading ? "Processing..." : "Approve Payment"}
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

const SectionHeader = ({ icon, color, title, description }) => (
    <div className="feePaymentSectionHeader">
        <div className={`feePaymentSectionIcon ${color}`}>
            {icon}
        </div>

        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="feePaymentInfoItem">
        <span>{label}</span>
        <strong>
            {value !== undefined &&
                value !== null &&
                value !== ""
                ? value
                : "Not provided"}
        </strong>
    </div>
);