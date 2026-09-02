import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL;

// =================================
// Public Api Calls
// =================================

export const getPublishedInstitutes = async (type, setInstitutes, setError, setLoading) => {
    setLoading(true);
    await axios.get(`${API_URL}/institutes`, {
        params: type ? { type } : undefined
    }).then((res) => {
        if (res.data.success) {
            setInstitutes(res.data.institutes);
        } else {
            setError(res.data.message);
        }
    }).catch(() => {
        setError("Institute could not be loaded.");
    }).finally(() => setLoading(false));
};

export const getPublishedInstituteById = async (id, setInstData, setError, setLoading) => {
    await axios.get(`${API_URL}/institutes/${id}`)
        .then((res) => {
            if (res.data.success) {
                setInstData(res.data.institute);
            } else {
                setError(res.data.message);
            }
        })
        .catch(() => {
            setError("Institute could not be loaded.");
        })
        .finally(() => setLoading(false));
};

export const registerAdmin = (admin_data, setLoading, setMessage) => {
    setLoading(true);
    setMessage({
        text: "Processing...",
        type: "success"
    });
    axios.post(`${API_URL}/reg/admin`, admin_data, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setMessage({
                text: res.data.message,
                type: "success"
            });
            window.open("/");
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({
            text: "Something went wrong. Try again.",
            type: "error"
        });
    }).finally(() => {
        setLoading(false);
    });
};

export const loginApi = (formData, setLoading, setMessage, navigate, setUserState) => {
    setLoading(true);
    axios.post(`${API_URL}/login`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setMessage({
                text: res.data.message,
                type: "success"
            });
            setUserState("login");
            navigate(res.data.redirectUrl);
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({
            text: "Something went wrong.",
            type: "error"
        });
    }).finally(() => setLoading(false));
};

export const verifyEmail = (email, ownerName, setOtp, setLoading, setMessage) => {
    setLoading(true);
    setMessage({
        text: "Processing...",
        type: "success"
    });
    axios.post(`${API_URL}/verify/email`, { email, ownerName }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setOtp(true);
            setMessage({
                text: res.data.message,
                type: "success"
            });
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({
            text: "Something went wrong.",
            type: "error"
        });
    }).finally(() => setLoading(false));
};

export const getUserState = (setUserState) => {
    axios.get(`${API_URL}/user/loginState`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setUserState("login");
        } else {
            setUserState(null);
        }
    }).catch(() => {
        setUserState(null);
    });
};

export const logOutApi = (setUserState, navigate) => {
    axios.get(`${API_URL}/logout`, {
        withCredentials: true
    }).finally(() => {
        setUserState(null);
        navigate("/");
    });
};

export const AdmissionSubmissionApi = async (formData, setLoading, setMessage) => {
    setLoading(true);
    setMessage({
        text: "Processing...",
        type: "success"
    });
    await axios.post(`${API_URL}/submit/admission`, formData)
        .then((res) => {
            if (res.data.success) {
                setMessage({
                    text: res.data.message,
                    type: "success"
                });
            } else {
                setMessage({
                    text: res.data.message,
                    type: "error"
                });
            }
        }).catch(() => {
            setMessage({
                text: "Something went wrong.",
                type: "error"
            });
        }).finally(() => setLoading(false));
};

export const getHeroPageInstitutes = (setHeroPageInstitutes) => {
    axios.get(`${API_URL}/hero/page/institutes`)
        .then((res) => {
            if (res.data.success) {
                setHeroPageInstitutes(res.data.institutes);
            }
        }).catch(() => { });
};

// FORGET PASSWORD (RECOVERY)
export const sendOTPToVerifyEmailToResetPass = (setLoading, setMessage, setStep, email) => {
    setLoading(true);
    setMessage({
        text: "Processing...",
        type: "success"
    });
    axios.post(`${API_URL}/reset_password/verify_email`, { email }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStep(2);
            setMessage({
                text: res.data.message,
                type: "success"
            });
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({
            text: "Something went wrong. please try again",
            type: "error"
        });
    }).finally(() => setLoading(false));
};

