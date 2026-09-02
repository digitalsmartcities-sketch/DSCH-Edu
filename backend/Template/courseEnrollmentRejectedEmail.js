export const courseEnrollmentRejectedEmail = ({
    studentName,
    courseTitle,
    reason
}) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Course Enrollment Update</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f9fafb;
    font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:35px 15px;background:#f9fafb;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="
    max-width:600px;
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:10px;
    overflow:hidden;
">

<tr>
<td style="
    padding:23px 28px;
    border-bottom:1px solid #e5e7eb;
">

<strong style="
    color:#059669;
    font-size:18px;
">
    DSCH-Edu
</strong>

</td>
</tr>

<tr>
<td style="padding:34px 32px 28px;">

<h1 style="
    margin:0 0 20px;
    color:#111827;
    font-size:22px;
    line-height:1.4;
    font-weight:600;
">
    Course Enrollment Update
</h1>

<p style="
    margin:0 0 16px;
    color:#374151;
    font-size:14px;
    line-height:1.7;
">
    Dear <strong>${studentName}</strong>,
</p>

<p style="
    margin:0 0 20px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">
    Thank you for your interest in
    <strong style="color:#111827;">
        ${courseTitle}
    </strong>.
    After reviewing your enrollment application, the application
    could not be approved at this time.
</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="
    margin:22px 0;
    border:1px solid #fecaca;
    border-radius:8px;
    background:#fef2f2;
">

<tr>
<td style="padding:16px 18px;">

<p style="
    margin:0 0 9px;
    color:#b91c1c;
    font-size:12px;
    font-weight:700;
">
    Enrollment Not Approved
</p>

<p style="
    margin:0 0 10px;
    color:#4b5563;
    font-size:11px;
    line-height:1.6;
">
    Reason provided by the DSCH-Edu administration:
</p>

<div style="
    padding:12px 13px;
    border:1px solid #fecaca;
    border-radius:6px;
    background:#ffffff;
    color:#7f1d1d;
    font-size:12px;
    line-height:1.7;
">
    ${reason}
</div>

</td>
</tr>

</table>

<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">
    Please review the reason above. Where applicable, you may contact
    the DSCH-Edu support team for clarification or to provide corrected
    information or documentation.
</p>

<p style="
    margin:0;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">
    Thank you for your understanding.
</p>

<p style="
    margin:24px 0 0;
    color:#374151;
    font-size:13px;
    line-height:1.7;
">
    Regards,<br>
    <strong>DSCH-Edu Administration</strong><br>
    Digital Smart City Hub
</p>

</td>
</tr>

<tr>
<td style="
    padding:18px 28px;
    border-top:1px solid #e5e7eb;
    background:#f9fafb;
">

<p style="
    margin:0 0 5px;
    color:#6b7280;
    font-size:11px;
">
    Digital Smart City Hub — Education Module
</p>

<p style="
    margin:0;
    color:#9ca3af;
    font-size:10px;
    line-height:1.5;
">
    This is an automated email. Please do not reply directly to this message.
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