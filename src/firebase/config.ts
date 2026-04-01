import {initializeApp} from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCnhC97ion40_4DQGxyNHgoHPzJWV1LrO8",
    authDomain: "weird-space-facts.firebaseapp.com",
    projectId: "weird-space-facts",
    storageBucket: "weird-space-facts.firebasestorage.app",
    messagingSenderId: "706070244294",
    appId: "1:706070244294:web:8180c8ac8a45b7f76260c7"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)