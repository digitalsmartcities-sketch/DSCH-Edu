import "./classic_certificate.css";
import { FaUniversity, FaPrint, FaDownload } from "react-icons/fa";

export const ClassicCertificate = ({ student, institute, certificateType }) => {

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


    return (
        <div className="classicCertificatePage">
            <div className="classicCertificate">
                <div className="classicOuterBorder">
                    <div className="classicInnerBorder">
                        <div className="classicHeader">
                            {institute?.instituteLogo ? (
                                <img
                                    className="classicLogo"
                                    src={institute.instituteLogo}
                                    alt="Institute Logo"
                                />
                            ) : (
                                <FaUniversity className="classicLogo" />
                            )}
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
                        <div className="classicTitle">
                            <span>
                                THIS IS TO CERTIFY THAT
                            </span>
                            <h2>
                                {studentName || "Student Name"}
                            </h2>
                            <div></div>
                            <h3>
                                {getTitle()}
                            </h3>
                        </div>
                        <div className="classicBody">
                            {certificateType === "CHARACTER" && (
                                <p>
                                    This is to certify that the above named
                                    student has been associated with our
                                    institution and has demonstrated good
                                    conduct and character during the period
                                    of study.
                                </p>
                            )}
                            {certificateType === "LEAVING" && (
                                <p>
                                    This is to certify that the above named
                                    student has attended this institution
                                    and is hereby granted this School Leaving
                                    Certificate upon completion or withdrawal
                                    from the institution.
                                </p>
                            )}
                            {certificateType === "PROVISIONAL" && (
                                <p>
                                    This is to certify that the above named
                                    student has successfully completed the
                                    required academic requirements and is
                                    hereby issued this Provisional Certificate.
                                </p>
                            )}
                            <div className="classicDetails">
                                <p>
                                    <strong>Class:</strong>{" "}
                                    {student?.class || "N/A"}
                                </p>
                                <p>
                                    <strong>Guardian:</strong>{" "}
                                    {student?.guardianName || "N/A"}
                                </p>
                                <p>
                                    <strong>Date of Issue:</strong>{" "}
                                    {new Date().toLocaleDateString("en-GB")}
                                </p>
                            </div>
                        </div>
                        <div className="classicFooter">
                            <div>
                                <span></span>
                                <p>Principal / Head</p>
                            </div>
                            <div className="classicSeal">
                                OFFICIAL
                                <br />
                                SEAL
                            </div>
                            <div>
                                <span></span>
                                <p>Institution</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="certificateActionsBar">

                <button
                    className="certificatePrintButton"
                    onClick={() => window.print()}
                >
                    <FaPrint />
                    Print Certificate
                </button>

                <button
                    className="certificateDownloadButton"
                    onClick={() => window.print()}
                >
                    <FaDownload />
                    Download PDF
                </button>

            </div>
        </div>
    );
};