export const adminApprovalEmail = (
    ownerName,
    instituteName,
    email,
    loginUrl
) => {

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Institute Registration Approved</title>
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
        style="background-color: #f9fafb; padding: 35px 15px;"
    >
        <tr>
            <td align="center">
            <!-- Main Container -->
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
                    <!-- Header -->
                    <tr>
                        <td
                            align="center"
                            style="
                                padding: 28px 25px;
                                background-color: #ecfdf5;
                                border-bottom: 1px solid #dcfce7;
                            "
                        >
                            <img
                                src="https://kohat.online/static/media/navlogo.0fd8dfb4ecd22e75c6c8.jpg"
                                alt="DSCH"
                                width="90"
                                style="
                                    display: block;
                                    max-width: 90px;
                                    border-radius: 8px;
                                "
                            >
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 35px 35px 20px;">
                            <h1 style="
                                margin: 0 0 10px;
                                color: #111827;
                                font-size: 24px;
                                line-height: 1.3;
                                text-align: center;
                            ">
                                Registration Approved
                            </h1>
                            <p style="
                                margin: 0 0 25px;
                                color: #059669;
                                font-size: 14px;
                                font-weight: 600;
                                text-align: center;
                            ">
                                Your institute is now registered with DSCH
                            </p>
                            <p style="
                                margin: 0 0 18px;
                                color: #374151;
                                font-size: 14px;
                                line-height: 1.7;
                            ">
                                Dear <strong>${ownerName}</strong>,
                            </p>
                            <p style="
                                margin: 0 0 18px;
                                color: #4b5563;
                                font-size: 14px;
                                line-height: 1.7;
                            ">
                                We are pleased to inform you that the
                                registration application for
                                <strong style="color: #111827;">
                                    ${instituteName}
                                </strong>
                                has been reviewed and
                                <strong style="color: #059669;">
                                    approved
                                </strong>
                                by the DSCH administration.
                            </p>
                            <!-- Success Box -->
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
                                            ✓ Application Successfully Approved
                                        </p>
                                        <p style="
                                            margin: 0;
                                            color: #374151;
                                            font-size: 12px;
                                            line-height: 1.6;
                                        ">
                                            You can now access your institute
                                            administration account.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <!-- Next Steps -->
                            <h2 style="
                                margin: 25px 0 12px;
                                color: #111827;
                                font-size: 16px;
                            ">
                                What to do next?
                            </h2>
                            <p style="
                                margin: 0 0 15px;
                                color: #4b5563;
                                font-size: 13px;
                                line-height: 1.7;
                            ">
                                Before you can start using the complete
                                administration dashboard, you need to
                                <strong>
                                    complete your institute profile and
                                    initial institute setup.
                                </strong>
                            </p>
                            <!-- Steps -->
                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                            >
                                <tr>
                                    <td
                                        width="36"
                                        valign="top"
                                        style="padding-bottom: 14px;"
                                    >
                                        <div style="
                                            width: 28px;
                                            height: 28px;
                                            line-height: 28px;
                                            text-align: center;
                                            border-radius: 50%;
                                            background-color: #10b981;
                                            color: #ffffff;
                                            font-size: 12px;
                                            font-weight: bold;
                                        ">
                                            1
                                        </div>
                                    </td>
                                    <td
                                        valign="top"
                                        style="
                                            padding: 3px 0 14px;
                                            color: #374151;
                                            font-size: 13px;
                                            line-height: 1.5;
                                        "
                                    >
                                        Log in to your DSCH admin account.
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        width="36"
                                        valign="top"
                                        style="padding-bottom: 14px;"
                                    >
                                        <div style="
                                            width: 28px;
                                            height: 28px;
                                            line-height: 28px;
                                            text-align: center;
                                            border-radius: 50%;
                                            background-color: #10b981;
                                            color: #ffffff;
                                            font-size: 12px;
                                            font-weight: bold;
                                        ">
                                            2
                                        </div>
                                    </td>
                                    <td
                                        valign="top"
                                        style="
                                            padding: 3px 0 14px;
                                            color: #374151;
                                            font-size: 13px;
                                            line-height: 1.5;
                                        "
                                    >
                                        Complete your institute profile
                                        and required setup information.
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        width="36"
                                        valign="top"
                                    >
                                        <div style="
                                            width: 28px;
                                            height: 28px;
                                            line-height: 28px;
                                            text-align: center;
                                            border-radius: 50%;
                                            background-color: #10b981;
                                            color: #ffffff;
                                            font-size: 12px;
                                            font-weight: bold;
                                        ">
                                            3
                                        </div>
                                    </td>
                                    <td
                                        valign="top"
                                        style="
                                            padding: 3px 0;
                                            color: #374151;
                                            font-size: 13px;
                                            line-height: 1.5;
                                        "
                                    >
                                        After completing the setup, you
                                        will be able to access and manage
                                        your institute dashboard.
                                    </td>
                                </tr>
                            </table>
                            <!-- Login Details -->
                            <h2 style="
                                margin: 30px 0 12px;
                                color: #111827;
                                font-size: 16px;
                            ">
                                Your Login Details
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
                                            Email
                                        </span>
                                        <strong style="
                                            color: #111827;
                                            font-size: 13px;
                                        ">
                                            ${email}
                                        </strong>
                                    </td>
                                </tr>
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
                                            Password
                                        </span>
                                        <strong style="
                                            color: #111827;
                                            font-size: 13px;
                                    ">
                                        Use the password you entered
                                        during registration
                                    </strong>
                                    </td>
                                </tr>
                            </table>
                            <!-- Login Button -->
                            <div style="
                                text-align: center;
                                margin: 28px 0;
                            ">
                                <a
                                    href="${loginUrl}"
                                    style="
                                        display: inline-block;
                                        padding: 12px 25px;
                                        background-color: #10b981;
                                        color: #ffffff;
                                        text-decoration: none;
                                        border-radius: 8px;
                                        font-size: 13px;
                                        font-weight: 600;
                                    "
                                >
                                    Access Admin Login
                                </a>
                            </div>
                            <p style="
                                margin: 0 0 18px;
                                color: #6b7280;
                                font-size: 12px;
                                line-height: 1.7;
                            ">
                                For security reasons, please do not share
                                your login credentials with anyone.
                            </p>
                            <p style="
                                margin: 0;
                                color: #4b5563;
                                font-size: 13px;
                                line-height: 1.7;
                            ">
                                If you did not submit this application or
                                believe this approval was made in error,
                                please contact the DSCH administration.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
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
                                Digital Smart City Hub (DSCH)
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