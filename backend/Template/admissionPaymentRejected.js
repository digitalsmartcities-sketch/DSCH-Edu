export const studentAdmissionPaymentRejectedEmail = ({
    studentName,
    instituteName,
    paymentAmount,
    transactionId,
    reason,
    paymentUrl = "https://yourdomain.com/student/login"
}) => {

    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admission Payment Requires Correction</title>
</head>

<body style="
    margin:0;
    padding:0;
    background-color:#f9fafb;
    font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="background:#f9fafb;padding:35px 15px;">

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
    Admission Payment Update
</h1>


<p style="
    margin:0 0 25px;
    color:#dc2626;
    font-size:14px;
    font-weight:600;
    text-align:center;
">
    Your payment submission requires correction
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

    Your admission application for
    <strong>${instituteName}</strong>
    has already been approved.

    However, the admission fee payment you recently submitted
    could not be approved by the institute administration.

</p>


<!-- REJECTION BOX -->

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="
    margin:25px 0;
    background:#fef2f2;
    border:1px solid #fecaca;
    border-radius:10px;
">

<tr>
<td style="padding:18px 20px;">

<p style="
    margin:0 0 9px;
    color:#b91c1c;
    font-size:13px;
    font-weight:700;
">
    ✕ Payment Not Approved
</p>

<p style="
    margin:0 0 12px;
    color:#374151;
    font-size:12px;
    line-height:1.6;
">
    Reason provided by the institute administration:
</p>

<div style="
    padding:13px 14px;
    background:#ffffff;
    border:1px solid #fecaca;
    border-radius:7px;
    color:#7f1d1d;
    font-size:12px;
    line-height:1.7;
">
    ${reason}
</div>

</td>
</tr>

</table>


<!-- PAYMENT DETAILS -->

<h2 style="
    margin:28px 0 12px;
    color:#111827;
    font-size:16px;
">
    Submitted Payment
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
    Submitted Amount
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
<td style="padding:13px 16px;">

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

</table>


<!-- NEXT STEPS -->

<h2 style="
    margin:28px 0 12px;
    color:#111827;
    font-size:16px;
">
    What should you do now?
</h2>


<table width="100%" cellpadding="0" cellspacing="0" border="0">

<tr>

<td width="36" valign="top" style="padding-bottom:14px;">

<div style="
    width:28px;
    height:28px;
    line-height:28px;
    text-align:center;
    border-radius:50%;
    background:#10b981;
    color:#ffffff;
    font-size:12px;
    font-weight:bold;
">
    1
</div>

</td>

<td valign="top"
style="
    padding:3px 0 14px;
    color:#374151;
    font-size:13px;
    line-height:1.5;
">
Review the payment rejection reason carefully.
</td>

</tr>


<tr>

<td width="36" valign="top" style="padding-bottom:14px;">

<div style="
    width:28px;
    height:28px;
    line-height:28px;
    text-align:center;
    border-radius:50%;
    background:#10b981;
    color:#ffffff;
    font-size:12px;
    font-weight:bold;
">
    2
</div>

</td>

<td valign="top"
style="
    padding:3px 0 14px;
    color:#374151;
    font-size:13px;
    line-height:1.5;
">
Correct the payment information or prepare a valid payment proof.
</td>

</tr>


<tr>

<td width="36" valign="top">

<div style="
    width:28px;
    height:28px;
    line-height:28px;
    text-align:center;
    border-radius:50%;
    background:#10b981;
    color:#ffffff;
    font-size:12px;
    font-weight:bold;
">
    3
</div>

</td>

<td valign="top"
style="
    padding:3px 0;
    color:#374151;
    font-size:13px;
    line-height:1.5;
">
Submit the admission payment again from your student dashboard.
</td>

</tr>

</table>


<!-- BUTTON -->

<div style="text-align:center;margin:28px 0;">

<a href="${paymentUrl}"
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
    Resubmit Admission Payment
</a>

</div>


<!-- NOTICE -->

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="
    margin:8px 0 22px;
    background:#fffbeb;
    border:1px solid #fde68a;
    border-radius:9px;
">

<tr>
<td style="padding:14px 16px;">

<p style="
    margin:0;
    color:#92400e;
    font-size:11px;
    line-height:1.7;
">

    <strong>Important:</strong>
    Your admission application remains approved.
    Only the submitted admission payment requires correction
    and re-submission.

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

    Please ensure that your transaction information and payment
    proof are accurate and clearly visible before submitting again.

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