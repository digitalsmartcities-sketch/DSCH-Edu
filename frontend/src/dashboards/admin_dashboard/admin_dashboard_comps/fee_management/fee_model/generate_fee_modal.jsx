import { useState } from "react";
import {
    FaTimes,
    FaCalendarAlt,
    FaGraduationCap,
    FaMoneyBillWave,
    FaChevronDown
} from "react-icons/fa";
import "./generate_fee_modal.css";
import { generateFeeForStudent, generateMonthlyFee } from "../../../../../apicalls/admin_apicalls";
import { useToast } from "../../../../../components/toast/ToastContext";

export const GenerateFeeModal = ({
    mode = "COLLECTIVE",
    student = null,
    classFilter = null,
    onClose,
    loading,
    setLoading
}) => {
    const toast = useToast();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(String(currentYear));

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const years = Array.from(
        { length: 5 },
        (_, index) => currentYear + index
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!month || !year) {
            toast.error("Please select month and year.");
            return;
        }

        if (mode === "INDIVIDUAL" && !student) {
            toast.error("Student information is required.");
            return;
        }

        if (mode === "COLLECTIVE") {
            const result = await generateMonthlyFee(classFilter, month, year, setLoading);
            if (result?.success) onClose();
            return;
        }

        if (mode === "INDIVIDUAL") {
            const result = await generateFeeForStudent(student?._id, month, year, setLoading);
            if (result?.success) onClose();
        }
    };

    return (
        <div className="generateFeeModalOverlay">

            <div className="generateFeeModal">

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="generateFeeModalHeader">

                    <div>
                        <span>
                            FEE MANAGEMENT
                        </span>

                        <h2>
                            Generate Fee
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="generateFeeCloseBtn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* =========================================
                    MODE
                ========================================= */}

                <div className="generateFeeMode">

                    <div className="generateFeeModeIcon">
                        {mode === "COLLECTIVE"
                            ? <FaGraduationCap />
                            : <FaMoneyBillWave />}
                    </div>

                    <div>

                        <span>
                            Generation Type
                        </span>

                        <strong>
                            {mode === "COLLECTIVE"
                                ? "Collective Fee Generation"
                                : "Individual Student Fee"}
                        </strong>

                        <p>
                            {mode === "COLLECTIVE"
                                ? "Generate a fee for all eligible students in a selected class."
                                : "Generate a fee for the selected student only."}
                        </p>

                    </div>

                </div>


                {/* =========================================
                    STUDENT INFO
                ========================================= */}

                {mode === "INDIVIDUAL" && student && (

                    <div className="generateFeeStudent">

                        <div className="generateFeeStudentAvatar">
                            {student.firstName?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div>
                            <span>
                                Student
                            </span>

                            <strong>
                                {student.firstName}{" "}
                                {student.lastName}
                            </strong>

                            <p>
                                Class {student.class || "N/A"}
                            </p>
                        </div>

                    </div>

                )}


                <form onSubmit={handleSubmit}>

                    {/* =========================================
                        MONTH & YEAR
                    ========================================= */}

                    <div className="generateFeeFields">

                        <div className="generateFeeField">

                            <label>
                                Month
                            </label>

                            <div className="generateFeeSelect">

                                <FaCalendarAlt />

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


                        <div className="generateFeeField">

                            <label>
                                Year
                            </label>

                            <div className="generateFeeSelect">

                                <FaCalendarAlt />

                                <select
                                    value={year}
                                    onChange={(e) =>
                                        setYear(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Select year
                                    </option>

                                    {years.map((item) => (
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

                    </div>


                    {/* =========================================
                        COLLECTIVE MODE NOTE
                    ========================================= */}

                    {mode === "COLLECTIVE" && (

                        <div className="generateFeeInfo">

                            <FaGraduationCap />

                            <p>
                                The selected month and year will be used
                                to generate fees for all eligible students
                                of the selected class.
                            </p>

                        </div>

                    )}


                    {/* =========================================
                        INDIVIDUAL MODE NOTE
                    ========================================= */}

                    {mode === "INDIVIDUAL" && (

                        <div className="generateFeeInfo">

                            <FaMoneyBillWave />

                            <p>
                                A fee record will be created only for this
                                student. No class selection is required.
                            </p>

                        </div>

                    )}


                    {/* =========================================
                        ACTIONS
                    ========================================= */}

                    <div className="generateFeeModalActions">

                        <button
                            type="button"
                            className="generateFeeCancelBtn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="generateFeeSubmitBtn"
                            disabled={
                                loading ||
                                !month ||
                                !year ||
                                (mode === "INDIVIDUAL" && !student)
                            }
                        >
                            <FaMoneyBillWave />
                            {loading
                                ? "Generating..."
                                : "Generate Fee"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};