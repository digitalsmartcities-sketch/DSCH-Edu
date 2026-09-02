import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaClipboardList,
    FaCog,
    FaGraduationCap,
    FaSchool,
    FaShieldAlt,
    FaUserShield,
    FaUsers
} from "react-icons/fa";
import "./home.css";

export const SADashboardHome = () => {

    return (
        <div className="superAdminHome">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="superAdminHero">

                <div className="superAdminHeroContent">

                    <span>
                        DSCH ADMINISTRATION
                    </span>

                    <h1>
                        Manage the DSCH-Edu platform.
                    </h1>

                    <p>
                        Use the administration dashboard to manage
                        institutes, applications, courses, enrollments
                        and platform-level education services.
                    </p>

                </div>


                <div className="superAdminHeroBadge">

                    <div className="superAdminHeroIcon">
                        <FaUserShield />
                    </div>

                    <div>

                        <span>
                            ACCESS LEVEL
                        </span>

                        <strong>
                            Super Admin
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                MANAGEMENT AREAS
            ================================================= */}

            <section className="superAdminSection">

                <div className="superAdminSectionHeading">

                    <span>
                        MANAGEMENT
                    </span>

                    <h2>
                        Platform management
                    </h2>

                    <p>
                        Access the main areas of the DSCH-Edu administration
                        system.
                    </p>

                </div>


                <div className="superAdminManagementGrid">

                    <div className="superAdminManagementCard">

                        <div className="superAdminCardIcon green">
                            <FaSchool />
                        </div>

                        <div>

                            <h3>
                                Institutes
                            </h3>

                            <p>
                                Review institute applications and manage
                                institute-related administration.
                            </p>
                        </div>

                    </div>


                    <div className="superAdminManagementCard">

                        <div className="superAdminCardIcon blue">
                            <FaClipboardList />
                        </div>

                        <div>

                            <h3>
                                Applications
                            </h3>

                            <p>
                                Review submitted institute applications
                                and handle approval workflows.
                            </p>
                        </div>
                    </div>


                    <div className="superAdminManagementCard">

                        <div className="superAdminCardIcon purple">
                            <FaBookOpen />
                        </div>

                        <div>

                            <h3>
                                Courses
                            </h3>

                            <p>
                                Create, publish and manage courses available
                                through DSCH-Edu.
                            </p>
                        </div>
                    </div>


                    <div className="superAdminManagementCard">

                        <div className="superAdminCardIcon orange">
                            <FaUsers />
                        </div>

                        <div>

                            <h3>
                                Enrollments
                            </h3>

                            <p>
                                Review course enrollment applications and
                                manage enrollment decisions.
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                PLATFORM WORKFLOW
            ================================================= */}

            <section className="superAdminSection superAdminWorkflowSection">

                <div className="superAdminSectionHeading">

                    <span>
                        PLATFORM WORKFLOW
                    </span>

                    <h2>
                        Core administration flow
                    </h2>

                    <p>
                        The main responsibilities handled by the
                        Super Admin.
                    </p>

                </div>


                <div className="superAdminWorkflow">

                    <div className="superAdminWorkflowStep">

                        <div className="superWorkflowNumber">
                            01
                        </div>

                        <div className="superWorkflowIcon">
                            <FaSchool />
                        </div>

                        <h3>
                            Institutes
                        </h3>

                        <p>
                            Review and manage institute registration
                            applications.
                        </p>

                    </div>


                    <div className="superWorkflowLine"></div>


                    <div className="superAdminWorkflowStep">

                        <div className="superWorkflowNumber">
                            02
                        </div>

                        <div className="superWorkflowIcon">
                            <FaClipboardList />
                        </div>

                        <h3>
                            Applications
                        </h3>

                        <p>
                            Oversee application decisions and related
                            administrative workflows.
                        </p>

                    </div>


                    <div className="superWorkflowLine"></div>


                    <div className="superAdminWorkflowStep">

                        <div className="superWorkflowNumber">
                            03
                        </div>

                        <div className="superWorkflowIcon">
                            <FaBookOpen />
                        </div>

                        <h3>
                            Courses
                        </h3>

                        <p>
                            Create and publish courses for public
                            discovery.
                        </p>

                    </div>


                    <div className="superWorkflowLine"></div>


                    <div className="superAdminWorkflowStep">

                        <div className="superWorkflowNumber">
                            04
                        </div>

                        <div className="superWorkflowIcon">
                            <FaGraduationCap />
                        </div>

                        <h3>
                            Enrollments
                        </h3>

                        <p>
                            Review course enrollment applications and
                            certificate eligibility.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                ADMINISTRATION SERVICES
            ================================================= */}

            <section className="superAdminSection">

                <div className="superAdminSectionHeading">

                    <span>
                        PLATFORM SERVICES
                    </span>

                    <h2>
                        Other administration areas
                    </h2>

                    <p>
                        Platform tools available to Super Admin.
                    </p>

                </div>


                <div className="superAdminServices">

                    <div className="superAdminServiceItem">

                        <FaShieldAlt />

                        <div>
                            <strong>
                                Access Control
                            </strong>

                            <span>
                                Manage administrative access
                            </span>
                        </div>

                    </div>


                    <div className="superAdminServiceItem">

                        <FaUsers />

                        <div>
                            <strong>
                                User Management
                            </strong>

                            <span>
                                Manage platform accounts where applicable
                            </span>
                        </div>

                    </div>


                    <div className="superAdminServiceItem">

                        <FaGraduationCap />

                        <div>
                            <strong>
                                Education Services
                            </strong>

                            <span>
                                Manage DSCH-Edu offerings
                            </span>
                        </div>

                    </div>


                    <div className="superAdminServiceItem">

                        <FaCog />

                        <div>
                            <strong>
                                Platform Settings
                            </strong>

                            <span>
                                Manage available administrative settings
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                SUPPORT / SECURITY NOTE
            ================================================= */}

            <section className="superAdminNote">

                <div className="superAdminNoteIcon">
                    <FaShieldAlt />
                </div>

                <div>

                    <strong>
                        Administrative access
                    </strong>

                    <p>
                        Super Admin actions can affect platform-wide
                        education services. Review information carefully
                        before making administrative decisions.
                    </p>

                </div>

            </section>

        </div>
    );
};