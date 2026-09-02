import { useEffect, useMemo, useState } from "react";
import {
    FaChevronDown,
    FaEye,
    FaFilter,
    FaPlus,
    FaMoneyBillWave,
    FaMoneyCheckAlt
} from "react-icons/fa";
import "./fee.css";
import { getFeesRecord } from "../../../../apicalls/admin_apicalls";
import { FeeReceiptModal } from "./fee_receipt_view/fee_receipt_modal";
import { FeePaymentView } from "./fee_payment_view/fee_payment_view";
import { GenerateFeeModal } from "./fee_model/generate_fee_modal";

export const AdminFeeManagmenet = () => {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(null);
    const [fees, setFees] = useState([]);
    let [feePaymentView, setFeePaymentView] = useState(null);
    let [openGenerateFeeModal, setOpenGenerateFeeModal] = useState(false);

    const currentYear = new Date().getFullYear();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        getFeesRecord(setFees, setLoading);
    }, []);

    const filteredFees = useMemo(() => {
        return fees.filter((fee) => {
            const monthMatch =
                !month || String(fee.month).toLowerCase() === String(month).toLowerCase();

            const yearMatch =
                !year || String(fee.year) === String(year);

            const classMatch =
                !classFilter ||
                String(fee.studentId?.class).toLowerCase() === String(classFilter).toLowerCase();

            return monthMatch && yearMatch && classMatch;
        });
    }, [fees, month, year, classFilter]);

    const formatAmount = (amount) => {
        const value = Number(amount);
        return Number.isFinite(value)
            ? `PKR ${value.toLocaleString()}`
            : "N/A";
    };

    const getStatusClass = (status) => {
        switch (status) {
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

    if (showReceiptModal !== null) {
        return <FeeReceiptModal fee={fees[showReceiptModal]} onClose={() => setShowReceiptModal(null)} />
    }

    if (feePaymentView !== null) {
        return <FeePaymentView fee={fees[feePaymentView]} onClose={() => setFeePaymentView(null)} />
    }

    if (openGenerateFeeModal) {
        return <GenerateFeeModal
            mode="COLLECTIVE"
            student={null}
            classFilter={classFilter}
            onClose={() => setOpenGenerateFeeModal(false)}
            loading={loading}
            setLoading={setLoading}
        />
    }

    return (
        <div className="adminFeesPage">
            {/* =========================================
                HEADER
            ========================================= */}
            <div className="adminFeesHeader">
                <div>
                    <span className="adminFeesEyebrow">
                        FEE MANAGEMENT
                    </span>
                    <h1>
                        Student Fees
                    </h1>
                    <p>
                        Generate and manage monthly student fees.
                    </p>
                </div>
                <div className="adminFeesSummary">
                    <div className="adminFeesSummaryIcon">
                        <FaMoneyBillWave />
                    </div>
                    <div>
                        <strong>
                            {filteredFees.length}
                        </strong>
                        <span>
                            Fee Records
                        </span>
                    </div>
                </div>
            </div>
            {/* =========================================
                FILTER CARD
            ========================================= */}
            <section className="feeFilterCard">
                <div className="feeFilterHeader">
                    <div className="feeFilterTitle">
                        <div className="feeFilterIcon">
                            <FaFilter />
                        </div>
                        <div>
                            <h2>
                                Generate / Filter Fees
                            </h2>
                            <p>
                                Select a class to generate fees for all
                                active students in that class.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="feeFilters">
                    {/* MONTH */}
                    <div className="feeFilterGroup">
                        <label>
                            Month
                        </label>
                        <div className="feeSelectWrapper">
                            <select
                                value={month}
                                onChange={(e) =>
                                    setMonth(e.target.value)
                                }
                            >
                                <option value="">
                                    Select month
                                </option>
                                {months.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown />
                        </div>
                    </div>
                    {/* YEAR */}
                    <div className="feeFilterGroup">
                        <label>
                            Year
                        </label>
                        <div className="feeSelectWrapper">
                            <select
                                value={year}
                                onChange={(e) =>
                                    setYear(e.target.value)
                                }
                            >
                                <option value="">
                                    Select year
                                </option>
                                {[0, 1, 2, 3, 4, 5, 6].map((onSetYear) => (
                                    <option
                                        key={currentYear + onSetYear}
                                        value={currentYear + onSetYear}
                                    >
                                        {currentYear + onSetYear}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown />
                        </div>
                    </div>
                    {/* CLASS */}
                    <div className="feeFilterGroup">
                        <label>
                            Class
                        </label>
                        <div className="feeSelectWrapper">
                            <select
                                value={classFilter}
                                onChange={(e) =>
                                    setClassFilter(e.target.value)
                                }
                            >
                                <option value="">
                                    Select class
                                </option>
                                {
                                    fees[0]?.instituteId?.academicPrograms?.map((item) => (
                                        <option
                                            key={item.class}
                                            value={item.class}
                                        >
                                            {item.class}
                                        </option>
                                    ))
                                }
                            </select>
                            <FaChevronDown />
                        </div>
                    </div>
                    <div className="feeFilterGroup">
                        <label>
                            Generate Fee
                        </label>
                        <button
                            className="generateFeeBtn"
                            disabled={
                                !classFilter ||
                                loading
                            }
                            onClick={() => filteredFees.length > 0 ? setOpenGenerateFeeModal(true) : alert("No Data To Generate")}
                        >
                            <FaPlus />
                            {loading ? "Loading..." : "Generate Fee"}
                        </button>
                    </div>
                </div>
            </section>
            {/* =========================================
                ACTIVE FILTERS
            ========================================= */}
            <div className="activeFeeFilters">
                <div>
                    <span>
                        Month
                    </span>
                    <strong>
                        {month || "All"}
                    </strong>
                </div>
                <div>
                    <span>
                        Year
                    </span>
                    <strong>
                        {year || "All"}
                    </strong>
                </div>
                <div>
                    <span>
                        Class
                    </span>
                    <strong>
                        {classFilter
                            ? `Class ${classFilter}`
                            : "All Classes"}
                    </strong>
                </div>
            </div>
            {/* =========================================
                TABLE
            ========================================= */}
            <section className="feesTableCard">
                <div className="feesTableHeader">

                    <div>
                        <h2>
                            Fee Records
                        </h2>

                        <p>
                            {filteredFees.length} record
                            {filteredFees.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                </div>
                <div className="feesTableWrapper">
                    <table className="feesTable">
                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Student
                                </th>

                                <th>
                                    Class
                                </th>

                                <th>
                                    Month
                                </th>

                                <th>
                                    Year
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>
                        {
                            !loading
                                ?
                                <tbody>
                                    {filteredFees.length > 0 ? (
                                        filteredFees.map((fee, index) => (
                                            <tr key={fee._id || index}>
                                                <td>
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <div className="feeStudentInfo">
                                                        <div className="feeStudentAvatar">
                                                            {fee.studentId?.firstName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || "S"}
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                {fee.studentId?.firstName || "Unknown"}{" "}
                                                                {fee.studentId?.lastName || ""}
                                                            </strong>
                                                            <span>
                                                                {fee.studentId?.email || "No email"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    Class {fee.studentId?.class || "N/A"}
                                                </td>
                                                <td>
                                                    {fee.month || "N/A"}
                                                </td>
                                                <td>
                                                    {fee.year || "N/A"}
                                                </td>
                                                <td className="feeAmount">
                                                    {formatAmount(fee.amount)}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`feeStatus ${getStatusClass(fee.status)}`}
                                                    >
                                                        <span></span>

                                                        {fee.status || "NOT_PAID"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="feeTableActions">
                                                        <button
                                                            className="feePreviewBtn"
                                                            title="Preview Fee"
                                                            onClick={() => setShowReceiptModal(index)}
                                                            disabled={loading}
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        {
                                                            fee.status === "PENDING" && (
                                                                <button
                                                                    className="feeApproveBtn"
                                                                    title="Approve Fee"
                                                                    onClick={() => setFeePaymentView(index)}
                                                                    disabled={loading}
                                                                >
                                                                    <FaMoneyCheckAlt />
                                                                </button>
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="feesEmptyCell"
                                            >
                                                <div className="feesEmptyState">
                                                    <div className="feesEmptyIcon">
                                                        <FaMoneyBillWave />
                                                    </div>
                                                    <h3>
                                                        No fee records found
                                                    </h3>
                                                    <p>
                                                        Select a class, month and year
                                                        to generate fee records.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                :
                                <tbody>
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="feesEmptyCell"
                                        >
                                            <div className="feesEmptyState">
                                                <h3>
                                                    Loading fee records...
                                                </h3>
                                                <p>
                                                    Please wait while we load the fee records.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                        }
                    </table>
                </div>
            </section>
        </div>
    );
};