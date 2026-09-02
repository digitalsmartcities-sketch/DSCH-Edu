export const contactQuerySubmissionTemplate = (
    firstName,
    lastName,
    email,
    phone,
    subject,
    message
) => {


    return (`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>New Contact Us Query</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background-color:#f3f6f8;
        font-family:Arial, Helvetica, sans-serif;
        color:#111827;
    "
>

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            width:100%;
            background-color:#f3f6f8;
            padding:40px 15px;
        "
    >

        <tr>
            <td align="center">

                <!-- MAIN CONTAINER -->
                <table
                    width="620"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        width:100%;
                        max-width:620px;
                        background-color:#ffffff;
                        border-radius:14px;
                        overflow:hidden;
                        box-shadow:0 8px 30px rgba(17,24,39,0.08);
                    "
                >

                    <!-- HEADER -->
                    <tr>
                        <td
                            style="
                                background:linear-gradient(
                                    135deg,
                                    #064e3b,
                                    #047857,
                                    #059669
                                );
                                padding:30px 35px;
                            "
                        >

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                            >

                                <tr>

                                    <td>

                                        <div
                                            style="
                                                color:#ffffff;
                                                font-size:25px;
                                                font-weight:700;
                                                letter-spacing:-0.5px;
                                            "
                                        >
                                            DSCH
                                        </div>

                                        <div
                                            style="
                                                margin-top:5px;
                                                color:#d1fae5;
                                                font-size:12px;
                                                letter-spacing:0.8px;
                                            "
                                        >
                                            DIGITAL SMART CITY HUB
                                        </div>

                                    </td>

                                    <td
                                        align="right"
                                        valign="middle"
                                    >

                                        <span
                                            style="
                                                display:inline-block;
                                                padding:7px 12px;
                                                border:1px solid
                                                    rgba(255,255,255,0.25);
                                                border-radius:20px;
                                                color:#ecfdf5;
                                                background-color:
                                                    rgba(255,255,255,0.08);
                                                font-size:11px;
                                                font-weight:600;
                                            "
                                        >
                                            CONTACT US
                                        </span>

                                    </td>

                                </tr>

                            </table>

                        </td>
                    </tr>


                    <!-- TITLE -->
                    <tr>
                        <td
                            style="
                                padding:35px 35px 20px;
                            "
                        >

                            <div
                                style="
                                    display:inline-block;
                                    margin-bottom:12px;
                                    padding:6px 11px;
                                    border-radius:20px;
                                    background-color:#ecfdf5;
                                    color:#059669;
                                    font-size:11px;
                                    font-weight:700;
                                    letter-spacing:0.8px;
                                "
                            >
                                NEW INQUIRY
                            </div>

                            <h1
                                style="
                                    margin:0;
                                    color:#111827;
                                    font-size:25px;
                                    line-height:1.3;
                                    font-weight:700;
                                "
                            >
                                A new contact query has been received
                            </h1>

                            <p
                                style="
                                    margin:10px 0 0;
                                    color:#6b7280;
                                    font-size:14px;
                                    line-height:1.6;
                                "
                            >
                                A visitor has submitted a message
                                through the DSCH Contact Us form.
                            </p>

                        </td>
                    </tr>


                    <!-- CONTACT INFORMATION -->
                    <tr>
                        <td
                            style="
                                padding:10px 35px 0;
                            "
                        >

                            <h2
                                style="
                                    margin:0 0 12px;
                                    color:#111827;
                                    font-size:15px;
                                    font-weight:700;
                                "
                            >
                                Contact Information
                            </h2>

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    border:1px solid #e5e7eb;
                                    border-radius:10px;
                                    overflow:hidden;
                                "
                            >

                                <!-- NAME -->
                                <tr>
                                    <td
                                        style="
                                            padding:13px 15px;
                                            border-bottom:1px solid #f0f0f0;
                                            color:#6b7280;
                                            font-size:13px;
                                            width:30%;
                                        "
                                    >
                                        Full Name
                                    </td>

                                    <td
                                        style="
                                            padding:13px 15px;
                                            border-bottom:1px solid #f0f0f0;
                                            color:#111827;
                                            font-size:13px;
                                            font-weight:600;
                                        "
                                    >
                                        ${firstName} ${lastName}
                                    </td>
                                </tr>


                                <!-- EMAIL -->
                                <tr>
                                    <td
                                        style="
                                            padding:13px 15px;
                                            border-bottom:1px solid #f0f0f0;
                                            color:#6b7280;
                                            font-size:13px;
                                        "
                                    >
                                        Email
                                    </td>

                                    <td
                                        style="
                                            padding:13px 15px;
                                            border-bottom:1px solid #f0f0f0;
                                            font-size:13px;
                                        "
                                    >
                                        <a
                                            href="mailto:${email}"
                                            style="
                                                color:#059669;
                                                text-decoration:none;
                                                font-weight:600;
                                            "
                                        >
                                            ${email}
                                        </a>
                                    </td>
                                </tr>


                                <!-- PHONE -->
                                <tr>
                                    <td
                                        style="
                                            padding:13px 15px;
                                            color:#6b7280;
                                            font-size:13px;
                                        "
                                    >
                                        Phone
                                    </td>

                                    <td
                                        style="
                                            padding:13px 15px;
                                            color:#111827;
                                            font-size:13px;
                                            font-weight:600;
                                        "
                                    >
                                        ${phone || "Not provided"}
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>


                    <!-- QUERY -->
                    <tr>
                        <td
                            style="
                                padding:28px 35px 0;
                            "
                        >

                            <h2
                                style="
                                    margin:0 0 12px;
                                    color:#111827;
                                    font-size:15px;
                                    font-weight:700;
                                "
                            >
                                Query Details
                            </h2>


                            <!-- SUBJECT -->
                            <div
                                style="
                                    padding:15px;
                                    border-left:4px solid #10b981;
                                    border-radius:7px;
                                    background-color:#f0fdf4;
                                "
                            >

                                <div
                                    style="
                                        margin-bottom:5px;
                                        color:#6b7280;
                                        font-size:11px;
                                        font-weight:600;
                                        text-transform:uppercase;
                                        letter-spacing:0.7px;
                                    "
                                >
                                    Subject
                                </div>

                                <div
                                    style="
                                        color:#111827;
                                        font-size:14px;
                                        font-weight:700;
                                    "
                                >
                                    ${subject}
                                </div>

                            </div>


                            <!-- MESSAGE -->
                            <div
                                style="
                                    margin-top:14px;
                                    padding:18px;
                                    border:1px solid #e5e7eb;
                                    border-radius:10px;
                                    background-color:#ffffff;
                                "
                            >

                                <div
                                    style="
                                        margin-bottom:9px;
                                        color:#6b7280;
                                        font-size:11px;
                                        font-weight:600;
                                        text-transform:uppercase;
                                        letter-spacing:0.7px;
                                    "
                                >
                                    Message
                                </div>

                                <div
                                    style="
                                        color:#374151;
                                        font-size:14px;
                                        line-height:1.7;
                                        white-space:pre-line;
                                    "
                                >
                                    ${message}
                                </div>

                            </div>

                        </td>
                    </tr>


                    <!-- ACTION -->
                    <tr>
                        <td
                            style="
                                padding:28px 35px;
                            "
                        >

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    border-radius:10px;
                                    background-color:#ecfdf5;
                                "
                            >

                                <tr>

                                    <td
                                        style="
                                            padding:17px;
                                        "
                                    >

                                        <div
                                            style="
                                                color:#065f46;
                                                font-size:13px;
                                                line-height:1.6;
                                            "
                                        >
                                            <strong>
                                                Action required
                                            </strong>
                                            <br>

                                            Please review this inquiry
                                            and respond to the user using
                                            the email address provided above.
                                        </div>

                                    </td>

                                </tr>

                            </table>

                        </td>
                    </tr>


                    <!-- FOOTER -->
                    <tr>
                        <td
                            style="
                                padding:25px 35px;
                                border-top:1px solid #e5e7eb;
                                background-color:#fafafa;
                                text-align:center;
                            "
                        >

                            <div
                                style="
                                    color:#374151;
                                    font-size:13px;
                                    font-weight:700;
                                "
                            >
                                Digital Smart City Hub
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    color:#9ca3af;
                                    font-size:11px;
                                    line-height:1.6;
                                "
                            >
                                This is an automated notification from
                                the DSCH Contact Us system.
                                <br>
                                Please do not reply directly to this
                                notification.
                            </div>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>

    </table>

</body>

</html>`)
};