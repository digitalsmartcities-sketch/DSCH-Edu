import { useEffect, useState } from "react";
import {
    FaCheckCircle, FaClock, FaCreditCard, FaFileAlt, FaGraduationCap,
    FaUser, FaEye, FaPrint, FaTimes, FaUniversity
} from "react-icons/fa";
import "./std_admission_application.css";
import { getmyApplication } from "../../../../apicalls/student_apicalls";

export const StudentAdmission = ({ setSubPage }) => {
    const [showReceipt, setShowReceipt] = useState(false);
    const [admission, setAdmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getmyApplication((data) => {
            setAdmission(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="studentDashboardLoading">
                <div className="studentDashboardLoader"></div>
                <p>Loading, Please wait...</p>
            </div>
        );
    }

    if (!admission) {
        return (
            <div className="studentAdmissionPage">
                <div className="admissionEmptyState">
                    <FaFileAlt />
                    <h2>Admission Information Not Found</h2>
                    <p>We could not find your admission information.</p>
                </div>
            </div>
        );
    }
    
    const receipt = admission.admissionReceiptData || {};
    const paymentStatus = admission.paymentStatus;
    const fullName = `${admission.firstName || ""} ${admission.lastName || ""}`.trim() || "Not provided";
    const applicationApproved = admission.status === "APPROVED";

    const getPaymentLabel = () => {
        switch (paymentStatus) {
            case "NOT_SUBMITTED": return "Payment Required";
            case "SUBMITTED": return "Payment Submitted";
            case "PENDING": return "Payment Under Review";
            case "PAID": return "Payment Approved";
            case "REJECTED": return "Payment Rejected";
            default: return "Unknown";
        }
    };

    const getPaymentDescription = () => {
        switch (paymentStatus) {
            case "PENDING":
                return "Your payment proof has been submitted and is currently being reviewed by the institute.";
            case "NOT_SUBMITTED":
                return "Your admission application has been approved. Please submit your admission fee payment.";
            case "SUBMITTED":
                return "Your payment proof has been submitted and is currently being reviewed by the institute.";
            case "PAID":
                return "Your admission fee payment has been approved successfully.";
            case "REJECTED":
                return admission.rejectionReason || "Your admission fee payment was rejected. Please submit a valid payment proof.";
            default:
                return "Payment information is currently unavailable.";
        }
    };

    const money = (value) => {
        const amount = Number(value);
        return Number.isFinite(amount) ? `PKR ${amount.toLocaleString()}` : "Not provided";
    };

    const handlePrintReceipt = () => window.print();

    return (
        <div className="studentAdmissionPage">

            <div className="studentAdmissionHeader">
                <div>
                    <span className="studentAdmissionEyebrow">ADMISSION</span>
                    <h1>My Admission</h1>
                    <p>View your admission details, receipt and admission fee payment status.</p>
                </div>

                <div className={`admissionApprovedBadge ${applicationApproved ? "" : "notApproved"}`}>
                    {applicationApproved ? <FaCheckCircle /> : <FaClock />}
                    {applicationApproved ? "Application Approved" : "Application Pending"}
                </div>
            </div>

            <div className={`admissionStatusCard ${applicationApproved ? "" : "pending"}`}>
                <div className="admissionStatusLeft">
                    <div className="admissionStatusIcon">
                        {applicationApproved ? <FaGraduationCap /> : <FaClock />}
                    </div>

                    <div>
                        <span>Admission Application</span>
                        <strong>{admission.admissionApplication || "PENDING"}</strong>
                        <p>
                            {applicationApproved
                                ? "Your admission application has been approved by the institute administration."
                                : "Your admission application is currently being reviewed."}
                        </p>
                    </div>
                </div>

                <div className="admissionStatusRight">
                    <span>Class</span>
                    <strong>{admission.applyingFor || "N/A"}</strong>
                </div>
            </div>

            <div className="admissionContentGrid">

                <section className="admissionCard">
                    <div className="admissionCardHeader">
                        <div className="admissionCardIcon green"><FaUser /></div>
                        <div>
                            <h2>Student Information</h2>
                            <p>Your submitted admission information.</p>
                        </div>
                    </div>

                    <div className="admissionInfoGrid">
                        <InfoItem label="Student Name" value={fullName} />
                        <InfoItem label="Class" value={admission.applyingFor ? `Class ${admission.applyingFor}` : null} />
                        <InfoItem label="Email" value={admission.email} />
                        <InfoItem label="Phone" value={admission.phone} />
                        <InfoItem label="Gender" value={admission.gender} />
                        <InfoItem label="Date of Birth" value={admission.dateOfBirth} />
                        <InfoItem label="Guardian Name" value={admission.guardianName} />
                        <InfoItem label="Guardian Phone" value={admission.guardianPhone} />
                    </div>
                </section>

                <section className="admissionCard">
                    <div className="admissionCardHeader">
                        <div className="admissionCardIcon orange"><FaCreditCard /></div>
                        <div>
                            <h2>Fee Information</h2>
                            <p>Fees associated with your admission.</p>
                        </div>
                    </div>

                    <div className="feeSummary">
                        <div className="feeSummaryRow">
                            <span>Admission Fee</span>
                            <strong>{money(admission.admissionFee)}</strong>
                        </div>

                        {Number(admission.monthlyFee) > 0 && (
                            <div className="feeSummaryRow">
                                <span>Monthly Fee</span>
                                <strong>{money(admission.monthlyFee)}</strong>
                            </div>
                        )}

                        <div className="feeSummaryRow total">
                            <span>Admission Payment</span>
                            <strong>{getPaymentLabel()}</strong>
                        </div>
                    </div>
                </section>

            </div>

            {applicationApproved && (
                <section className="admissionCard paymentCard">
                    <div className="admissionCardHeader">
                        <div className="admissionCardIcon blue"><FaCreditCard /></div>
                        <div>
                            <h2>Admission Fee Payment</h2>
                            <p>Submit and track your admission fee payment.</p>
                        </div>
                    </div>

                    <div className={`paymentState ${paymentStatus.toLowerCase()}`}>
                        <div className="paymentStateIcon">
                            {paymentStatus === "NOT_SUBMITTED" && <FaCreditCard />}
                            {paymentStatus === "SUBMITTED" && <FaCreditCard />}
                            {paymentStatus === "PENDING" && <FaClock />}
                            {paymentStatus === "PAID" && <FaCheckCircle />}
                            {paymentStatus === "REJECTED" && <FaFileAlt />}
                        </div>

                        <div className="paymentStateContent">
                            <h3>{getPaymentLabel()}</h3>
                            <p>{getPaymentDescription()}</p>
                        </div>

                        {paymentStatus === "NOT_SUBMITTED" && (
                            <button className="admissionPayBtn" onClick={() => setSubPage(`PaymentForm:${admission._id}`)}>
                                <FaCreditCard />
                                Pay Admission Fee
                            </button>
                        )}

                        {paymentStatus === "PENDING" && (
                            <span className="paymentPendingBadge">
                                <FaClock />
                                Pending Review
                            </span>
                        )}

                        {paymentStatus === "PAID" && (
                            <span className="paymentPaidBadge">
                                <FaCheckCircle />
                                Paid
                            </span>
                        )}

                        {paymentStatus === "REJECTED" && (
                            <button className="admissionPayBtn rejected" onClick={() => setSubPage(`PaymentForm:${admission._id}`)}>
                                Submit Again
                            </button>
                        )}
                    </div>
                </section>
            )}

            {applicationApproved && (
                <section className="admissionCard">
                    <div className="admissionCardHeader">
                        <div className="admissionCardIcon purple"><FaFileAlt /></div>
                        <div>
                            <h2>Admission Receipt</h2>
                            <p>Your admission approval receipt.</p>
                        </div>
                    </div>

                    <div className="receiptSummary">
                        <div>
                            <span>Receipt Number</span>
                            <strong>{receipt.receiptNo || "Not available"}</strong>
                        </div>

                        <div>
                            <span>Generated On</span>
                            <strong>{receipt.date ? new Date(receipt.date).toLocaleDateString() : "Not available"}</strong>
                        </div>

                        <div>
                            <span>Application Status</span>
                            <strong className="receiptApproved">
                                <FaCheckCircle />
                                {admission.status || "APPROVED"}
                            </strong>
                        </div>

                        <div>
                            <span>Payment Status</span>
                            <strong>{receipt.paymentStatus || paymentStatus}</strong>
                        </div>
                    </div>

                    <div className="receiptActions">
                        <button className="viewReceiptBtn" onClick={() => setShowReceipt(true)}>
                            <FaEye />
                            View Receipt
                        </button>
                    </div>
                </section>
            )}

            {paymentStatus === "NOT_SUBMITTED" && applicationApproved && (
                <div className="admissionPaymentNotice">
                    <FaClock />
                    <div>
                        <strong>Action Required</strong>
                        <p>
                            Your admission application has been approved, but your admission fee has not been submitted. Please complete the payment to continue the student activation process.
                        </p>
                    </div>
                </div>
            )}

            {showReceipt && applicationApproved && (
                <div className="receiptModalOverlay">
                    <div className="receiptModal">

                        <div className="receiptModalHeader">
                            <div>
                                <span>ADMISSION DOCUMENT</span>
                                <h2>Admission Receipt</h2>
                            </div>

                            <button className="receiptCloseBtn" onClick={() => setShowReceipt(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="printableReceipt">

                            <div className="receiptTop">
                                <div className="receiptInstituteIcon"><FaUniversity /></div>

                                <div className="receiptInstituteInfo">
                                    <h1>{receipt.instName || "Institute Name"}</h1>
                                    <p>{receipt.instAddress || "Institute address not available"}</p>
                                    <span>Phone: {receipt.instPhone || "Not available"}</span>
                                </div>
                            </div>

                            <div className="receiptTitleSection">
                                <span>OFFICIAL DOCUMENT</span>
                                <h2>ADMISSION RECEIPT</h2>
                            </div>

                            <div className="receiptMeta">
                                <div>
                                    <span>Receipt No.</span>
                                    <strong>{receipt.receiptNo || "Not available"}</strong>
                                </div>

                                <div>
                                    <span>Date</span>
                                    <strong>
                                        {receipt.date
                                            ? new Date(receipt.date).toLocaleDateString("en-GB", {
                                                day: "2-digit", month: "long", year: "numeric"
                                            })
                                            : "Not available"}
                                    </strong>
                                </div>
                            </div>

                            <div className="receiptSection">
                                <div className="receiptSectionTitle">Student Information</div>

                                <div className="receiptFields">
                                    <ReceiptField label="Student Name" value={receipt.studentName || fullName} />
                                    <ReceiptField label="Class" value={receipt.class ? `Class ${receipt.class}` : admission.class ? `Class ${admission.class}` : null} />
                                    <ReceiptField label="Guardian Name" value={receipt.guardianName || admission.guardianName} />
                                    <ReceiptField label="Guardian Phone" value={receipt.guardianPhone || admission.guardianPhone} />
                                </div>
                            </div>

                            <div className="receiptSection">
                                <div className="receiptSectionTitle">Fee Details</div>

                                <div className="receiptFeeTable">
                                    <div className="receiptFeeRow receiptFeeHeader">
                                        <span>Description</span>
                                        <span>Amount</span>
                                    </div>

                                    <div className="receiptFeeRow">
                                        <span>Admission Fee</span>
                                        <strong>{money(receipt.admissionFee ?? admission.admissionFee)}</strong>
                                    </div>

                                    {Number(receipt.monthlyFee ?? admission.monthlyFee) > 0 && (
                                        <div className="receiptFeeRow">
                                            <span>Monthly Fee</span>
                                            <strong>{money(receipt.monthlyFee ?? admission.monthlyFee)}</strong>
                                        </div>
                                    )}

                                    <div className="receiptFeeRow receiptTotal">
                                        <span>Application Status</span>
                                        <strong>{admission.status || "APPROVED"}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="receiptStatusGrid">
                                <div>
                                    <span>Application Status</span>
                                    <strong className="receiptStatusApproved">
                                        <FaCheckCircle />
                                        {admission.status || "APPROVED"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Payment Status</span>
                                    <strong className="receiptStatusPending">
                                        <FaClock />
                                        {receipt.paymentStatus || paymentStatus}
                                    </strong>
                                </div>
                            </div>

                            <div className="receiptFooter">
                                <p>This receipt confirms the approval of the student's admission application.</p>
                                <span>Computer generated receipt</span>
                            </div>

                        </div>

                        <div className="receiptModalActions">
                            <button className="receiptCloseActionBtn" onClick={() => setShowReceipt(false)}>
                                Close
                            </button>

                            <button className="receiptPrintBtn" onClick={handlePrintReceipt}>
                                <FaPrint />
                                Print Receipt
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="admissionInfoItem">
        <span>{label}</span>
        <strong>{value !== undefined && value !== null && value !== "" ? value : "Not provided"}</strong>
    </div>
);

const ReceiptField = ({ label, value }) => (
    <div className="receiptField">
        <span>{label}</span>
        <strong>{value !== undefined && value !== null && value !== "" ? value : "Not provided"}</strong>
    </div>
);