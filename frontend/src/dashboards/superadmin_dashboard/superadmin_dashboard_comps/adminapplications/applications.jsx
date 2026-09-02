import { FaEye,FaUserCheck, FaUserSlash } from "react-icons/fa";
import { disableAdmin, enableAdmin, getApplications } from "../../../../apicalls/superadmin_apicalls";
import "./application.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminApplications = ({ setSubpage }) => {
    let [applications, setApplications] = useState([]);
    let [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getApplications(setApplications, navigate);
    }, []);

    const stateFilter = (filter) =>
        applications.filter((v, i) => {
            if (filter === "pending") {
                return !v.approved;
            } else if (filter === "approved") {
                return v.approved;
            } else {
                return true;
            }
        });

    const typeFilter = (type) =>
        applications.filter((v, i) => {
            if (type === "all") {
                return true;
            } else {
                return v.instituteType == type;
            }
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
                    <select defaultValue="all" onChange={(e) => setApplications(stateFilter(e.target.value))}>
                        <option value="all">
                            All Applications
                        </option>
                        <option value="pending">
                            Pending
                        </option>
                        <option value="approved">
                            Approved
                        </option>
                    </select>
                </div>
                <div className="application-filter">
                    <label>
                        Institute Type
                    </label>
                    <select defaultValue="all" onChange={(e) => setApplications(typeFilter(e.target.value))}>
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
                        {applications?.length} Applications
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
                                (applications)
                                    ?
                                    applications.map((app, index) => (
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