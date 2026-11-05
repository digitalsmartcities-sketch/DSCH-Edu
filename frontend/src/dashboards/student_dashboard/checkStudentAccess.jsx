import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/navbar/navbar";
import { checkStudentAccess } from "../../apicalls/student_apicalls";
import "./checkStudentAccess.css";
import { StudentDashboardHome } from "./student_dashboard_components/dashboard_home/home";
import { StudentAdmission } from "./student_dashboard_components/my_applications/std_admission_application";
import { PaymentForm } from "./student_dashboard_components/payment_form/payment_form";
import { StudentProfile } from "./student_dashboard_components/my_profile/profile";
import { StudentFees } from "./student_dashboard_components/Fee/fee";
import { ChangePassword } from "../../components/change_password_dashboards_comp/change_password";
import { logOutApi } from "../../apicalls/public_apicalls";
import AppContext from "../../app_context/context";
import { FaSignOutAlt } from "react-icons/fa";

export const CheckStudentAccess = () => {
    const navigate = useNavigate();
    const { setUserState } = useContext(AppContext);
    const [subpage, setSubpage] = useState("check_page");
    const [, setStudent] = useState(null);
    const [message, setMessage] = useState({
        text: null,
        type: null
    });
    const [canAccess, setCanAccess] = useState(["Home", "Admission", "Fees", "Profile", "PaymentForm"]);
    useEffect(() => {
        checkStudentAccess(setMessage, setSubpage, setCanAccess, setStudent);
    }, []);

    /* =========================================
       DASHBOARD CONTENT
    ========================================= */
    let content;
    switch (subpage) {
        case "Home":
            content = <StudentDashboardHome />
            break;
        case "Admission":
            content = <StudentAdmission setSubPage={setSubpage} />
            break;
        case "Fees":
            content = <StudentFees setSubPage={setSubpage} />
            break;
        case "Profile":
            content = <StudentProfile />
            break;
        case "change_password":
            content = <ChangePassword />
            break;
    }

    if (subpage.startsWith("PaymentForm")) {
        content = <PaymentForm billId={subpage.split(":")[1]} setSubPage={setSubpage} />
    }

    return (
        <>
            {
                subpage === "check_page" ?
                    /* =================================
                       ACCESS CHECK SCREEN
                    ================================= */
                    <div className="student-access-check-page">
                        <div className="student-access-check-box">
                            <div className="student-access-loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <h2>
                                Checking Access
                            </h2>
                            <p>
                                Please wait while we verify
                                your student status.
                            </p>
                            {
                                message.text && (
                                    <div className="student-access-message-wrapper">
                                        <p
                                            className={`student-dashboard-message ${message.type || ""}`}
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
                       STUDENT DASHBOARD
                    ================================= */
                    <>
                        <header>
                            <Navbar />
                        </header>
                        <main className="student-dashboard">
                            {/* =================================
                               SIDEBAR
                            ================================= */}
                            <aside className="student-sidebar">
                                {/* Dashboard */}
                                <div
                                    className={
                                        subpage === "Home"
                                            ? "student-sidebar-item active"
                                            : "student-sidebar-item"
                                    }
                                    onClick={() =>
                                        setSubpage("Home")
                                    }
                                    style={{ display: `${canAccess.includes("Home") ? "flex" : "none"}` }}
                                >
                                    <span className="student-sidebar-icon">
                                        🏠
                                    </span>
                                    <span>
                                        Dashboard
                                    </span>
                                </div>
                                {/* Admission */}
                                <div
                                    className={
                                        subpage === "Admission"
                                            ? "student-sidebar-item active"
                                            : "student-sidebar-item"
                                    }
                                    onClick={() =>
                                        setSubpage("Admission")
                                    }
                                    style={{ display: `${canAccess.includes("Admission") ? "flex" : "none"}` }}
                                >
                                    <span className="student-sidebar-icon">
                                        📝
                                    </span>
                                    <span>
                                        Admission
                                    </span>
                                </div>
                                {/* Fees */}
                                <div
                                    className={
                                        subpage === "Fees"
                                            ? "student-sidebar-item active"
                                            : "student-sidebar-item"
                                    }
                                    onClick={() =>
                                        setSubpage("Fees")
                                    }
                                    style={{ display: `${canAccess.includes("Fees") ? "flex" : "none"}` }}
                                >
                                    <span className="student-sidebar-icon">
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
                                            ? "student-sidebar-item active"
                                            : "student-sidebar-item"
                                    }
                                    onClick={() =>
                                        setSubpage("Profile")
                                    }
                                    style={{ display: `${canAccess.includes("Profile") ? "flex" : "none"}` }}
                                >
                                    <span className="student-sidebar-icon">
                                        👤
                                    </span>
                                    <span>
                                        Profile
                                    </span>
                                </div>
                                {/* change password */}
                                <div
                                    className={
                                        subpage === "change_password"
                                            ? "student-sidebar-item active"
                                            : "student-sidebar-item"
                                    }
                                    onClick={() =>
                                        setSubpage("change_password")
                                    }
                                    style={{ display: `${canAccess.includes("change_password") ? "flex" : "none"}` }}
                                >
                                    <span className="student-sidebar-icon">
                                        🔑
                                    </span>
                                    <span>
                                        Change Password
                                    </span>
                                </div>
                                {/* logout button */}
                                <div
                                    className="student-sidebar-item sidebar_logout_tab"
                                    onClick={async() => {
                                        logOutApi(setUserState,navigate);
                                    }}
                                >
                                    <span className="student-sidebar-icon">
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
                            <section className="student-content">
                                {content}
                            </section>
                        </main>
                    </>
            }
        </>
    );
};