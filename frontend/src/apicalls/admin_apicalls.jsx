import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL;

// =====================================
// Admin (Service Owner/Provider) APIs
// =====================================
export const checkAdminAccess = (setSubpage, setMessage) => {
    axios.get(`${API_URL}/verify/admin`, {
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

export const getInstituteData = (setBasicInfo) => {
    axios.get(`${API_URL}/get/instData`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setBasicInfo(res.data.data);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveHeroImagesApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/heroImages`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveBrandingImagesApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/brandingImages`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveQuickInfoApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/quickInfo`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveAboutInfoApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/aboutInfo`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveAcademicProgramsApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/academicPrograms`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveFacilitiesApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/facilities`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveGalleryApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/gallery`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const SaveFaqsApi = (formData) => {
    return axios.post(`${API_URL}/save/instData/faqs`, formData, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    });
};

export const publishInstituteApi = () => {
    return axios.post(`${API_URL}/publish/instData`, {}, {
        withCredentials: true
    }).then((res) => {
        alert(res.data.message);
        return res.data;
    }).catch((err) => {
        alert(err.response?.data?.message || "Something went wrong.");
    });
};

export const getAdmissionApplications = (setApplications, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/get/admission/applications`, {}, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setApplications(res.data.applications);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const GetApplicationByIdApi = async (id, setLoading, setStudent) => {
    setLoading(true);
    axios.post(`${API_URL}/get/application/ById`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStudent(res.data.application);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const approveAdmission = async (id, setSubpage, setLoading) => {
    setLoading(true);
    let addmonthlyFee = prompt("Do you want to add the monthly fee with admission to submit? Just reply in 'Yes' or 'No'");
    let data = {
        id: id,
        addmonthlyFee: undefined
    };
    if (!addmonthlyFee || addmonthlyFee.trim() === "") {
        setLoading(false);
        alert("Please enter yes or no.");
        return;
    }
    if (addmonthlyFee.toLowerCase() === "yes") {
        data.addmonthlyFee = true;
    } else if (addmonthlyFee.toLowerCase() === "no") {
        data.addmonthlyFee = false;
    } else {
        setLoading(false);
        alert("Please enter yes or no.");
        return;
    }

    axios.post(`${API_URL}/approve/admission`, data, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            setSubpage("Admissions");
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const handleApplicationDelete = (id, setLoading, setApplications) => {
    setLoading(true);
    axios.post(`${API_URL}/delete/admission/application`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            setApplications((prev) =>
                prev.filter((app) => app._id !== id)
            );
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const rejectAdmission = (id, rejectionReason, setSubpage, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/reject/admission`, {
        applicationId: id,
        rejectionReason
    }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
            setSubpage("Admissions");
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const approveStudentAdmissionPayment = (admissionId, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/approve/student/payment`, { admissionId }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert(res.data.message);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const getInstituteStudents = (setStudents, setLoading) => {
    setLoading(true);
    axios.get(`${API_URL}/get/institute/students`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStudents(res.data.students);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const getStudentById = (id, setStudent, setLoading, setAdmissionApplication) => {
    setLoading(true);
    axios.post(`${API_URL}/get/student/byId`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStudent(res.data.student);
            setAdmissionApplication(res.data.admissionData);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const getStudentPaymentById = (id, setStudent, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/get/student/payment/ById`, { id }, {
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

export const getFeesRecord = (setFees, setLoading) => {
    setLoading(true);
    axios.get(`${API_URL}/get/inst/fees`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setFees(res.data.fees);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const generateMonthlyFee = (feeOfClass, month, year, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/generate/monthly/fee`, { feeOfClass, month, year }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert("Okay");
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const approveMonthlyFeePayment = (id, setLoading, close) => {
    setLoading(true);
    axios.post(`${API_URL}/approve/payment/fee`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            close();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => setLoading(false));
};

export const getStudentDataForCertificate = (id, setData, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/certificate/studentData`, { id }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setData(res.data.data);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const updateRejectedStudentApplication = (data, close, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/update/student/aplication`, data, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            close();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const getAdminProfile = (setAdmin, setLoading) => {
    setLoading(true);
    axios.get(`${API_URL}/admin/profile`, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setAdmin(res.data.admin);
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const rejectStudentPayment = (id, reason, close, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/reject/student/payment`, { id, reason }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            close();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const generateFeeForStudent = (id, month, year, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/generate/fee/for/student`, { id, month, year }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert("Fee generated successfully.");
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const rejectFeePayment = (id, reason, close, setLoading) => {
    setLoading(true);
    axios.post(`${API_URL}/reject/fee/payment/${id}`, { reason }, {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            alert("Payment rejected successfully.");
            close();
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const suspendTheStudent = (id, setLoading, setStudents) => {
    setLoading(true);
    axios.get(`${API_URL}/suspend/student/${id}`,
    {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStudents((prev) => (
                prev.map((student) => {
                    if (student._id === id) {
                        return { ...student, status: "SUSPENDED" };
                    }
                    return student;
                })
            ));
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};

export const unsuspendTheStudent = (id, setLoading, setStudents) => {
    setLoading(true);
    axios.get(`${API_URL}/unsuspend/student/${id}`,
    {
        withCredentials: true
    }).then((res) => {
        if (res.data.success) {
            setStudents((prev) => (
                prev.map((student) => {
                    if (student._id === id) {
                        return { ...student, status: "ACTIVE" };
                    }
                    return student;
                })
            ));
        } else {
            alert(res.data.message);
        }
    }).catch(() => {
        alert("Something went wrong.");
    }).finally(() => {
        setLoading(false);
    });
};