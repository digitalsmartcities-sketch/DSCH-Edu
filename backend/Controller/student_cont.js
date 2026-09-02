import { deleteFiles, uploadFiles } from "../Utils/helperFun.js";
import Admission from "../Models/Admission.js";
import { Fee } from "../Models/Fee.js";
import { validateStudent } from "../Utils/validation_check.js";
import { Institute } from "../Models/Institute.js";
// ===============================
// Student Controller
// ===============================

export const CheckStudentAccessCont = async (req, res) => {
    try {
        const { isValid, student } = await validateStudent(req, res);
        if (!isValid) return;

        if (student.admissionApplication !== "APPROVED") {
            return res.json({ success: false, message: "Student not approved" });
        }

        if (student.admissionApplicationId == null || student.admissionApplicationId == "") {
            return res.json({ success: false, message: "Please complete admission process first" });
        }

        let admission = await Admission.findById(student.admissionApplicationId);
        if (!admission) {
            return res.json({ success: false, message: "Admission application not found" });
        }

        if (admission.status === "REJECTED") {
            return res.json({ success: false, message: "Admission application rejected" });
        }

        if (admission.admissionReceipt !== "GENERATED") {
            return res.json({ success: false, message: "Your Application is Under-Process." });
        }

        let canAccess = ["Admission", "PaymentForm", "Home"]

        if (student.approved && student.status === "ACTIVE" && admission.isAdmissionCompleted) {
            canAccess = ["Home", "Admission", "Fees", "Profile", "PaymentForm", "change_password"];
        }

        return res.json({ success: true, message: "Student access granted", canAccess, student: student });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const GetMyApplication = async (req, res) => {
    try {
        const { isValid, student } = await validateStudent(req, res);
        if (!isValid) return;

        if (student.admissionApplicationId) {
            let admission = await Admission.findById(student.admissionApplicationId);
            if (admission) {
                return res.json({ success: true, application: admission });
            }
        }

        return res.json({ success: false, message: "No application found", application: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const GetBillByIdCont = async (req, res) => {
    try {
        const { isValid, student } = await validateStudent(req, res);
        if (!isValid) return;

        if (student.admissionApplication !== "APPROVED") {
            return res.json({ success: false, message: "Student not approved" });
        }

        let { id } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Please provide bill id" });
        }

        let responseData = {};

        let bill = await Admission.findOne({ _id: id, studentId: student._id });
        responseData.paymentType = bill?.admissionReceiptData?.monthlyFee > 0 ? "Admission & 1st monthly Fee" : "Admission";
        if (!bill) {
            bill = await Fee.findOne({ _id: id, studentId: student._id })
                .populate("studentId", "firstName lastName email phone _id class")
                .populate("instituteId", "instituteName");
            responseData.paymentType = "Fee";
        }

        if (!bill) {
            return res.json({ success: false, message: "Bill not found" });
        }

        if (responseData.paymentType !== "Fee") { // Admission case is handled.
            responseData.instituteName = bill.instituteName;
            responseData.class = responseData.paymentType.startsWith("Admission") ? bill.applyingFor : bill.class;
            responseData.amount = responseData.paymentType.startsWith("Admission") ? bill?.admissionReceiptData?.admissionFee + bill?.admissionReceiptData?.monthlyFee : bill?.monthlyFee;
            responseData.fullName = student.firstName + " " + student.lastName;
            responseData.email = student.email;
            responseData.phone = student.phone;
            responseData.stdId = student._id;
            responseData.status = bill?.paymentStatus;
            responseData.paymentProof = bill?.paymentProof;
            responseData.paymentMethod = bill?.paymentMethod;
            responseData.transactionId = bill?.transactionId;
            responseData.rejectionReason = bill?.rejectionReason;
        } else { // Fee case is handled.
            responseData.instituteName = bill.instituteId.instituteName;
            responseData.class = bill.studentId.class;
            responseData.amount = bill.amount;
            responseData.fullName = bill.studentId.firstName + " " + bill.studentId.lastName;
            responseData.email = bill.studentId.email;
            responseData.phone = bill.studentId.phone;
            responseData.stdId = bill.studentId._id;
            responseData.status = bill.status;
            responseData.paymentProof = bill.paymentProof;
            responseData.paymentMethod = bill.paymentMethod;
            responseData.transactionId = bill.transactionId;
            responseData.rejectionReason = bill?.rejectionReason;
        }

        return res.json({ success: true, billData: responseData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const SubmitBill = async (req, res) => {
    try {
        // =========================================================
        // 1. AUTHENTICATION
        // =========================================================
        const { isValid, student } = await validateStudent(req, res);
        if (!isValid) return;

        if (student.admissionApplication !== "APPROVED") {
            return res.json({
                success: false,
                message: "Student not approved"
            });
        }

        // =========================================================
        // 2. GET REQUEST DATA
        // =========================================================
        const {
            billId,
            collection,
            paymentMethod,
            transactionId
        } = req.body;

        if (
            !billId ||
            !collection ||
            !paymentMethod ||
            !transactionId
        ) {
            return res.json({
                success: false,
                message: "Please provide complete bill information"
            });
        }


        // =========================================================
        // 3. DETERMINE BILL TYPE
        // =========================================================
        const isAdmissionBill =
            collection === "Admission" ||
            collection === "Admission & 1st monthly Fee";

        const isFeeBill = collection === "Fee";

        if (!isAdmissionBill && !isFeeBill) {
            return res.json({
                success: false,
                message: "Invalid bill collection"
            });
        }

        // =========================================================
        // 4. FIND BILL
        // =========================================================
        let bill;

        if (isAdmissionBill) {
            bill = await Admission.findById(billId);
        } else {
            bill = await Fee.findById(billId);
        }

        if (!bill) {
            return res.json({
                success: false,
                message: "Bill not found"
            });
        }


        // =========================================================
        // 5. GET CURRENT BILL STATUS & OLD PAYMENT PROOF
        // =========================================================
        const billStatus = isAdmissionBill
            ? bill?.paymentStatus
            : bill.status;

        const oldPaymentProofPublicId = bill.paymentProof?.public_id;

        // =========================================================
        // 6. HANDLE REJECTED BILL
        // =========================================================
        if (billStatus === "REJECTED") {
            let changedData = [];
            if (req.body.changes) {
                try {
                    changedData = JSON.parse(req.body.changes);
                } catch (error) {
                    return res.json({
                        success: false,
                        message: "Invalid changes data"
                    });
                }
            }

            const paymentProofChanged =
                changedData.includes("paymentProof");

            const transactionIdChanged =
                changedData.includes("transactionId");

            const paymentMethodChanged =
                changedData.includes("paymentMethod");


            // -----------------------------------------------------
            // Check if student actually changed anything
            // -----------------------------------------------------
            if (
                !paymentProofChanged &&
                !transactionIdChanged &&
                !paymentMethodChanged
            ) {
                return res.json({
                    success: false,
                    message: "Please make at least one change before resubmitting"
                });
            }

            // -----------------------------------------------------
            // Update transaction ID
            // -----------------------------------------------------
            if (transactionIdChanged) {
                bill.transactionId = transactionId;
            }

            // -----------------------------------------------------
            // Update payment method
            // -----------------------------------------------------
            if (paymentMethodChanged) {
                bill.paymentMethod = paymentMethod;
            }

            // -----------------------------------------------------
            // Replace payment proof
            // -----------------------------------------------------
            if (paymentProofChanged) {
                if (!req.file) {
                    return res.json({
                        success: false,
                        message: "Please provide new payment proof"
                    });
                }

                const uploadResult = await uploadFiles(
                    req.file,
                    "paymentProof"
                );

                if (
                    !uploadResult ||
                    !uploadResult.secure_url ||
                    !uploadResult.public_id
                ) {
                    return res.json({
                        success: false,
                        message: "Payment proof upload failed"
                    });
                }

                const paymentProof = {
                    title: isAdmissionBill
                        ? "Admission fee"
                        : `${bill.month} monthly fee`,

                    imageUrl: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                };

                // Delete old Cloudinary file
                if (oldPaymentProofPublicId) {
                    await deleteFiles(oldPaymentProofPublicId);
                }

                // Save new payment proof
                bill.paymentProof = paymentProof;
            }

            // -----------------------------------------------------
            // Reset payment status after rejection
            // -----------------------------------------------------
            if (isAdmissionBill) {
                bill.paymentStatus = "SUBMITTED";
                bill.paymentSubmittedAt = new Date();
            } else {
                bill.status = "PENDING";
                bill.submittedAt = new Date();
                bill.paidAt = new Date();
            }

            await bill.save();
            return res.json({
                success: true,
                message: "Bill resubmitted successfully"
            });
        }

        // =========================================================
        // 7. NEW PAYMENT SUBMISSION
        // =========================================================
        // Payment proof is required for a new submission
        if (!req.file) {
            return res.json({
                success: false,
                message: "Please provide payment proof"
            });
        }

        // =========================================================
        // 8. UPLOAD PAYMENT PROOF
        // =========================================================
        const uploadResult = await uploadFiles(
            req.file,
            "paymentProof"
        );

        if (
            !uploadResult ||
            !uploadResult.secure_url ||
            !uploadResult.public_id
        ) {
            return res.json({
                success: false,
                message: "Payment proof upload failed"
            });
        }

        const paymentProof = {
            title: isAdmissionBill
                ? "Admission fee"
                : `${bill.month} monthly fee`,

            imageUrl: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };

        // =========================================================
        // 9. SAVE PAYMENT DATA
        // =========================================================
        if (isAdmissionBill) {
            bill.paymentStatus = "SUBMITTED";
            bill.paymentMethod = paymentMethod;
            bill.transactionId = transactionId;
            bill.paymentProof = paymentProof;
            bill.paymentSubmittedAt = new Date();
        } else {
            bill.status = "PENDING";
            bill.paymentMethod = paymentMethod;
            bill.transactionId = transactionId;
            bill.paymentProof = paymentProof;
            bill.submittedAt = new Date();
            bill.paidAt = new Date();
        }

        // =========================================================
        // 10. SAVE BILL
        // =========================================================

        await bill.save();
        // =========================================================
        // 11. RESPONSE
        // =========================================================
        return res.json({
            success: true,
            message: "Bill submitted successfully"
        });
    } catch (error) {
        console.error("SubmitBill Error:", error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const GetStudentProfileCont = async (req, res) => {
    try {
        const { isValid, student } = await validateStudent(req, res);
        if (!isValid) return;

        return res.json({ success: true, student });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal server error" });
    }
}

export const GetStudentFeesCont = async (req, res) => {
    try {
        const { isValid, student } = await validateStudent(req, res);
        if (!isValid) return;

        let fees = await Fee.find({ studentId: student._id });
        let institute = await Institute.findById(student.instituteId).select("instituteName instituteAddress institutePhone website");
        return res.json({ success: true, fees, institute });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal server error" });
    }
}

export const UpdateStudentProfileCont = async (req, res) => {
    try {
        const { isValid, student } = await validateStudent(req, res);
        if (!isValid) return;

        let changes = req.body;
        for (const key in changes) {
            if (changes[key] !== "") {
                student[key] = changes[key];
            }
        }
        await student.save();
        return res.json({ success: true, message: "Student profile updated successfully", student });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal server error" });
    }
}