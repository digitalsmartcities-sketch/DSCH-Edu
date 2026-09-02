import "./modern_certificate.css";
import {
    FaGraduationCap,
    FaUniversity,
    FaPrint,
    FaDownload
} from "react-icons/fa";

export const ModernCertificate = ({
    student,
    institute,
    certificateType
}) => {

    const getTitle = () => {
        switch (certificateType) {
            case "CHARACTER":
                return "CHARACTER CERTIFICATE";
            case "LEAVING":
                return "SCHOOL LEAVING CERTIFICATE";
            case "PROVISIONAL":
                return "PROVISIONAL CERTIFICATE";
            default:
                return "CERTIFICATE";
        }
    };

    const studentName =
        `${student?.firstName || ""} ${student?.lastName || ""}`.trim();

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="modernCertificatePage">
            <div className="modernCertificate">
                <div className="modernTopAccent"></div>
                <div className="modernHeader">
                    <div className="modernLogo">
                        {institute?.logo
                            ? <img src={institute.logo} alt="Institute Logo" />
                            : <FaUniversity />
                        }
                    </div>
                    <div className="modernInstitute">
                        <h1>
                            {institute?.instituteName || "Institute Name"}
                        </h1>
                        <p>
                            {institute?.instituteAddress || "Institute Address"}
                        </p>
                        <span>
                            {institute?.institutePhone || "Institute Phone"}
                        </span>
                    </div>
                </div>
                <div className="modernCertificateLabel">
                    <span>
                        OFFICIAL DOCUMENT
                    </span>
                    <h2>
                        {getTitle()}
                    </h2>
                </div>
                <div className="modernCertificateBody">
                    <p className="modernOpening">
                        This is to certify that
                    </p>
                    <h3 className="modernStudentName">
                        {studentName || "Student Name"}
                    </h3>
                    <div className="modernUnderline"></div>
                    <p className="modernText">
                        {certificateType === "CHARACTER" &&
                            `has been a student of ${institute?.instituteName || "the institution"} and has maintained good conduct and character during the period of study.`}
                        {certificateType === "LEAVING" &&
                            `has completed the required academic period at ${institute?.instituteName || "the institution"} and is hereby granted this School Leaving Certificate.`}
                        {certificateType === "PROVISIONAL" &&
                            `has successfully completed the required academic requirements and is hereby issued this Provisional Certificate.`}
                    </p>
                    <div className="modernStudentDetails">
                        <div>
                            <span>
                                Class
                            </span>
                            <strong>
                                {student?.class || "N/A"}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Guardian
                            </span>
                            <strong>
                                {student?.guardianName || "N/A"}
                            </strong>
                        </div>
                        <div>
                            <span>
                                Issue Date
                            </span>
                            <strong>
                                {new Date().toLocaleDateString("en-GB")}
                            </strong>
                        </div>
                    </div>
                </div>
                <div className="modernFooter">
                    <div className="modernSignature">
                        <div></div>
                        <span>
                            Principal / Head
                        </span>
                    </div>
                    <div className="modernCertificateIcon">
                        <FaGraduationCap />
                    </div>
                    <div className="modernSignature">
                        <div></div>
                        <span>
                            Official Stamp
                        </span>
                    </div>
                </div>
                <div className="modernBottomAccent"></div>
            </div>
            {/* =========================================
                ACTION BUTTONS
            ========================================= */}
            <div className="modernCertificateActions">
                <button
                    className="modernPrintBtn"
                    onClick={handlePrint}
                >
                    <FaPrint />
                    Print Certificate
                </button>
                <button
                    className="modernDownloadBtn"
                    onClick={handleDownload}
                >
                    <FaDownload />
                    Download PDF
                </button>
            </div>
        </div>
    );
};