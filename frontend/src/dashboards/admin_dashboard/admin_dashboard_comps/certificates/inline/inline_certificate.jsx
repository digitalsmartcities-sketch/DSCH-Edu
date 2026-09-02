import "./inline_certificate.css";
import {
    FaCertificate,
    FaPrint,
    FaDownload
} from "react-icons/fa";

export const InlineCertificate = ({
    student,
    institute,
    certificateType
}) => {

    const getTitle = () => {
        switch (certificateType) {
            case "CHARACTER":
                return "Character Certificate";
            case "LEAVING":
                return "School Leaving Certificate";
            case "PROVISIONAL":
                return "Provisional Certificate";
            default:
                return "Certificate";
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
        <div className="inlineCertificatePage">
            <div className="inlineCertificate">
                <div className="inlineHeader">
                    <div className="inlineHeaderMain">
                        <div className="inlineIcon">
                            {institute?.instituteLogo ? (
                                <img
                                    className="instituteLogoImg"
                                    src={institute.instituteLogo}
                                    alt="Institute Logo"
                                />
                            ) : (
                                <FaCertificate />
                            )}
                        </div>
                        <div>
                            <h1>
                                {institute?.instituteName || "Institute Name"}
                            </h1>
                            <p>
                                {institute?.instituteAddress || "Institute Address"}
                            </p>
                        </div>
                    </div>
                    <span>
                        {institute?.institutePhone || "Institute Phone"}
                    </span>
                </div>
                <div className="inlineTitle">
                    <h2>
                        {getTitle()}
                    </h2>
                    <div></div>
                </div>
                <div className="inlineBody">
                    <p>
                        This is to certify that{" "}
                        <strong>
                            {studentName || "Student Name"}
                        </strong>
                        {certificateType === "CHARACTER" &&
                            " has been a student of this institution and has maintained satisfactory conduct and character."}
                        {certificateType === "LEAVING" &&
                            " has attended this institution and is hereby granted this School Leaving Certificate."}
                        {certificateType === "PROVISIONAL" &&
                            " has fulfilled the relevant academic requirements and is hereby issued this Provisional Certificate."}
                    </p>
                    <div className="inlineInformation">
                        <span>
                            Class:
                            <strong>
                                {student?.class || "N/A"}
                            </strong>
                        </span>
                        <span>
                            Guardian:
                            <strong>
                                {student?.guardianName || "N/A"}
                            </strong>
                        </span>
                        <span>
                            Date:
                            <strong>
                                {new Date().toLocaleDateString("en-GB")}
                            </strong>
                        </span>
                    </div>
                </div>
                <div className="inlineFooter">
                    <div>
                        <span></span>
                        Principal / Head
                    </div>
                    <div>
                        <span></span>
                        Official Stamp
                    </div>
                </div>
            </div>
            {/* =========================================
                ACTION BUTTONS
            ========================================= */}
            <div className="inlineCertificateActions">
                <button
                    className="inlinePrintBtn"
                    onClick={handlePrint}
                >
                    <FaPrint />
                    Print Certificate
                </button>
                <button
                    className="inlineDownloadBtn"
                    onClick={handleDownload}
                >
                    <FaDownload />
                    Download PDF
                </button>
            </div>
        </div>
    );
};