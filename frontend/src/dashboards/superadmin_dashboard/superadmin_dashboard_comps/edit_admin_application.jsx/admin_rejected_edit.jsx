import { useState } from "react";
import {
    FaSave,
    FaTimes,
    FaUpload,
    FaUser,
    FaUniversity,
    FaCreditCard,
    FaFileAlt
} from "react-icons/fa";
import "./admin_rejected_edit.css";
import { updateRejectedAdminApplication } from "../../../../apicalls/superadmin_apicalls";

// Builds the editable form state from the rejected application.
const buildForm = (admin) => ({
    ownerName: admin?.ownerName || "",
    fatherName: admin?.fatherName || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
    cnic: admin?.cnic || "",
    dateOfBirth: admin?.dateOfBirth || "",
    gender: admin?.gender || "",
    address: admin?.address || "",
    city: admin?.city || "",
    province: admin?.province || "",
    instituteName: admin?.instituteName || "",
    instituteType: admin?.instituteType || "",
    registrationNumber: admin?.registrationNumber || "",
    establishedYear: admin?.establishedYear || "",
    instituteAddress: admin?.instituteAddress || "",
    instituteCity: admin?.instituteCity || "",
    instituteProvince: admin?.instituteProvince || "",
    institutePhone: admin?.institutePhone || "",
    instituteEmail: admin?.instituteEmail || "",
    website: admin?.website || "",
    paymentMethod: admin?.paymentMethod || "",
    transactionId: admin?.transactionId || "",
});

const buildDocuments = (admin) =>
    (admin?.images || []).map((doc) => ({
        title: doc?.title || "",
        imageUrl: doc?.imageUrl || "",
        publicId: doc?.publicId || "",
        file: null,
    }));

// Newly selected files use a blob URL, so the file type is checked first.
const isPdfDocument = (document) =>
    document?.file?.type === "application/pdf" ||
    (typeof document?.imageUrl === "string" &&
        document.imageUrl.split("?")[0].toLowerCase().endsWith(".pdf"));

