import { useEffect, useState } from "react";
import {
    FaSearch,
    FaEye,
    FaFilter,
    FaUserGraduate,
    FaChevronDown,
    FaTrash,
    FaMoneyBill,
} from "react-icons/fa";

import "./applications.css";
import { getAdmissionApplications, handleApplicationDelete } from "../../../../apicalls/admin_apicalls";

export const AdmissionApplications = ({ setSubpage }) => {
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        getAdmissionApplications(setApplications, setLoading);
    }, []);

    const filteredApplications = applications.filter((application) => {
        const fullName =
            `${application.firstName} ${application.lastName}`.toLowerCase();
        const searchMatch =
            fullName.includes(search.toLowerCase()) ||
            application.email.toLowerCase().includes(search.toLowerCase());
        const classMatch =
            classFilter === "ALL" ||
            String(application.applyingFor) === String(classFilter);
        const statusMatch =
            statusFilter === "ALL" ||
            application.status === statusFilter;
        return searchMatch && classMatch && statusMatch;
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="adminApplications">
            {/* =========================================
                PAGE HEADER
            ========================================= */}
            <div className="applicationsPageHeader">
                <div>
                    <span className="applicationsEyebrow">
                        STUDENT ADMISSIONS
                    </span>
                    <h1>
                        Admission Applications
                    </h1>
                    <p>
                        Review student applications submitted for
                        admission to your institute.
                    </p>
                </div>
                <div className="applicationsSummary">
                    <FaUserGraduate />
                    <div>
                        <strong>
                            {applications.length}
                        </strong>
                        <span>
                            Total Applications
                        </span>
                    </div>
                </div>
            </div>
            {/* =========================================
                FILTERS
            ========================================= */}
            <div className="applicationsFilterCard">
                <div className="filterTitle">
                    <div className="filterIcon">
                        <FaFilter />
                    </div>
                    <div>
                        <h3>
                            Filter Applications
                        </h3>
                        <p>
                            Find a specific student application.
                        </p>
                    </div>
                </div>
                <div className="applicationFilters">
                    {/* Search */}
                    <div className="applicationSearch">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search student name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Class */}
                    <div className="applicationSelect">
                        <select
                            value={classFilter}
                            onChange={(e) =>
                                setClassFilter(e.target.value)
                            }
                        >
                            <option value="ALL">
                                All Classes
                            </option>
                            <option value="1">
                                Class 1
                            </option>
                            <option value="2">
                                Class 2
                            </option>
                            <option value="3">
                                Class 3
                            </option>
                            <option value="4">
                                Class 4
                            </option>
                            <option value="5">
                                Class 5
                            </option>
                            <option value="6">
                                Class 6
                            </option>
                            <option value="7">
                                Class 7
                            </option>
                            <option value="8">
                                Class 8
                            </option>
                            <option value="9">
                                Class 9
                            </option>
                            <option value="10">
                                Class 10
                            </option>
                        </select>
                        <FaChevronDown />
                    </div>
                    {/* Status */}
                    <div className="applicationSelect">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="ALL">
                                All Status
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
                        </select>
                        <FaChevronDown />
                    </div>
                </div>
            </div>
            {/* =========================================
                APPLICATION TABLE
            ========================================= */}
            <div className="applicationsTableCard">
                <div className="applicationsTableHeader">
                    <div>
                        <h2>
                            Student Applications
                        </h2>
                        <p>
                            {filteredApplications.length} application
                            {filteredApplications.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>
                <div className="applicationsTableWrapper">
                    <table className="applicationsTable">
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
                                    Email
                                </th>
                                <th>
                                    Applied On
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Payment Status
                                </th>
                                <th>
                                    Receipt
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredApplications.length > 0 ?
                                    filteredApplications.map(
                                        (application, index) => (
                                            <tr key={application._id}>
                                                <td>
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <div className="studentTableInfo">
                                                        <div className="studentAvatar">
                                                            {
                                                                application?.firstName
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()
                                                            }
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                {application.firstName}{" "}
                                                                {application.lastName}
                                                            </strong>
                                                            <span>
                                                                {application.phone}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {application.applyingFor}
                                                </td>
                                                <td>
                                                    {application.email}
                                                </td>
                                                <td>
                                                    {formatDate(
                                                        application.createdAt
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`applicationStatus ${application?.status?.toLowerCase()}`}
                                                    >
                                                        <span></span>
                                                        {application.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span>
                                                        <span></span>
                                                        {application?.paymentStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    {application?.admissionReceipt ? application?.admissionReceipt : "NOT_GENERATED"}
                                                </td>
                                                <td style={{ display: "flex", gap: "5px", justifyContent: "center", alignItems: "center" }}>
                                                    {
                                                        application?.paymentStatus !== "SUBMITTED" ?
                                                            <button
                                                                className="applicationViewBtn"
                                                                disabled={loading}
                                                                onClick={() =>
                                                                    setSubpage(`ApplicationView:${application._id}`)
                                                                }
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        application?.paymentStatus === "SUBMITTED" ?
                                                            <button
                                                                className="applicationViewBtn"
                                                                disabled={loading}
                                                                onClick={() => setSubpage(`PaymentView:${application._id}`)}>
                                                                <FaMoneyBill />
                                                            </button>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        !application.isAdmissionCompleted && (
                                                            <button
                                                                className="applicationDeleteBtn"
                                                                title="Delete Application"
                                                                disabled={loading}
                                                                onClick={() =>
                                                                    handleApplicationDelete(application._id, setLoading, setApplications)
                                                                }
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    )
                                    :
                                    loading
                                        ?
                                        <tr>
                                            <td
                                                colSpan="9"
                                                style={{ textAlign: "center" }}
                                            >
                                                Loading, please wait ...
                                            </td>
                                        </tr>
                                        :
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="applicationsEmptyCell"
                                            >
                                                <div className="applicationsEmptyState">
                                                    <div className="emptyApplicationIcon">
                                                        <FaUserGraduate />
                                                    </div>
                                                    <h3>
                                                        No applications found
                                                    </h3>
                                                    <p>
                                                        No student applications
                                                        match the selected filters.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};