import { type NextRequest, NextResponse } from "next/server";
import { sendTestEmails } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      candidateName,
      candidateEmail,
      roleAppliedFor,
      experienceLevel,
      testLink,
      proctorEmail = "divyanshu.bhati@vanshiv.com",
      scheduledDate,
      scheduledTime,
      proctoringLink,
    } = body;

    // if (!candidateName || !candidateEmail || !roleAppliedFor || !experienceLevel || !testLink) {
    //   return NextResponse.json({ error: "Missing required candidate fields" }, { status: 400 })
    // }

    // if (!proctorEmail || !proctoringLink) {
    //   return NextResponse.json({ error: "Missing required proctor fields" }, { status: 400 })
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // if (!emailRegex.test(candidateEmail) || !emailRegex.test(proctorEmail)) {
    //   return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    // }

    // Prepare email data
    const candidateData = {
      candidateName,
      candidateEmail,
      roleAppliedFor,
      experienceLevel,
      testLink,
    };

    const proctorData = {
      candidateName: candidateName || "",
      proctorEmail: proctorEmail || "",
      role: roleAppliedFor || "",
      experienceLevel: experienceLevel || "",
      scheduledDate: scheduledDate || "",
      scheduledTime: scheduledTime || "",
      proctoringLink: proctoringLink || "",
    };

    const result = await sendTestEmails(candidateData, proctorData);

    if (result.candidateSuccess && result.proctorSuccess) {
      return NextResponse.json(
        {
          success: true,
          message: "Both emails sent successfully",
        },
        { status: 200 }
      );
    } else if (result.candidateSuccess || result.proctorSuccess) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more emails failed to send",
          errors: result.errors,
        },
        { status: 207 } // 207 Multi-Status
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send emails",
          errors: result.errors,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[send-test-email] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
