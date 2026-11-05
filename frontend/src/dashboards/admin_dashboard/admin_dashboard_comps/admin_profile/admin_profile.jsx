import { useEffect,useState } from "react";
import {
    FaUser,
    FaUniversity,
    FaCreditCard,
    FaFileAlt,
    FaCheckCircle,
    FaUserShield,
    FaLock,
    FaArrowLeft
} from "react-icons/fa";
import "./admin_profile.css";
import { getAdminProfile } from "../../../../apicalls/admin_apicalls";

export const AdminProfile = ({ setSubPage }) => {

    const [admin,setAdmin] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        getAdminProfile(setAdmin,setLoading);
    },[]);

    const formatDate = (date) => {
        if (!date) return "Not provided";

        return new Date(date).toLocaleDateString("en-GB",{
            day:"2-digit",
            month:"long",
            year:"numeric"
        });
    };

    if (loading) {
        return (
            <div className="adminProfileLoading">
                <div className="adminProfileLoader"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="adminProfileEmpty">
                <FaUserShield />
                <h2>Profile Not Available</h2>
                <p>Unable to load your profile information.</p>
            </div>
        );
    }

    const ownerName = admin.ownerName || "Admin";

    return (
        <div className="adminProfilePage">
            {/* =========================================
                PAGE HEADER
            ========================================= */}
            <div className="adminProfileHeader">
                <div>
                    <span className="adminProfileEyebrow">
                        ACCOUNT SETTINGS
                    </span>
                    <h1>
                        Admin Profile
                    </h1>
                    <p>
                        View and manage your administrator and institute
                        information.
                    </p>
                </div>
                <button
                    className="adminProfileBackBtn"
                    onClick={() =>
                        setSubPage && setSubPage("Home")
                    }
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>
            {/* =========================================
                PROFILE SUMMARY
            ========================================= */}
            <section className="adminProfileSummary">
                <div className="adminProfileIdentity">
                    <div className="adminProfileAvatar">
                        {admin.images?.find(
                            (img) => img.title === "Owner Photo"
                        )?.imageUrl ? (
                            <img
                                src={
                                    admin.images.find(
                                        (img) =>
                                            img.title === "Owner Photo"
                                    ).imageUrl
                                }
                                alt={ownerName}
                            />
                        ) : (
                            <span>
                                {ownerName
                                    .charAt(0)
                                    .toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <span>
                            Administrator
                        </span>
                        <h2>
                            {ownerName}
                        </h2>
                        <p>
                            {admin.instituteName || "Institute not provided"}
                        </p>
                    </div>
                </div>
                <div className="adminProfileBadges">
                    <span className="adminProfileBadge approved">
                        <FaCheckCircle />
                        Approved
                    </span>
                    <span className="adminProfileBadge active">
                        <span className="statusDot"></span>
                        {admin.disabled ? "Disabled" : "Active"}
                    </span>
                </div>
            </section>
            {/* =========================================
                PERSONAL INFORMATION
            ========================================= */}
            <section className="adminProfileCard">
                <SectionHeader
                    icon={<FaUser />}
                    title="Personal Information"
                    description="Personal details associated with the administrator account."
                />
                <div className="adminProfileInfoGrid">
                    <InfoItem
                        label="Full Name"
                        value={admin.ownerName}
                    />
                    <InfoItem
                        label="Father Name"
                        value={admin.fatherName}
                    />
                    <InfoItem
                        label="Email"
                        value={admin.email}
                    />
                    <InfoItem
                        label="Phone"
                        value={admin.phone}
                    />
                    <InfoItem
                        label="CNIC"
                        value={admin.cnic}
                    />
                    <InfoItem
                        label="Date of Birth"
                        value={formatDate(admin.dateOfBirth)}
                    />
                    <InfoItem
                        label="Gender"
                        value={admin.gender}
                    />
                    <InfoItem
                        label="City"
                        value={admin.city}
                    />
                    <InfoItem
                        label="Address"
                        value={admin.address}
                        full
                    />
                </div>
            </section>
            {/* =========================================
                INSTITUTE INFORMATION
            ========================================= */}
            <section className="adminProfileCard">
                <SectionHeader
                    icon={<FaUniversity />}
                    title="Institute Information"
                    description="Registered information of the institute managed by this admin."
                />
                <div className="adminProfileInfoGrid">
                    <InfoItem
                        label="Institute Name"
                        value={admin.instituteName}
                    />
                    <InfoItem
                        label="Institute Type"
                        value={admin.instituteType}
                    />
                    <InfoItem
                        label="Registration Number"
                        value={admin.registrationNumber}
                    />
                    <InfoItem
                        label="Established Year"
                        value={admin.establishedYear}
                    />
                    <InfoItem
                        label="Institute Phone"
                        value={admin.institutePhone}
                    />
                    <InfoItem
                        label="Institute Email"
                        value={admin.instituteEmail}
                    />
                    <InfoItem
                        label="City"
                        value={admin.instituteCity}
                    />
                    <InfoItem
                        label="Website"
                        value={admin.website}
                    />
                    <InfoItem
                        label="Institute ID"
                        value={admin.instituteId}
                    />
                    <InfoItem
                        label="Institute Address"
                        value={admin.instituteAddress}
                        full
                    />
                </div>
            </section>
            {/* =========================================
                ACCOUNT INFORMATION
            ========================================= */}
            <section className="adminProfileCard">
                <SectionHeader
                    icon={<FaUserShield />}
                    title="Account Information"
                    description="Current account and access status."
                />
                <div className="adminProfileInfoGrid">
                    <InfoItem
                        label="Role"
                        value={admin.role}
                    />
                    <InfoItem
                        label="Email Verified"
                        value={
                            admin.emailVerified
                                ? "Verified"
                                : "Not Verified"
                        }
                    />
                    <InfoItem
                        label="Account Approved"
                        value={
                            admin.approved
                                ? "Approved"
                                : "Not Approved"
                        }
                    />
                    <InfoItem
                        label="Account Status"
                        value={
                            admin.disabled
                                ? "Disabled"
                                : "Active"
                        }
                    />
                    <InfoItem
                        label="Application Status"
                        value={
                            admin.rejected
                                ? "Rejected"
                                : admin.approved
                                    ? "Approved"
                                    : "Pending"
                        }
                    />
                    <InfoItem
                        label="Registered On"
                        value={formatDate(admin.createdAt)}
                    />
                    <InfoItem
                        label="Last Updated"
                        value={formatDate(admin.updatedAt)}
                    />
                </div>
                <div className="adminSecurityNotice">
                    <FaLock />
                    <div>
                        <strong>
                            Password Security
                        </strong>
                        <p>
                            Your password is securely stored and is not
                            displayed here.
                        </p>
                    </div>
                </div>
            </section>
            {/* =========================================
                REGISTRATION PAYMENT
            ========================================= */}
            <section className="adminProfileCard">
                <SectionHeader
                    icon={<FaCreditCard />}
                    title="Registration Payment"
                    description="Payment information submitted during institute registration."
                />
                <div className="adminProfileInfoGrid">
                    <InfoItem
                        label="Payment Method"
                        value={admin.paymentMethod}
                    />
                    <InfoItem
                        label="Transaction ID"
                        value={admin.transactionId}
                    />
                </div>
            </section>
            {/* =========================================
                DOCUMENTS
            ========================================= */}
            <section className="adminProfileCard">
                <SectionHeader
                    icon={<FaFileAlt />}
                    title="Submitted Documents"
                    description="Documents associated with the administrator registration."
                />
                <div className="adminProfileDocuments">
                    {admin.images?.length ? (
                        admin.images.map((document,index) => (
                            <DocumentCard
                                key={index}
                                title={
                                    document.title ||
                                    `Document ${index + 1}`
                                }
                                image={document.imageUrl}
                            />
                        ))
                    ) : (
                        <div className="adminNoDocuments">
                            <FaFileAlt />
                            <p>No documents available.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};


/* =========================================
   SECTION HEADER
========================================= */

const SectionHeader = ({
    icon,
    title,
    description
}) => (
    <div className="adminProfileSectionHeader">
        <div className="adminProfileSectionIcon">
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


/* =========================================
   INFO ITEM
========================================= */

const InfoItem = ({
    label,
    value,
    full = false
}) => (
    <div
        className={`adminProfileInfoItem ${full ? "full" : ""}`}
    >
        <span>
            {label}
        </span>
        <strong>
            {
                value !== undefined &&
                value !== null &&
                value !== ""
                    ? value
                    : "Not provided"
            }
        </strong>
    </div>
);

/* =========================================
   DOCUMENT CARD
========================================= */
const DocumentCard = ({
    title,
    image
}) => {
    const isPdf = typeof image === "string" && image.split("?")[0].toLowerCase().endsWith(".pdf");

    return (
        <div className="adminDocumentCard">
            <div className="adminDocumentHeader">
                <h3>
                    {title}
                </h3>
                {image && (
                    <button
                        type="button"
                        onClick={() =>
                            window.open(
                                image,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        View
                    </button>
                )}
            </div>
            <div className="adminDocumentPreview">
                {!image ? (
                    <div className="adminDocumentMissing">
                        <FaFileAlt />
                        <span>
                            Document unavailable
                        </span>
                    </div>
                ) : isPdf ? (
                    <div className="adminDocumentMissing">
                        <FaFileAlt />
                        <a href={image} target="_blank" rel="noreferrer">
                            Open PDF
                        </a>
                    </div>
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