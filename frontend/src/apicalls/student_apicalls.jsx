import apiClient, { API_URL, getApiError } from "./apiClient";
import notify from "../components/toast/toastBus";

// ========================================
// Student APIs
// ========================================
export { API_URL };

export const checkStudentAccess = async (setMessage, setSubpage, setCanAccess, setStudent) => {
    try {
        const res = await apiClient.get("/check/student/access");

        if (res.data.success) {
            setCanAccess?.(res.data.canAccess);
            setStudent?.(res.data.student);
            setSubpage?.("Home");
        } else {
            setMessage?.({
                text: res.data.message,
                type: "error",
            });
        }
    } catch (error) {
        setMessage?.({
            text: getApiError(error, "Something went wrong"),
            type: "error",
        });
    }
};

export const getmyApplication = async (setMy_Application) => {
    try {
        const res = await apiClient.get("/get/my/application");

        if (res.data.success) {
            setMy_Application?.(res.data.application);
        } else {
            notify.error(res.data.message || "Application could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    }
};

export const getBillById = async (id, setBillData, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/get/bill/ById", { id });

        if (res.data.success) {
            setBillData?.(res.data.billData);
        } else {
            notify.error(res.data.message || "Bill could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const submitBill = async (formData, setSubmitting, setSubPage, prevPage) => {
    setSubmitting?.(true);
    try {
        const res = await apiClient.post("/submit/bill", formData);

        if (res.data.success) {
            notify.success(res.data.message);
            setSubPage?.(prevPage);
            return { success: true, message: res.data.message };
        }

        notify.error(res.data.message);
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        notify.error(message);
        return { success: false, message };
    } finally {
        setSubmitting?.(false);
    }
};

export const getStudentProfile = async (setStudent, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/get/student/profile");

        if (res.data.success) {
            setStudent?.(res.data.student);
        } else {
            notify.error(res.data.message || "Profile could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const getStudentFees = async (setFees, setLoading, setInstitute) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/get/student/fees");

        if (res.data.success) {
            setFees?.(res.data.fees);
            setInstitute?.(res.data.institute);
        } else {
            notify.error(res.data.message || "Fees could not be loaded.");
        }
    } catch (error) {
        notify.error(getApiError(error, "Something went wrong."));
    } finally {
        setLoading?.(false);
    }
};

export const updateStudentProfile = async (changes, setLoading, setStudent) => {
    setLoading?.(true);
    try {
        const res = await apiClient.post("/update/student/profile", changes);

        if (res.data.success) {
            notify.success(res.data.message);
            setStudent?.(res.data.student);
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
