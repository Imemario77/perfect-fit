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
