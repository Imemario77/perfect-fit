import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req, _) => {
  const { googlePhotosToken } = await req.json();

  if (!googlePhotosToken)
    return NextResponse.json({ error: "No token was passed" }, { status: 400 });
  const res = await getNewAccessToken(googlePhotosToken);
  return NextResponse.json({ token: res.access_token }, { status: 200 });
};

async function getNewAccessToken(refresh_token) {
  const clientId = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web.client_id;
  const clientSecret = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .client_secret;
  const redirectUri = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .redirect_uris[0];
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token,
    grant_type: "refresh_token",
  };

  const axioConfig = {
    method: "post",
    url: "https://oauth2.googleapis.com/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: data,
  };

  try {
    const response = await axios(axioConfig);
    return response.data;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    throw error;
  }
}
