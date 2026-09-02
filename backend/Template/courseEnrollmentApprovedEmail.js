export const courseEnrollmentApprovedEmail = ({
    studentName,
    courseTitle,
    courseCode,
    instituteName,
    whatsappGroupLink
}) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Course Enrollment Approved</title>
</head>


<body style="
    margin:0;
    padding:0;
    background:#f9fafb;
    font-family:Arial,Helvetica,sans-serif;
">


<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        padding:35px 15px;
        background:#f9fafb;
    "
>

<tr>

<td align="center">


<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        max-width:600px;
        background:#ffffff;
        border:1px solid #e5e7eb;
        border-radius:10px;
        overflow:hidden;
    "
>


<!-- =====================================================
     HEADER
===================================================== -->

<tr>

<td
    style="
        padding:23px 28px;
        border-bottom:1px solid #e5e7eb;
    "
>

<strong
    style="
        color:#059669;
        font-size:18px;
    "
>
    DSCH-Edu
</strong>

</td>

</tr>


<!-- =====================================================
     CONTENT
===================================================== -->

<tr>

<td style="padding:34px 32px 28px;">


<h1
    style="
        margin:0 0 20px;
        color:#111827;
        font-size:22px;
        line-height:1.4;
        font-weight:600;
    "
>
    Course Enrollment Approved
</h1>


<p
    style="
        margin:0 0 16px;
        color:#374151;
        font-size:14px;
        line-height:1.7;
    "
>
    Dear <strong>${studentName}</strong>,
</p>


<p
    style="
        margin:0 0 20px;
        color:#4b5563;
        font-size:14px;
        line-height:1.7;
    "
>
    Your enrollment application for
    <strong style="color:#111827;">
        ${courseTitle}
    </strong>
    has been reviewed and approved.
</p>


<!-- =====================================================
     ENROLLMENT DETAILS
===================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:22px 0;
        border:1px solid #d1fae5;
        border-radius:8px;
        background:#ecfdf5;
    "
>

<tr>

<td style="padding:16px 18px;">

<p
    style="
        margin:0 0 9px;
        color:#166534;
        font-size:12px;
        font-weight:700;
    "
>
    Enrollment Details
</p>


<p
    style="
        margin:4px 0;
        color:#374151;
        font-size:12px;
        line-height:1.6;
    "
>
    <strong>Course:</strong>
    ${courseTitle}
</p>


<p
    style="
        margin:4px 0;
        color:#374151;
        font-size:12px;
        line-height:1.6;
    "
>
    <strong>Course Code:</strong>
    ${courseCode}
</p>


<p
    style="
        margin:4px 0;
        color:#374151;
        font-size:12px;
        line-height:1.6;
    "
>
    <strong>Offered By:</strong>
    ${instituteName}
</p>


<p
    style="
        margin:4px 0;
        color:#374151;
        font-size:12px;
        line-height:1.6;
    "
>
    <strong>Status:</strong>

    <span
        style="
            color:#059669;
            font-weight:700;
        "
    >
        Approved
    </span>
</p>

</td>

</tr>

</table>


<!-- =====================================================
     NEXT STEP
===================================================== -->

<p
    style="
        margin:0 0 10px;
        color:#111827;
        font-size:14px;
        line-height:1.6;
        font-weight:600;
    "
>
    Next step
</p>


<p
    style="
        margin:0;
        color:#4b5563;
        font-size:13px;
        line-height:1.7;
    "
>
    You are now enrolled in the course. Please join the official
    course WhatsApp group using the button below to receive course
    announcements, updates and relevant instructions.
</p>


<!-- =====================================================
     WHATSAPP BUTTON
===================================================== -->

${
    whatsappGroupLink
        ? `
<div
    style="
        text-align:center;
        margin:24px 0 25px;
    "
>

<a
    href="${whatsappGroupLink}"
    target="_blank"
    style="
        display:inline-block;
        padding:12px 24px;

        background:#059669;
        color:#ffffff;

        text-decoration:none;

        border-radius:7px;

        font-size:13px;
        font-weight:600;
    "
>
    Join Course WhatsApp Group
</a>

</div>
`
        : ""
}


<!-- =====================================================
     IMPORTANT
===================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:5px 0 22px;
        border:1px solid #e5e7eb;
        border-radius:8px;
        background:#f9fafb;
    "
>

<tr>

<td style="padding:13px 15px;">

<p
    style="
        margin:0;
        color:#6b7280;
        font-size:11px;
        line-height:1.7;
    "
>
    <strong style="color:#374151;">
        Please note:
    </strong>
    The WhatsApp group is used for course-related communication
    and updates. Please use it responsibly and follow the
    instructions provided by the course administration.
</p>

</td>

</tr>

</table>


<p
    style="
        margin:0 0 18px;
        color:#4b5563;
        font-size:13px;
        line-height:1.7;
    "
>
    We wish you success in your learning journey.
</p>


<p
    style="
        margin:0;
        color:#374151;
        font-size:13px;
        line-height:1.7;
    "
>
    Regards,<br>
    <strong>DSCH-Edu Administration</strong><br>
    Digital Smart City Hub
</p>


</td>

</tr>


<!-- =====================================================
     FOOTER
===================================================== -->

<tr>

<td
    style="
        padding:18px 28px;
        border-top:1px solid #e5e7eb;
        background:#f9fafb;
    "
>

<p
    style="
        margin:0 0 5px;
        color:#6b7280;
        font-size:11px;
    "
>
    Digital Smart City Hub — Education Module
</p>


<p
    style="
        margin:0;
        color:#9ca3af;
        font-size:10px;
        line-height:1.5;
    "
>
    This is an automated email. Please do not reply directly
    to this message.
</p>

</td>

</tr>


</table>

</td>

</tr>

</table>


</body>

</html>
`;
};