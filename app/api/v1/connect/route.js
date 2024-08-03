import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  const clientId = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web.client_id;
  const clientSecret = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .client_secret;
  const redirectUri = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .redirect_uris[0];
  const scope = "https://www.googleapis.com/auth/photoslibrary.readonly";
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&prompt=consent`;

  return NextResponse.json({ url });
};
