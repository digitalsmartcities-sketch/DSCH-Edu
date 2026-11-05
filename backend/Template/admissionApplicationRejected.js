export const studentAdmissionRejectedEmail = ({
    studentName,
    instituteName,
    rejectedFor,
    reason,
    supportContact
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

    <title>Admission Application Rejected</title>
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
        background:#f9fafb;
        padding:32px 15px;
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

<!-- HEADER -->

<tr>
<td
    style="
        padding:22px 28px;
        background:#ecfdf5;
        border-bottom:1px solid #d1fae5;
    "
>

<h2 style="
    margin:0;
    color:#059669;
    font-size:18px;
    font-weight:700;
">
    ${instituteName}
</h2>

</td>
</tr>


<!-- CONTENT -->

<tr>
<td style="padding:32px 30px;">

<h1 style="
    margin:0 0 24px;
    color:#111827;
    font-size:20px;
    line-height:1.4;
    font-weight:600;
">
    Admission Application Rejected
</h1>


<p style="
    margin:0 0 18px;
    color:#374151;
    font-size:14px;
    line-height:1.7;
">
    Dear ${studentName},
</p>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    Thank you for submitting your admission application to
    <strong style="color:#111827;">
        ${instituteName}
    </strong>
    for
    <strong style="color:#111827;">
        Class ${rejectedFor}
    </strong>.

</p>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    After reviewing the information and documents submitted,
    we regret to inform you that your admission application
    has been rejected.

</p>


<!-- REASON -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:22px 0;
        background:#f9fafb;
        border-left:3px solid #10b981;
    "
>

<tr>
<td style="padding:15px 17px;">

<p style="
    margin:0 0 7px;
    color:#6b7280;
    font-size:11px;
    font-weight:600;
">
    Reason for rejection
</p>

<p style="
    margin:0;
    color:#374151;
    font-size:13px;
    line-height:1.7;
">
    ${reason}
</p>

</td>
</tr>

</table>


<!-- NEXT STEP -->

<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    Your application and the uploaded documents have been
    removed. You should resubmit the application with the
    correct information and documents. Please review the reason
    above carefully before resubmitting.

</p>


<!-- SUPPORT CONTACT -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:20px 0 24px;
        background:#ecfdf5;
        border:1px solid #d1fae5;
        border-radius:8px;
    "
>

<tr>
<td style="padding:14px 16px;">

<p style="
    margin:0 0 6px;
    color:#166534;
    font-size:12px;
    font-weight:600;
">
    Contact for Support
</p>

<p style="
    margin:0;
    color:#374151;
    font-size:12px;
    line-height:1.7;
">
    For any support, contact DSCH via
    <a
        href="mailto:${supportContact}"
        style="color:#059669; text-decoration:none;"
    >${supportContact}</a>.
</p>

</td>
</tr>

</table>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">

    Please clearly mention your name and admission class when
    contacting DSCH support so your new application can be
    identified quickly.

</p>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">

    Once you resubmit a new application with the corrected
    information and documents, it will be reviewed again.

</p>


<!-- NOTICE -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:8px 0 22px;
        background:#f9fafb;
        border:1px solid #e5e7eb;
        border-radius:8px;
    "
>

<tr>
<td style="padding:13px 15px;">

<p style="
    margin:0;
    color:#6b7280;
    font-size:11px;
    line-height:1.7;
">

    <strong style="color:#374151;">
        Please note:
    </strong>
    Resubmitting an application does not guarantee approval.
    The new application will be reviewed by the institute
    administration.

</p>

</td>
</tr>

</table>


<p style="
    margin:0;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">

    For any questions, please contact DSCH support at
    <strong>${supportContact}</strong>.

</p>

</td>
</tr>


<!-- FOOTER -->

<tr>
<td
    style="
        padding:18px 30px;
        background:#f9fafb;
        border-top:1px solid #e5e7eb;
    "
>

<p style="
    margin:0 0 5px;
    color:#6b7280;
    font-size:11px;
">
    ${instituteName}
</p>

<p style="
    margin:0;
    color:#9ca3af;
    font-size:10px;
    line-height:1.5;
">
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