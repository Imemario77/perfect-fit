import * as admin from "firebase-admin";
import serviceAccount from "C:/Users/ROBERTECH/Downloads/perfect-fit-fc745-firebase-adminsdk-dgswh-78513b0486.json";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
