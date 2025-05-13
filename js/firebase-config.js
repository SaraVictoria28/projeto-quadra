import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzW2xGb-h-GaHrBMNuRe8_uUPA6A5fjMo",
  authDomain: "quadras-teste.firebaseapp.com",
  databaseURL: "https://quadras-teste-default-rtdb.firebaseio.com",
  projectId: "quadras-teste",
  storageBucket: "quadras-teste.firebasestorage.app",
  messagingSenderId: "971751359974",
  appId: "1:971751359974:web:5e9a7c4b9d7d12e2cc0227",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export{auth, db};