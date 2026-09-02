import { useEffect, useMemo, useState } from "react";
import {
    FaBookOpen,
    FaCertificate,
    FaCheckCircle,
    FaClock,
    FaEye,
    FaFilter,
    FaSearch,
    FaTimesCircle,
    FaUserGraduate
} from "react-icons/fa";
import "./enrollments.css";
import { getAllCoursesEnrollments } from "../../../../../apicalls/superadmin_apicalls";

export const Enrollments = ({ setCurrentComponent }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [course, setCourse] = useState("ALL");
    const [paymentStatus, setPaymentStatus] = useState("ALL");
    const [loading, setLoading] = useState(false);

    const [enrollments, setEnrollments] = useState([
        {
            id: "ENR-10001",
            firstName: "Awais",
            lastName: "Anwar",
            email: "awais@example.com",
            phone: "+92 317 3441884",
            courseId: "web-development-101",
            courseTitle: "Full Stack Web Development",
            courseCode: "WEB-101",
            courseProvider: "Digital Skills & Computer Institute",
            status: "PENDING",
            payment: {
                status: "SUBMITTED",
                amount: 15000,
                paymentMethod: "EASYPAISA",
                transactionId: "EP-874521",
                paymentDate: "2026-08-26"
            },
            submittedAt: "2026-08-26"
        },
        {
            id: "ENR-10002",
            firstName: "Adyan",
            lastName: "Anwar",
            email: "adyan@example.com",
            phone: "+92 317 3441884",
            courseId: "digital-marketing-101",
            courseTitle: "Digital Marketing Fundamentals",
            courseCode: "DM-101",
            courseProvider: "Digital Growth Institute",
            status: "APPROVED",
            payment: {
                status: "PAID",
                amount: 10000,
                paymentMethod: "BANK_TRANSFER",
                transactionId: "BT-225841",
                paymentDate: "2026-08-23"
            },
            submittedAt: "2026-08-22"
        },
        {
            id: "ENR-10003",
            firstName: "Sahil",
            lastName: "Shah",
            email: "sahil@example.com",
            phone: "+92 300 1234567",
            courseId: "graphic-design-101",
            courseTitle: "Graphic Design Fundamentals",
            courseCode: "GD-101",
            courseProvider: "Creative Design Academy",
            status: "REJECTED",
            payment: {
                status: "REJECTED",
                amount: 12000,
                paymentMethod: "JAZZCASH",
                transactionId: "JC-125478",
                paymentDate: "2026-08-21"
            },
            submittedAt: "2026-08-20"
        },
        {
            id: "ENR-10004",
            firstName: "Humna",
            lastName: "Nadeem",
            email: "humna@example.com",
            phone: "+92 312 9876543",
            courseId: "web-development-101",
            courseTitle: "Full Stack Web Development",
            courseCode: "WEB-101",
            courseProvider: "Digital Skills & Computer Institute",
            status: "COMPLETED",
            payment: {
                status: "PAID",
                amount: 15000,
                paymentMethod: "EASYPAISA",
                transactionId: "EP-662148",
                paymentDate: "2026-08-18"
            },
            submittedAt: "2026-08-17"
        }
    ]);

    useEffect(() => {
        getAllCoursesEnrollments(setEnrollments, setLoading);
    }, [])

    const courses = useMemo(() => {
        return [
            ...new Map(
                enrollments.map((item) => [
                    item.courseId,
                    {
                        id: item.courseId,
                        title: item.courseTitle
                    }
                ])
            ).values()
        ];
    }, [enrollments]);

    const filteredEnrollments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return enrollments.filter((item) => {

            const fullName =
                `${item.firstName} ${item.lastName}`;

            const matchesSearch =
                !query ||
                fullName.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.courseTitle.toLowerCase().includes(query);

            const matchesStatus =
                status === "ALL" ||
                item.status === status;

            const matchesCourse =
                course === "ALL" ||
                item.courseId === course;

            const matchesPayment =
                paymentStatus === "ALL" ||
                item.payment.status === paymentStatus;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCourse &&
                matchesPayment
            );
        });
    }, [
        enrollments,
        search,
        status,
        course,
        paymentStatus
    ]);

    const getStatusIcon = (value) => {
        switch (value) {
            case "APPROVED":
            case "PAID":
                return <FaCheckCircle />;
            case "REJECTED":
                return <FaTimesCircle />;
            case "COMPLETED":
                return <FaCertificate />;
            default:
                return <FaClock />;
        }
    };

    const getStatusClass = (value) => {
        return value.toLowerCase().replaceAll("_", "-");
    };

    const handlePreview = (id) => {
        setCurrentComponent("enrollment_payment:" + id);
    };

    const handleCertificate = (id) => {
        setCurrentComponent("createCertificate:" + id);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("ALL");
        setCourse("ALL");
        setPaymentStatus("ALL");
    };

    return (
        <div className="superAdminEnrollments">
            {/* =========================================
                HEADER
            ========================================== */}
            <div className="enrollmentsHeader">
                <div>
                    <span className="enrollmentsEyebrow">
                        COURSE MANAGEMENT
                    </span>
                    <h1>
                        Enrollments
                    </h1>
                    <p>
                        Review and manage course enrollment applications
                        submitted through DSCH-Edu.
                    </p>
                </div>
                <div className="enrollmentHeaderCount">
                    <strong>
                        {enrollments.length}
                    </strong>
                    <span>
                        Total Enrollments
                    </span>
                </div>
            </div>
            {/* =========================================
                FILTERS
            ========================================== */}
            <section className="enrollmentFilters">
                <div className="enrollmentSearch">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search name, email, course or enrollment ID..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>
                <div className="enrollmentFilterItem">
                    <FaFilter />
                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Statuses
                        </option>
                        <option value="PENDING">
                            Pending
                        </option>
                        <option value="APPROVED">
                            Approved
                        </option>
                        <option value="REJECTED">
                            Rejected
                        </option>
                        <option value="COMPLETED">
                            Completed
                        </option>
                    </select>
                </div>
                <div className="enrollmentFilterItem">
                    <FaBookOpen />
                    <select
                        value={course}
                        onChange={(e) =>
                            setCourse(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Courses
                        </option>
                        {courses.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="enrollmentFilterItem">
                    <FaCheckCircle />
                    <select
                        value={paymentStatus}
                        onChange={(e) =>
                            setPaymentStatus(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Payments
                        </option>
                        <option value="NOT_REQUIRED">
                            Not Required
                        </option>
                        <option value="NOT_SUBMITTED">
                            Not Submitted
                        </option>
                        <option value="SUBMITTED">
                            Submitted
                        </option>
                        <option value="PAID">
                            Paid
                        </option>
                        <option value="REJECTED">
                            Rejected
                        </option>
                    </select>
                </div>
            </section>
            {/* =========================================
                RESULT BAR
            ========================================== */}
            <div className="enrollmentResultsBar">
                <div>
                    <strong>
                        {filteredEnrollments.length}
                    </strong>
                    <span>
                        enrollment
                        {filteredEnrollments.length !== 1 && "s"}
                        found
                    </span>
                </div>
                {
                    (
                        search ||
                        status !== "ALL" ||
                        course !== "ALL" ||
                        paymentStatus !== "ALL"
                    ) && (
                        <button
                            onClick={clearFilters}
                            className="clearEnrollmentFilters"
                        >
                            Clear Filters
                        </button>
                    )
                }
            </div>
            {/* =========================================
                TABLE
            ========================================== */}
            <section className="enrollmentsTableCard">
                <div className="enrollmentsTableWrapper">
                    <table className="enrollmentsTable">
                        <thead>
                            <tr>
                                <th>
                                    Applicant
                                </th>
                                <th>
                                    Course
                                </th>
                                <th>
                                    Submitted
                                </th>
                                <th>
                                    Enrollment
                                </th>
                                <th>
                                    Payment
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.map(
                                (enrollment, i) => (
                                    <tr key={i}>
                                        {/* APPLICANT */}
                                        <td>
                                            <div className="applicantCell">
                                                <div className="applicantAvatar">
                                                    <FaUserGraduate />
                                                </div>
                                                <div>
                                                    <strong>
                                                        {enrollment?.fullName}
                                                    </strong>
                                                    <span>
                                                        {enrollment?.email}
                                                    </span>
                                                    <small>
                                                        {enrollment?._id}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        {/* COURSE */}
                                        <td>
                                            <div className="courseCell">
                                                <strong>
                                                    {enrollment?.courseTitle}
                                                </strong>
                                                <span>
                                                    {enrollment?.courseCode}
                                                </span>
                                            </div>
                                        </td>
                                        {/* DATE */}
                                        <td>
                                            <span className="tableDate">
                                                {enrollment?.createdAt?.slice(0, 10)}
                                            </span>
                                        </td>
                                        {/* ENROLLMENT */}
                                        <td>
                                            <span
                                                className={`enrollmentStatusBadge ${getStatusClass(
                                                    enrollment.status
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    enrollment.status
                                                )}
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        {/* PAYMENT */}
                                        <td>
                                            <div className="paymentCell">
                                                <span
                                                    className={`paymentStatusBadge ${getStatusClass(
                                                        enrollment.payment.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        enrollment.payment.status
                                                    )}
                                                    {enrollment.payment.status}
                                                </span>
                                                {
                                                    enrollment.payment.amount >
                                                    0 && (
                                                        <small>
                                                            PKR{" "}
                                                            {Number(
                                                                enrollment.payment.amount
                                                            ).toLocaleString()}
                                                        </small>
                                                    )
                                                }
                                            </div>
                                        </td>
                                        {/* ACTION */}
                                        <td>
                                            <div className="enrollmentActions">
                                                {
                                                    enrollment.status ===
                                                    "PENDING" && (
                                                        <button
                                                            className="enrollmentActionBtn preview"
                                                            title="View enrollment application"
                                                            onClick={() =>
                                                                handlePreview(
                                                                    enrollment._id
                                                                )
                                                            }
                                                        >
                                                            <FaEye />
                                                            Preview
                                                        </button>
                                                    )
                                                }
                                                {
                                                    enrollment.status ===
                                                    "APPROVED" && (
                                                        <button
                                                            className="enrollmentActionBtn certificate"
                                                            title="Create course certificate"
                                                            onClick={() =>
                                                                handleCertificate(
                                                                    enrollment._id
                                                                )
                                                            }
                                                        >
                                                            <FaCertificate />
                                                            Certificate
                                                        </button>
                                                    )
                                                }
                                                {
                                                    enrollment.status ===
                                                    "REJECTED" && (
                                                        <button
                                                            className="enrollmentActionBtn preview"
                                                            title="View rejected enrollment"
                                                            onClick={() =>
                                                                handlePreview(
                                                                    enrollment._id
                                                                )
                                                            }
                                                        >
                                                            <FaEye />
                                                            View
                                                        </button>
                                                    )
                                                }
                                                {
                                                    enrollment.status ===
                                                    "COMPLETED" && (
                                                        <button
                                                            className="enrollmentActionBtn preview"
                                                            title="View enrollment"
                                                            onClick={() =>
                                                                handlePreview(
                                                                    enrollment._id
                                                                )
                                                            }
                                                        >
                                                            <FaEye />
                                                            View
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {/* EMPTY */}
                {filteredEnrollments.length === 0 && (
                    <div className="enrollmentsEmpty">
                        <div className="enrollmentsEmptyIcon">
                            <FaSearch />
                        </div>
                        <h3>
                            No enrollments found
                        </h3>
                        <p>
                            Try changing the search or selected filters,, if any.
                        </p>
                        <button
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};