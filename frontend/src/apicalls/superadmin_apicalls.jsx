import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL;

// ================================
// Super Admin APIs
// ================================

export const checkSuperAdminAccess = (setSubpage, setMessage) => {
    axios.get(`${API_URL}/verify/superadmin`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setSubpage("Home");
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
    });
};

export const getApplications = (setApplications, navigate) => {
    axios.get(`${API_URL}/get/applications`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setApplications(res.data.applications);
        } else {
            alert(res.data.message);
            navigate("/");
        }
    }).catch(() => {
        alert("Something went wrong.");
        navigate("/");
    });
};

export const getAdminById = (id, setAdmins, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/get/admin/ById`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setAdmins(res.data.admin);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const approveAdmin = (id, setSubpage, setAdmins, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/approve/admin`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            setSubpage("Applications");
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const disableAdmin = (id, setApplications, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/disable/admin`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setApplications(prev => prev.map(app =>
                app._id === id ? { ...app, disabled: true } : app
            ));
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const enableAdmin = (id, setApplications, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/enable/admin`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setApplications(prev => prev.map(app =>
                app._id === id ? { ...app, disabled: false } : app
            ));
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const rejectAdminApplication = (id, setSubpage, setLoading) => {
    setLoading(true);
    let reason = prompt("Enter Reason for rejection:");
    if (!reason) {
        alert("Reason is required");
        setLoading(false);
        return;
    }
    axios.post(`${API_URL}/rejectAdminApplication`, { id, reason }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            setSubpage("Applications");
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const updateRejectedAdminApplication = (data, close) => {
    axios.post(`${API_URL}/update/admin/aplication`, data, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            close();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const createCourse = (data, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/create/course`, data, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong. Try Again Later.");
    }).finally(() => setLoading(false));
};

export const getAllCoursesEnrollments = (setEnrollments, setLoading) => {
    setLoading(true);
    axios.get(`${API_URL}/get/all/courses/enrollments`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setEnrollments(res.data.enrollments);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong. Try Again Later.");
    }).finally(() => setLoading(false));
};

export const getEnrollmentById = (id, setEnrollment, setLoading) => {
    setLoading(true);
    axios.get(`${API_URL}/get/enrollment/${id}`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setEnrollment(res.data.enrollment);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong. Try Again Later.");
    }).finally(() => setLoading(false));
};

export const approveCourseEnrollment = (id, setLoading, goBack) => {
    setLoading(true);
    axios.get(`${API_URL}/approve/course/enrollment/${id}`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            goBack();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong. Try Again Later.");
    }).finally(() => setLoading(false));
};

export const rejectCourseEnrollment = (id, setLoading, goBack) => {
    let reason = prompt("Enter Reason for rejection:");
    if (!reason) {
        alert("Reason is required");
        setLoading(false);
        return;
    }
    setLoading(true);
    axios.post(`${API_URL}/reject/course/enrollment/${id}`, { reason }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            goBack();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong. Try Again Later.");
    }).finally(() => setLoading(false));
};

export const resubmitCourseEnrollmentPayment = (id, data, setLoading, setMessage, onBack) => {
    setLoading(true);
    axios.post(`${API_URL}/resubmit/course/enrollment/payment/${id}`, data, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            onBack();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong. Try Again Later.");
    }).finally(() => setLoading(false));
};

export const getCertificateData = async (id, setStudent, setCourse) => {
    await axios.get(`${API_URL}/get/certificate/${id}`, {
        withCredentials: true
    }).then((res) => {  
        if (res.data.success) {
            setStudent(res.data.responseData.student);
            setCourse(res.data.responseData.course);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong. Try Again Later.");
    });
};
