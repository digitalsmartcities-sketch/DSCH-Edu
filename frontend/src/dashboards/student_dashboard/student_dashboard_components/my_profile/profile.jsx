import { useEffect, useState } from "react";
import {
    FaUser,
    FaPhone,
    FaGraduationCap,
    FaIdCard,
    FaSave
} from "react-icons/fa";
import { getStudentProfile, updateStudentProfile } from "../../../../apicalls/student_apicalls";
import "./profile.css";

export const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving] = useState(false);
    const [changed, setChanged] = useState(false);
    const [changes, setChanges] = useState({});

    useEffect(() => {
        getStudentProfile(setStudent, setLoading);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setStudent((prev) => ({
            ...prev,
            [name]: value
        }));

        setChanges((prev) => ({
            ...prev,
            [name]: value
        }));

        setChanged(true);
    };

    const handleGuardianChange = (e) => {
        const { name, value } = e.target;

        setStudent((prev) => ({
            ...prev,
            [name]: value
        }));

        setChanges((prev) => ({
            ...prev,
            [name]: value
        }));

        setChanged(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (changed) {
            updateStudentProfile(changes, setLoading, setStudent);
        }
    };

    if (loading) {
        return (
            <div className="studentProfileLoading">
                <div className="studentProfileLoader"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="studentProfileEmpty">
                <FaUser />
                <h2>Profile Not Found</h2>
                <p>We could not load your profile information.</p>
            </div>
        );
    }

    const fullName =
        `${student.firstName || ""} ${student.lastName || ""}`.trim();

    return (
        <div className="studentProfilePage">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="studentProfileHeader">
                <div>
                    <span className="studentProfileEyebrow">
                        ACCOUNT SETTINGS
                    </span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        View and update your personal and contact information.
                    </p>
                </div>

                <div className="studentProfileBadge">
                    <FaUser />
                    Student Profile
                </div>
            </div>


            <form onSubmit={handleSave}>

                {/* =========================================
                    PROFILE OVERVIEW
                ========================================= */}

                <section className="studentProfileCard profileOverviewCard">

                    <div className="studentProfileAvatar">
                        {student.firstName?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div className="profileOverviewInfo">
                        <h2>
                            {fullName || "Student"}
                        </h2>

                        <p>
                            {student.email || "Email not available"}
                        </p>

                        <div className="profileOverviewMeta">
                            <span>
                                Class: {student.class || "Not assigned"}
                            </span>

                            <span className="activeStatus">
                                {student.status || "INACTIVE"}
                            </span>
                        </div>
                    </div>

                </section>


                {/* =========================================
                    PERSONAL INFORMATION
                ========================================= */}

                <section className="studentProfileCard">

                    <div className="profileSectionHeader">

                        <div className="profileSectionIcon green">
                            <FaUser />
                        </div>

                        <div>
                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Update your basic personal information.
                            </p>
                        </div>

                    </div>


                    <div className="studentProfileGrid">

                        <ProfileField
                            label="First Name"
                            name="firstName"
                            value={student.firstName}
                            onChange={handleChange}
                            required
                        />

                        <ProfileField
                            label="Last Name"
                            name="lastName"
                            value={student.lastName}
                            onChange={handleChange}
                            required
                        />

                        <ProfileField
                            label="Email"
                            name="email"
                            value={student.email}
                            onChange={handleChange}
                            type="email"
                            required
                        />

                        <ProfileField
                            label="Phone Number"
                            name="phone"
                            value={student.phone}
                            onChange={handleChange}
                            type="tel"
                            required
                        />

                        <ProfileSelect
                            label="Gender"
                            name="gender"
                            value={student.gender}
                            onChange={handleChange}
                            options={[
                                { value: "MALE", label: "Male" },
                                { value: "FEMALE", label: "Female" },
                                { value: "OTHER", label: "Other" }
                            ]}
                        />

                        <ProfileField
                            label="Date of Birth"
                            name="dateOfBirth"
                            value={student.dateOfBirth}
                            onChange={handleChange}
                            type="date"
                            required
                        />

                    </div>

                </section>


                {/* =========================================
                    GUARDIAN INFORMATION
                ========================================= */}

                <section className="studentProfileCard">

                    <div className="profileSectionHeader">

                        <div className="profileSectionIcon blue">
                            <FaPhone />
                        </div>

                        <div>
                            <h2>
                                Guardian Information
                            </h2>

                            <p>
                                Keep your parent or guardian information up to date.
                            </p>
                        </div>

                    </div>


                    <div className="studentProfileGrid">

                        <ProfileField
                            label="Guardian Name"
                            name="guardianName"
                            value={student.guardianName}
                            onChange={handleGuardianChange}
                            required
                        />

                        <ProfileField
                            label="Guardian Phone"
                            name="guardianPhone"
                            value={student.guardianPhone}
                            onChange={handleGuardianChange}
                            type="tel"
                            required
                        />

                        <ProfileField
                            label="Guardian CNIC"
                            name="guardianCnic"
                            value={student.guardianCnic}
                            onChange={handleGuardianChange}
                            required
                        />

                        <ProfileField
                            label="Relation"
                            name="guardianRelation"
                            value={student.guardianRelation}
                            onChange={handleGuardianChange}
                            required
                        />

                    </div>

                </section>


                {/* =========================================
                    ACADEMIC BACKGROUND
                ========================================= */}

                <section className="studentProfileCard">

                    <div className="profileSectionHeader">

                        <div className="profileSectionIcon purple">
                            <FaGraduationCap />
                        </div>

                        <div>
                            <h2>
                                Academic Background
                            </h2>

                            <p>
                                Your previous educational information.
                            </p>
                        </div>

                    </div>


                    <div className="studentProfileGrid">

                        <ProfileField
                            label="Previous School"
                            name="previousSchool"
                            value={student.previousSchool}
                            onChange={handleChange}
                        />

                        <ProfileField
                            label="Last Qualification"
                            name="lastQualification"
                            value={student.lastQualification}
                            onChange={handleChange}
                        />

                        <ProfileField
                            label="Obtained Marks"
                            name="obtainedMarks"
                            value={student.obtainedMarks}
                            onChange={handleChange}
                            type="number"
                        />

                        <ProfileField
                            label="Total Marks"
                            name="totalMarks"
                            value={student.totalMarks}
                            onChange={handleChange}
                            type="number"
                        />

                        <ProfileField
                            label="Passing Year"
                            name="passingYear"
                            value={student.passingYear}
                            onChange={handleChange}
                            type="number"
                        />

                    </div>

                </section>


                {/* =========================================
                    ACCOUNT INFORMATION
                ========================================= */}

                <section className="studentProfileCard">

                    <div className="profileSectionHeader">

                        <div className="profileSectionIcon orange">
                            <FaIdCard />
                        </div>

                        <div>
                            <h2>
                                Account Information
                            </h2>

                            <p>
                                System-managed information about your account.
                            </p>
                        </div>

                    </div>


                    <div className="studentProfileGrid">

                        <ReadOnlyField
                            label="Student ID"
                            value={student._id}
                        />

                        <ReadOnlyField
                            label="Class"
                            value={student.class ? `Class ${student.class}` : null}
                        />

                        <ReadOnlyField
                            label="Account Status"
                            value={student.status}
                        />

                        <ReadOnlyField
                            label="Admission Status"
                            value={student.admissionApplication}
                        />

                    </div>

                </section>

                {/* =========================================
                    SAVE BAR
                ========================================= */}

                <div className="studentProfileSaveBar">

                    <div>
                        <strong>
                            Profile changes
                        </strong>

                        <span>
                            Make sure your information is accurate before saving.
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="saveStudentProfileBtn"
                        disabled={!changed || saving}
                    >
                        <FaSave />

                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
};


/* =========================================
   EDITABLE FIELD
========================================= */

const ProfileField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false
}) => {
    return (
        <div className="studentProfileField">

            <label>
                {label}

                {required && (
                    <span>*</span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
            />

        </div>
    );
};


/* =========================================
   SELECT FIELD
========================================= */

const ProfileSelect = ({
    label,
    name,
    value,
    onChange,
    options
}) => {
    return (
        <div className="studentProfileField">

            <label>
                {label}
            </label>

            <select
                name={name}
                value={value ?? ""}
                onChange={onChange}
            >

                <option value="">
                    Select {label}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}

            </select>

        </div>
    );
};


/* =========================================
   READ ONLY FIELD
========================================= */

const ReadOnlyField = ({ label, value }) => {
    return (
        <div className="studentProfileField">

            <label>
                {label}
            </label>

            <input
                type="text"
                value={value ?? "Not available"}
                readOnly
            />

        </div>
    );
};