import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCl7SF2syGX55Eb0e8dNuSPsdvvWRDFYLU",
    authDomain: "ekarigar-project-manage.firebaseapp.com",
    projectId: "ekarigar-project-manage",
    storageBucket: "ekarigar-project-manage.firebasestorage.app",
    messagingSenderId: "1075807050837",
    appId: "1:1075807050837:web:f01992e4ff5a97688a08dc",
    measurementId: "G-BTPYR9T371"
  };


 export  const app = initializeApp(firebaseConfig);
 export const messaging = getMessaging(app);
