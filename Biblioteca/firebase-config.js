// Configuração do seu Firebase (usando SDK compat já importado no HTML)
const firebaseConfig = {
    apiKey: "AIzaSyCzgUy1wzPcSDGmabgr8uWjn4HHxHqsOTg",
    authDomain: "bibliotecagamboa.firebaseapp.com",
    projectId: "bibliotecagamboa",
    storageBucket: "bibliotecagamboa.firebasestorage.app",
    messagingSenderId: "404640417642",
    appId: "1:404640417642:web:190bf7b20939b10bec8713"
};

// URL publicada do Apps Script (ajuste para sua implantação)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw-LbU-mzFWLA4F-CN-vwpy5LYtaD2RZVNQjV3AqJFlvNN0Cucy5ypJhLkMjgrOiyRq/exec";

// Inicializa Firebase e Auth compat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();