import {
    FaUserPlus,
    FaClipboardCheck,
    FaUniversity,
    FaUserGraduate,
    FaMoneyBillWave,
    FaCertificate,
    FaArrowRight,
    FaSearch,
    FaFileAlt,
    FaCheckCircle,
    FaBookOpen,
    FaHistory
} from "react-icons/fa";
import "./how_it_works.css";
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/Footer";
import { Link } from "react-router-dom";
import { MdVerified, MdOutlineFactCheck } from "react-icons/md";
import { HiOutlineAcademicCap, HiOutlineIdentification } from "react-icons/hi2";

export const HowItWorksPage = () => {

    // Section 3: Online Admission Steps
    const admissionSteps = [
        {
            number: "01",
            icon: <FaSearch />,
            title: "Discover Institute",
            text: "Explore registered schools and colleges in Kohat, compare academic programs, facilities, and fee schedules."
        },
        {
            number: "02",
            icon: <FaUniversity />,
            title: "View Profile & Programs",
            text: "Open the institute's official profile to review eligibility criteria, admission dates, and required documents."
        },
        {
            number: "03",
            icon: <FaFileAlt />,
            title: "Submit Admission Form",
            text: "Fill out the online application with student, guardian, academic details, and upload requested documents."
        },
        {
            number: "04",
            icon: <FaMoneyBillWave />,
            title: "Submit Fee Proof",
            text: "Provide your admission fee transaction ID and payment proof receipt for manual verification."
        },
        {
            number: "05",
            icon: <FaClipboardCheck />,
            title: "Institute Review",
            text: "The institute administration thoroughly reviews your application, uploaded documents, and payment details."
        },
        {
            number: "06",
            icon: <FaCheckCircle />,
            title: "Approval or Correction",
            text: "If approved, your admission is confirmed. If corrections are required, you receive specific feedback to update."
        },
        {
            number: "07",
            icon: <FaUserGraduate />,
            title: "Student Account Access",
            text: "Upon approval, a student account is provisioned to log in, track fee records, and access academic services."
        }
    ];

    // Section 4: Course Enrollment Steps
    const courseSteps = [
        {
            number: "01",
            icon: <FaBookOpen />,
            title: "Explore Courses",
            text: "Browse practical skill-building programs, vocational training, and certified short courses."
        },
        {
            number: "02",
            icon: <FaFileAlt />,
            title: "View Course Details",
            text: "Inspect curriculum modules, duration, instructor/institute provider, and course fee information."
        },
        {
            number: "03",
            icon: <FaClipboardCheck />,
            title: "Submit Enrollment",
            text: "Fill out the standalone course enrollment form directly with your contact information."
        },
        {
            number: "04",
            icon: <FaMoneyBillWave />,
            title: "Submit Fee Proof",
            text: "Provide payment transaction proof for the course fee according to the specified payment instructions."
        },
        {
            number: "05",
            icon: <MdOutlineFactCheck />,
            title: "Admin Review & Approval",
            text: "Course coordinators verify your enrollment and payment submission."
        },
        {
            number: "06",
            icon: <HiOutlineAcademicCap />,
            title: "Course Participation",
            text: "Join course sessions and class WhatsApp group where configured to engage in learning."
        },
        {
            number: "07",
            icon: <HiOutlineIdentification />,
            title: "Earn Certificate",
            text: "Upon successful completion of the course requirements, receive a verified course certificate."
        }
    ];

    // Section 5: Institute Owner Steps
    const instituteOwnerSteps = [
        {
            number: "01",
            icon: <FaUserPlus />,
            title: "Register Institute",
            text: "Submit institute details, owner CNIC, registration documents, and payment proof via the registration portal."
        },
        {
            number: "02",
            icon: <FaClipboardCheck />,
            title: "Super Admin Review",
            text: "The DSCH administration team reviews legal documentation and verifies ownership and credentials."
        },
        {
            number: "03",
            icon: <FaCheckCircle />,
            title: "Approval & Activation",
            text: "Once approved, your institute administrator account is activated for login and portal access."
        },
        {
            number: "04",
            icon: <FaUniversity />,
            title: "Setup Institute Profile",
            text: "Add academic programs, monthly fee structures, campus facilities, photo gallery, and FAQs."
        },
        {
            number: "05",
            icon: <FaUserGraduate />,
            title: "Receive Admissions",
            text: "Receive online admission applications directly from students and parents in Kohat."
        },
        {
            number: "06",
            icon: <FaMoneyBillWave />,
            title: "Review Fees & Payments",
            text: "Review submitted payment proofs, approve or reject transactions, and generate monthly fee records."
        },
        {
            number: "07",
            icon: <FaCertificate />,
            title: "Issue Certificates",
            text: "Generate professional student academic certificates using structured platform templates."
        }
    ];

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <div className="howItWorksPage">

                    {/* =========================================
                        HERO & SECTION 1: WHAT DSCH-EDU IS
                    ========================================== */}
                    <section className="howWorksHero">
                        <div className="heroBackgroundShape"></div>

                        <span className="howWorksEyebrow">
                            TRANSPARENT PROCESS
                        </span>

                        <h1>
                            How <span>DSCH-Edu</span> Works
                        </h1>

                        <p>
                            DSCH-Edu is the dedicated education module of the Digital Smart City Hub (DSCH),
                            focused on helping users discover educational institutes, submit digital admissions,
                            enroll in standalone skill courses, and access education-related services in Kohat.
                        </p>
                    </section>

                    {/* =========================================
                        SECTION 2: FOR STUDENTS & PUBLIC USERS
                    ========================================== */}
                    <section className="howWorksSection studentPublicSection">
                        <div className="howWorksSectionTitle">
                            <span>FOR STUDENTS & PARENTS</span>
                            <h2>Your Journey as a Public User</h2>
                            <p>
                                Everything you need to discover academic opportunities, submit applications,
                                and manage your educational records online.
                            </p>
                        </div>

                        <div className="featuresOverviewGrid">
                            <div className="featureItemCard">
                                <div className="featureItemIcon"><FaSearch /></div>
                                <h3>Discover Institutes</h3>
                                <p>Search recognized primary, secondary, and higher secondary schools as well as colleges across Kohat.</p>
                            </div>
                            <div className="featureItemCard">
                                <div className="featureItemIcon"><FaUniversity /></div>
                                <h3>Review Official Profiles</h3>
                                <p>Inspect verified academic programs, monthly fee structures, campus facilities, and contact information.</p>
                            </div>
                            <div className="featureItemCard">
                                <div className="featureItemIcon"><FaFileAlt /></div>
                                <h3>Apply Online</h3>
                                <p>Complete digital admission applications with student, guardian, and academic history without visiting in person.</p>
                            </div>
                            <div className="featureItemCard">
                                <div className="featureItemIcon"><FaMoneyBillWave /></div>
                                <h3>Submit Fee Records</h3>
                                <p>Provide fee transaction IDs and deposit receipts directly for transparent administrative verification.</p>
                            </div>
                            <div className="featureItemCard">
                                <div className="featureItemIcon"><FaHistory /></div>
                                <h3>Track Status & Corrections</h3>
                                <p>Stay informed regarding application review status, with the ability to correct and resubmit rejected items.</p>
                            </div>
                            <div className="featureItemCard">
                                <div className="featureItemIcon"><FaUserGraduate /></div>
                                <h3>Student Dashboard</h3>
                                <p>After admission approval, log into the Student Portal to review fee dues, payment history, and certificates.</p>
                            </div>
                        </div>
                    </section>

                    {/* =========================================
                        SECTION 3: HOW ONLINE ADMISSION WORKS
                    ========================================== */}
                    <section className="howWorksSection admissionFlowSection">
                        <div className="howWorksSectionTitle">
                            <span>FORMAL EDUCATION</span>
                            <h2>How Online School & College Admission Works</h2>
                            <p>
                                A thorough, step-by-step workflow designed to ensure authenticity and administrative review.
                                Admissions are verified manually by institute administrators — not approved automatically.
                            </p>
                        </div>

                        <div className="verticalStepsList">
                            {admissionSteps.map((step) => (
                                <div className="stepListItem" key={step.number}>
                                    <div className="stepBadgeContainer">
                                        <span className="stepNumBadge">{step.number}</span>
                                        <div className="stepIconBubble">{step.icon}</div>
                                    </div>
                                    <div className="stepBody">
                                        <h3>{step.title}</h3>
                                        <p>{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sectionCtaBanner">
                            <div>
                                <h4>Looking for a School or College?</h4>
                                <p>Explore verified educational institutes in Kohat and check available admissions.</p>
                            </div>
                            <Link to="/school" className="primarySectionBtn">
                                Explore Institutes
                                <FaArrowRight />
                            </Link>
                        </div>
                    </section>

                    {/* =========================================
                        SECTION 4: HOW COURSE ENROLLMENT WORKS (SEPARATE)
                    ========================================== */}
                    <section className="howWorksSection courseFlowSection">
                        <div className="howWorksSectionTitle">
                            <span>SKILL DEVELOPMENT</span>
                            <h2>How Course Enrollment Works</h2>
                            <p>
                                Skill and vocational courses are managed through a separate, standalone workflow.
                            </p>
                        </div>

                        <div className="courseNoticeBanner">
                            <MdVerified />
                            <div>
                                <strong>Independent Learning Pathway:</strong>
                                <span> Course enrollment is a separate workflow and does not require enrollment or admission as a school/college student. Any individual can browse courses and enroll directly.</span>
                            </div>
                        </div>

                        <div className="verticalStepsList courseStepsList">
                            {courseSteps.map((step) => (
                                <div className="stepListItem" key={step.number}>
                                    <div className="stepBadgeContainer">
                                        <span className="stepNumBadge courseBadge">{step.number}</span>
                                        <div className="stepIconBubble courseBubble">{step.icon}</div>
                                    </div>
                                    <div className="stepBody">
                                        <h3>{step.title}</h3>
                                        <p>{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sectionCtaBanner courseBanner">
                            <div>
                                <h4>Want to Learn New Skills or Offer a Course?</h4>
                                <p>Browse published courses or contact DSCH if you are an educator interested in offering courses.</p>
                            </div>
                            <div className="bannerButtons">
                                <Link to="/courses" className="primarySectionBtn">
                                    Browse Courses
                                    <FaArrowRight />
                                </Link>
                                <Link to="/contact" className="secondarySectionBtn">
                                    Offer a Course with DSCH
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* =========================================
                        SECTION 5: FOR INSTITUTE OWNERS
                    ========================================== */}
                    <section className="howWorksSection instituteSection">
                        <div className="howWorksSectionTitle">
                            <span>FOR INSTITUTE OWNERS & ADMINISTRATORS</span>
                            <h2>The Institute Management Lifecycle</h2>
                            <p>
                                From registration and verification to daily student management, fee tracking, and certificates.
                            </p>
                        </div>

                        <div className="instituteGrid">
                            {instituteOwnerSteps.map((step) => (
                                <div className="instituteFlowCard" key={step.number}>
                                    <div className="flowCardHeader">
                                        <div className="flowCardIcon">{step.icon}</div>
                                        <span className="flowCardNum">{step.number}</span>
                                    </div>
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="sectionCtaBanner">
                            <div>
                                <h4>Ready to Bring Your Institute Online?</h4>
                                <p>Submit your institute registration and begin managing your admissions and students digitally.</p>
                            </div>
                            <Link to="/register-institute" className="primarySectionBtn">
                                Register Your Institute
                                <FaArrowRight />
                            </Link>
                        </div>
                    </section>

                    {/* =========================================
                        SECTION 6: REJECTED APPLICATIONS & CORRECTIONS
                    ========================================== */}
                    <section className="howWorksSection rejectionHelpSection">
                        <div className="howWorksSectionTitle">
                            <span>CORRECTIONS & REVIEW</span>
                            <h2>What Happens if an Application is Rejected?</h2>
                            <p>
                                Rejection on DSCH-Edu is not permanent. Our platform includes transparent correction
                                mechanisms so users and institute owners can fix errors and resubmit for review.
                            </p>
                        </div>

                        <div className="rejectionCardsGrid">
                            <div className="rejectionCard">
                                <div className="rejectionIcon">
                                    <FaUniversity />
                                </div>
                                <h3>Institute Registration Rejection</h3>
                                <ul>
                                    <li>Super Admin reviews the submission and provides a specific reason (e.g. illegible CNIC, missing registration certificate).</li>
                                    <li>The institute owner is informed of the exact requirement that needs correction.</li>
                                    <li>Corrected documents or updated details can be provided through the supported workflow.</li>
                                    <li>Super Admin re-evaluates the submission for final approval.</li>
                                </ul>
                            </div>

                            <div className="rejectionCard">
                                <div className="rejectionIcon">
                                    <FaUserGraduate />
                                </div>
                                <h3>Student Admission Rejection</h3>
                                <ul>
                                    <li>The institute administrator reviews the admission application and documents.</li>
                                    <li>If information or uploaded documents are incomplete or ineligible, a rejection reason is recorded.</li>
                                    <li>The student/applicant can review the specific feedback and correct the rejected fields or re-upload documents.</li>
                                    <li>The corrected application goes back to the institute queue for re-evaluation.</li>
                                </ul>
                            </div>

                            <div className="rejectionCard">
                                <div className="rejectionIcon">
                                    <FaMoneyBillWave />
                                </div>
                                <h3>Payment Proof Rejection</h3>
                                <ul>
                                    <li>Submitted transaction IDs or deposit receipts are checked against institute records.</li>
                                    <li>If the receipt is invalid, unreadable, or mismatched, status becomes <code>REJECTED</code> with an explanation.</li>
                                    <li>The user can upload a clear bank receipt or update the transaction ID.</li>
                                    <li>Payment status returns to <code>SUBMITTED</code> and is reviewed again until marked <code>PAID</code>.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* =========================================
                        FINAL CTA
                    ========================================== */}
                    <section className="howWorksCTA">
                        <div className="howWorksCTAInner">
                            <span>GET STARTED TODAY</span>
                            <h2>Explore Education in Kohat with Confidence</h2>
                            <p>
                                Whether you are a student looking for the right school or college, an eager learner
                                exploring skill courses, or an institute administrator digitizing your operations,
                                DSCH-Edu is here to help.
                            </p>
                            <div className="ctaButtonsRow">
                                <Link to="/school" className="primaryCtaBtn">
                                    Explore Institutes
                                    <FaArrowRight />
                                </Link>
                                <Link to="/register-institute" className="secondaryCtaBtn">
                                    Register Your Institute
                                </Link>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </>
    );
};