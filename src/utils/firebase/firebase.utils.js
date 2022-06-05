import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword, //method by firebase
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
//just like getAuth, we need to instantiate our firestore instance
//doc method retrieve documents inside of our firestore database, doc get the document's instance
//use getDoc access the document's data
//use setDoc to sets/update the document's data
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore"; //firestore is a different service

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
const googleProvider = new GoogleAuthProvider(); //Initialize a provider

googleProvider.setCustomParameters({
  prompt: "select_account", //Always force user to select an account when they interact with a provider
});

export const auth = getAuth(); //Create the instance
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider); //************************* */

// export const signInWithGoogleRedirect = () =>
//   signInWithRedirect(auth, googleProvider);

//Firestore Setup
export const db = getFirestore(); //Instantiate our firestore, now we can use it to access our database

//objectsToAdd is the actual document that we want to add
//put data to firestore database
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done!");
};

//get data from firestore
export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs);

  //testing map
  // querySnapshot.docs.map((snapshot) => {
  //   console.log(snapshot.data());
  // });

  //initial value as an empty object
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    // console.log(docSnapshot.data());
    // console.log(acc);
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  //******************************** */
  //userAuth: user authentication object

  if (!userAuth) return; //if we dont receive the useAuth argument, just dont run the function

  const userDocRef = doc(db, "users", userAuth.uid); //Hey, give me the document reference inside of this database, under the user collection, with user Auth id
  // console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef); //get the data from our userDocRef: allow us to check whether or not there is an instance that exist and allow us to access the data
  // console.log(userSnapshot);
  // console.log(userSnapshot.exists());

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
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  //if user data exists
  //return userDocRef
  return userDocRef;
};

//Interface layer functions//
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth); //auth is also keeping track of what users are signed in right now

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
