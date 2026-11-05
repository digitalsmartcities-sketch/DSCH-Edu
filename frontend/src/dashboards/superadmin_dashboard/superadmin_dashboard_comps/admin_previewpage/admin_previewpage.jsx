import { useState } from "react";
import { approveAdmin, getAdminById } from "../../../../apicalls/superadmin_apicalls";
import "./admin_previewpage.css";
import { useEffect } from "react";
import { rejectAdminApplication } from "../../../../apicalls/superadmin_apicalls";
import { AdminRejectedEdit } from "../edit_admin_application.jsx/admin_rejected_edit";
import notify from "../../../../components/toast/toastBus";

export const AdminPreview = ({ id, setSubpage }) => {
    let [admin, setAdmin] = useState(null);
    let [loading, setLoading] = useState(null);
    let [showRejectForm, setShowRejectForm] = useState(false);
    let [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        getAdminById(id, setAdmin, setLoading);
    }, [id]);

    const handleApprove = () => {
        approveAdmin(id, setSubpage, setAdmin, setLoading);
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            notify.error("A rejection reason is required.");
            return;
        }
        rejectAdminApplication(id, rejectReason.trim(), setSubpage, setLoading);
    };

    const cancelReject = () => {
        setRejectReason("");
        setShowRejectForm(false);
    };

    if (admin?.rejected) {
        return <AdminRejectedEdit key={admin._id} admin={admin} loading={loading} onCancel={() => setSubpage("Applications")} />
    }

    return (
        <div className="admin-preview-page">
            {/* =========================================
                HEADER
            ========================================= */}
            <div className="admin-preview-header">
                <div>
                    <span className="admin-preview-label">
                        ADMIN APPLICATION
                    </span>
                    <h1>
                        Application Preview
                    </h1>
                    <p>
                        Review the information and documents submitted
                        by the service provider.
                    </p>
                </div>
                <button
                    className="preview-back-btn"
                    onClick={() => setSubpage("Applications")}
                >
                    ← Back
                </button>
            </div>
            {/* =========================================
                APPLICATION STATUS
            ========================================= */}
            <div className="application-review-status">
                <div className="review-status-left">
                    <div className="review-status-icon">
                        ⏳
                    </div>
                    <div>
                        <strong>
                            Application Pending Review
                        </strong>
                        <p>
                            Please carefully review all information
                            and documents before making a decision.
                        </p>
                    </div>
                </div>
                <span className="pending-badge">
                    {admin?.approved ? "Approved" : "Pending"}
                </span>
            </div>
            {/* =========================================
                OWNER INFORMATION
            ========================================= */}
            <section className="preview-section">
                <div className="section-heading">
                    <div className="section-number">
                        01
                    </div>
                    <div>
                        <h2>
                            Owner Information
                        </h2>
                        <p>
                            Personal information of the service provider.
                        </p>
                    </div>
                </div>
                <div className="information-grid">
                    <InfoItem
                        label="Owner Name"
                        value={admin?.ownerName}
                    />
                    <InfoItem
                        label="Father Name"
                        value={admin?.fatherName}
                    />
                    <InfoItem
                        label="Email"
                        value={admin?.email}
                    />
                    <InfoItem
                        label="Phone"
                        value={admin?.phone}
                    />
                    <InfoItem
                        label="CNIC"
                        value={admin?.cnic}
                    />
                    <InfoItem
                        label="Date of Birth"
                        value={admin?.dateOfBirth}
                    />
                    <InfoItem
                        label="Gender"
                        value={admin?.gender}
                    />
                    <InfoItem
                        label="City"
                        value={admin?.city}
                    />
                    <InfoItem
                        label="Address"
                        value={admin?.address}
                        full
                    />
                </div>
            </section>
            {/* =========================================
                INSTITUTE INFORMATION
            ========================================= */}
            <section className="preview-section">
                <div className="section-heading">
                    <div className="section-number">
                        02
                    </div>
                    <div>
                        <h2>
                            Institute Information
                        </h2>
                        <p>
                            Basic information about the institute.
                        </p>
                    </div>
                </div>
                <div className="information-grid">
                    <InfoItem
                        label="Institute Name"
                        value={admin?.instituteName}
                    />
                    <InfoItem
                        label="Institute Type"
                        value={admin?.instituteType}
                    />
                    <InfoItem
                        label="Registration Number"
                        value={admin?.registrationNumber}
                    />
                    <InfoItem
                        label="Established Year"
                        value={admin?.establishedYear}
                    />
                    <InfoItem
                        label="Institute Phone"
                        value={admin?.institutePhone}
                    />
                    <InfoItem
                        label="Institute Email"
                        value={admin?.instituteEmail}
                    />
                    <InfoItem
                        label="Institute City"
                        value={admin?.instituteCity}
                    />
                    <InfoItem
                        label="Institute Province"
                        value={admin?.instituteProvince}
                    />
                    <InfoItem
                        label="Website"
                        value={admin?.website}
                    />
                    <InfoItem
                        label="Institute Address"
                        value={admin?.instituteAddress}
                        full
                    />
                </div>
            </section>
            {/* =========================================
                ACCOUNT INFORMATION
            ========================================= */}
            <section className="preview-section">
                <div className="section-heading">
                    <div className="section-number">
                        03
                    </div>
                    <div>
                        <h2>
                            Account Information
                        </h2>
                        <p>
                            Login information submitted during registration.
                        </p>
                    </div>
                </div>
                <div className="information-grid">
                    <InfoItem
                        label="Username"
                        value={admin?.ownerName}
                    />
                    <InfoItem
                        label="Account Email"
                        value={admin?.email}
                    />
                </div>
            </section>
            {/* =========================================
                PAYMENT INFORMATION
            ========================================= */}
            <section className="preview-section">
                <div className="section-heading">
                    <div className="section-number">
                        04
                    </div>
                    <div>
                        <h2>
                            Registration Payment
                        </h2>
                        <p>
                            Payment information submitted with the application.
                        </p>
                    </div>
                </div>
                <div className="information-grid">
                    <InfoItem
                        label="Payment Method"
                        value={admin?.paymentMethod}
                    />
                    <InfoItem
                        label="Transaction ID"
                        value={admin?.transactionId}
                    />
                </div>
            </section>
            {/* =========================================
                DOCUMENTS
            ========================================= */}
            <section className="preview-section">
                <div className="section-heading">
                    <div className="section-number">
                        05
                    </div>
                    <div>
                        <h2>
                            Submitted Documents
                        </h2>
                        <p>
                            Verify the submitted documents before approval.
                        </p>
                    </div>
                </div>
                <div className="documents-grid">
                    {(admin?.images || []).map((document, index) => (
                        <DocumentCard
                            key={document.publicId || document.imageUrl || index}
                            title={document.title || `Document ${index + 1}`}
                            image={document.imageUrl}
                        />
                    ))}
                    {!admin?.images?.length && (
                        <p>No documents submitted.</p>
                    )}
                </div>
            </section>
            {/* =========================================
                DECISION AREA
            ========================================= */}
            <section className="application-decision">
                <div className="decision-content">
                    <div>
                        <h2>
                            Application Decision
                        </h2>
                        <p>
                            Verify all submitted information and documents
                            before approving this application.
                        </p>
                    </div>
                    <div className="decision-buttons">
                        <button
                            className="reject-app-btn"
                            onClick={() => setShowRejectForm((prev) => !prev)}
                            disabled={(loading || admin?.approved || admin?.rejected) ? true : false}
                        >
                            ✕ Reject Application
                        </button>
                        <button
                            className="approve-app-btn"
                            onClick={handleApprove}
                            disabled={(loading || admin?.approved) ? true : false}
                        >
                            ✓ Approve Application
                        </button>
                    </div>
                </div>

                {showRejectForm && (
                    <div className="reject-reason-panel">
                        <label htmlFor="reject-reason">
                            Reason for rejection <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                            id="reject-reason"
                            name="rejectReason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Explain why this application is being rejected..."
                            rows={4}
                            maxLength={500}
                            disabled={loading}
                        />
                        <div className="reject-reason-actions">
                            <button
                                type="button"
                                className="reject-cancel-btn"
                                onClick={cancelReject}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="reject-confirm-btn"
                                onClick={handleReject}
                                disabled={loading || !rejectReason.trim()}
                            >
                                {loading ? "Rejecting..." : "Confirm Rejection & Delete"}
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

/* =========================================
   INFORMATION COMPONENT
========================================= */
const InfoItem = ({ label, value, full }) => {
    return (
        <div className={`info-item ${full ? "full" : ""}`}>
            <span>
                {label}
            </span>
            <strong>
                {value || "Not provided"}
            </strong>
        </div>
    );
};

/* =========================================
   DOCUMENT COMPONENT
========================================= */
const DocumentCard = ({ title, image }) => {
    const isPdf = typeof image === "string" && image.split("?")[0].toLowerCase().endsWith(".pdf");

    return (
        <div className="document-card">
            <div className="document-header">
                <h3>
                    {title}
                </h3>
                {image && (
                    <span onClick={() => window.open(image, "_blank")}>
                        View
                    </span>
                )}
            </div>
            <div className="document-image-wrapper">
                {!image ? (
                    <span>No preview</span>
                ) : isPdf ? (
                    <a href={image} target="_blank" rel="noreferrer">
                        Open PDF
                    </a>
                ) : (
                    <img
                        src={image}
                        alt={title}
                    />
                )}
            </div>
        </div>
    );
};