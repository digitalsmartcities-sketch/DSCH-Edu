export const studentAdmissionPaymentApprovedEmail = ({
    studentName,
    instituteName,
    paymentAmount,
    transactionId,
    className,
    loginUrl
}) => {

    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admission Payment Approved</title>
</head>

<body style="
    margin:0;
    padding:0;
    background-color:#f9fafb;
    font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="background-color:#f9fafb;padding:35px 15px;">

<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="
    max-width:620px;
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:14px;
    overflow:hidden;
">

<!-- HEADER -->

<tr>
<td align="center"
style="
    padding:28px 25px;
    background:#ecfdf5;
    border-bottom:1px solid #dcfce7;
">

<h2 style="
    margin:0;
    color:#059669;
    font-size:20px;
    font-weight:700;
">
    ${instituteName}
</h2>

</td>
</tr>


<!-- CONTENT -->

<tr>
<td style="padding:35px 35px 25px;">

<h1 style="
    margin:0 0 10px;
    color:#111827;
    font-size:24px;
    line-height:1.3;
    text-align:center;
">
    Admission Payment Approved
</h1>


<p style="
    margin:0 0 25px;
    color:#059669;
    font-size:14px;
    font-weight:600;
    text-align:center;
">
    Your admission payment has been successfully verified.
</p>


<p style="
    margin:0 0 18px;
    color:#374151;
    font-size:14px;
    line-height:1.7;
">
    Dear <strong>${studentName}</strong>,
</p>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    We are pleased to inform you that your admission fee payment
    for <strong>${instituteName}</strong> has been reviewed and
    approved by the institute administration.

</p>


<!-- SUCCESS BOX -->

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="
    margin:25px 0;
    background:#ecfdf5;
    border:1px solid #bbf7d0;
    border-radius:10px;
">

<tr>
<td style="padding:18px 20px;">

<p style="
    margin:0 0 8px;
    color:#166534;
    font-size:13px;
    font-weight:700;
">
    ✓ Payment Successfully Approved
</p>

<p style="
    margin:0;
    color:#374151;
    font-size:12px;
    line-height:1.6;
">
    Your student account has now been activated.
</p>

</td>
</tr>

</table>


<!-- PAYMENT DETAILS -->

<h2 style="
    margin:28px 0 12px;
    color:#111827;
    font-size:16px;
">
    Payment Details
</h2>


<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="
    background:#f9fafb;
    border:1px solid #e5e7eb;
    border-radius:10px;
">

<tr>
<td style="
    padding:13px 16px;
    border-bottom:1px solid #e5e7eb;
">

<span style="
    display:block;
    margin-bottom:4px;
    color:#6b7280;
    font-size:11px;
">
    Payment Type
</span>

<strong style="
    color:#111827;
    font-size:13px;
">
    Admission Fee
</strong>

</td>
</tr>


<tr>
<td style="
    padding:13px 16px;
    border-bottom:1px solid #e5e7eb;
">

<span style="
    display:block;
    margin-bottom:4px;
    color:#6b7280;
    font-size:11px;
">
    Amount
</span>

<strong style="
    color:#111827;
    font-size:13px;
">
    PKR ${Number(paymentAmount || 0).toLocaleString()}
</strong>

</td>
</tr>


<tr>
<td style="
    padding:13px 16px;
    border-bottom:1px solid #e5e7eb;
">

<span style="
    display:block;
    margin-bottom:4px;
    color:#6b7280;
    font-size:11px;
">
    Transaction ID
</span>

<strong style="
    color:#111827;
    font-size:13px;
    word-break:break-word;
">
    ${transactionId || "Not provided"}
</strong>

</td>
</tr>


<tr>
<td style="padding:13px 16px;">

<span style="
    display:block;
    margin-bottom:4px;
    color:#6b7280;
    font-size:11px;
">
    Class
</span>

<strong style="
    color:#111827;
    font-size:13px;
">
    ${className || "Not provided"}
</strong>

</td>
</tr>

</table>


<!-- ACTIVE ACCOUNT -->

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="
    margin:20px 0;
    background:#f0fdf4;
    border:1px solid #dcfce7;
    border-radius:9px;
">

<tr>
<td style="padding:15px 17px;">

<p style="
    margin:0 0 6px;
    color:#166534;
    font-size:12px;
    font-weight:700;
">
    Your Student Account Is Now Active
</p>

<p style="
    margin:0;
    color:#4b5563;
    font-size:11px;
    line-height:1.7;
">

    You can now access your student dashboard and use the
    available academic and fee-related services.

</p>

</td>
</tr>

</table>


<!-- LOGIN BUTTON -->

<div style="text-align:center;margin:28px 0;">

<a href="${loginUrl}"
style="
    display:inline-block;
    padding:12px 26px;
    background:#10b981;
    color:#ffffff;
    text-decoration:none;
    border-radius:8px;
    font-size:13px;
    font-weight:600;
">
    Access Student Dashboard
</a>

</div>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">

    Your monthly fee will be managed through the student dashboard.
    Please check the <strong>Fees</strong> section regularly for
    newly generated fee records.

</p>


<p style="
    margin:0;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">

    We wish you a successful academic journey at
    <strong>${instituteName}</strong>.

</p>

</td>
</tr>


<!-- FOOTER -->

<tr>
<td align="center"
style="
    padding:22px 25px;
    background:#f9fafb;
    border-top:1px solid #e5e7eb;
">

<p style="
    margin:0 0 6px;
    color:#374151;
    font-size:12px;
    font-weight:600;
">
    ${instituteName}
</p>

<p style="
    margin:0;
    color:#9ca3af;
    font-size:10px;
    line-height:1.5;
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