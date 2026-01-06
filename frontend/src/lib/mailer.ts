import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: `${process.env.MAIL_SERVICE}`,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

export interface CandidateEmailData {
  candidateName: string;
  candidateEmail: string;
  roleAppliedFor: string;
  testLink: string;
}

export interface ProctorEmailData {
  candidateName: string;
  proctorEmail: string;
  role: string;
  scheduledDate?: string;
  scheduledTime?: string;
  proctoringLink: string;
}

export async function sendCandidateTestEmail(
  data: CandidateEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      candidateName,
      candidateEmail,
      roleAppliedFor,
      testLink,
    } = data;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #667eea 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 20px;
            }
            .greeting {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .details-box {
              background-color: #f9fafb;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .details-box p {
              margin: 8px 0;
              font-size: 14px;
            }
            .details-box strong {
              color: #1f2937;
            }
            .cta-button {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
              transition: background-color 0.3s ease;
            }
            .cta-button:hover {
              background-color: #5568d3;
            }
            .instructions {
              background-color: #fef3c7;
              border: 1px solid #fcd34d;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .instructions h3 {
              margin: 0 0 12px 0;
              color: #92400e;
              font-size: 14px;
            }
            .instructions ul {
              margin: 0;
              padding-left: 20px;
              color: #78350f;
              font-size: 14px;
            }
            .instructions li {
              margin-bottom: 8px;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Interview Test Is Ready</h1>
            </div>

            <div class="content">
              <div class="greeting">
                <strong>Greetings For The Day,</strong>
                <p>Great news! Your interview test has been scheduled. You're all set to begin whenever you're ready.</p>
              </div>

              <div class="details-box">
                <p><strong>Role Applied For:</strong> ${roleAppliedFor}</p>
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${testLink}" class="cta-button" style="color: white">Start Your Test</a>
              </p>

              <div class="instructions">
                <h3>📋 Test Requirements</h3>
                <ul>
                  <li>Stable internet connection is required</li>
                  <li>Camera and microphone access required</li>
                  <li>Your test link is unique and non-shareable</li>
                  <li>Complete the test in one session — do not close the window</li>
                  <li>Allow 60-90 minutes for the full assessment</li>
                </ul>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                If you encounter any technical issues, please contact our support team immediately.
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0;">© 2026 Interview Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: candidateEmail,
      subject: "Your Interview Test Is Ready – Start Now",
      html: htmlContent,
    });

    console.log("[mailer] Candidate email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[mailer] Error sending candidate email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send proctoring email to HR/Proctor
 */
export async function sendProctorTestEmail(
  data: ProctorEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      candidateName,
      proctorEmail,
      role,
      proctoringLink,
    } = data;

    const htmlContent = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #667eea 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 20px;
          }
          .alert-box {
            background-color: #eff6ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .alert-box h3 {
            margin: 0 0 10px 0;
            color: #1e40af;
            font-size: 16px;
          }
          .alert-box p {
            margin: 0;
            color: #1e3a8a;
            font-size: 14px;
          }
          .details-box {
            background-color: #f9fafb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
          }
          .details-box p {
            margin: 10px 0;
            font-size: 14px;
          }
          .details-box strong {
            color: #1f2937;
            display: inline-block;
            min-width: 140px;
          }
          .cta-button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: background-color 0.3s ease;
          }
          .cta-button:hover {
            background-color: #5568d3;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Candidate Test Created</h1>
          </div>

          <div class="content">
            <div class="alert-box">
              <h3>⚠️ Proctoring Required</h3>
              <p>A new candidate test has been created and requires your monitoring and supervision.</p>
            </div>

            <div class="details-box">
              <p><strong>Role:</strong> ${role}</p>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${proctoringLink}" class="cta-button" style="color:white">Access Proctoring Dashboard</a>
            </p>

            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              <strong>Next Steps:</strong>
            </p>
            <ul style="font-size: 14px; color: #6b7280; margin: 0; padding-left: 20px;">
              <li>Review candidate details and test parameters</li>
              <li>Monitor the candidate during the entire test session</li>
              <li>Document any unusual behavior or technical issues</li>
              <li>Confirm test completion and submit assessment</li>
            </ul>
          </div>

          <div class="footer">
            <p style="margin: 0;">© 2026 Interview Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>`;

    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: proctorEmail,
      subject: "New Candidate Test Created – Proctoring Required",
      html: htmlContent,
    });

    console.log("[mailer] Proctor email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[mailer] Error sending proctor email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send both candidate and proctor emails
 */
export async function sendTestEmails(
  candidateData: CandidateEmailData,
  proctorData: ProctorEmailData
): Promise<{
  candidateSuccess: boolean;
  proctorSuccess: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  const candidateResult = await sendCandidateTestEmail(candidateData);
  if (!candidateResult.success && candidateResult.error) {
    errors.push(`Candidate email failed: ${candidateResult.error}`);
  }

  const proctorResult = await sendProctorTestEmail(proctorData);
  if (!proctorResult.success && proctorResult.error) {
    errors.push(`Proctor email failed: ${proctorResult.error}`);
  }

  return {
    candidateSuccess: candidateResult.success,
    proctorSuccess: proctorResult.success,
    errors,
  };
}
