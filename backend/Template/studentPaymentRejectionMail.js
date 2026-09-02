export const studentPaymentRejectedEmail = (
    studentName,
    instituteName,
    paymentType,
    reason,
    loginUrl
) => {

    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title>Payment Submission Update</title>
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
<td style="
    padding:22px 28px;
    background:#ffffff;
    border-bottom:1px solid #e5e7eb;
">

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
    font-size:21px;
    line-height:1.4;
    font-weight:600;
">
    Payment Submission Update
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

    Your
    <strong style="color:#111827;">
        ${paymentType}
    </strong>
    payment submission at
    <strong style="color:#111827;">
        ${instituteName}
    </strong>
    could not be approved.

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


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    Please review the reason above and submit the corrected
    payment information and proof through your student dashboard.

</p>


<!-- ACTION -->

<div style="
    text-align:left;
    margin:24px 0;
">

<a
    href="${loginUrl}"
    style="
        display:inline-block;
        padding:11px 20px;
        background:#10b981;
        color:#ffffff;
        text-decoration:none;
        border-radius:7px;
        font-size:12px;
        font-weight:600;
    "
>
    Open Student Dashboard
</a>

</div>


<p style="
    margin:0;
    color:#4b5563;
    font-size:13px;
    line-height:1.7;
">

    Please ensure that the payment details and uploaded proof
    are accurate and clearly visible before submitting again.

</p>


<p style="
    margin:22px 0 0;
    color:#374151;
    font-size:13px;
    line-height:1.7;
">

    Regards,<br>
    <strong>${instituteName} Administration</strong>

</p>

</td>
</tr>


<!-- FOOTER -->

<tr>
<td style="
    padding:18px 30px;
    background:#f9fafb;
    border-top:1px solid #e5e7eb;
">

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