import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";

import {
  //   auth,
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  signInWithGoogleRedirect,
} from "../../utils/firebase/firebase.utils";

import SignUpForm from "../../components/sign-up-form/sign-up-form.component";

const SignIn = () => {
  //   useEffect(() => {
  //     (async () => {
  //       const response = await getRedirectResult(auth);
  //       console.log(response);
  //       if (response) {
  //         const userDocRef = await createUserDoumentFromAuth(response.user);
  //         console.log(response);
  //       }
  //     })(); //execute the function directly here
  //   }, []);

  const logGoogleUser = async () => {
    const { user } = await signInWithGooglePopup();
    console.log(user);
    const userDocRef = await createUserDocumentFromAuth(user);
  };

  //When we sign in with google redirect, we being taken to that page, choose our google user. When we come back, our
  //application is going to remount, the SignIn component will remount. On mount, useEffect will run once
  //due to empty dependency array, then get the response of the redirect that just happened, we know what
  //redirect happened based on the auth. auth help us keep track of all these authentication state that are
  //happening throughout the application. think auth like memory bank tracking all our authentication state for
  //our website and our firebase instance regardless of where the website is going, so that why auth is so useful
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={logGoogleUser}>Sign in with Google Popup</button>
      {/* <button onClick={signInWithGoogleRedirect}>
        Sign in with Google Redirect
      </button> */}
      <SignUpForm />
    </div>
  );
};

export default SignIn;
