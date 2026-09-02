export const studentAdmissionApprovedEmail = ({
    studentName,
    instituteName,
    applyingFor,
    email,
    password,
    loginUrl
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

    <title>Admission Application Approved</title>
</head>


<body style="
    margin: 0;
    padding: 0;
    background-color: #f9fafb;
    font-family: Arial, Helvetica, sans-serif;
">


<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background-color: #f9fafb;
        padding: 35px 15px;
    "
>

<tr>
<td align="center">


<!-- =========================================
     MAIN CONTAINER
========================================= -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        max-width: 620px;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        overflow: hidden;
    "
>


<!-- =========================================
     HEADER
========================================= -->

<tr>

<td
    align="center"
    style="
        padding: 28px 25px;
        background-color: #ecfdf5;
        border-bottom: 1px solid #dcfce7;
    "
>

<h2 style="
    margin: 0;
    color: #059669;
    font-size: 20px;
    font-weight: 700;
">
    ${instituteName}
</h2>

</td>

</tr>


<!-- =========================================
     CONTENT
========================================= -->

<tr>

<td style="padding: 35px 35px 25px;">


<h1 style="
    margin: 0 0 10px;
    color: #111827;
    font-size: 24px;
    line-height: 1.3;
    text-align: center;
">
    Admission Application Approved
</h1>


<p style="
    margin: 0 0 25px;
    color: #059669;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
">
    Congratulations! Your admission application has been approved.
</p>


<p style="
    margin: 0 0 18px;
    color: #374151;
    font-size: 14px;
    line-height: 1.7;
">
    Dear <strong>${studentName}</strong>,
</p>


<p style="
    margin: 0 0 18px;
    color: #4b5563;
    font-size: 14px;
    line-height: 1.7;
">

    We are pleased to inform you that your admission application
    for

    <strong style="color: #111827;">
        ${instituteName}
    </strong>

    has been reviewed and approved by the institute administration.

</p>


<!-- =========================================
     APPROVAL BOX
========================================= -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin: 25px 0;
        background-color: #ecfdf5;
        border: 1px solid #bbf7d0;
        border-radius: 10px;
    "
>

<tr>

<td style="padding: 18px 20px;">

<p style="
    margin: 0 0 7px;
    color: #166534;
    font-size: 13px;
    font-weight: 700;
">
    ✓ Admission Approved
</p>

<p style="
    margin: 0;
    color: #374151;
    font-size: 12px;
    line-height: 1.6;
">

    <strong>Class:</strong>
    ${applyingFor}

</p>

</td>

</tr>

</table>


<!-- =========================================
     LOGIN DETAILS
========================================= -->

<h2 style="
    margin: 28px 0 12px;
    color: #111827;
    font-size: 16px;
">
    Your Student Login Credentials
</h2>


<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
    "
>


<!-- EMAIL -->

<tr>

<td style="
    padding: 14px 16px;
    border-bottom: 1px solid #e5e7eb;
">

<span style="
    display: block;
    margin-bottom: 4px;
    color: #6b7280;
    font-size: 11px;
">
    Login Email
</span>


<strong style="
    color: #111827;
    font-size: 13px;
">
    ${email}
</strong>

</td>

</tr>


<!-- PASSWORD -->

<tr>

<td style="
    padding: 14px 16px;
">

<span style="
    display: block;
    margin-bottom: 4px;
    color: #6b7280;
    font-size: 11px;
">
    Temporary Password
</span>


<strong style="
    color: #111827;
    font-size: 13px;
    word-break: break-word;
">
    ${password}
</strong>

</td>

</tr>

</table>


<!-- =========================================
     SECURITY WARNING
========================================= -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin-top: 15px;
        background-color: #fffbeb;
        border: 1px solid #fde68a;
        border-radius: 9px;
    "
>

<tr>

<td style="padding: 13px 15px;">

<p style="
    margin: 0;
    color: #92400e;
    font-size: 11px;
    line-height: 1.6;
">

    <strong>Important:</strong>
    This is your temporary login password.
    Please change your password immediately after your first login
    and do not share your credentials with anyone.

</p>

</td>

</tr>

</table>


<!-- =========================================
     LOGIN BUTTON
========================================= -->

<div style="
    text-align: center;
    margin: 28px 0;
">

<a
    href="${loginUrl}"
    style="
        display: inline-block;
        padding: 12px 26px;
        background-color: #10b981;
        color: #ffffff;
        text-decoration: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
    "
>
    Login to Student Dashboard
</a>

</div>


<!-- =========================================
     ADMISSION PAYMENT NOTICE
========================================= -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin: 10px 0 25px;
        background-color: #f0fdf4;
        border: 1px solid #dcfce7;
        border-radius: 9px;
    "
>

<tr>

<td style="padding: 15px 17px;">

<p style="
    margin: 0 0 6px;
    color: #166534;
    font-size: 12px;
    font-weight: 700;
">
    Next Step: Admission Fee
</p>


<p style="
    margin: 0;
    color: #4b5563;
    font-size: 11px;
    line-height: 1.7;
">

    Your admission application has been approved, but your
    admission fee payment is still pending. After logging in,
    open the <strong>Admission</strong> section of your dashboard
    to submit the admission fee and payment proof.

</p>

</td>

</tr>

</table>


<p style="
    margin: 0 0 18px;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.7;
">

    Please keep your login credentials secure and use the
    official student dashboard for all admission and fee-related
    activities.

</p>


<p style="
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.7;
">

    We wish you a successful academic journey at
    <strong>${instituteName}</strong>.

</p>


</td>

</tr>


<!-- =========================================
     FOOTER
========================================= -->

<tr>

<td
    align="center"
    style="
        padding: 22px 25px;
        background-color: #f9fafb;
        border-top: 1px solid #e5e7eb;
    "
>

<p style="
    margin: 0 0 6px;
    color: #374151;
    font-size: 12px;
    font-weight: 600;
">
    ${instituteName}
</p>


<p style="
    margin: 0;
    color: #9ca3af;
    font-size: 10px;
    line-height: 1.5;
">
    This is an automated email.
    Please do not reply directly to this message.
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