export const verifyOTPToResetPass = (setLoading, setMessage, setStep, otp) => {
    setLoading(true);
    setMessage({
        text: "Processing...",
        type: "success"
    });
    axios.post(`${API_URL}/reset_password/verify_otp`, { otp }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStep(3);
            setMessage({
                text: res.data.message,
                type: "success"
            });
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({
            text: "Something went wrong. please try again",
            type: "error"
        });
    }).finally(() => setLoading(false));
};

export const resetPassword = (setLoading, setMessage, setStep, password, confirmPassword, email) => {
    setLoading(true);
    setMessage({
        text: "Processing...",
        type: "success"
    });
    axios.post(`${API_URL}/reset_password`, { password, confirmPassword, email }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStep(1);
            setMessage({
                text: res.data.message,
                type: "success"
            });
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({
            text: "Something went wrong. please try again",
            type: "error"
        });
    }).finally(() => setLoading(false));
};

// CHANGE PASSWORD: USER KNOWS CURRENT PASSWORD. ALTHOUGH THIS API IS ASSOCIATED WITH THE DASHBORDS BUT IT IS USED BY MORE THAN ONE DASHBOARD, THAT'S WHY PLACED IT HERE, NOT IN RESPECTIVE DASHBOARD APICALL.JSX:
export const changePassword = (form, setLoading, setMessage) => {
    setLoading(true);
    setMessage({
        text: "Processing...",
        type: "success"
    });
    axios.post(`${API_URL}/change_password`, form, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setMessage({
                text: res.data.message,
                type: "success"
            });
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({
            text: "Something went wrong. please try again",
            type: "error"
        });
    }).finally(() => setLoading(false));
};

export const handleReviewSubmission = (setLoading, setRating, setReview, rating, review, setReviews, instituteId) => {
    setLoading(true);
    axios.post(`${API_URL}/handle/review`, {
        rating,
        review,
        instituteId
    }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setRating(0);
            setReview("");
            setReviews((prev) => {
                if (Array.isArray(prev)) {
                    return [res.data.newReview, ...prev];
                }
                return [res.data.newReview];
            });
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong, Please try again.");
    }).finally(() => setLoading(false));
};

export const getTheReviews = (setReviews, setLoading, instituteId) => {
    setLoading(true);
    axios.post(`${API_URL}/get/reviews`, { instituteId })
        .then((res) => {
            if (res.data.success) {
                if (res.data?.reviews) {
                    setReviews(res.data.reviews);
                } else {
                    setReviews([]);
                }
            }
        }).catch(() => {
            alert("Something went wrong, Please try again.");
        }).finally(() => {
            setLoading(false);
        });
};

export const submitContactForm = (setLoading, setFormData, formData) => {
    setLoading(true);
    axios.post(`${API_URL}/submit/contact-form`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setLoading(false);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
        } else {
            setLoading(false);
        }
    }).catch(() => {
        setLoading(false);
    });
};

export const fetchAllCourses = (setCourses, setLoading) => {
    axios.get(`${API_URL}/get/all/courses`)
        .then((res) => {
            if (res.data.success) {
                setCourses(res.data.courses);
            }
        }).catch(() => {
        }).finally(() => {
            if (setLoading) setLoading(false);
        });
};

export const getCourseById = (id, setCourse, setLoading) => {
    axios.get(`${API_URL}/get/course/${id}`)
        .then((res) => {
            if (res.data.success) {
                setCourse(res.data.course);
            }
        }).catch(() => {
            alert("Something went wrong, Please try again.");
        }).finally(() => {
            setLoading(false);
        });
};

export const submitCourseEnrollment = (formData, setLoading, navigate) => {
    setLoading(true);
    axios.post(`${API_URL}/submit/course/enrollment`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setLoading(false);
            navigate("/");
        } else {
            setLoading(false);
        }
    }).catch(() => {
        setLoading(false);
    });
};