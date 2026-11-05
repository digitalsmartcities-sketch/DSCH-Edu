import { useContext, useEffect, useState } from "react";
import "./checkSuperAdminAccess.css";
import { Navbar } from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { checkSuperAdminAccess } from "../../apicalls/superadmin_apicalls";
import { SADashboardHome } from "./superadmin_dashboard_comps/dashboard_home/home";
import { AdminApplications } from "./superadmin_dashboard_comps/adminapplications/applications";
import { AdminPreview } from "./superadmin_dashboard_comps/admin_previewpage/admin_previewpage";
import { ManageCourses } from "./superadmin_dashboard_comps/courses/course_form";
import { logOutApi } from "../../apicalls/public_apicalls";
import AppContext from "../../app_context/context";
import { FaSignOutAlt } from "react-icons/fa";

export const CheckSuperAdminAccess = () => {
    let [subpage, setSubpage] = useState("check_page");
    let [message, setMessage] = useState({
        text: null,
        type: null
    });

    let { setUserState } = useContext(AppContext)

    useEffect(() => {
        checkSuperAdminAccess(setSubpage, setMessage);
    }, []);

    const navigate = useNavigate();

    let content;
    switch (subpage) {
        case "Home":
            content = <SADashboardHome />;
            break;
        case "Applications":
            content = <AdminApplications setSubpage={setSubpage} />;
            break;
        case "Manage_Courses":
            content = <ManageCourses setSubpage={setSubpage} />;
            break;
        default:
            content = <SADashboardHome />;
            break;
    }

    if (subpage.startsWith("preview_admin")) {
        content = <AdminPreview id={subpage.split(":")[1]} setSubpage={setSubpage} />
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            {
                subpage === "check_page" ?
                    /* ================================
                       ACCESS CHECKING SCREEN
                    ================================= */
                    <div className="access-check-page">
                        <div className="access-check-box">
                            <div className="access-loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <h2>
                                Checking Access
                            </h2>
                            <p>
                                Please wait while we verify your
                                Superadmin access.
                            </p>
                            {
                                message.text && (
                                    <div>
                                        <p className={`dashboard-message ${message.type || ""} `}>{message.text}</p>
                                        <button onClick={() => navigate("/")}>Go Back</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    :
                    /* ===============================
                       SUPERADMIN DASHBOARD
                    ================================= */
                    <>
                        <main className="superadmin-dashboard">
                            <aside className="superadmin-sidebar">
                                <div className={subpage === "Home" ? "sidebar-item active" : "sidebar-item"} onClick={() => setSubpage("Home")}>
                                    <span className="sidebar-icon">
                                        🏠
                                    </span>
                                    <span>
                                        Dashboard
                                    </span>
                                </div>
                                <div className={subpage === "Applications" ? "sidebar-item active" : "sidebar-item"} onClick={() => setSubpage("Applications")}>
                                    <span className="sidebar-icon">
                                        📋
                                    </span>
                                    <span>
                                        Applications
                                    </span>
                                </div>
                                <div className="sidebar-item" onClick={() => setSubpage("Manage_Courses")}>
                                    <span className="sidebar-icon">
                                        🎓
                                    </span>
                                    <span>
                                        Manage Courses
                                    </span>
                                </div>
                                <div className="sidebar-item sidebar_logout_tab" onClick={() => logOutApi(setUserState, navigate)}>
                                    <span className="sidebar-icon">
                                        <FaSignOutAlt />
                                    </span>
                                    <span>
                                        Logout
                                    </span>
                                </div>
                            </aside>
                            <section className="superadmin-content">
                                {content}
                            </section>
                        </main>
                    </>
            }
        </>
    );
};