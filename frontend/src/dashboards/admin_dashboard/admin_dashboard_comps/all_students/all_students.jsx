import { useEffect, useState } from "react";
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaUserGraduate,
    FaChevronDown,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaDollarSign,
    FaBan,
    FaUserLock
} from "react-icons/fa";
import "./all_students.css";
import { getInstituteStudents, suspendTheStudent, unsuspendTheStudent } from "../../../../apicalls/admin_apicalls";
import { GenerateFeeModal } from "../fee_management/fee_model/generate_fee_modal";

export const Students = ({ setSubpage }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [openGenerateFeeModel, setOpenGenerateFeeModel] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null)

    useEffect(() => {
        getInstituteStudents(setStudents, setLoading);
    }, []);
    const classes = [
        ...new Set(
            students
                .map((student) => student?.class)
                .filter((value) => value !== null && value !== undefined && value !== "")
        )
    ];
    classes.sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { numeric: true })
    );
    const filteredStudents = students.filter((student) => {
        if (!student) return false;
        const fullName =
            `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
        const searchValue = search.toLowerCase().trim();
        const searchMatch =
            !searchValue ||
            fullName.includes(searchValue) ||
            (student.email || "").toLowerCase().includes(searchValue) ||
            (student.phone || "").toLowerCase().includes(searchValue);
        const classMatch =
            classFilter === "ALL" ||
            String(student.class) === String(classFilter);
        const statusMatch =
            statusFilter === "ALL" ||
            student.status === statusFilter;
        return searchMatch && classMatch && statusMatch;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case "ACTIVE":
                return <FaCheckCircle />;
            case "INACTIVE":
                return <FaClock />;
            case "SUSPENDED":
                return <FaTimesCircle />;
            default:
                return <FaClock />;
        }
    };
    const getStatusLabel = (status) => {
        if (!status) return "UNKNOWN";
        return status;
    };
    
    if (loading) {
        return (
            <div className="adminComponentLoading">
                <div className="adminComponentLoader"></div>
                <p>Loading, Please wait...</p>
            </div>
        );
    }

    if (openGenerateFeeModel) {
        return (
            <GenerateFeeModal
                mode="INDIVIDUAL"
                student={selectedStudent}
                onClose={() => setOpenGenerateFeeModel(false)}
                loading={loading}
                setLoading={setLoading}
            />
        )
    }

    return (
        <div className="adminStudentsPage">
            {/* =========================================
                HEADER
            ========================================= */}
            <div className="adminStudentsHeader">
                <div>
                    <span className="adminStudentsEyebrow">
                        STUDENT MANAGEMENT
                    </span>
                    <h1>
                        Students
                    </h1>
                    <p>
                        View and manage students enrolled in your institute.
                    </p>
                </div>
                <div className="adminStudentsCount">
                    <FaUserGraduate />
                    <div>
                        <strong>{filteredStudents.length}</strong>
                        <span>Students</span>
                    </div>
                </div>
            </div>
            {/* =========================================
                FILTER CARD
            ========================================= */}
            <section className="adminStudentFilterCard">
                <div className="adminStudentFilterTitle">
                    <div className="adminStudentFilterIcon">
                        <FaFilter />
                    </div>
                    <div>
                        <h2>Filter Students</h2>
                        <p>
                            Search students or filter them by class and status.
                        </p>
                    </div>
                </div>
                <div className="adminStudentFilters">
                    {/* Search */}
                    <div className="adminStudentSearch">
                        <FaSearch />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email or phone..."
                        />
                    </div>
                    {/* Class */}
                    <div className="adminStudentSelect">
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            <option value="ALL">
                                All Classes
                            </option>
                            {classes.map((className) => (
                                <option
                                    key={className}
                                    value={className}
                                >
                                    Class {className}
                                </option>
                            ))}
                        </select>
                        <FaChevronDown />
                    </div>
                    {/* Status */}
                    <div className="adminStudentSelect">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">
                                All Status
                            </option>
                            <option value="ACTIVE">
                                Active
                            </option>
                            <option value="INACTIVE">
                                Inactive
                            </option>
                            <option value="SUSPENDED">
                                Suspended
                            </option>
                        </select>
                        <FaChevronDown />
                    </div>
                </div>
            </section>
            {/* =========================================
                STUDENT TABLE
            ========================================= */}
            <section className="adminStudentsTableCard">
                <div className="adminStudentsTableHeader">
                    <div>
                        <h2>
                            Institute Students
                        </h2>
                        <p>
                            {filteredStudents.length} student
                            {filteredStudents.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>
                <div className="adminStudentsTableWrapper">
                    <table className="adminStudentsTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Email</th>
                                <th>Guardian</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => {
                                    const fullName =
                                        `${student.firstName || ""} ${student.lastName || ""}`.trim();
                                    return (
                                        <tr key={student._id}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                <div className="adminStudentInfo">
                                                    <div className="adminStudentAvatar">
                                                        {
                                                            student.firstName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || "S"
                                                        }
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            {fullName || "Unnamed Student"}
                                                        </strong>
                                                        <span>
                                                            {student.phone || "No phone"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {student.class
                                                    ? `Class ${student.class}`
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                {student.email || "N/A"}
                                            </td>
                                            <td>
                                                {student.guardianName || "N/A"}
                                            </td>
                                            <td>
                                                <span
                                                    className={`adminStudentStatus ${(student.status || "UNKNOWN").toLowerCase()}`}
                                                >
                                                    {getStatusIcon(student.status)}
                                                    {getStatusLabel(student.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="adminStudentActions">
                                                    <button
                                                        className="studentProfileActionBtn"
                                                        title="View Profile"
                                                        disabled={loading}
                                                        onClick={() =>
                                                            setSubpage(`StudentProfile:${student._id}`)
                                                        }
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        className="studentProfileActionBtn"
                                                        title="Generate Fee"
                                                        disabled={loading || student.status === "SUSPENDED"}
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setOpenGenerateFeeModel(true)
                                                        }}
                                                    >
                                                        <FaDollarSign />
                                                    </button>
                                                    {
                                                        student.status === "SUSPENDED" ? (
                                                            <button
                                                                className="studentProfileActionBtn"
                                                                title="Unsuspend Student"
                                                                disabled={loading}
                                                                onClick={() => {
                                                                    unsuspendTheStudent(student._id, setLoading, setStudents)
                                                                }}
                                                            >
                                                                <FaUserLock />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="studentProfileActionBtn"
                                                                title="Suspend Student"
                                                                disabled={loading}
                                                                onClick={() => {
                                                                    suspendTheStudent(student._id, setLoading, setStudents)
                                                                }}
                                                            >
                                                                <FaBan />
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="adminStudentsEmptyCell"
                                    >
                                        <div className="adminStudentsEmpty">
                                            <FaUserGraduate />
                                            <h3>
                                                No students found
                                            </h3>
                                            <p>
                                                No students match the selected
                                                filters.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};