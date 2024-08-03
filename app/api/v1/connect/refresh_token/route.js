import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req, _) => {
  const { code } = await req.json();

  if (!code)
    return NextResponse.json(
      { error: "No code was giving for exchange" },
      { status: 400 }
    );
  const res = await getNewRefreshToken(code);
  return NextResponse.json({ token: res.refresh_token }, { status: 200 });
};

async function getNewRefreshToken(code) {
  const clientId = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web.client_id;
  const clientSecret = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .client_secret;
  const redirectUri = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .redirect_uris[0];
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
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
