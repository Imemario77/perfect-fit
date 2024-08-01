import { admin_messaging } from "@/firebase/admin/config";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  const message = {
    notification: {
      title: "Today's Outfit Suggestion From Perfect Fit",
      body: "Perfect for today's weather: Tap for details!",
    },
    data: {
      click_action: "/getOutfit",
    },
    topic: "7_am_early_reminder",
  };
  try {
    const res = await admin_messaging.send(message);
    console.log(res);
    return NextResponse.json({ success: true, res }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
