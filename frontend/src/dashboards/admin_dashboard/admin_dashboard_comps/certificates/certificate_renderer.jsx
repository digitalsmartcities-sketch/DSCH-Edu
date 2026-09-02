import { useEffect, useState } from "react";

import { ModernCertificate } from "./modern/modern_certificate";
import { ClassicCertificate } from "./classic/classic_certificate";
import { InlineCertificate } from "./inline/inline_certificate";
import { getStudentDataForCertificate } from "../../../../apicalls/admin_apicalls";

export const CertificateRenderer = ({ studentId, certificateType, template }) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudentDataForCertificate(
            studentId,
            setData,
            setLoading
        );
    }, [studentId]);

    if (loading) {
        return <div>Loading certificate...</div>;
    }

    if (!data) {
        return <div>Certificate data not found.</div>;
    }

    const certificateProps = {
        student: data.student,
        institute: data.institute,
        certificateType
    };

    switch (template) {
        case "MODERN":
            return (
                <ModernCertificate
                    {...certificateProps}
                />
            );

        case "CLASSIC":
            return (
                <ClassicCertificate
                    {...certificateProps}
                />
            );

        case "INLINE":
            return (
                <InlineCertificate
                    {...certificateProps}
                />
            );

        default:
            return <div>Invalid certificate template.</div>;
    }
};