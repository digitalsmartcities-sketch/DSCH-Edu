export const emailVerificationTemp = (name,otp) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0"
    >
    <title>Verify Your Email - DSCH</title>
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
        border-bottom:1px solid #e5e7eb;
        background:#ffffff;
    "
>

<img
    src="https://kohat.online/static/media/navlogo.0fd8dfb4ecd22e75c6c8.jpg"
    alt="Digital Smart City Hub"
    width="82"
    style="
        display:block;
        width:82px;
        border-radius:6px;
    "
>

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
    Verify your email address
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
    margin:0 0 22px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    We received a request to verify the email address
    associated with your
    <strong style="color:#111827;">
        DSCH account
    </strong>.

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
<td
    align="center"
    style="padding:22px 15px;"
>

<p style="
    margin:0 0 10px;
    color:#6b7280;
    font-size:10px;
    font-weight:600;
    text-transform:uppercase;
    letter-spacing:1px;
">
    Verification code
</p>

<div style="
    display:inline-block;
    padding:10px 20px;
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
    margin:0 0 22px;
    color:#6b7280;
    font-size:12px;
    line-height:1.7;
">

    This code will expire in
    <strong style="color:#374151;">
        10 minutes
    </strong>.
    For your security, do not share this code with anyone.

</p>


<!-- SECURITY -->

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
<td style="padding:13px 15px;">

<p style="
    margin:0;
    color:#374151;
    font-size:11px;
    line-height:1.7;
">

    <strong style="color:#166534;">
        Security notice:
    </strong>
    DSCH will never ask you to share your verification code
    by email, phone, or any other channel.

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

    If you did not request this verification code, you can
    safely ignore this email.

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
    Digital Smart City Hub
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