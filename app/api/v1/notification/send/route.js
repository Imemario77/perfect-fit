import { admin_messaging } from "@/firebase/admin/config";
import { genAI } from "@/lib/gemini";
import { NextResponse } from "next/server";

// cron job to send notfication
export const GET = async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const topics = [
    "Seasonal trends",
    "Color coordination",
    "Outfit of the day",
    "Accessorizing tips",
    "Style icon inspiration",
    "Wardrobe organization",
    "Sustainable fashion",
    "Body type styling",
    "Upcoming fashion events",
    "Personal style quiz",
    "Dress code guidance",
    "Fabric care tips",
    "Vintage fashion finds",
    "Mix and match strategies",
    "Fashion history tidbits",
  ];

  function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
  }

  const prompt = `
Generate a single, unique JSON notification for a personal styling assistant app. Use the randomly selected topic to create a fresh, engaging message that prompts the user to open the app.

The selected topic is: ${getRandomTopic()}

Create a notification related to this topic. Be creative and use engaging language to encourage app usage. The JSON structure should be:

{
  "title": "Short, attention-grabbing title (max 50 characters)",
  "body": "Longer message with more details or a call to action (max 150 characters)"
}

Ensure the content is novel and tailored to the selected topic. Do not include any explanations or additional text outside the JSON structure.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    let notification;
    try {
      notification = JSON.parse(response);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      notification = {
        title: "✨ Style Quiz: Discover Your Signature Look!",
        body: "Curious about your personal style? Use our chat assistant and unlock personalized recommendations. Let's find your perfect fit! 😉",
      };
    }

    console.log("Parsed Notification:", notification);

    const message = {
      notification,
      data: {
        click_action: "/getOutfit",
      },
      topic: "7_am_early_reminder",
    };

    const fcmResponse = await admin_messaging.send(message);
    console.log("FCM Response:", fcmResponse);
    return NextResponse.json(
      { success: true, res: fcmResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
