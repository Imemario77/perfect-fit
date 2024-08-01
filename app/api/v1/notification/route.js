import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .where("needsNotification", "==", true)
      .get();

    if (!snapshot.empty) {
      const message = {
        notification: {
          title: "Daily Update",
          body: "You have updates in your account.",
        },
        topic: "daily_updates",
      };

      await messaging.send(message);
      NextResponse.json(
        { success: true, message: "Notifications sent" },
        { status: 200 }
      );
    } else {
      NextResponse.json(
        { success: true, message: "No notifications needed" },
        { status: 200 }
      );
    }
  } catch (error) {
    NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
