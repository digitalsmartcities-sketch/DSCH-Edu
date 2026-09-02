import {
    FaAward,
    FaCheckCircle,
    FaGraduationCap,
    FaPrint,
    FaUniversity
} from "react-icons/fa";
import "./course_certificate.css";
import { useEffect } from "react";
import { useState } from "react";
import { getCertificateData } from "../../../../../apicalls/superadmin_apicalls";

export const CourseCertificate = ({ id, onClose }) => {
    const [student, setStudent] = useState(null);
    const [course, setCourse] = useState(null);
    useEffect(() => {
        getCertificateData(id, setStudent, setCourse)
    }, [id])
    const studentName = student?.fullName;
    const issueDate = course?.certificateIssuedAt
        ? new Date(course.certificateIssuedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "N/A";

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="courseCertificatePage">
            {/* =========================================
                ACTION BAR
            ========================================== */}
            <div className="certificateActionBar noPrint">
                {onClose && (
                    <button
                        type="button"
                        className="certificateCloseBtn"
                        onClick={onClose}
                    >
                        Close
                    </button>
                )}
                <button
                    type="button"
                    className="certificatePrintBtn"
                    onClick={handlePrint}
                >
                    <FaPrint />
                    Print Certificate
                </button>
            </div>
            {/* =========================================
                CERTIFICATE
            ========================================== */}
            <div className="courseCertificate">
                {/* =====================================
                    OUTER FRAME
                ====================================== */}
                <div className="certificateOuterFrame">
                    <div className="certificateInnerFrame">
                        {/* Decorative corners */}
                        <span className="certificateCorner topLeft"></span>
                        <span className="certificateCorner topRight"></span>
                        <span className="certificateCorner bottomLeft"></span>
                        <span className="certificateCorner bottomRight"></span>
                        {/* =================================
                            HEADER
                        ================================== */}
                        <header className="certificateHeader">
                            <div className="certificateLogoArea">
                                {
                                    course?.offeredByInstituteLogoUrl ? (
                                        <img
                                            src={
                                                course.offeredByInstituteLogoUrl
                                            }
                                            alt={
                                                course?.offeredByInstitute ||
                                                "Institute"
                                            }
                                            className="certificateInstituteLogo"
                                        />
                                    ) : (
                                        <div className="certificateInstituteLogoPlaceholder">
                                            <FaUniversity />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="certificateInstitute">
                                <span className="certificatePlatform">
                                    DIGITAL SMART CITY HUB
                                </span>
                                <h1>
                                    {
                                        course?.offeredByInstitute ||
                                        "Institute Name"
                                    }
                                </h1>
                                <p>
                                    Education & Professional Learning
                                </p>
                            </div>
                            <div className="certificateSeal">
                                <FaAward />
                                <span>
                                    DSCH
                                </span>
                            </div>
                        </header>
                        {/* =================================
                            TITLE
                        ================================== */}
                        <section className="certificateTitleSection">
                            <div className="certificateSmallTitle">
                                CERTIFICATE OF COMPLETION
                            </div>
                            <div className="certificateTitleLine">
                                <span></span>
                                <FaGraduationCap />
                                <span></span>
                            </div>
                            <h2>
                                Certificate
                            </h2>
                            <p>
                                This certificate is proudly presented to
                            </p>
                        </section>
                        {/* =================================
                            STUDENT NAME
                        ================================== */}
                        <section className="certificateRecipient">
                            <h3>
                                {studentName || "Recipient Name"}
                            </h3>
                            <div className="recipientUnderline"></div>
                        </section>
                        {/* =================================
                            DESCRIPTION
                        ================================== */}
                        <section className="certificateStatement">
                            <p>
                                for successfully completing the course
                            </p>
                            <h4>
                                {
                                    course?.title ||
                                    "Course Title"
                                }
                            </h4>
                            <p className="certificateCompletionText">
                                This certificate recognizes the successful
                                completion of the required learning activities
                                and course requirements.
                            </p>
                        </section>
                        {/* =================================
                            COURSE META
                        ================================== */}
                        <div className="certificateCourseMeta">
                            <div>
                                <span>
                                    COURSE CODE
                                </span>
                                <strong>
                                    {course?.courseCode || "N/A"}
                                </strong>
                            </div>
                            <div>
                                <span>
                                    DATE OF ISSUE
                                </span>
                                <strong>
                                    {issueDate}
                                </strong>
                            </div>
                            <div>
                                <span>
                                    PROVIDER
                                </span>
                                <strong>
                                    {
                                        course?.offeredByInstitute ||
                                        "Institute Name"
                                    }
                                </strong>
                            </div>
                        </div>
                        {/* =================================
                            FOOTER / SIGNATURES
                        ================================== */}
                        <footer className="certificateFooter">
                            <div className="certificateSignature">
                                <div className="signatureLine"></div>
                                <strong>
                                    Instructor
                                </strong>
                                <span>
                                    Institute
                                </span>
                            </div>
                            <div className="certificateFooterSeal">
                                <div className="footerSealCircle">
                                    <FaCheckCircle />
                                </div>
                                <span>
                                    VERIFIED
                                </span>
                            </div>
                            <div className="certificateSignature">
                                <div className="signatureLine"></div>
                                <strong>
                                    DSCH Education
                                </strong>
                                <span>
                                    Digital Smart City Hub
                                </span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};