importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyCl7SF2syGX55Eb0e8dNuSPsdvvWRDFYLU",
    authDomain: "ekarigar-project-manage.firebaseapp.com",
    projectId: "ekarigar-project-manage",
    storageBucket: "ekarigar-project-manage.firebasestorage.app",
    messagingSenderId: "1075807050837",
    appId: "1:1075807050837:web:f01992e4ff5a97688a08dc",
    measurementId: "G-BTPYR9T371"
  };
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});