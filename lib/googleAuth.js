import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export const authWithGoogle = async (auth) => {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  const result = await signInWithPopup(auth, provider);
  // The signed-in user info.
  const user = result.user;
  // This gives you a Google Access Token.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
};


export const getAccessTokenForPhotos =  () => {
// https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://developers.google.com/oauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/photoslibrary.readonly&access_type=offline
}