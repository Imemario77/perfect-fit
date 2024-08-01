// import { getMessaging } from "firebase/messaging/sw";
// import { onBackgroundMessage } from "firebase/messaging/sw";
// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging/sw";

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAA9UA5Mhr1R5fEITWBYqUGv4Rstd_E2WM",
  authDomain: "perfect-fit-fc745.firebaseapp.com",
  projectId: "perfect-fit-fc745",
  storageBucket: "perfect-fit-fc745.appspot.com",
  messagingSenderId: "195068368429",
  appId: "1:195068368429:web:aa14332e3353a0e2420aa4",
  measurementId: "G-PB7QGQWJSM",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Optional: Add background message handler
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload?.notification?.title;
  const notificationOptions = {
    body: payload?.notification?.body,
    icon: "/perfectfit -logo.jpg",
  };
  self.registration
    .showNotification(notificationTitle, notificationOptions)
    .then(() => console.log("Notification shown successfully"))
    .catch((error) => console.error("Error showing notification:", error));
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification click Received.", event);
  event.notification.close();

  // This will send a message to the client
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        client.postMessage({
          type: "NOTIFICATION_CLICK",
          action: event.notification.data.click_action,
        });
      }
      if (clientList.length === 0) {
        // If there is no active client, open a new window
        self.clients.openWindow("/getOutfit");
      }
    })
  );
});
