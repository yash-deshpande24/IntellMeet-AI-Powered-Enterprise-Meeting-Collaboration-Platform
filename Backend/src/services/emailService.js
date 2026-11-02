import nodemailer from 'nodemailer';

// Create transporter using environment variables or a fallback logger
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

/**
 * Generate Zoom-style invitation plaintext block
 */
export const generatePlainTextInvite = ({ hostName, title, scheduledAt, duration, meetingLink, roomCode, passcode }) => {
  const dateStr = new Date(scheduledAt).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
${hostName || 'The host'} is inviting you to a scheduled IntellMeet meeting.

Topic: ${title}
Time: ${dateStr}
Duration: ${duration || 45} minutes

Join IntellMeet Meeting:
${meetingLink}

Meeting ID: ${roomCode}
Passcode: ${passcode || 'None required'}

---
One-click mobile/direct join:
${meetingLink}
`.trim();
};

/**
 * Generate Zoom-style HTML invitation
 */
export const generateHtmlInvite = ({ hostName, title, description, scheduledAt, duration, meetingLink, roomCode, passcode }) => {
  const dateStr = new Date(scheduledAt).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Meeting Invitation: ${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">IntellMeet Video Conference</h1>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">AI-Powered Enterprise Collaboration</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px 28px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          <strong>${hostName || 'A team member'}</strong> is inviting you to attend a scheduled real-time conference.
        </p>

        <!-- Details Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b; width: 110px;"><strong>Topic:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${title}</td>
          </tr>
          ${description ? `
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;"><strong>Agenda:</strong></td>
            <td style="padding: 6px 0; font-size: 13px; color: #334155;">${description}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;"><strong>Date & Time:</strong></td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #334155;">${dateStr}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;"><strong>Duration:</strong></td>
            <td style="padding: 6px 0; font-size: 13px; color: #334155;">${duration || 45} minutes</td>
          </tr>
        </table>

        <!-- Call to Action Button -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${meetingLink}" target="_blank" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
            Join Meeting Now
          </a>
        </div>

        <!-- Credentials Box (Zoom Style) -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px dashed #cbd5e1; border-radius: 10px; padding: 16px; background: #fafafa; margin-bottom: 24px;">
          <tr>
            <td style="font-size: 13px; color: #475569; padding: 4px 0;">
              <strong>Direct Link:</strong> <a href="${meetingLink}" style="color: #4f46e5; word-break: break-all;">${meetingLink}</a>
            </td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #475569; padding: 4px 0;">
              <strong>Meeting ID / Room:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: #0f172a;">${roomCode}</span>
            </td>
          </tr>
          ${passcode ? `
          <tr>
            <td style="font-size: 13px; color: #475569; padding: 4px 0;">
              <strong>Security Passcode:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: 700; color: #4f46e5; background: #e0e7ff; padding: 2px 8px; border-radius: 6px;">${passcode}</span>
            </td>
          </tr>
          ` : ''}
        </table>

        <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5; text-align: center;">
          Can't join with 1-click? Open IntellMeet, select <em>Join Meeting</em>, and enter the Meeting ID and Passcode above.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; text-align: center; font-size: 11px; color: #94a3b8;">
        IntellMeet Enterprise Communications Platform • Real-time WebRTC Mesh with AI Summaries
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Send meeting invitation to a list of emails
 */
export const sendMeetingInvitations = async ({ hostName, title, description, scheduledAt, duration, meetingLink, roomCode, passcode, recipients = [] }) => {
  const cleanEmails = recipients
    .map((e) => (typeof e === 'string' ? e.trim() : e.email?.trim()))
    .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  if (cleanEmails.length === 0) {
    return { success: true, count: 0, recipients: [], notice: 'No valid recipient email addresses provided' };
  }

  const transporter = createTransporter();
  const htmlContent = generateHtmlInvite({ hostName, title, description, scheduledAt, duration, meetingLink, roomCode, passcode });
  const textContent = generatePlainTextInvite({ hostName, title, scheduledAt, duration, meetingLink, roomCode, passcode });

  const fromAddress = process.env.SMTP_FROM || `"IntellMeet Conferences" <no-reply@intellmeet.io>`;

  if (!transporter) {
    console.log(`[Email Service Simulation] No SMTP credentials in .env. Invitation prepared for ${cleanEmails.join(', ')}:`);
    console.log(`[Meeting Link]: ${meetingLink}`);
    console.log(`[Meeting ID]: ${roomCode} | [Passcode]: ${passcode}`);
    return {
      success: true,
      delivered: false,
      simulated: true,
      recipients: cleanEmails,
      message: `Invitations generated for ${cleanEmails.length} recipient(s) (Ready for SMTP / Simulated)`,
      previewInvite: textContent
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: cleanEmails.join(', '),
      subject: `Invitation: ${title} - IntellMeet Conference`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email Service] Dispatched meeting invitation to ${cleanEmails.join(', ')}: ${info.messageId}`);
    return {
      success: true,
      delivered: true,
      messageId: info.messageId,
      recipients: cleanEmails
    };
  } catch (error) {
    console.warn(`[Email Service Warning] Failed to send email via SMTP: ${error.message}`);
    return {
      success: false,
      delivered: false,
      error: error.message,
      recipients: cleanEmails,
      previewInvite: textContent
    };
  }
};
