import { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaCreditCard,
    FaEye,
    FaFileInvoice,
    FaPrint,
    FaTimes
} from "react-icons/fa";
import { getStudentFees } from "../../../../apicalls/student_apicalls";
import "./fee.css";

export const StudentFees = ({ setSubPage }) => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState("ALL");
    const [selectedMonth, setSelectedMonth] = useState("ALL");
    const [receiptFee, setReceiptFee] = useState(null);
    const [institute, setInstitute] = useState(null);

    useEffect(() => {
        getStudentFees(setFees, setLoading, setInstitute);
    }, []);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = [
        ...new Set(
            fees
                .map((fee) => fee?.year)
                .filter((year) => year !== null && year !== undefined)
        )
    ].sort((a, b) => b - a);

    const filteredFees = fees.filter((fee) => {
        if (!fee) return false;
        const yearMatch =
            selectedYear === "ALL" ||
            String(fee.year) === String(selectedYear);
        const monthMatch =
            selectedMonth === "ALL" ||
            fee.month === selectedMonth;
        return yearMatch && monthMatch;
    });

    const formatAmount = (amount) => {
        const value = Number(amount);
        return Number.isFinite(value)
            ? `PKR ${value.toLocaleString()}`
            : "N/A";
    };

    const formatDate = (date) => {
        if (!date) return "Not available";
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) {
            return "Not available";
        }

        return parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "NOT_PAID":
                return "Not Paid";
            case "PENDING":
                return "Pending";
            case "PAID":
                return "Paid";
            case "REJECTED":
                return "Rejected";
            default:
                return "Unknown";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PAID":
                return <FaCheckCircle />;
            case "PENDING":
                return <FaClock />;
            case "REJECTED":
                return <FaTimes />;
            default:
                return <FaCreditCard />;
        }
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="studentDashboardLoading">
                <div className="studentDashboardLoader"></div>
                <p>Loading, Please wait...</p>
            </div>
        );
    }

    return (
        <div className="studentFeesPage">
            {/* =========================================
                PAGE HEADER
            ======================================== */}
            <div className="studentFeesHeader">
                <div>
                    <span className="studentFeesEyebrow">
                        FEE MANAGEMENT
                    </span>
                    <h1>My Fees</h1>
                    <p>
                        View your monthly fees, payment status and receipts.
                    </p>
                </div>
                <div className="studentFeesCount">
                    <FaFileInvoice />
                    <div>
                        <strong>{filteredFees.length}</strong>
                        <span>Fees Found</span>
                    </div>
                </div>
            </div>
            {/* =========================================
                FILTERS
            ========================================= */}
            <section className="studentFeeFilterCard">
                <div className="studentFeeFilterTitle">
                    <div className="studentFeeFilterIcon">
                        <FaCalendarAlt />
                    </div>
                    <div>
                        <h2>Filter Fees</h2>
                        <p>Filter your fee records by month and year.</p>
                    </div>
                </div>
                <div className="studentFeeFilters">
                    <div className="studentFeeSelect">
                        <label>Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="ALL">All Years</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="studentFeeSelect">
                        <label>Month</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="ALL">All Months</option>
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>
            {/* =========================================
                FEES TABLE
            ========================================= */}
            <section className="studentFeesTableCard">
                <div className="studentFeesTableHeader">
                    <div>
                        <h2>Fee Records</h2>
                        <p>
                            Monthly fee records associated with your account.
                        </p>
                    </div>
                </div>
                <div className="studentFeesTableWrapper">
                    <table className="studentFeesTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Month</th>
                                <th>Year</th>
                                <th>Fee Type</th>
                                <th>Amount</th>
                                <th>Generated</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFees.length > 0 ? (
                                filteredFees.map((fee, index) => (
                                    <tr key={fee._id || `${fee.month}-${fee.year}-${index}`}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            <strong>
                                                {fee.month || "N/A"}
                                            </strong>
                                        </td>
                                        <td>
                                            {fee.year || "N/A"}
                                        </td>
                                        <td>
                                            <span className="feeTypeBadge">
                                                {fee.feeType || "MONTHLY"}
                                            </span>
                                        </td>
                                        <td>
                                            <strong className="feeAmount">
                                                {formatAmount(fee.amount)}
                                            </strong>
                                        </td>
                                        <td>
                                            {formatDate(fee.generatedAt)}
                                        </td>
                                        <td>
                                            <span
                                                className={`studentFeeStatus ${(fee.status || "UNKNOWN").toLowerCase()}`}
                                            >
                                                {getStatusIcon(fee.status)}
                                                {getStatusLabel(fee.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="studentFeeActions">
                                                {fee.status === "NOT_PAID" && (
                                                    <button
                                                        className="studentPayFeeBtn"
                                                        onClick={() => setSubPage(`PaymentForm:${fee._id}`)}
                                                    >
                                                        <FaCreditCard />
                                                        Pay Fee
                                                    </button>
                                                )}
                                                {fee.status === "PENDING" && (
                                                    <span className="studentPendingAction">
                                                        <FaClock />
                                                        Under Review
                                                    </span>
                                                )}
                                                {fee.status === "REJECTED" && (
                                                    <button
                                                        className="studentPayFeeBtn rejected"
                                                        onClick={() => setSubPage(`PaymentForm:${fee._id}`)}
                                                    >
                                                        <FaCreditCard />
                                                        Pay Again
                                                    </button>
                                                )}
                                                <button
                                                    className="studentViewReceiptBtn"
                                                    onClick={() => setReceiptFee(fee)}
                                                >
                                                    <FaEye />
                                                    View Receipt
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="studentFeesEmptyCell"
                                    >
                                        <div className="studentFeesEmpty">
                                            <FaFileInvoice />
                                            <h3>No fee records found</h3>
                                            <p>
                                                No fees match the selected month
                                                and year.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* =========================================
                RECEIPT MODAL
            ========================================= */}
            {receiptFee && (
                <div className="monthlyFeeReceiptOverlay">
                    <div className="monthlyFeeReceiptModal">
                        <div className="monthlyFeeReceiptModalHeader">
                            <div>
                                <span>FEE DOCUMENT</span>
                                <h2>Monthly Fee Receipt</h2>
                            </div>
                            <button
                                className="monthlyFeeReceiptClose"
                                onClick={() => setReceiptFee(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        {/* PRINTABLE RECEIPT */}
                        <div className="printableMonthlyReceipt">
                            <div className="monthlyReceiptInstitute">
                                <div className="monthlyReceiptLogo">
                                    {institute?.instituteLogo?.imageUrl
                                        ? <img src={institute.instituteLogo.imageUrl} alt="Institute Logo" className="receiptLogoImg" />
                                        : <FaFileInvoice />
                                    }
                                </div>
                                <div className="monthlyReceiptInstituteInfo">
                                    <h1>
                                        {institute?.instituteName || "Institute Name"}
                                    </h1>
                                    <p>
                                        {institute?.instituteAddress || "Institute address not available"}
                                    </p>
                                    <div>
                                        <span>
                                            Phone: {institute?.institutePhone || "N/A"}
                                        </span>
                                        {institute?.website && (
                                            <span>
                                                Website: {institute.website}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="monthlyReceiptTitle">
                                <span>
                                    OFFICIAL FEE DOCUMENT
                                </span>
                                <h2>
                                    MONTHLY FEE RECEIPT
                                </h2>
                            </div>
                            <div className="monthlyReceiptMeta">
                                <div>
                                    <span>Month</span>
                                    <strong>
                                        {receiptFee.month || "N/A"}
                                    </strong>
                                </div>
                                <div>
                                    <span>Year</span>
                                    <strong>
                                        {receiptFee.year || "N/A"}
                                    </strong>
                                </div>
                                <div>
                                    <span>Status</span>
                                    <strong>
                                        {getStatusLabel(receiptFee.status)}
                                    </strong>
                                </div>
                            </div>
                            <div className="monthlyReceiptSection">
                                <h3>
                                    Fee Information
                                </h3>
                                <div className="monthlyReceiptRows">
                                    <div>
                                        <span>Fee Type</span>
                                        <strong>
                                            {receiptFee.feeType || "MONTHLY"}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>Amount</span>
                                        <strong>
                                            {formatAmount(receiptFee.amount)}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>Generated On</span>
                                        <strong>
                                            {formatDate(receiptFee.generatedAt)}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>Paid On</span>
                                        <strong>
                                            {formatDate(receiptFee.paidAt)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            {receiptFee.paymentMethod && (
                                <div className="monthlyReceiptSection">
                                    <h3>
                                        Payment Information
                                    </h3>
                                    <div className="monthlyReceiptRows">
                                        <div>
                                            <span>Payment Method</span>
                                            <strong>
                                                {receiptFee.paymentMethod}
                                            </strong>
                                        </div>
                                        <div>
                                            <span>Transaction ID</span>
                                            <strong>
                                                {receiptFee.transactionId || "N/A"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {receiptFee.includedWithAdmission && (
                                <div className="monthlyReceiptAdmissionNote">
                                    <FaCheckCircle />
                                    <p>
                                        This month's fee was included with
                                        the student's admission payment.
                                    </p>
                                </div>
                            )}
                            <div className="monthlyReceiptFooter">
                                <p>
                                    Computer generated fee receipt.
                                </p>
                                <span>
                                    Fee ID: {receiptFee._id || "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className="monthlyFeeReceiptActions">
                            <button
                                className="monthlyFeeReceiptCloseBtn"
                                onClick={() => setReceiptFee(null)}
                            >
                                Close
                            </button>
                            <button
                                className="monthlyFeeReceiptPrintBtn"
                                onClick={handlePrintReceipt}
                            >
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