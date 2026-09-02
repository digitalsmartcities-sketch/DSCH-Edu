import {
    FaTimes,
    FaPrint,
    FaUniversity,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaMoneyBillWave
} from "react-icons/fa";
import "./fee_receipt_modal.css"
export const FeeReceiptModal = ({ fee, onClose }) => {
    const institute = fee?.instituteId || "";

    const formatDateTime = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusIcon = () => {
        switch (fee.status) {
            case "PAID":
                return <FaCheckCircle />;
            case "PENDING":
                return <FaClock />;
            case "REJECTED":
                return <FaTimesCircle />;
            default:
                return <FaMoneyBillWave />;
        }
    };

    const getStatusClass = () => {
        switch (fee.status) {
            case "PAID":
                return "paid";
            case "PENDING":
                return "pending";
            case "REJECTED":
                return "rejected";
            default:
                return "not-paid";
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="feeReceiptModalOverlay">
            <div className="feeReceiptModal">
                {/* =====================================
                    MODAL HEADER
                ====================================== */}
                <div className="feeReceiptModalHeader">
                    <div>
                        <span>
                            FEE MANAGEMENT
                        </span>
                        <h2>
                            Fee Receipt
                        </h2>
                    </div>
                    <button
                        className="feeReceiptCloseBtn"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                </div>
                {/* =====================================
                    PRINTABLE RECEIPT
                ====================================== */}
                <div className="printableFeeReceipt">
                    {/* =================================
                        INSTITUTE
                    ================================== */}
                    <div className="feeReceiptInstitute">
                        <div className="feeReceiptInstituteIcon">
                            <FaUniversity />
                        </div>
                        <div>
                            <h1>
                                {institute.instituteName ||
                                    "Institute Name"}
                            </h1>
                            <p>
                                {institute.instituteAddress ||
                                    "Institute address not available"}
                            </p>
                            <span>
                                Phone: {
                                    institute.institutePhone ||
                                    "Not available"
                                }
                            </span>
                        </div>
                    </div>
                    {/* =================================
                        TITLE
                    ================================== */}
                    <div className="feeReceiptTitle">
                        <span>
                            OFFICIAL DOCUMENT
                        </span>
                        <h2>
                            MONTHLY FEE RECEIPT
                        </h2>
                    </div>
                    {/* =================================
                        META
                    ================================== */}
                    <div className="feeReceiptMeta">
                        <div>
                            <span>
                                Fee Month
                            </span>
                            <strong>
                                {fee.month || "N/A"}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Year
                            </span>
                            <strong>
                                {fee.year || "N/A"}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Fee ID
                            </span>
                            <strong>
                                {fee._id || "N/A"}
                            </strong>
                        </div>
                    </div>
                    {/* =================================
                        STUDENT INFORMATION
                    ================================== */}
                    <div className="feeReceiptSection">
                        <div className="feeReceiptSectionTitle">
                            Student Information
                        </div>
                        <div className="feeReceiptFields">
                            <ReceiptField
                                label="Student Name"
                                value={
                                    `${fee.studentId?.firstName || ""} ${fee.studentId?.lastName || ""}`.trim()
                                }
                            />
                            <ReceiptField
                                label="Class"
                                value={
                                    fee.studentId?.class
                                        ? `Class ${fee.studentId?.class}`
                                        : null
                                }
                            />
                            <ReceiptField
                                label="Email"
                                value={fee.studentId?.email}
                            />
                            <ReceiptField
                                label="Phone"
                                value={fee.studentId?.phone}
                            />
                        </div>
                    </div>
                    {/* =================================
                        FEE DETAILS
                    ================================== */}
                    <div className="feeReceiptSection">
                        <div className="feeReceiptSectionTitle">
                            Fee Details
                        </div>
                        <div className="feeReceiptTable">
                            <div className="feeReceiptRow feeReceiptHeader">
                                <span>
                                    Description
                                </span>
                                <span>
                                    Amount
                                </span>
                            </div>
                            <div className="feeReceiptRow">
                                <span>
                                    {fee.feeType === "MONTHLY"
                                        ? `${fee.month || ""} Monthly Fee`
                                        : "Student Fee"}
                                </span>
                                <strong>
                                    PKR {Number(
                                        fee.amount || 0
                                    ).toLocaleString()}
                                </strong>
                            </div>
                            <div className="feeReceiptRow feeReceiptTotal">
                                <span>
                                    Total Fee
                                </span>
                                <strong>
                                    PKR {Number(
                                        fee.amount || 0
                                    ).toLocaleString()}
                                </strong>
                            </div>
                        </div>
                    </div>
                    {/* =================================
                        PAYMENT INFORMATION
                    ================================== */}
                    <div className="feeReceiptSection">
                        <div className="feeReceiptSectionTitle">
                            Payment Information
                        </div>
                        <div className="feeReceiptFields">
                            <ReceiptField
                                label="Payment Status"
                                value={fee.status}
                            />
                            <ReceiptField
                                label="Payment Method"
                                value={fee.paymentMethod}
                            />
                            <ReceiptField
                                label="Transaction ID"
                                value={fee.transactionId}
                            />
                            <ReceiptField
                                label="Submitted At"
                                value={formatDateTime(fee.submittedAt)}
                            />
                            <ReceiptField
                                label="Reviewed At"
                                value={formatDateTime(fee.reviewedAt)}
                            />
                            <ReceiptField
                                label="Paid At"
                                value={formatDateTime(fee.paidAt)}
                            />
                        </div>
                    </div>
                    {/* =================================
                        STATUS
                    ================================== */}
                    <div className={`feeReceiptStatus ${getStatusClass()}`}>
                        <div className="feeReceiptStatusIcon">
                            {getStatusIcon()}
                        </div>
                        <div>
                            <span>
                                Current Fee Status
                            </span>
                            <strong>
                                {fee.status}
                            </strong>
                        </div>
                    </div>
                    {/* =================================
                        REJECTION REASON
                    ================================== */}
                    {fee.rejectionReason && fee.status === "REJECTED" && (
                        <div className="feeReceiptRejection">
                            <strong>
                                Rejection Reason
                            </strong>
                            <p>
                                {fee.rejectionReason}
                            </p>
                        </div>
                    )}
                    {/* =================================
                        ADMISSION INCLUDED
                    ================================== */}
                    {fee.includedWithAdmission && (
                        <div className="feeReceiptAdmissionNote">
                            <FaCheckCircle />
                            <p>
                                This month's fee was included with the
                                student's admission payment.
                            </p>
                        </div>
                    )}
                    {/* =================================
                        FOOTER
                    ================================== */}
                    <div className="feeReceiptFooter">
                        <p>
                            This receipt is generated from the institute's
                            fee management system.
                        </p>
                        <span>
                            Computer generated document
                        </span>
                    </div>
                </div>
                {/* =====================================
                    ACTIONS
                ====================================== */}
                <div className="feeReceiptModalActions">
                    <button
                        className="feeReceiptCloseAction"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="feeReceiptPrintBtn"
                        onClick={handlePrint}
                    >
                        <FaPrint />
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};


const ReceiptField = ({ label, value }) => (
    <div className="feeReceiptField">
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