import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL;

// ========================================
// Student APIs
// ========================================
export const checkStudentAccess = async (setMessage, setSubpage, setCanAccess, setStudent) => {
    await axios.get(`${API_URL}/check/student/access`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setCanAccess(res.data.canAccess);
            setStudent(res.data.student);
            setSubpage("Home");
        } else {
            setMessage({
                text: res.data.message,
                type: "error"
            });
        }
    }).catch(() => {
        setMessage({ text: "Something went wrong", type: "error" });
    });
};

export const getmyApplication = (setMy_Application) => {
    axios.get(`${API_URL}/get/my/application`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setMy_Application(res.data.application);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const getBillById = (id, setBillData, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/get/bill/ById`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setBillData(res.data.billData);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const submitBill = (formData, setSubmitting, setSubPage, prevPage) => {
    setSubmitting(true);
    axios.post(`${API_URL}/submit/bill`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            setSubPage(prevPage);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setSubmitting(false);
    });
};

export const getStudentProfile = (setStudent, setLoading) => {
    setLoading(true);
    axios.get(`${API_URL}/get/student/profile`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStudent(res.data.student);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const getStudentFees = (setFees, setLoading, setInstitute) => {
    setLoading(true);
    axios.get(`${API_URL}/get/student/fees`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setFees(res.data.fees);
            setInstitute(res.data.institute);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const updateStudentProfile = (changes, setLoading, setStudent) => {
    setLoading(true);
    axios.post(`${API_URL}/update/student/profile`, changes, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            setStudent(res.data.student);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};