export const AdminRejectedEdit = ({ admin, loading, onCancel }) => {
    // The application is already loaded when this form is rendered, so the
    // state can be initialised directly instead of being synced in an effect.
    const [form, setForm] = useState(() => buildForm(admin));

    const [documents, setDocuments] = useState(() => buildDocuments(admin));

    let [editedFields, setEditedFields] = useState({});
    let [editedDoc, setEditedDoc] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setEditedFields((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDocumentChange = (index, file, title) => {
        if (!file) return;

        setDocuments((prev) =>
            prev.map((doc, i) =>
                i === index
                    ? {
                        ...doc,
                        file,
                        imageUrl: URL.createObjectURL(file)
                    }
                    : doc
            )
        );

        setEditedDoc((prev) => {
            const existingIndex = prev.findIndex(
                (doc) => doc.title === title
            );

            if (existingIndex !== -1) {
                return prev.map((doc, i) =>
                    i === existingIndex
                        ? { title, file }
                        : doc
                );
            }

            return [
                ...prev,
                { title, file }
            ];
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        const fields = {
            ...editedFields,
            id: admin._id
        };

        formData.append(
            "editedFields",
            JSON.stringify(fields)
        );

        editedDoc.forEach((doc) => {
            if (doc.file instanceof File) {
                formData.append("editedDoc", doc.file);
                formData.append("editedDocTitles", doc.title);
            }
        });

        updateRejectedAdminApplication(
            formData,
            onCancel
        );
    };

    return (
        <form
            className="adminRejectedEditPage"
            onSubmit={handleSubmit}
        >
            {/* =========================================
                HEADER
            ========================================= */}
            <div className="rejectedEditHeader">
                <div>
                    <span>
                        CORRECTION MODE
                    </span>
                    <h1>
                        Edit Rejected Application
                    </h1>
                    <p>
                        Update the information or documents provided
                        by the applicant before resubmitting the application.
                    </p>
                </div>
                <div className="rejectedEditBadge">
                    REJECTED
                </div>
            </div>
            {/* =========================================
                OWNER INFORMATION
            ========================================= */}
            <section className="rejectedEditCard">
                <SectionHeader
                    icon={<FaUser />}
                    title="Owner Information"
                    description="Correct the service provider information."
                />
                <div className="rejectedEditGrid">
                    <Field
                        label="Owner Name"
                        name="ownerName"
                        value={form.ownerName}
                        onChange={handleChange}
                    />
                    <Field
                        label="Father Name"
                        name="fatherName"
                        value={form.fatherName}
                        onChange={handleChange}
                    />
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Field
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <Field
                        label="CNIC"
                        name="cnic"
                        value={form.cnic}
                        onChange={handleChange}
                    />
                    <Field
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                    />
                    <SelectField
                        label="Gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        options={["MALE", "FEMALE", "OTHER"]}
                    />
                    <Field
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                    />
                    <Field
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        full
                    />
                </div>
            </section>
            {/* =========================================
                INSTITUTE INFORMATION
            ========================================= */}
            <section className="rejectedEditCard">
                <SectionHeader
                    icon={<FaUniversity />}
                    title="Institute Information"
                    description="Correct the submitted institute details."
                />
                <div className="rejectedEditGrid">
                    <Field
                        label="Institute Name"
                        name="instituteName"
                        value={form.instituteName}
                        onChange={handleChange}
                    />
                    <SelectField
                        label="Institute Type"
                        name="instituteType"
                        value={form.instituteType}
                        onChange={handleChange}
                        options={[
                            "school",
                            "college",
                            "academy",
                            "university"
                        ]}
                    />
                    <Field
                        label="Registration Number"
                        name="registrationNumber"
                        value={form.registrationNumber}
                        onChange={handleChange}
                    />
                    <Field
                        label="Established Year"
                        name="establishedYear"
                        value={form.establishedYear}
                        onChange={handleChange}
                    />
                    <Field
                        label="Institute Phone"
                        name="institutePhone"
                        value={form.institutePhone}
                        onChange={handleChange}
                    />
                    <Field
                        label="Institute Email"
                        name="instituteEmail"
                        type="email"
                        value={form.instituteEmail}
                        onChange={handleChange}
                    />
                    <Field
                        label="Institute City"
                        name="instituteCity"
                        value={form.instituteCity}
                        onChange={handleChange}
                    />
                    <Field
                        label="Institute Province"
                        name="instituteProvince"
                        value={form.instituteProvince}
                        onChange={handleChange}
                    />
                    <Field
                        label="Website"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                    />
                    <Field
                        label="Institute Address"
                        name="instituteAddress"
                        value={form.instituteAddress}
                        onChange={handleChange}
                        full
                    />
                </div>
            </section>
            {/* =========================================
                PAYMENT INFORMATION
            ========================================= */}
            <section className="rejectedEditCard">
                <SectionHeader
                    icon={<FaCreditCard />}
                    title="Registration Payment"
                    description="Correct payment information if required."
                />
                <div className="rejectedEditGrid">
                    <SelectField
                        label="Payment Method"
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        options={[
                            "BANK_TRANSFER",
                            "JAZZCASH",
                            "EASYPAISA",
                            "OTHER"
                        ]}
                    />
                    <Field
                        label="Transaction ID"
                        name="transactionId"
                        value={form.transactionId}
                        onChange={handleChange}
                    />
                </div>
            </section>
            {/* =========================================
                DOCUMENTS
            ========================================= */}
            <section className="rejectedEditCard">
                <SectionHeader
                    icon={<FaFileAlt />}
                    title="Submitted Documents"
                    description="Replace documents that were incorrect or unclear."
                />
                <div className="rejectedDocumentsGrid">
                    {documents.map((document, index) => (
                        <div
                            className="rejectedDocument"
                            key={index}
                        >
                            <div className="rejectedDocumentHeader">
                                <div>
                                    <span>
                                        Document {index + 1}
                                    </span>
                                    <h3>
                                        {document.title ||
                                            `Document ${index + 1}`}
                                    </h3>
                                </div>
                            </div>
                            <div className="rejectedDocumentPreview">
                                {!document.imageUrl ? (
                                    <div className="noDocumentPreview">
                                        No document
                                    </div>
                                ) : isPdfDocument(document) ? (
                                    <div className="noDocumentPreview">
                                        <a
                                            href={document.imageUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img
                                        src={document.imageUrl}
                                        alt={document.title}
                                    />
                                )}
                            </div>
                            <label className="replaceDocumentBtn">
                                <FaUpload />
                                Replace Document
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) =>
                                        handleDocumentChange(
                                            index,
                                            e.target.files?.[0],
                                            document.title
                                        )
                                    }
                                    hidden
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </section>
            {/* =========================================
                ACTIONS
            ========================================= */}
            <div className="rejectedEditActions">
                <button
                    type="button"
                    className="rejectedCancelBtn"
                    onClick={onCancel}
                    disabled={loading}
                >
                    <FaTimes />
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rejectedSaveBtn"
                    disabled={loading}
                >
                    <FaSave />
                    {loading
                        ? "Saving..."
                        : "Save Corrections"}
                </button>
            </div>
        </form>
    );
};


/* =========================================
   SECTION HEADER
========================================= */

const SectionHeader = ({ icon, title, description }) => (
    <div className="rejectedSectionHeader">

        <div className="rejectedSectionIcon">
            {icon}
        </div>

        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>

    </div>
);


/* =========================================
   FIELD
========================================= */

const Field = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    full = false
}) => (
    <div className={`rejectedFormGroup ${full ? "full" : ""}`}>

        <label>
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
        />

    </div>
);


/* =========================================
   SELECT
========================================= */

const SelectField = ({
    label,
    name,
    value,
    onChange,
    options
}) => (
    <div className="rejectedFormGroup">

        <label>
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
        >

            <option value="">
                Select {label}
            </option>

            {options.map((option) => (
                <option
                    key={option}
                    value={option}
                >
                    {option}
                </option>
            ))}

        </select>

    </div>
);