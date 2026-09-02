import { useEffect, useState } from "react";
import {
    FaCertificate,
    FaSearch,
    FaUserGraduate,
    FaFilter,
    FaChevronDown
} from "react-icons/fa";
import "./certificates.css";
import { getInstituteStudents } from "../../../../apicalls/admin_apicalls";
import { SelectTemplate } from "./template_selector/select_template";
import { CertificateRenderer } from "./certificate_renderer";

export const Certificates = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState({
        studentId: null,
        certificateType: null,
        template: null
    });

    useEffect(() => {
        getInstituteStudents(setStudents, setLoading);
    }, []);

    const filteredStudents = students.filter((student) => {
        const name =
            `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();

        const searchMatch =
            name.includes(search.toLowerCase()) ||
            (student.email || "").toLowerCase().includes(search.toLowerCase());

        const classMatch =
            classFilter === "ALL" ||
            String(student.class) === String(classFilter);

        return searchMatch && classMatch;
    });

    if (selectedCertificate.studentId && selectedCertificate.certificateType && selectedCertificate.template) {
        return (
            <CertificateRenderer
                studentId={selectedCertificate.studentId}
                certificateType={selectedCertificate.certificateType}
                template={selectedCertificate.template}
            />
        );
    }

    if (selectedCertificate.studentId && selectedCertificate.certificateType) {
        return (
            <SelectTemplate
                certificateType={selectedCertificate.certificateType}
                setSelectedCertificate={setSelectedCertificate}
                onCancel={() => setSelectedCertificate({ studentId: null, certificateType: null, template: null })} />
        );
    }

    return (
        <div className="adminCertificatesPage">
            {/* HEADER */}
            <div className="adminCertificatesHeader">
                <div>
                    <span className="adminCertificatesEyebrow">
                        DOCUMENT MANAGEMENT
                    </span>
                    <h1>
                        Student Certificates
                    </h1>
                    <p>
                        View students and generate their certificates.
                    </p>
                </div>
                <div className="certificateSummary">
                    <div className="certificateSummaryIcon">
                        <FaCertificate />
                    </div>
                    <div>
                        <strong>
                            {students.length}
                        </strong>
                        <span>
                            Students
                        </span>
                    </div>
                </div>
            </div>
            {/* FILTERS */}
            <section className="certificateFilterCard">
                <div className="certificateFilterTitle">
                    <div className="certificateFilterIcon">
                        <FaFilter />
                    </div>
                    <div>
                        <h2>
                            Find Student
                        </h2>
                        <p>
                            Search by name or filter students by class.
                        </p>
                    </div>
                </div>
                <div className="certificateFilters">
                    <div className="certificateSearch">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search student name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="certificateSelect">
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            <option value="ALL">
                                All Classes
                            </option>
                            <option value="PlayGroup">
                                PlayGroup
                            </option>
                            {Array.from(
                                { length: 10 },
                                (_, index) => index + 1
                            ).map((item) => (
                                <option
                                    value={item}
                                    key={item}
                                >
                                    Class {item}
                                </option>
                            ))}
                        </select>
                        <FaChevronDown />
                    </div>
                </div>
            </section>
            {/* TABLE */}
            <section className="certificatesTableCard">
                <div className="certificatesTableHeader">
                    <div>
                        <h2>
                            Students
                        </h2>
                        <p>
                            {filteredStudents.length} student
                            {filteredStudents.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>
                <div className="certificatesTableWrapper">
                    <table className="certificatesTable">
                        <thead>
                            <tr>
                                <th>
                                    #
                                </th>
                                <th>
                                    Student
                                </th>
                                <th>
                                    Class
                                </th>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Certificate Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="certificatesLoadingCell"
                                    >
                                        Loading students...
                                    </td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={student._id}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            <div className="certificateStudentInfo">
                                                <div className="certificateStudentAvatar">
                                                    {student.firstName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "S"}
                                                </div>
                                                <div>
                                                    <strong>
                                                        {student.firstName}{" "}
                                                        {student.lastName}
                                                    </strong>
                                                    <span>
                                                        {student.phone || "Student"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {student.class
                                                ? `Class ${student.class}`
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {student.email || "Not provided"}
                                        </td>
                                        <td>
                                            <span
                                                className={`certificateStudentStatus ${student.status?.toLowerCase()}`}
                                            >
                                                <span></span>
                                                {student.status || "UNKNOWN"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="certificateActions">
                                                <button
                                                    className="certificateActionBtn certificateOne"
                                                    onClick={() => {
                                                        setSelectedCertificate({
                                                            studentId: student._id,
                                                            certificateType: "CHARACTER",
                                                            template: null
                                                        });
                                                    }}
                                                    title="Character Certificate"
                                                >
                                                    <FaCertificate />
                                                    <span>Character Certificate</span>
                                                </button>
                                                <button
                                                    className="certificateActionBtn certificateTwo"
                                                    onClick={() => {
                                                        setSelectedCertificate({
                                                            studentId: student._id,
                                                            certificateType: "LEAVING",
                                                            template: null
                                                        });
                                                    }}
                                                    title="Leaving Certificate"
                                                >
                                                    <FaCertificate />
                                                    <span>Leaving Certificate</span>
                                                </button>
                                                <button
                                                    className="certificateActionBtn certificateThree"
                                                    onClick={() => {
                                                        setSelectedCertificate({
                                                            studentId: student._id,
                                                            certificateType: "PROVISIONAL",
                                                            template: null
                                                        });
                                                    }}
                                                    title="Provisional Certificate"
                                                >
                                                    <FaCertificate />
                                                    <span>Provisional Certificate</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="certificatesEmptyCell"
                                    >
                                        <div className="certificatesEmptyState">
                                            <div className="certificateEmptyIcon">
                                                <FaUserGraduate />
                                            </div>
                                            <h3>
                                                No students found
                                            </h3>
                                            <p>
                                                No students match the
                                                selected search or filter.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};