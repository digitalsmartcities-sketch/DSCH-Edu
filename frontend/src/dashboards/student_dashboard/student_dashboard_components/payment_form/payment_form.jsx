import { useState } from "react";
import {
    FaArrowLeft,
    FaCreditCard,
    FaCloudUploadAlt,
    FaFilePdf,
    FaUniversity,
    FaUser,
    FaCheckCircle,
    FaRegStickyNote
} from "react-icons/fa";
import "./payment_form.css";
import { useEffect } from "react";
import { getBillById, submitBill } from "../../../../apicalls/student_apicalls";
import notify from "../../../../components/toast/toastBus";

const isPdfUrl = (url) => Boolean(url && url.split("?")[0].toLowerCase().endsWith(".pdf"));

export const PaymentForm = ({ billId, setSubPage }) => {
    const [billData, setBillData] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBillById(billId, setBillData, setLoading);
    }, [billId]);

    if (!billData || loading) {
        return (
            <div className="appPageLoader">
                <div className="appPageLoader__spinner"></div>
                <p>Loading, Please wait...</p>
            </div>
        );
    }

    // Remounting the form whenever the bill changes keeps the inputs in sync
    // with the server data without a "set state in effect" cascade.
    return (
        <PaymentFormFields
            key={`${billId}-${billData.status || "new"}`}
            billData={billData}
            billId={billId}
            setSubPage={setSubPage}
        />
    );
};

