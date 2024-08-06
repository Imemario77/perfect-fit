import { admin_messaging } from "@/firebase/admin/config";
import { NextResponse } from "next/server";

// register for notification
export const POST = async (req, res) => {
  try {
    let { token } = await req.json();
    const res = await admin_messaging.subscribeToTopic(
      [token],
      "7_am_early_reminder"
    );
    console.log(res);
    return NextResponse.json({ success: true, res }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
