import { FaEye, FaTrash, FaUserCheck, FaUserSlash } from "react-icons/fa";
import { deleteAdminApplication, disableAdmin, enableAdmin, getApplications } from "../../../../apicalls/superadmin_apicalls";
import "./application.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminApplications = ({ setSubpage }) => {
    let [applications, setApplications] = useState([]);
    let [loading, setLoading] = useState(false);
    let [statusFilter, setStatusFilter] = useState("all");
    let [typeFilter, setTypeFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        getApplications(setApplications, navigate);
    }, [navigate]);

    // The full list is kept in state so changing one filter never hides the
    // rows that another filter needs.
    const visibleApplications = applications.filter((app) => {
        if (statusFilter === "pending" && (app.approved || app.rejected)) return false;
        if (statusFilter === "approved" && !app.approved) return false;
        if (statusFilter === "rejected" && !app.rejected) return false;
        if (typeFilter !== "all" && app.instituteType !== typeFilter) return false;
        return true;
    });

    return (
        <div className="admin-applications">
            {/* =========================================
                PAGE HEADER
            ========================================= */}
            <div className="applications-header">
                <div>
                    <span className="applications-label">
                        ADMINISTRATION
                    </span>
                    <h1>
                        Admin Applications
                    </h1>
                    <p>
                        Review and manage institute registration
                        applications submitted by service providers.
                    </p>
                </div>
            </div>
            {/* =========================================
                FILTER / SEARCH BAR
            ========================================= */}
            <div className="application-filter-card">
                <div className="application-filter">
                    <label>
                        Status
                    </label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">
                            All Applications
                        </option>
                        <option value="pending">
                            Pending
                        </option>
                        <option value="approved">
                            Approved
                        </option>
                        <option value="rejected">
                            Rejected
                        </option>
                    </select>
                </div>
                <div className="application-filter">
                    <label>
                        Institute Type
                    </label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">
                            All Types
                        </option>
                        <option value="school">
                            School
                        </option>
                        <option value="college">
                            College
                        </option>
                    </select>
                </div>
            </div>
            {/* =========================================
                TABLE CARD
            ========================================= */}
            <div className="applications-table-card">
                <div className="table-card-header">
                    <div>
                        <h2>
                            Registration Applications
                        </h2>
                        <p>
                            Review submitted service-provider applications.
                        </p>
                    </div>
                    <span className="application-count">
                        {visibleApplications.length} Applications
                    </span>
                </div>
                {/* =====================================
                    TABLE
                ====================================== */}
                <div className="table-wrapper">
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>
                                    #
                                </th>
                                <th>
                                    Owner
                                </th>
                                <th>
                                    Institute
                                </th>
                                <th>
                                    Type
                                </th>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Submitted
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Disabled
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                visibleApplications.length
                                    ?
                                    visibleApplications.map((app, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{app.ownerName}</td>
                                            <td>{app.instituteName}</td>
                                            <td>{app.instituteType}</td>
                                            <td>{app.email}</td>
                                            <td>{app.createdAt?.split("T")[0]}</td>
                                            <td><span className={`status-td ${app.rejected ? "rejected" : app.approved ? "approved" : "pending"}`}>{app.rejected ? "Rejected" : app.approved ? "Approved" : "Pending"}</span></td>
                                            <td><span>{app.disabled ? "Yes" : "No"}</span></td>
                                            <td className="actions-td">
                                                <button disabled={loading} className="action-btns view-btn" onClick={() => setSubpage(`preview_admin:${app._id}`)}>
                                                    <FaEye />
                                                </button>
                                                {
                                                    !app.approved && !app.instituteId && (
                                                        <button
                                                            disabled={loading}
                                                            title="Delete Application"
                                                            aria-label="Delete Application"
                                                            className="action-btns delete-btn"
                                                            onClick={() =>
                                                                deleteAdminApplication(
                                                                    app._id,
                                                                    setApplications,
                                                                    setLoading
                                                                )
                                                            }
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )
                                                }
                                                {
                                                    app.rejected || !app.approved
                                                        ?
                                                        <></>
                                                        :
                                                        app.disabled ? (
                                                            <button
                                                                disabled={loading}
                                                                title="Enable Admin"
                                                                aria-label="Enable Admin"
                                                                className="action-btns enable-btn"
                                                                onClick={() =>
                                                                    enableAdmin(
                                                                        app._id,
                                                                        setApplications,
                                                                        setLoading
                                                                    )
                                                                }
                                                            >
                                                                <FaUserCheck />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                disabled={loading}
                                                                title="Disable Admin"
                                                                aria-label="Disable Admin"
                                                                className="action-btns disable-btn"
                                                                onClick={() =>
                                                                    disableAdmin(
                                                                        app._id,
                                                                        setApplications,
                                                                        setLoading
                                                                    )
                                                                }
                                                            >
                                                                <FaUserSlash />
                                                            </button>
                                                        )

                                                }
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr className="empty-table-row">

                                        <td colSpan="8">

                                            <div className="table-empty-state">

                                                <div className="table-empty-icon">
                                                    📋
                                                </div>

                                                <h3>
                                                    No applications found
                                                </h3>

                                                <p>
                                                    New institute registration
                                                    applications will appear here.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>
                            }
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};