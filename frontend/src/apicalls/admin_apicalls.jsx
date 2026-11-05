import apiClient, { API_URL, getApiError } from "./apiClient";
import notify from "../components/toast/toastBus";

// =====================================
// Admin (Service Owner/Provider) APIs
// =====================================
export { API_URL };

/**
 * Small helper that performs a request and reports the outcome through the
 * toast bus. Every admin action used to open a native `alert()`, which
 * blocked the UI and hid the actual backend message.
 */
const run = async ({ request, successMessage, onSuccess, fallback }) => {
    try {
        const res = await request();

        if (res?.data?.success) {
            notify.success(successMessage || res.data.message);
            onSuccess?.(res.data);
            return { success: true, data: res.data };
        }

        const message = res?.data?.message || fallback;
        notify.error(message);
        return { success: false, message };
    } catch (error) {
        const message = getApiError(error, fallback);
        notify.error(message);
        return { success: false, message };
    }
};

export const checkAdminAccess = async (setSubpage, setMessage) => {
    try {
        const res = await apiClient.get("/verify/admin");

        if (res.data.success) {
            setSubpage?.("Home");
        } else {
            setMessage?.({
                text: res.data.message,
                type: "error",
            });
        }
    } catch (error) {
        setMessage?.({
            text: getApiError(error, "Something went wrong."),
            type: "error",
        });
    }
};

export const getInstituteData = async (setBasicInfo) => {
    return run({
        request: () => apiClient.get("/get/instData"),
        fallback: "Institute data could not be loaded.",
        onSuccess: (data) => setBasicInfo?.(data.data),
    });
};

export const SaveHeroImagesApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/heroImages", formData),
        fallback: "Something went wrong.",
    });

export const SaveBrandingImagesApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/brandingImages", formData),
        fallback: "Something went wrong.",
    });

export const SaveQuickInfoApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/quickInfo", formData),
        fallback: "Something went wrong.",
    });

export const SaveAboutInfoApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/aboutInfo", formData),
        fallback: "Something went wrong.",
    });

export const SaveAcademicProgramsApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/academicPrograms", formData),
        fallback: "Something went wrong.",
    });

export const SaveFacilitiesApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/facilities", formData),
        fallback: "Something went wrong.",
    });

export const SaveGalleryApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/gallery", formData),
        fallback: "Something went wrong.",
    });

export const SaveFaqsApi = (formData) =>
    run({
        request: () => apiClient.post("/save/instData/faqs", formData),
        fallback: "Something went wrong.",
    });

export const publishInstituteApi = async () =>
    run({
        request: () => apiClient.post("/publish/instData", {}),
        fallback: "Something went wrong.",
    });

export const getAdmissionApplications = async (setApplications, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/get/admission/applications", {});

        if (res.data.success) {
            setApplications?.(res.data.applications || []);
        } else {
            notify.error(res.data.message || "Applications could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const GetApplicationByIdApi = async (id, setLoading, setStudent) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/get/application/ById", { id });

        if (res.data.success) {
            setStudent?.(res.data.application);
        } else {
            notify.error(res.data.message || "Application could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const approveAdmission = async (id, setSubpage, setLoading, addmonthlyFee = false) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/approve/admission", { id, addmonthlyFee });

        if (res.data.success) {
            notify.success(res.data.message);
            setSubpage?.("Admissions");
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const handleApplicationDelete = async (id, setLoading, setApplications) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/delete/admission/application", { id });

        if (res.data.success) {
            notify.success(res.data.message);
            setApplications?.((prev) => prev.filter((app) => app._id !== id));
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const rejectAdmission = async (id, rejectionReason, setSubpage, setLoading) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/reject/admission", {
            applicationId: id,
            rejectionReason,
        });

        if (res.data.success) {
            notify.success(res.data.message);
            setSubpage?.("Admissions");
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const approveStudentAdmissionPayment = async (admissionId, setLoading) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/approve/student/payment", { admissionId });

        if (res.data.success) {
            notify.success(res.data.message);
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getInstituteStudents = async (setStudents, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/get/institute/students");

        if (res.data.success) {
            setStudents?.(res.data.students || []);
        } else {
            notify.error(res.data.message || "Students could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const getStudentById = async (id, setStudent, setLoading, setAdmissionApplication) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/get/student/ById", { id });

        if (res.data.success) {
            setStudent?.(res.data.student);
            setAdmissionApplication?.(res.data.admissionData);
        } else {
            notify.error(res.data.message || "Student could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const getStudentPaymentById = async (id, setStudent, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/get/student/payment/ById", { id });

        if (res.data.success) {
            setStudent?.(res.data.student);
        } else {
            notify.error(res.data.message || "Payment details could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const getFeesRecord = async (setFees, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/get/inst/fees");

        if (res.data.success) {
            setFees?.(res.data.fees || []);
        } else {
            notify.error(res.data.message || "Fee records could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const generateMonthlyFee = async (feeOfClass, month, year, setLoading) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/generate/monthly/fee", { feeOfClass, month, year });

        if (res.data.success) {
            notify.success(res.data.message || "Monthly fee generated successfully.");
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const approveMonthlyFeePayment = async (id, setLoading, close) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/approve/payment/fee", { id });

        if (res.data.success) {
            notify.success(res.data.message || "Payment approved.");
            close?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getStudentDataForCertificate = async (id, setData, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/certificate/studentData", { id });

        if (res.data.success) {
            setData?.(res.data.data);
        } else {
            notify.error(res.data.message || "Certificate data could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const updateRejectedStudentApplication = async (data, close, setLoading) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/update/student/aplication", data);

        if (res.data.success) {
            notify.success(res.data.message || "Corrections submitted successfully.");
            close?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getAdminProfile = async (setAdmin, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/admin/profile");

        if (res.data.success) {
            setAdmin?.(res.data.admin);
        } else {
            notify.error(res.data.message || "Profile could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const rejectStudentPayment = async (id, reason, close, setLoading) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/reject/student/payment", { id, reason });

        if (res.data.success) {
            notify.success(res.data.message || "Payment rejected.");
            close?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const generateFeeForStudent = async (id, month, year, setLoading) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/generate/fee/for/student", { id, month, year });

        if (res.data.success) {
            notify.success(res.data.message || "Fee generated successfully.");
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const rejectFeePayment = async (id, reason, close, setLoading) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post(`/reject/fee/payment/${id}`, { reason });

        if (res.data.success) {
            notify.success(res.data.message || "Payment rejected successfully.");
            close?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

/**
 * Suspending a student changes state on the server, therefore it is a POST
 * request (the backend routes were changed from GET to POST for that reason).
 */
export const suspendTheStudent = async (id, setLoading, setStudents) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post(`/suspend/student/${id}`);

        if (res.data.success) {
            notify.success(res.data.message || "Student suspended successfully.");
            setStudents?.((prev) =>
                prev.map((student) =>
                    student._id === id ? { ...student, status: "SUSPENDED" } : student
                )
            );
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const unsuspendTheStudent = async (id, setLoading, setStudents) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post(`/unsuspend/student/${id}`);

        if (res.data.success) {
            notify.success(res.data.message || "Student unsuspended successfully.");
            setStudents?.((prev) =>
                prev.map((student) =>
                    student._id === id ? { ...student, status: "ACTIVE" } : student
                )
            );
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};
