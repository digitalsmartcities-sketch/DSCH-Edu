import apiClient, { API_URL, getApiError } from "./apiClient";
import notify from "../components/toast/toastBus";

// ================================
// Super Admin APIs
// ================================
export { API_URL };

export const checkSuperAdminAccess = async (setSubpage, setMessage) => {
    try {
        const res = await apiClient.get("/verify/superadmin");

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

export const getApplications = async (setApplications, navigate) => {
    try {
        const res = await apiClient.get("/get/applications");

        if (res.data.success) {
            setApplications?.(res.data.applications || []);
        } else {
            notify.error(res.data.message || "Applications could not be loaded.");
            navigate?.("/");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
        navigate?.("/");
    }
};

export const getAdminById = async (id, setAdmins, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/get/admin/ById", { id });

        if (res.data.success) {
            setAdmins?.(res.data.admin);
        } else {
            notify.error(res.data.message || "Admin could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const approveAdmin = async (id, setSubpage, setAdmins, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/approve/admin", { id });

        if (res.data.success) {
            notify.success(res.data.message);
            setSubpage?.("Applications");
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

export const disableAdmin = async (id, setApplications, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/disable/admin", { id });

        if (res.data.success) {
            notify.success(res.data.message || "Admin disabled successfully.");
            setApplications?.((prev) =>
                prev.map((app) => (app._id === id ? { ...app, disabled: true } : app))
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

export const enableAdmin = async (id, setApplications, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/enable/admin", { id });

        if (res.data.success) {
            notify.success(res.data.message || "Admin enabled successfully.");
            setApplications?.((prev) =>
                prev.map((app) => (app._id === id ? { ...app, disabled: false } : app))
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

export const deleteAdminApplication = async (id, setApplications, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/delete/admin/application", { id });

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

export const rejectAdminApplication = async (id, reason, setSubpage, setLoading) => {
    if (!reason || !String(reason).trim()) {
        notify.error("A rejection reason is required.");
        return { success: false, message: "A rejection reason is required." };
    }

    setLoading?.(true);
    try {
        const res = await apiClient.post("/rejectAdminApplication", { id, reason });

        if (res.data.success) {
            notify.success(res.data.message);
            setSubpage?.("Applications");
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

export const updateRejectedAdminApplication = async (data, close) => {
    try {
        const res = await apiClient.post("/update/admin/aplication", data);

        if (res.data.success) {
            notify.success(res.data.message || "Application updated successfully.");
            close?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    }
};

export const createCourse = async (data, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/create/course", data);

        if (res.data.success) {
            notify.success(res.data.message);
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. Try Again Later.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getAllCoursesForManagement = async (setCourses, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/get/all/courses/manage");

        if (res.data.success) {
            setCourses?.(res.data.courses || []);
            return { success: true, courses: res.data.courses || [] };
        }

        notify.error(res.data.message || "Courses could not be loaded.");
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. Try Again Later.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const updateCourse = async (id, data, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post(`/update/course/${id}`, data);

        if (res.data.success) {
            notify.success(res.data.message);
            return { success: true, message: res.data.message, course: res.data.course };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. Try Again Later.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getAllCoursesEnrollments = async (setEnrollments, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/get/all/courses/enrollments");

        if (res.data.success) {
            setEnrollments?.(res.data.enrollments || []);
        } else {
            notify.error(res.data.message || "Enrollments could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong. Try Again Later."));
    } finally {
        setLoading?.(false);
    }
};

export const getEnrollmentById = async (id, setEnrollment, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get(`/get/enrollment/${id}`);

        if (res.data.success) {
            setEnrollment?.(res.data.enrollment);
        } else {
            notify.error(res.data.message || "Enrollment could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong. Try Again Later."));
    } finally {
        setLoading?.(false);
    }
};

/**
 * Approving an enrollment changes state on the server, so the request is a
 * POST (the backend route was changed from GET to POST for that reason).
 */
export const approveCourseEnrollment = async (id, setLoading, goBack) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post(`/approve/course/enrollment/${id}`);

        if (res.data.success) {
            notify.success(res.data.message);
            goBack?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. Try Again Later.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const rejectCourseEnrollment = async (id, reason, setLoading, goBack) => {
    if (!reason || !String(reason).trim()) {
        notify.error("A rejection reason is required.");
        return { success: false, message: "A rejection reason is required." };
    }

    setLoading?.(true);
    try {
        const res = await apiClient.post(`/reject/course/enrollment/${id}`, { reason });

        if (res.data.success) {
            notify.success(res.data.message);
            goBack?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. Try Again Later.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const resubmitCourseEnrollmentPayment = async (id, data, setLoading, setMessage, onBack) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post(`/resubmit/course/enrollment/payment/${id}`, data);

        if (res.data.success) {
            notify.success(res.data.message);
            onBack?.();
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. Try Again Later.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getCertificateData = async (id, setStudent, setCourse) => {
    try {
        const res = await apiClient.get(`/get/certificate/${id}`);

        if (res.data.success) {
            setStudent?.(res.data.responseData.student);
            setCourse?.(res.data.responseData.course);
        } else {
            notify.error(res.data.message || "Certificate data could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong. Try Again Later."));
    }
};
