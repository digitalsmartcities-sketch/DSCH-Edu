import apiClient, { API_URL, getApiError } from "./apiClient";

// =================================
// Public Api Calls
// =================================

export { API_URL };

export const getPublishedInstitutes = async (type, setInstitutes, setError, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get("/institutes", {
            params: type ? { type } : undefined,
        });

        if (res.data.success) {
            setInstitutes(res.data.institutes || []);
            setError?.("");
        } else {
            setError?.(res.data.message || "Institute could not be loaded.");
        }
    } catch (error) {
        setError?.(getApiError(error, "Institute could not be loaded."));
    } finally {
        setLoading?.(false);
    }
};

export const getPublishedInstituteById = async (id, setInstData, setError, setLoading) => {
    setLoading?.(true);
    try {
        const res = await apiClient.get(`/institutes/${id}`);

        if (res.data.success) {
            setInstData(res.data.institute);
            setError?.("");
        } else {
            setError?.(res.data.message || "Institute could not be loaded.");
        }
    } catch (error) {
        setError?.(getApiError(error, "Institute could not be loaded."));
    } finally {
        setLoading?.(false);
    }
};

export const registerAdmin = async (admin_data, setLoading, setMessage) => {
    setLoading?.(true);
    setMessage?.({ text: "Processing...", type: "info" });

    try {
        const res = await apiClient.post("/reg/admin", admin_data);

        if (res.data.success) {
            setMessage?.({ text: res.data.message, type: "success" });
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. Try again.");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const loginApi = async (formData, setLoading, setMessage, navigate, setUserState) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/login", formData);

        if (res.data.success) {
            setMessage?.({ text: res.data.message, type: "success" });
            setUserState?.(res.data.user || "login");
            navigate?.(res.data.redirectUrl);
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Invalid email or password.");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const verifyEmail = async (registrationData, setOtp, setLoading, setMessage) => {
    setLoading?.(true);
    setMessage?.({ text: "Processing...", type: "info" });

    try {
        const res = await apiClient.post("/verify/email", registrationData);

        if (res.data.success) {
            setOtp?.(true);
            setMessage?.({ text: res.data.message, type: "success" });
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getUserState = (setUserState) => {
    apiClient
        .get("/user/loginState")
        .then((res) => {
            if (res.data.success) {
                setUserState?.(res.data.user || "login");
            } else {
                setUserState?.(null);
            }
        })
        .catch(() => {
            setUserState?.(null);
        });
};

export const logOutApi = (setUserState, navigate) => {
    apiClient
        .get("/logout")
        .finally(() => {
            setUserState?.(null);
            navigate?.("/");
        });
};

export const AdmissionSubmissionApi = async (formData, setLoading, setMessage) => {
    setLoading?.(true);
    setMessage?.({ text: "Processing...", type: "info" });

    try {
        const res = await apiClient.post("/submit/admission", formData);

        if (res.data.success) {
            setMessage?.({ text: res.data.message, type: "success" });
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong.");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const getHeroPageInstitutes = (setHeroPageInstitutes) => {
    apiClient
        .get("/hero/page/institutes")
        .then((res) => {
            if (res.data.success) {
                setHeroPageInstitutes?.(res.data.institutes || []);
            }
        })
        .catch(() => { });
};

// FORGET PASSWORD (RECOVERY)
export const sendOTPToVerifyEmailToResetPass = async (setLoading, setMessage, setStep, email) => {
    setLoading?.(true);
    setMessage?.({ text: "Processing...", type: "info" });

    try {
        const res = await apiClient.post("/reset_password/verify_email", { email });

        if (res.data.success) {
            setStep?.(2);
            setMessage?.({ text: res.data.message, type: "success" });
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. please try again");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const verifyOTPToResetPass = async (setLoading, setMessage, setStep, otp) => {
    setLoading?.(true);
    setMessage?.({ text: "Processing...", type: "info" });

    try {
        const res = await apiClient.post("/reset_password/verify_otp", { otp });

        if (res.data.success) {
            setStep?.(3);
            setMessage?.({ text: res.data.message, type: "success" });
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. please try again");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const resetPassword = async (setLoading, setMessage, setStep, password, confirmPassword, email) => {
    setLoading?.(true);
    setMessage?.({ text: "Processing...", type: "info" });

    try {
        const res = await apiClient.post("/reset_password", { password, confirmPassword, email });

        if (res.data.success) {
            setStep?.(4);
            setMessage?.({ text: res.data.message, type: "success" });
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. please try again");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

// CHANGE PASSWORD: USER KNOWS CURRENT PASSWORD. ALTHOUGH THIS API IS ASSOCIATED WITH THE DASHBORDS BUT IT IS USED BY MORE THAN ONE DASHBOARD, THAT'S WHY PLACED IT HERE, NOT IN RESPECTIVE DASHBOARD APICALL.JSX:
export const changePassword = async (form, setLoading, setMessage) => {
    setLoading?.(true);
    setMessage?.({ text: "Processing...", type: "info" });

    try {
        const res = await apiClient.post("/change_password", form);

        if (res.data.success) {
            setMessage?.({ text: res.data.message, type: "success" });
            return { success: true, message: res.data.message };
        }

        setMessage?.({ text: res.data.message, type: "error" });
        return { success: false, message: res.data.message };
    } catch (error) {
        const message = getApiError(error, "Something went wrong. please try again");
        setMessage?.({ text: message, type: "error" });
        return { success: false, message };
    } finally {
        setLoading?.(false);
    }
};

export const handleReviewSubmission = async (setLoading, setRating, setReview, rating, review, setReviews, instituteId) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/handle/review", { rating, review, instituteId });

        if (res.data.success) {
            setRating?.(0);
            setReview?.("");
            setReviews?.((prev) => {
                const newReview = res.data.newReview;
                if (Array.isArray(prev)) {
                    return [newReview, ...prev];
                }
                return [newReview];
            });
            return { success: true, message: res.data.message };
        }

        return { success: false, message: res.data.message };
    } catch (error) {
        return { success: false, message: getApiError(error, "Something went wrong, Please try again.") };
    } finally {
        setLoading?.(false);
    }
};

export const getTheReviews = async (setReviews, setLoading, instituteId) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/get/reviews", { instituteId });

        if (res.data.success) {
            setReviews?.(res.data.reviews || []);
        }
    } catch (error) {
        return { success: false, message: getApiError(error, "Something went wrong, Please try again.") };
    } finally {
        setLoading?.(false);
    }

    return { success: true };
};

export const submitContactForm = async (setLoading, setFormData, formData) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/submit/contact-form", formData);

        if (res.data.success) {
            setFormData?.({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
            return { success: true, message: res.data.message };
        }

        return { success: false, message: res.data.message };
    } catch (error) {
        return { success: false, message: getApiError(error, "Something went wrong, Please try again.") };
    } finally {
        setLoading?.(false);
    }
};

export const fetchAllCourses = async (setCourses, setLoading) => {
    try {
        const res = await apiClient.get("/get/all/courses");

        if (res.data.success) {
            setCourses?.(res.data.courses || []);
        }
    } catch (error) {
        return { success: false, message: getApiError(error, "Courses could not be loaded.") };
    } finally {
        setLoading?.(false);
    }

    return { success: true };
};

export const getCourseById = async (id, setCourse, setLoading, setError) => {
    try {
        const res = await apiClient.get(`/get/course/${id}`);

        if (res.data.success) {
            setCourse?.(res.data.course);
            setError?.("");
        } else {
            setError?.(res.data.message || "Course could not be loaded.");
        }
    } catch (error) {
        setError?.(getApiError(error, "Course could not be loaded."));
    } finally {
        setLoading?.(false);
    }
};

export const submitCourseEnrollment = async (formData, setLoading, navigate) => {
    setLoading?.(true);

    try {
        const res = await apiClient.post("/submit/course/enrollment", formData);

        if (res.data.success) {
            navigate?.("/");
            return { success: true, message: res.data.message };
        }

        return { success: false, message: res.data.message };
    } catch (error) {
        return { success: false, message: getApiError(error, "Something went wrong, Please try again.") };
    } finally {
        setLoading?.(false);
    }
};
