import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
//just like getAuth, we need to instantiate our firestore instance
//doc method retrieve documents inside of our firestore database, doc get the document's instance
//use getDoc access the document's data
//use setDoc to sets/update the document's data
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; //firestore is a different service

const firebaseConfig = {
  apiKey: "AIzaSyAyO9kKT3T6sThuMJTGafqkTCWBipvfhls",
  authDomain: "crown-clothing-db-3656c.firebaseapp.com",
  projectId: "crown-clothing-db-3656c",
  storageBucket: "crown-clothing-db-3656c.appspot.com",
  messagingSenderId: "38555475269",
  appId: "1:38555475269:web:18ac6d51f4a801b115b22c",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//Use google authentication

const provider = new GoogleAuthProvider(); //Initialize a provider

provider.setCustomParameters({
  prompt: "select_account", //Always force user to select an account when they interact with a provider
});

export const auth = getAuth(); //Create the instance
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

//Firestore Setup

export const db = getFirestore(); //Instantiate our firestore, now we can use it to access our database

export const createUserDoumentFromAuth = async (userAuth) => {
  //userAuth: user authentication object
  const userDocRef = doc(db, "users", userAuth.uid); //Hey, give me the document reference inside of this database, under the user collection, with user Auth id
  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef); //get the data from our userDocRef: allow us to check whether or not there is an instance that exist and allow us to access the data
  console.log(userSnapshot);
  console.log(userSnapshot.exists());

  //if user data does not exists
  //create / set the document with the data from userAuth in my collection
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth; //destructure from the user ovject
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        //if snapshot dosent't exist, we gonna set the userDocRef with that object
        displayName,
        email,
        createAt,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;

  //if user data exists

  //return userDocRef
};
