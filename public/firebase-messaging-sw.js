importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAA9UA5Mhr1R5fEITWBYqUGv4Rstd_E2WM",
  authDomain: "perfect-fit-fc745.firebaseapp.com",
  projectId: "perfect-fit-fc745",
  storageBucket: "perfect-fit-fc745.appspot.com",
  messagingSenderId: "195068368429",
  appId: "1:195068368429:web:aa14332e3353a0e2420aa4",
  measurementId: "G-PB7QGQWJSM",
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig || defaultConfig);
let messaging;
try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error("Failed to initialize Firebase Messaging", err);
}

// To dispaly background notifications
if (messaging) {
  try {
    messaging.onBackgroundMessage((payload) => {
      console.log("Received background message: ", payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        tag: notificationTitle, // tag is added to ovverride the notification with latest update
        icon: payload.notification?.image || data.image,
        data: {
          url: payload?.data?.openUrl, // This should contain the URL you want to open
        },
      };
      // Optional
      /*
       * This condition is added because notification triggers from firebase messaging console doesn't handle image by default.
       * collapseKey comes only when the notification is triggered from firebase messaging console and not from hitting fcm google api.
       */
      if (payload?.collapseKey && notification?.image) {
        self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
      } else {
        // Skipping the event handling for notification
        return new Promise(function (resolve, reject) {});
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// File: firebase-messaging-sw.js
// Handling Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // CLosing the notification when clicked
  const urlToOpen = event?.notification?.data?.url || "https://www.test.com/";
  // Open the URL in the default browser.
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (const client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab with the target URL
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
