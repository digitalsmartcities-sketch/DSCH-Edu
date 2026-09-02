import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./checkAdminAccess.css";
import { Navbar } from "../../components/navbar/navbar";
import { checkAdminAccess, getInstituteData } from "../../apicalls/admin_apicalls";
import { AdminDashboardHome } from "./admin_dashboard_comps/dashboard_home/home";
import { InstituteProfile } from "./admin_dashboard_comps/Institute_profile/institute_profile";
import { AdmissionApplications } from "./admin_dashboard_comps/admissions_applications/applications";
import { StudentView } from "./admin_dashboard_comps/student_previewpage/studentView";
import { PaymentView } from "./admin_dashboard_comps/payment_view_comp/payment_view";
import { Students } from "./admin_dashboard_comps/all_students/all_students";
import { StudentProfile } from "./admin_dashboard_comps/student_profile/studentProfile";
import { AdminFeeManagmenet } from "./admin_dashboard_comps/fee_management/fee";
import { Certificates } from "./admin_dashboard_comps/certificates/certificates";
import { FaCertificate, FaSignOutAlt } from "react-icons/fa";
import { AdminProfile } from "./admin_dashboard_comps/admin_profile/admin_profile";
import { FaKey } from "react-icons/fa6";
import { ChangePassword } from "../../components/change_password_dashboards_comp/change_password";
import { logOutApi } from "../../apicalls/public_apicalls";
import AppContext from "../../app_context/context";

export const CheckAdminAccess = () => {
    const navigate = useNavigate();
    const { userState, setUserState } = useContext(AppContext);
    const [subpage, setSubpage] = useState("check_page");
    const [message, setMessage] = useState({
        text: null,
        type: null
    });
    const [instituteData, setInstituteData] = useState(null);

    useEffect(() => {
        checkAdminAccess(setSubpage, setMessage);
        getInstituteData((data) => setInstituteData(data));
    }, []);

    /* =========================================
       DASHBOARD CONTENT
    ========================================= */
    let content;
    switch (subpage) {
        case "Home":
            content = <AdminDashboardHome />;
            break;
        case "Admissions":
            content = <AdmissionApplications setSubpage={setSubpage} />;
            break;
        case "Students":
            content = <Students setSubpage={setSubpage} />;
            break;
        case "Fees":
            content = <AdminFeeManagmenet />;
            break;
        case "Institute_Profile":
            content = <InstituteProfile />;
            break;
        case "certificates":
            content = <Certificates />;
            break;
        case "Profile":
            content = <AdminProfile setSubpage={setSubpage} />
            break;
        case "change_password":
            content = <ChangePassword />;
            break;
    }

    if (subpage.startsWith("ApplicationView")) {
        content = <StudentView id={subpage.split(":")[1]} setSubpage={setSubpage} />
    }

    if (subpage.startsWith("PaymentView")) {
        content = <PaymentView setSubpage={setSubpage} id={subpage.split(":")[1]} />
    }

    if (subpage.startsWith("StudentProfile")) {
        content = <StudentProfile setSubpage={setSubpage} id={subpage.split(":")[1]} />
    }


    return (
        <>
            <header>
                <Navbar />
            </header>
            {
                subpage === "check_page" ?
                    /* =================================
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
                                admin access.
                            </p>
                            {
                                message.text && (
                                    <div>
                                        <p
                                            className={`dashboard-message ${message.type || ""}`}
                                        >
                                            {message.text}
                                        </p>
                                        <button
                                            onClick={() => navigate("/")}
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    :
                    /* =================================
                       ADMIN DASHBOARD
                    ================================= */
                    <>
                        <main className="admin-dashboard">
                            {/* =================================
                               SIDEBAR
                            ================================= */}
                            <aside className="admin-sidebar">
                                {/* Institute Logo in Sidebar */}
                                <div className="sidebar-institute-logo">
                                    {instituteData?.instituteLogo?.imageUrl
                                        ? <img src={instituteData.instituteLogo.imageUrl} alt="Institute Logo" className="sidebar-logo-img" />
                                        : <div className="sidebar-logo-placeholder">🏫</div>
                                    }
                                    <p className="sidebar-institute-name">{instituteData?.instituteName || "Institute"}</p>
                                </div>
                                {/* Dashboard */}
                                <div
                                    className={
                                        subpage === "Home"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("Home")}
                                >
                                    <span className="sidebar-icon">
                                        🏠
                                    </span>
                                    <span>
                                        Dashboard
                                    </span>
                                </div>
                                {/* Admissions */}
                                <div
                                    className={
                                        subpage === "Admissions"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("Admissions")}
                                >
                                    <span className="sidebar-icon">
                                        📝
                                    </span>
                                    <span>
                                        Admissions
                                    </span>
                                </div>
                                {/* Students */}
                                <div
                                    className={
                                        subpage === "Students"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("Students")}
                                >
                                    <span className="sidebar-icon">
                                        👨‍🎓
                                    </span>
                                    <span>
                                        Students
                                    </span>
                                </div>
                                {/* Fees */}
                                <div
                                    className={
                                        subpage === "Fees"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("Fees")}
                                >
                                    <span className="sidebar-icon">
                                        💳
                                    </span>
                                    <span>
                                        Fees
                                    </span>
                                </div>
                                {/* Profile */}
                                <div
                                    className={
                                        subpage === "Profile"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("Profile")}
                                >
                                    <span className="sidebar-icon">
                                        👤
                                    </span>
                                    <span>
                                        Profile
                                    </span>
                                </div>
                                {/* Institute Profile */}
                                <div
                                    className={
                                        subpage === "Institute_Profile"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("Institute_Profile")}
                                >
                                    <span className="sidebar-icon">
                                        🏦
                                    </span>
                                    <span>
                                        Institute
                                    </span>
                                </div>
                                {/* Certificates */}
                                <div
                                    className={
                                        subpage === "certificates"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("certificates")}
                                >
                                    <span className="sidebar-icon">
                                        <FaCertificate />
                                    </span>
                                    <span>
                                        Certificates
                                    </span>
                                </div>
                                {/* Change Password */}
                                <div
                                    className={
                                        subpage === "change_password"
                                            ? "sidebar-item active"
                                            : "sidebar-item"
                                    }
                                    onClick={() => setSubpage("change_password")}
                                >
                                    <span className="sidebar-icon">
                                        <FaKey />
                                    </span>
                                    <span>
                                        Change Password
                                    </span>
                                </div>
                                {/* logout button */}
                                <div
                                    className={"sidebar-item sidebar_logout_tab"}
                                    onClick={async () => {
                                        logOutApi(setUserState, navigate);
                                    }}
                                >
                                    <span className="sidebar-icon">
                                        <FaSignOutAlt />
                                    </span>
                                    <span>
                                        Logout
                                    </span>
                                </div>
                            </aside>
                            {/* =================================
                               CONTENT
                            ================================= */}
                            <section className="admin-content">
                                {content}
                            </section>
                        </main>
                    </>
            }
        </>
    );
};