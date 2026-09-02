import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaCertificate,
    FaClipboardList,
    FaCreditCard,
    FaGraduationCap,
    FaInfoCircle,
    FaUser
} from "react-icons/fa";
import "./home.css";

export const StudentDashboardHome = () => {

    return (
        <div className="studentHomePage">

            {/* =================================================
                HERO
            ================================================= */}
            <section className="studentHomeHero">
                <div className="studentHeroContent">
                    <span className="studentHeroEyebrow">
                        DSCH-EDU
                    </span>
                    <h1>
                        Manage your education journey from one place.
                    </h1>
                    <p>
                        Use your dashboard to review applications,
                        manage fee payments, explore courses and
                        access certificates available to your account.
                    </p>
                </div>


                <div className="studentHeroCard">

                    <div className="studentHeroIcon">
                        <FaGraduationCap />
                    </div>

                    <div>
                        <span>
                            STUDENT PORTAL
                        </span>

                        <strong>
                            DSCH-Edu
                        </strong>
                    </div>

                </div>

            </section>


            {/* =================================================
                QUICK ACCESS
            ================================================= */}

            <section className="studentHomeSection">

                <div className="studentSectionHeading">
                    <h2>
                        What would you like to do?
                    </h2>
                </div>

                <div className="studentQuickGrid">
                    <div className="studentQuickCard">
                        <div className="studentQuickIcon green">
                            <FaClipboardList />
                        </div>
                        <div>
                            <h3>
                                My Applications
                            </h3>
                            <p>
                                View your submitted admission applications
                                and their current status.
                            </p>
                        </div>
                    </div>
                    <div className="studentQuickCard">
                        <div className="studentQuickIcon orange">
                            <FaCreditCard />
                        </div>
                        <div>
                            <h3>
                                My Fees
                            </h3>
                            <p>
                                Review fee records and manage available
                                payment submissions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* =================================================
                STUDENT WORKFLOW
            ================================================= */}
            <section className="studentHomeSection studentWorkflowSection">
                <div className="studentSectionHeading">
                    <span>
                        DSCH-EDU WORKFLOW
                    </span>

                    <h2>
                        Your education journey
                    </h2>
                    <p>
                        The main services available to students through
                        the platform.
                    </p>
                </div>
                <div className="studentWorkflow">
                    <div className="studentWorkflowStep">
                        <div className="studentWorkflowNumber">
                            01
                        </div>

                        <div className="studentWorkflowIcon">
                            <FaClipboardList />
                        </div>

                        <h3>
                            Apply
                        </h3>

                        <p>
                            Submit and review admission applications
                            through the platform.
                        </p>

                    </div>


                    <div className="studentWorkflowLine"></div>


                    <div className="studentWorkflowStep">

                        <div className="studentWorkflowNumber">
                            02
                        </div>

                        <div className="studentWorkflowIcon">
                            <FaCreditCard />
                        </div>

                        <h3>
                            Manage Fees
                        </h3>

                        <p>
                            Review applicable fees and submit payment
                            information where required.
                        </p>

                    </div>


                    <div className="studentWorkflowLine"></div>


                    <div className="studentWorkflowStep">

                        <div className="studentWorkflowNumber">
                            03
                        </div>

                        <div className="studentWorkflowIcon">
                            <FaBookOpen />
                        </div>

                        <h3>
                            Learn
                        </h3>

                        <p>
                            Explore the learning opportunities available
                            through DSCH-Edu.
                        </p>

                    </div>


                    <div className="studentWorkflowLine"></div>


                    <div className="studentWorkflowStep">

                        <div className="studentWorkflowNumber">
                            04
                        </div>

                        <div className="studentWorkflowIcon">
                            <FaCertificate />
                        </div>

                        <h3>
                            Certificates
                        </h3>

                        <p>
                            Access certificates issued through supported
                            DSCH-Edu services.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                AVAILABLE SERVICES
            ================================================= */}

            <section className="studentHomeSection">

                <div className="studentSectionHeading">

                    <span>
                        AVAILABLE SERVICES
                    </span>

                    <h2>
                        Manage your account
                    </h2>

                    <p>
                        Use the dashboard sections to manage your
                        education-related information.
                    </p>

                </div>


                <div className="studentServicesCard">

                    <div className="studentServiceItem">

                        <FaUser />

                        <div>
                            <strong>
                                Profile
                            </strong>

                            <span>
                                Manage your personal information
                            </span>
                        </div>

                    </div>


                    <div className="studentServiceItem">

                        <FaClipboardList />

                        <div>
                            <strong>
                                Applications
                            </strong>

                            <span>
                                Review application information
                            </span>
                        </div>

                    </div>


                    <div className="studentServiceItem">

                        <FaCreditCard />

                        <div>
                            <strong>
                                Fees & Payments
                            </strong>

                            <span>
                                Review available fee records
                            </span>
                        </div>

                    </div>
                </div>

            </section>


            {/* =================================================
                SUPPORT
            ================================================= */}

            <section className="studentHomeSupport">

                <div className="studentSupportIcon">
                    <FaInfoCircle />
                </div>

                <div>

                    <strong>
                        Need help?
                    </strong>

                    <p>
                        Contact DSCH support if you need assistance
                        with your account or available services.
                    </p>

                </div>

                <Link
                    to="/contact"
                    className="studentSupportBtn"
                >
                    Contact Support
                    <FaArrowRight />
                </Link>

            </section>

        </div>
    );
};