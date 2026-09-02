import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaCertificate,
    FaClipboardList,
    FaMoneyBillWave,
    FaSchool,
    FaUserCog,
    FaUserGraduate
} from "react-icons/fa"; 
import "./home.css";

export const AdminDashboardHome = () => {

    return (
        <div className="adminHomePage">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="adminHomeHero">

                <div className="adminHomeHeroContent">

                    <span className="adminHomeEyebrow">
                        INSTITUTE DASHBOARD
                    </span>

                    <h1>
                        Manage your institute from one place.
                    </h1>

                    <p>
                        Use your dashboard to manage admissions, students,
                        fees, payments, institute information and other
                        available education services.
                    </p>

                </div>


                <div className="adminHomeHeroCard">

                    <div className="adminHomeHeroIcon">
                        <FaSchool />
                    </div>

                    <div>
                        <span>
                            DSCH-EDU
                        </span>

                        <strong>
                            Institute Management
                        </strong>
                    </div>

                </div>

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="adminHomeSection">

                <div className="adminHomeSectionHeading">

                    <div>
                        <span>
                            QUICK ACCESS
                        </span>

                        <h2>
                            Common institute tasks
                        </h2>

                        <p>
                            Go directly to the section you need.
                        </p>
                    </div>

                </div>


                <div className="adminQuickGrid">

                    <div className="adminQuickCard">

                        <div className="adminQuickIcon green">
                            <FaClipboardList />
                        </div>

                        <div className="adminQuickContent">

                            <h3>
                                Admissions
                            </h3>

                            <p>
                                Review and manage student admission
                                applications.
                            </p>

                        </div>

                    </div>


                    <div className="adminQuickCard">

                        <div className="adminQuickIcon blue">
                            <FaUserGraduate />
                        </div>

                        <div className="adminQuickContent">

                            <h3>
                                Students
                            </h3>

                            <p>
                                View and manage students enrolled
                                in your institute.
                            </p>

                        </div>

                    </div>


                    <div className="adminQuickCard" >

                        <div className="adminQuickIcon orange">
                            <FaMoneyBillWave />
                        </div>

                        <div className="adminQuickContent">

                            <h3>
                                Fees & Payments
                            </h3>

                            <p>
                                Generate fees and review submitted
                                payment information.
                            </p>
                        </div>

                    </div>


                    <div className="adminQuickCard">

                        <div className="adminQuickIcon purple">
                            <FaSchool />
                        </div>

                        <div className="adminQuickContent">

                            <h3>
                                Institute Profile
                            </h3>

                            <p>
                                Keep your institute information
                                updated on the platform.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                WORKFLOW
            ================================================= */}

            <section className="adminHomeSection adminWorkflowSection">

                <div className="adminHomeSectionHeading">

                    <div>
                        <span>
                            HOW TO USE THE DASHBOARD
                        </span>

                        <h2>
                            Your institute workflow
                        </h2>

                        <p>
                            Manage the main institute processes in a
                            simple sequence.
                        </p>
                    </div>

                </div>


                <div className="adminWorkflow">

                    <div className="adminWorkflowStep">

                        <div className="workflowNumber">
                            01
                        </div>

                        <div className="workflowIcon">
                            <FaClipboardList />
                        </div>

                        <h3>
                            Review Applications
                        </h3>

                        <p>
                            Review submitted admission applications
                            and make the appropriate decision.
                        </p>

                    </div>


                    <div className="workflowLine"></div>


                    <div className="adminWorkflowStep">

                        <div className="workflowNumber">
                            02
                        </div>

                        <div className="workflowIcon">
                            <FaUserGraduate />
                        </div>

                        <h3>
                            Manage Students
                        </h3>

                        <p>
                            Manage approved students and their
                            institute records.
                        </p>

                    </div>


                    <div className="workflowLine"></div>


                    <div className="adminWorkflowStep">

                        <div className="workflowNumber">
                            03
                        </div>

                        <div className="workflowIcon">
                            <FaMoneyBillWave />
                        </div>

                        <h3>
                            Manage Fees
                        </h3>

                        <p>
                            Generate student fees and review
                            payment submissions.
                        </p>

                    </div>


                    <div className="workflowLine"></div>


                    <div className="adminWorkflowStep">

                        <div className="workflowNumber">
                            04
                        </div>

                        <div className="workflowIcon">
                            <FaCertificate />
                        </div>

                        <h3>
                            Issue Certificates
                        </h3>

                        <p>
                            Use the available certificate tools
                            for eligible students.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                AVAILABLE SERVICES
            ================================================= */}

            <section className="adminHomeSection">

                <div className="adminHomeSectionHeading">

                    <div>
                        <span>
                            AVAILABLE SERVICES
                        </span>

                        <h2>
                            What you can manage
                        </h2>

                        <p>
                            Your dashboard brings the main institute
                            management tasks together.
                        </p>
                    </div>

                </div>


                <div className="adminServicesCard">

                    <div className="adminServiceItem">

                        <FaClipboardList />

                        <div>
                            <strong>
                                Admission Applications
                            </strong>

                            <span>
                                Receive and review applications
                            </span>
                        </div>

                    </div>


                    <div className="adminServiceItem">

                        <FaUserGraduate />

                        <div>
                            <strong>
                                Student Management
                            </strong>

                            <span>
                                Manage your institute students
                            </span>
                        </div>

                    </div>


                    <div className="adminServiceItem">

                        <FaMoneyBillWave />

                        <div>
                            <strong>
                                Fee Management
                            </strong>

                            <span>
                                Generate and manage student fees
                            </span>
                        </div>

                    </div>


                    <div className="adminServiceItem">

                        <FaBookOpen />

                        <div>
                            <strong>
                                Institute Information
                            </strong>

                            <span>
                                Maintain your public institute profile
                            </span>
                        </div>

                    </div>


                    <div className="adminServiceItem">

                        <FaCertificate />

                        <div>
                            <strong>
                                Certificates
                            </strong>

                            <span>
                                Generate available student certificates
                            </span>
                        </div>

                    </div>

                    <div className="adminServiceItem">
                        <FaUserCog />
                        <div>
                            <strong>
                                Manage Accounts
                            </strong>

                            <span>
                                Veiw your profile, change passwords.
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                HELP / NOTE
            ================================================= */}

            <section className="adminHomeNote">

                <div className="adminHomeNoteIcon">
                    ?
                </div>

                <div>

                    <strong>
                        Need assistance?
                    </strong>

                    <p>
                        Contact DSCH support if you need help with
                        your institute account or any dashboard service.
                    </p>

                </div>

                <Link
                    to="/contact"
                    className="adminHomeSupportBtn"
                >
                    Contact Support
                    <FaArrowRight />
                </Link>

            </section>

        </div>
    );
};