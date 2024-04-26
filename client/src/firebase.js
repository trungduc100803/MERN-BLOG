// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWVLvq_8iMyu99S6OQElA9mJbq3wRppTM",
    authDomain: "mern-blog-265bc.firebaseapp.com",
    projectId: "mern-blog-265bc",
    storageBucket: "mern-blog-265bc.appspot.com",
    messagingSenderId: "522645869834",
    appId: "1:522645869834:web:305c2b92e45fe4cb3c16f3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);