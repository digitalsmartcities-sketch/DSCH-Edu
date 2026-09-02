import { useParams } from "react-router-dom"
import { Navbar } from "../../components/navbar/navbar"
import "./admission_form.css"
import { AdmissionSubmissionApi, getPublishedInstituteById } from "../../apicalls/public_apicalls";
import { useEffect, useState } from "react";
export const AdmissionForm = () => {
    const { id } = useParams();
    let [instData, setInstData] = useState(null);
    let [loading, setLoading] = useState(false);
    let [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
    let [message, setMessage] = useState({
        text: null,
        type: null
    });

    useEffect(() => {
        if (id) {
            getPublishedInstituteById(id, setInstData, setMessage, setLoading);
        }
    }, [id]);

    // ================================
    // Admission Handler
    // ================================

    const [admissionData, setAdmissionData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",

        previousSchool: "",
        lastQualification: "",
        obtainedMarks: "",
        totalMarks: "",
        passingYear: "",
        applyingFor: "",

        guardianName: "",
        guardianPhone: "",
        guardianCnic: "",
        guardianRelation: "",

        agreement: false
    });

    const [admissionFiles, setAdmissionFiles] = useState({
        studentPhoto: null,
        cnicBForm: null,
        previousSchoolCertificate: null
    });

    const handleFormFieldsChange = (e) => {
        let { name, value } = e.target;
        setAdmissionData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        if (instData?.academicPrograms?.filter((v) => v.class === admissionData.applyingFor)[0]?.admissionStatus === "CLOSE") {
            setMessage({
                text: `Selected Program (${admissionData.applyingFor}) is not accepting admissions`,
                type: "error"
            });
            setDisableSubmitBtn(true);
            return;
        }
        setMessage({
            text: null,
            type: null
        });
        setDisableSubmitBtn(false);
    }, [admissionData.applyingFor, instData?.academicPrograms]);

    const handleAdmissionFiles = (e) => {
        let { name, files } = e.target;
        setAdmissionFiles((prev) => ({
            ...prev,
            [name]: files[0]
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        for (const key in admissionData) {
            if (key == "obtainedMarks" || key == "totalMarks" || key == "passingYear") {
                if (admissionData[key] == "") {
                    formData.append(key, "0");
                    continue;
                }
            }

            if (key === "applyingFor" && (admissionData[key] == null || admissionData[key] == "Select Class / Program")) {
                setMessage({
                    text: `Please select a program`,
                    type: "error"
                });
                return;
            }

            if (admissionData[key] === "") {
                setMessage({
                    text: `Please fill ${key}`,
                    type: "error"
                })
                return;
            }
            formData.append(key, admissionData[key])
        }

        for (const key in admissionFiles) {
            if (key == "previousSchoolCertificate" && (admissionData.previousSchool === "N/A" || admissionData.lastQualification === "N/A")) {
                continue;
            }
            if (!admissionFiles[key]) {
                setMessage({
                    text: `Please upload ${key}`,
                    type: "error"
                });
                return;
            }

            formData.append(key, admissionFiles[key]);
        }
        formData.append("instituteId", instData._id);
        formData.append("instituteName", instData.instituteName);
        formData.append("instituteType", instData.instituteType);
        formData.append("adminId", instData.adminId);
        formData.append("admissionFee", instData?.academicPrograms?.filter((v) => v.class === admissionData.applyingFor)[0]?.admissionFee);
        formData.append("monthlyFee", instData?.academicPrograms?.filter((v) => v.class === admissionData.applyingFor)[0]?.monthlyFee);
        AdmissionSubmissionApi(formData, setLoading, setMessage);
    }
    return (
        <>
            <Navbar />
            {/* =========================================
                APPLICATION FORM
            ========================================= */}
            <section className="applicationSection">
                <div className="container">
                    <div className="applicationForm">
                        <div className="applicationHeader">
                            <span>Admission Application</span>
                            <h2>Student Information</h2>
                            <p>
                                Complete the information below to submit your admission request.<br />
                                Please ensure all details are accurate, as they will be used for admission and your student portal.<br />
                                Review carefully before submitting.
                            </p>
                        </div>
                        {/* PERSONAL INFORMATION */}
                        <div className="formSection">
                            <h3>Personal Information</h3>
                            <div className="formGrid">
                                <div className="inputGroup">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={admissionData.firstName} onChange={handleFormFieldsChange} placeholder="Enter first name" />
                                </div>
                                <div className="inputGroup">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={admissionData.lastName} onChange={handleFormFieldsChange} placeholder="Enter last name" />
                                </div>
                                <div className="inputGroup">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={admissionData.email} onChange={handleFormFieldsChange} placeholder="Enter email" />
                                </div>
                                <div className="inputGroup">
                                    <label>Phone Number</label>
                                    <input type="text" name="phone" value={admissionData.phone} onChange={handleFormFieldsChange} placeholder="+92" />
                                </div>
                                <div className="inputGroup">
                                    <label>Gender</label>
                                    <select name="gender" value={admissionData.gender} onChange={handleFormFieldsChange}>
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="inputGroup">
                                    <label>Date of Birth</label>
                                    <input type="date" name="dateOfBirth" value={admissionData.dateOfBirth} onChange={handleFormFieldsChange} />
                                </div>
                            </div>
                        </div>
                        {/* ACADEMIC INFORMATION */}
                        <div className="formSection">
                            <h3>Academic Information</h3>
                            <div className="formGrid">
                                <div className="inputGroup">
                                    <label>Previous School</label>
                                    <input type="text" name="previousSchool" placeholder="If fresh to education, write N/A" value={admissionData.previousSchool} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Last Qualification</label>
                                    <input type="text" name="lastQualification" placeholder="If fresh to education, write N/A" value={admissionData.lastQualification} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Obtained Marks</label>
                                    <input type="number" name="obtainedMarks" disabled={admissionData.lastQualification == "N/A"} value={(admissionData.lastQualification == "N/A") ? 0 : admissionData.obtainedMarks} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Total Marks</label>
                                    <input type="number" name="totalMarks" disabled={admissionData.lastQualification == "N/A"} value={(admissionData.lastQualification == "N/A") ? 0 : admissionData.totalMarks} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Passing Year</label>
                                    <input type="text" name="passingYear" disabled={admissionData.lastQualification == "N/A"} value={(admissionData.lastQualification == "N/A") ? 0 : admissionData.passingYear} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Applying For</label>
                                    <select name="applyingFor" value={admissionData.applyingFor} onChange={handleFormFieldsChange}>
                                        <option value={null}>Select Class / Program</option>
                                        {
                                            instData?.academicPrograms?.map((program, index) => (
                                                <option key={index}>{program.class}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* GUARDIAN INFORMATION */}
                        <div className="formSection">
                            <h3>Guardian Information</h3>
                            <div className="formGrid">
                                <div className="inputGroup">
                                    <label>Father / Guardian Name</label>
                                    <input type="text" name="guardianName" value={admissionData.guardianName} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Guardian Phone</label>
                                    <input type="text" name="guardianPhone" value={admissionData.guardianPhone} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Guardian CNIC</label>
                                    <input type="text" name="guardianCnic" value={admissionData.guardianCnic} onChange={handleFormFieldsChange} />
                                </div>
                                <div className="inputGroup">
                                    <label>Guardian Relationship</label>
                                    <input type="text" name="guardianRelation" value={admissionData.guardianRelation} onChange={handleFormFieldsChange} />
                                </div>
                            </div>
                        </div>
                        {/* DOCUMENTS */}
                        <div className="formSection">
                            <h3>Required Documents</h3>
                            <div className="uploadGrid">
                                <div className="uploadBox">
                                    <label>Student Photo</label>
                                    <input type="file" name="studentPhoto" onChange={handleAdmissionFiles} />
                                </div>
                                <div className="uploadBox">
                                    <label>CNIC / B-Form</label>
                                    <input type="file" name="cnicBForm" onChange={handleAdmissionFiles} />
                                </div>
                                {
                                    (admissionData.previousSchool !== "N/A" && admissionData.lastQualification !== "N/A") ? (
                                        <div className="uploadBox">
                                            <label>Previous School Certificate</label>
                                            <input type="file" name="previousSchoolCertificate" onChange={handleAdmissionFiles} />
                                        </div>
                                    ) :
                                        <></>
                                }
                            </div>
                        </div>
                        {/* TERMS */}
                        <div className="termsBox">
                            <input
                                type="checkbox"
                                id="agreement"
                                name="agreement"
                                checked={admissionData.agreement}
                                onChange={(e) => {
                                    setAdmissionData((prev) => ({
                                        ...prev,
                                        agreement: e.target.checked
                                    }));
                                }}
                            />
                            <label htmlFor="agreement">
                                I confirm that all information provided above is accurate. I understand that submitting this application does not guarantee admission.
                            </label>
                        </div>
                        {/* BUTTON */}
                        {
                            message.text
                                ?
                                <p className={`message ${message.type === "success" ? "success" : "error"}`}>{message.text}</p>
                                :
                                <></>
                        }
                        <button className="submitApplicationBtn" disabled={loading || disableSubmitBtn} onClick={handleSubmit}>
                            {loading ? "Applying..." : "Submit Admission Application"}
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}