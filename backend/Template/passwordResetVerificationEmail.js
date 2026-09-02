export const passwordResetVerificationEmail = (name, otp) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title>Password Reset Verification</title>
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
    Digital Smart City Hub
</h2>

</td>
</tr>


<!-- CONTENT -->

<tr>
<td style="padding:32px 30px;">

<h1 style="
    margin:0 0 22px;
    color:#111827;
    font-size:21px;
    line-height:1.4;
    font-weight:600;
">
    Verify your password reset request
</h1>


<p style="
    margin:0 0 16px;
    color:#374151;
    font-size:14px;
    line-height:1.7;
">
    Hello ${name},
</p>


<p style="
    margin:0 0 20px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    We received a request to reset the password for your
    <strong style="color:#111827;">
        DSCH account
    </strong>.
    To continue, enter the verification code below.

</p>


<!-- OTP -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:22px 0;
        background:#f9fafb;
        border:1px solid #e5e7eb;
        border-radius:8px;
    "
>

<tr>
<td align="center" style="padding:22px 15px;">

<p style="
    margin:0 0 10px;
    color:#6b7280;
    font-size:10px;
    font-weight:600;
    letter-spacing:1px;
    text-transform:uppercase;
">
    Verification code
</p>

<div style="
    display:inline-block;
    padding:10px 22px;
    background:#ecfdf5;
    border:1px solid #a7f3d0;
    border-radius:7px;
    color:#059669;
    font-size:28px;
    font-weight:700;
    letter-spacing:6px;
">
    ${otp}
</div>

</td>
</tr>

</table>


<p style="
    margin:0 0 20px;
    color:#6b7280;
    font-size:12px;
    line-height:1.7;
">

    This verification code will expire in
    <strong style="color:#374151;">
        10 minutes
    </strong>.
    Enter it only on the official DSCH password reset page.

</p>


<!-- SECURITY NOTICE -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin:0 0 22px;
        background:#ecfdf5;
        border:1px solid #d1fae5;
        border-radius:8px;
    "
>

<tr>
<td style="padding:14px 16px;">

<p style="
    margin:0;
    color:#374151;
    font-size:11px;
    line-height:1.7;
">

    <strong style="color:#166534;">
        Security notice:
    </strong>
    Never share this verification code with anyone.
    DSCH will never ask you to provide your OTP by email,
    phone, WhatsApp, or any other channel.

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

    If you did not request a password reset, you can safely
    ignore this email. Your current password will remain unchanged.

</p>


<p style="
    margin:22px 0 0;
    color:#374151;
    font-size:13px;
    line-height:1.7;
">

    Regards,<br>
    <strong>DSCH Administration</strong><br>
    Digital Smart City Hub

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
    Digital Smart City Hub (DSCH)
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