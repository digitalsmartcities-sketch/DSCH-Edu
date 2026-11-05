import { useEffect, useState } from "react";
import {
    FaBookOpen,
    FaCreditCard,
    FaFileAlt,
    FaFilePdf,
    FaSave,
    FaTimes,
    FaUpload,
    FaUser,
    FaUserShield
} from "react-icons/fa";
import "./student_rejected_edit.css";
import {
    updateRejectedStudentApplication
} from "../../../../apicalls/admin_apicalls";
import notify from "../../../../components/toast/toastBus";

const isPdfDocument = (document) => {
    if (!document) return false;
    if (document.file?.type === "application/pdf") return true;
    return Boolean(
        document.imageUrl &&
        document.imageUrl.split("?")[0].toLowerCase().endsWith(".pdf")
    );
};

export const StudentRejectedEdit = ({
    admission,
    onCancel
}) => {

    const [form, setForm] = useState(() => ({
        firstName: admission?.firstName || "",
        lastName: admission?.lastName || "",
        email: admission?.email || "",
        phone: admission?.phone || "",
        gender: admission?.gender || "",
        dateOfBirth: admission?.dateOfBirth || "",
        previousSchool: admission?.previousSchool || "",
        lastQualification: admission?.lastQualification || "",
        obtainedMarks: admission?.obtainedMarks ?? "",
        totalMarks: admission?.totalMarks ?? "",
        passingYear: admission?.passingYear || "",
        applyingFor: admission?.applyingFor || "",
        guardianName: admission?.guardianName || "",
        guardianPhone: admission?.guardianPhone || "",
        guardianCnic: admission?.guardianCnic || "",
        guardianRelation: admission?.guardianRelation || "",

        // Payment
        paymentMethod: admission?.paymentMethod || "",
        transactionId: admission?.transactionId || "",
        paymentSubmittedAt: admission?.paymentSubmittedAt
            ? new Date(admission.paymentSubmittedAt).toISOString().split("T")[0]
            : ""
    }));

    const [documents, setDocuments] = useState(() =>
        (admission?.documents || []).map((doc) => ({
            title: doc?.title || "",
            imageUrl: doc?.imageUrl || "",
            publicId: doc?.publicId || "",
            file: null
        }))
    );

    const [editedDoc, setEditedDoc] = useState([]);

    const [paymentProof, setPaymentProof] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!admission) {
            notify.error("Admission not found.");
            onCancel?.();
        }
    }, [admission, onCancel]);

    if (!admission) {
        return null;
    }


    /* =====================================================
       WORKFLOW FLAGS
    ===================================================== */

    const applicationRejected =
        admission?.status === "REJECTED";

    const paymentRejected =
        admission?.paymentStatus === "REJECTED";

    const canEdit =
        applicationRejected || paymentRejected;


    /* =====================================================
       FIELD CHANGE
    ===================================================== */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    /* =====================================================
       DOCUMENT CHANGE
    ===================================================== */

    const handleDocumentChange = (
        index,
        file,
        title
    ) => {

        if (!file) return;


        setDocuments((prev) =>
            prev.map((doc, i) =>
                i === index
                    ? {
                        ...doc,
                        file,
                        imageUrl:
                            URL.createObjectURL(file)
                    }
                    : doc
            )
        );


        setEditedDoc((prev) => {

            const existingIndex =
                prev.findIndex(
                    (doc) =>
                        doc.title === title
                );


            if (existingIndex !== -1) {

                return prev.map(
                    (doc, i) =>
                        i === existingIndex
                            ? {
                                title,
                                file
                            }
                            : doc
                );

            }


            return [
                ...prev,
                {
                    title,
                    file
                }
            ];

        });

    };


    /* =====================================================
       PAYMENT PROOF CHANGE
    ===================================================== */

    const handlePaymentProofChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        setPaymentProof(file);

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!canEdit) return;


        const formData =
            new FormData();


        /* =============================================
           BASIC + APPLICATION DATA
        ============================================= */

        const fields = {

            ...form,

            id: admission._id,

            applicationRejected,

            paymentRejected

        };


        formData.append(
            "editedFields",
            JSON.stringify(fields)
        );


        /* =============================================
           REPLACED STUDENT DOCUMENTS
        ============================================= */

        editedDoc.forEach((doc) => {

            if (doc.file instanceof File) {

                formData.append(
                    "editedDoc",
                    doc.file
                );

                formData.append(
                    "editedDocTitles",
                    doc.title
                );

            }

        });


        /* =============================================
           PAYMENT PROOF
        ============================================= */

        if (
            paymentRejected &&
            paymentProof instanceof File
        ) {

            formData.append(
                "paymentProof",
                paymentProof
            );

        }

        updateRejectedStudentApplication(
            formData,
            onCancel,
            setLoading
        );

    };


    return (
        <form
            className="studentRejectedEditPage"
            onSubmit={handleSubmit}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="studentRejectedEditHeader">

                <div>

                    <span>
                        CORRECTION MODE
                    </span>

                    <h1>
                        Edit Rejected Admission
                    </h1>

                    <p>
                        Correct the information or payment details
                        requested by the institute before resubmission.
                    </p>

                </div>


                <div className="studentRejectedBadge">
                    REJECTED
                </div>

            </div>


            {/* =================================================
                REJECTION REASON
            ================================================= */}

            <div className="studentRejectionNotice">

                <strong>
                    Correction Required
                </strong>

                <p>
                    {
                        admission.rejectionReason ||
                        "Please review and correct the submitted information."
                    }
                </p>

            </div>


            {/* =================================================
                STUDENT INFORMATION
            ================================================= */}

            <section className="studentRejectedEditCard">

                <SectionHeader
                    icon={<FaUser />}
                    title="Student Information"
                    description="Correct the personal information submitted by the student."
                />

                <div className="studentRejectedGrid">

                    <Field
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <SelectField
                        label="Gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                        options={[
                            "MALE",
                            "FEMALE",
                            "OTHER"
                        ]}
                    />

                    <Field
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                </div>

            </section>


            {/* =================================================
                ACADEMIC INFORMATION
            ================================================= */}

            <section className="studentRejectedEditCard">

                <SectionHeader
                    icon={<FaBookOpen />}
                    title="Academic Information"
                    description="Correct the student's academic information."
                />

                <div className="studentRejectedGrid">

                    <Field
                        label="Applying For"
                        name="applyingFor"
                        value={form.applyingFor}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Previous School"
                        name="previousSchool"
                        value={form.previousSchool}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Last Qualification"
                        name="lastQualification"
                        value={form.lastQualification}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Obtained Marks"
                        name="obtainedMarks"
                        type="number"
                        value={form.obtainedMarks}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Total Marks"
                        name="totalMarks"
                        type="number"
                        value={form.totalMarks}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Passing Year"
                        name="passingYear"
                        value={form.passingYear}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                </div>

            </section>


            {/* =================================================
                GUARDIAN
            ================================================= */}

            <section className="studentRejectedEditCard">

                <SectionHeader
                    icon={<FaUserShield />}
                    title="Guardian Information"
                    description="Correct the parent or guardian information."
                />

                <div className="studentRejectedGrid">

                    <Field
                        label="Guardian Name"
                        name="guardianName"
                        value={form.guardianName}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Guardian Phone"
                        name="guardianPhone"
                        value={form.guardianPhone}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Guardian CNIC"
                        name="guardianCnic"
                        value={form.guardianCnic}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                    <Field
                        label="Guardian Relation"
                        name="guardianRelation"
                        value={form.guardianRelation}
                        onChange={handleChange}
                        disabled={!applicationRejected}
                    />

                </div>

            </section>


            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <section className="studentRejectedEditCard">

                <SectionHeader
                    icon={<FaFileAlt />}
                    title="Student Documents"
                    description="Replace the documents that require correction."
                />

                <div className="studentRejectedDocuments">

                    {documents.map((doc, index) => (

                        <div
                            className="studentRejectedDocument"
                            key={`${doc.title}-${index}`}
                        >

                            <div className="studentRejectedDocumentHeader">

                                <div>

                                    <span>
                                        Document {index + 1}
                                    </span>

                                    <h3>
                                        {
                                            doc.title ||
                                            `Document ${index + 1}`
                                        }
                                    </h3>

                                </div>

                            </div>


                            <div className="studentRejectedDocumentPreview">

                                {doc.imageUrl ? (

                                    isPdfDocument(doc) ? (

                                        <a
                                            className="studentDocumentPdfLink"
                                            href={doc.imageUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FaFilePdf />
                                            Open PDF
                                        </a>

                                    ) : (

                                        <img
                                            src={doc.imageUrl}
                                            alt={doc.title}
                                        />

                                    )

                                ) : (

                                    <div className="studentNoDocument">
                                        No document available
                                    </div>

                                )}

                            </div>


                            <label
                                className={
                                    applicationRejected
                                        ? "studentReplaceDocumentBtn"
                                        : "studentReplaceDocumentBtn disabled"
                                }
                            >

                                <FaUpload />

                                Replace Document

                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    hidden
                                    disabled={!applicationRejected}
                                    onChange={(e) =>
                                        handleDocumentChange(
                                            index,
                                            e.target.files?.[0],
                                            doc.title
                                        )
                                    }
                                />

                            </label>

                        </div>

                    ))}

                </div>

            </section>


            {/* =================================================
                PAYMENT INFORMATION
            ================================================= */}

            <section className="studentRejectedEditCard">

                <SectionHeader
                    icon={<FaCreditCard />}
                    title="Admission Payment"
                    description="Correct the payment information and replace the payment proof if required."
                />


                <div className="studentPaymentCorrectionStatus">

                    <span>
                        Payment Status
                    </span>

                    <strong className="paymentRejectedLabel">
                        {admission.paymentStatus}
                    </strong>

                </div>


                <div className="studentRejectedGrid">

                    <div className="studentRejectedFormGroup">

                        <label>
                            Payment Method
                        </label>

                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            disabled={!paymentRejected}
                        >

                            <option value="">
                                Select Payment Method
                            </option>

                            <option value="EASYPAISA">
                                EasyPaisa
                            </option>

                            <option value="JAZZCASH">
                                JazzCash
                            </option>

                            <option value="BANK_TRANSFER">
                                Bank Transfer
                            </option>

                            <option value="OTHER">
                                Other
                            </option>

                        </select>

                    </div>


                    <Field
                        label="Transaction ID"
                        name="transactionId"
                        value={form.transactionId}
                        onChange={handleChange}
                        disabled={!paymentRejected}
                    />


                    <Field
                        label="Payment Submitted Date"
                        name="paymentSubmittedAt"
                        type="date"
                        value={form.paymentSubmittedAt}
                        onChange={handleChange}
                        disabled={!paymentRejected}
                    />

                </div>


                {/* =============================================
                    PAYMENT PROOF
                ============================================= */}

                <div className="studentPaymentProofBox">

                    <div className="studentPaymentProofInfo">

                        <span>
                            CURRENT PAYMENT PROOF
                        </span>

                        <strong>
                            {
                                admission.paymentProof?.title ||
                                "Admission Fee Payment Proof"
                            }
                        </strong>

                    </div>


                    {
                        admission.paymentProof?.imageUrl && (

                            <a
                                href={
                                    admission.paymentProof.imageUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="studentViewPaymentProofBtn"
                            >
                                View Current Proof
                            </a>

                        )
                    }

                </div>


                {/* =============================================
                    REPLACE PAYMENT PROOF
                ============================================= */}

                <label
                    className={
                        paymentRejected
                            ? "studentReplacePaymentProof"
                            : "studentReplacePaymentProof disabled"
                    }
                >

                    <FaUpload />

                    <div>

                        <strong>
                            {
                                paymentProof
                                    ? paymentProof.name
                                    : "Replace Payment Proof"
                            }
                        </strong>

                        <span>
                            JPG, PNG or PDF
                        </span>

                    </div>

                    <input
                        type="file"
                        accept="image/*,.pdf"
                        hidden
                        disabled={!paymentRejected}
                        onChange={
                            handlePaymentProofChange
                        }
                    />

                </label>

            </section>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="studentRejectedEditActions">

                <button
                    type="button"
                    className="studentRejectedCancelBtn"
                    onClick={onCancel}
                    disabled={loading}
                >
                    <FaTimes />
                    Cancel
                </button>


                <button
                    type="submit"
                    className="studentRejectedSaveBtn"
                    disabled={
                        loading || !canEdit
                    }
                >
                    <FaSave />

                    {
                        loading
                            ? "Saving..."
                            : "Save Corrections"
                    }

                </button>

            </div>

        </form>
    );
};


/* =====================================================
   SECTION HEADER
===================================================== */

const SectionHeader = ({
    icon,
    title,
    description
}) => (

    <div className="studentRejectedSectionHeader">

        <div className="studentRejectedSectionIcon">
            {icon}
        </div>

        <div>

            <h2>
                {title}
            </h2>

            <p>
                {description}
            </p>

        </div>

    </div>

);


/* =====================================================
   FIELD
===================================================== */

const Field = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    disabled = false
}) => (

    <div className="studentRejectedFormGroup">

        <label>
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />

    </div>

);


/* =====================================================
   SELECT
===================================================== */

const SelectField = ({
    label,
    name,
    value,
    onChange,
    options,
    disabled = false
}) => (

    <div className="studentRejectedFormGroup">

        <label>
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
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