const PaymentFormFields = ({ billData, billId, setSubPage }) => {
    const [paymentMethod, setPaymentMethod] = useState(billData?.paymentMethod || "");
    const [transactionId, setTransactionId] = useState(billData?.transactionId || "");
    const [paymentProof, setPaymentProof] = useState("");
    const [preview, setPreview] = useState(() => {
        const existingProof = billData?.paymentProof?.imageUrl;
        return existingProof && !isPdfUrl(existingProof) ? existingProof : null;
    });
    const [submitting, setSubmitting] = useState(false);

    let [changes, setChanges] = useState([]);

    const handleProofChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPaymentProof(file);
        if (file.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
        setChanges([...changes, "paymentProof"])
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (billData.status === "REJECTED" && changes.length === 0) {
            notify.error("Please update the rejected changes.");
            return;
        }

        if (!paymentMethod) {
            notify.error("Please select a payment method.");
            return;
        }
        if (!transactionId.trim()) {
            notify.error("Please enter the transaction ID.");
            return;
        }
        if (!paymentProof && billData?.status !== "REJECTED") {
            notify.error("Please upload your payment proof.");
            return;
        }
        let formData = new FormData;
        formData.append("paymentMethod", paymentMethod);
        formData.append("transactionId", transactionId.trim());
        formData.append("paymentProof", paymentProof);
        formData.append("billId", billId);
        if (billData?.status === "REJECTED" && changes?.length > 0) {
            formData.append("changes", JSON.stringify(changes));
        }
        formData.append("collection", billData.paymentType?.startsWith("Admission") ? "Admission" : "Fee");
        let prevPage = billData.paymentType?.startsWith("Admission") ? "Admission" : "Fees";
        submitBill(formData, setSubmitting, setSubPage, prevPage);
    };

    return (
        <div className="studentPaymentPage">
            {/* =========================================
                HEADER
            ========================================= */}
            <div className="studentPaymentHeader">
                <div>
                    <span className="studentPaymentEyebrow">
                        ADMISSION PAYMENT
                    </span>
                    <h1>
                        {`Pay ${(billData?.paymentType?.startsWith("Admission") ? "Admission Fee" : billData?.paymentType)}`}
                    </h1>
                    <p>
                        Submit your {`${billData?.paymentType?.startsWith("Admission") ? "Admission" : billData?.paymentType}`} fee payment and payment proof
                        for institute verification.
                    </p>
                </div>
                <button
                    type="button"
                    className="paymentBackBtn"
                    onClick={() => setSubPage(`${billData?.paymentType?.startsWith("Admission") ? "Admission" : "Fees"}`)}
                >
                    <FaArrowLeft />
                    Back to {
                        `${billData?.paymentType?.startsWith("Admission") ? "Admission" : billData?.paymentType}`
                    }
                </button>
            </div>
            {/* =========================================
                PAYMENT SUMMARY
            ========================================= */}
            <div className="paymentSummaryCard">
                <div className="paymentSummaryInstitute">
                    <div className="paymentSummaryIcon">
                        <FaUniversity />
                    </div>
                    <div>
                        <span>
                            Institute
                        </span>
                        <strong>
                            {billData?.instituteName}
                        </strong>
                        <small>
                            Class {billData?.class}
                        </small>
                    </div>
                </div>
                <div className="paymentAmount">
                    <span>
                        {billData?.paymentType}
                    </span>
                    <strong>
                        PKR {Number(billData?.amount).toLocaleString()}
                    </strong>
                </div>
            </div>
            <form
                className="studentPaymentForm"
                onSubmit={handleSubmit}
            >
                {/* =========================================
                    STUDENT INFORMATION
                ========================================= */}
                <section className="paymentFormCard">
                    <div className="paymentSectionHeader">
                        <div className="paymentSectionIcon green">
                            <FaUser />
                        </div>
                        <div>
                            <h2>
                                Student Information
                            </h2>
                            <p>
                                Your information is automatically filled
                                from your student account.
                            </p>
                        </div>
                    </div>
                    <div className="paymentInfoGrid">
                        <div className="paymentInfoItem">
                            <span>
                                Student Name
                            </span>
                            <strong>
                                {billData?.fullName || "Not provided"}
                            </strong>
                        </div>
                        <div className="paymentInfoItem">
                            <span>
                                Email
                            </span>
                            <strong>
                                {billData?.email || "Not provided"}
                            </strong>
                        </div>
                        <div className="paymentInfoItem">
                            <span>
                                Phone
                            </span>
                            <strong>
                                {billData?.phone || "Not provided"}
                            </strong>
                        </div>
                        <div className="paymentInfoItem">
                            <span>
                                Class
                            </span>
                            <strong>
                                {billData?.class
                                    ? `${billData?.class}`
                                    : "Not provided"}
                            </strong>
                        </div>
                    </div>
                </section>
                {/* =========================================
                    PAYMENT DETAILS
                ========================================= */}
                <section className="paymentFormCard">
                    <div className="paymentSectionHeader">
                        <div className="paymentSectionIcon blue">
                            <FaCreditCard />
                        </div>
                        <div>
                            <h2>
                                Payment Details
                            </h2>
                            <p>
                                Enter the details of the payment you made.
                            </p>
                        </div>
                    </div>
                    <div className="paymentFieldsGrid">
                        <div className="paymentFormGroup">
                            <label>
                                Payment Type
                            </label>
                            <input
                                type="text"
                                value={billData?.paymentType || "N/A"}
                                disabled
                            />
                        </div>
                        <div className="paymentFormGroup">
                            <label>
                                Amount
                            </label>
                            <input
                                type="text"
                                value={`PKR ${Number(
                                    billData?.amount || 0
                                ).toLocaleString()}`}
                                disabled
                            />
                        </div>
                        <div className="paymentFormGroup fullWidth">
                            <label>
                                Payment Method
                                <span>*</span>
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                disabled={billData?.status === "REJECTED"}
                            >
                                <option value="">
                                    Select payment method
                                </option>
                                <option value="EASYPAISA">
                                    Easypaisa
                                </option>
                            </select>
                        </div>
                        <div className="paymentFormGroup fullWidth">
                            <label>
                                Transaction ID / Reference Number
                                <span>*</span>
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => {
                                    setTransactionId(e.target.value);
                                    setChanges([...changes, "transactionId"])
                                }}
                                placeholder="Enter transaction ID or reference number"
                            />
                        </div>
                    </div>
                </section>
                {/* =========================================
                    PAYMENT PROOF
                ========================================= */}
                <section className="paymentFormCard">
                    <div className="paymentSectionHeader">
                        <div className="paymentSectionIcon purple">
                            <FaCloudUploadAlt />
                        </div>
                        <div>
                            <h2>
                                Payment Proof
                            </h2>
                            <p>
                                Upload a clear screenshot or image of
                                your payment receipt.
                            </p>
                        </div>
                    </div>
                    {billData?.paymentProof?.imageUrl &&
                        isPdfUrl(billData.paymentProof.imageUrl) &&
                        !paymentProof && (
                            <div className="selectedProof">
                                <FaFilePdf />
                                <div>
                                    <strong>
                                        Current payment proof (PDF)
                                    </strong>
                                    <a
                                        href={billData.paymentProof.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open PDF
                                    </a>
                                </div>
                            </div>
                        )}
                    <div className="paymentUploadArea">
                        <label
                            htmlFor="paymentProof"
                            className="paymentUploadBox"
                        >
                            {
                                preview ? (
                                    <div className="paymentProofPreview">
                                        <img
                                            src={preview}
                                            alt="Payment proof preview"
                                        />
                                        <span>
                                            Change Image
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="paymentUploadIcon">
                                            <FaCloudUploadAlt />
                                        </div>
                                        <strong>
                                            Upload Payment Proof
                                        </strong>
                                        <p>
                                            PNG, JPG, JPEG or PDF
                                        </p>
                                        <span className="chooseProofBtn">
                                            Choose File
                                        </span>
                                    </>
                                )
                            }
                            <input
                                id="paymentProof"
                                type="file"
                                accept="image/*,.pdf"
                                hidden
                                onChange={handleProofChange}
                            />
                        </label>
                    </div>
                    {
                        paymentProof && (
                            <div className="selectedProof">
                                <FaCheckCircle />
                                <div>
                                    <strong>
                                        {paymentProof.name}
                                    </strong>
                                    <span>
                                        {(
                                            paymentProof.size /
                                            (1024 * 1024)
                                        ).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </section>
                {/* =========================================
                    NOTICE
                ========================================= */}
                <div className="paymentWarning">
                    <FaCheckCircle />
                    <div>
                        <strong>
                            Before submitting
                        </strong>
                        <p>
                            Make sure the transaction ID is correct and
                            the uploaded payment proof is clear and readable.
                            Your payment will remain pending until reviewed
                            by the institute administration.
                        </p>
                    </div>
                </div>
                {/* =========================================
                    REJECTION REASON
                ========================================= */}
                {
                    billData?.status === "REJECTED" || billData?.paymentStatus === "REJECTED" ? (
                        <div className="applicationRejection">
                            <FaRegStickyNote />
                            <div>
                                <strong>
                                    Rejection Reason
                                </strong>
                                <p>
                                    {billData?.rejectionReason}
                                </p>
                            </div>
                        </div>
                    ) : null
                }
                {/* =========================================
                    ACTIONS
                ========================================= */}
                <div className="paymentFormActions">
                    <button
                        type="button"
                        className="paymentCancelBtn"
                        onClick={() => setSubPage(`${billData?.paymentType === "Admission" ? "Admission" : "Fees"}`)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="paymentSubmitBtn"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Loading ..."
                            : (
                                <>
                                    <FaCreditCard />
                                    {billData?.status !== "REJECTED" ? "Submit Payment" : "Resubmit Payment"}
                                </>
                            )}
                    </button>
                </div>
            </form>
        </div>
    );
};