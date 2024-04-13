// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB5th6oofibd2PJi-NXX4u7RrjMwnJSZUM',
  authDomain: 'e-commerce-819ee.firebaseapp.com',
  projectId: 'e-commerce-819ee',
  storageBucket: 'e-commerce-819ee.appspot.com',
  messagingSenderId: '55823718952',
  appId: '1:55823718952:web:ed4abfd7b3785f375af31d',
  measurementId: 'G-5JRSMNGF4Q',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
