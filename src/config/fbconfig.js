// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCaI2qpMVbweHvM15zYdzAZ2s7CdxaQ9KI",
	authDomain: "firstprj-7b27c.firebaseapp.com",
	databaseURL:
		"https://firstprj-7b27c-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "firstprj-7b27c",
	storageBucket: "firstprj-7b27c.appspot.com",
	messagingSenderId: "711468014459",
	appId: "1:711468014459:web:443a4f49c709c4b5923bde",
	measurementId: "G-2JYGZY381T",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage();
// FIREBASE Firestore HERE ⚠⚠⚠
export const db = getFirestore();
// FIREBASE Firestore GET HERE ⚠⚠⚠
export const convertStorageImgURL = async (imgURL) => {
	const finalURL = await getDownloadURL(ref(storage, imgURL)).then(
		(url) => url
	);
	return finalURL;
};
