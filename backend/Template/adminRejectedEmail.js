export const adminRejectedEmail = (
    ownerName,
    instituteName,
    reason,
    supportEmail = process.env.SUPPORT_EMAIL
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

    <title>Institute Registration Update</title>
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
    margin:0 0 24px;
    color:#111827;
    font-size:20px;
    line-height:1.4;
    font-weight:600;
">
    Institute Registration Update
</h1>


<p style="
    margin:0 0 18px;
    color:#374151;
    font-size:14px;
    line-height:1.7;
">
    Dear ${ownerName},
</p>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    Thank you for submitting the registration application
    for <strong style="color:#111827;">${instituteName}</strong>
    to Digital Smart City Hub (DSCH).

</p>


<p style="
    margin:0 0 18px;
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
">

    After reviewing the information and documents provided,
    we are unable to approve the application in its current form.

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

    Please contact the DSCH administration team and provide
    the corrected information and/or documents related to the
    issue mentioned above. Your application can then be
    reviewed again.

</p>


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
    margin:0 0 5px;
    color:#166534;
    font-size:12px;
    font-weight:600;
">
    Contact DSCH
</p>

<p style="
    margin:0;
    color:#374151;
    font-size:12px;
    line-height:1.6;
">
    Email:
    <a
        href="mailto:${supportEmail}"
        style="
            color:#059669;
            text-decoration:none;
        "
    >
        ${supportEmail}
    </a>
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

    Please ensure that all corrected information and documents
    are complete and accurate before submitting them for review.

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