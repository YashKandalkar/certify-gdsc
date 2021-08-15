import { useState } from "react";
import { Button, Note } from "@geist-ui/react";
import firebase from "firebase/app";
import { firebaseApp } from "../firebase/init";

export const Login = ({ user, setUser }) => {
  const [error, setError] = useState(null);
  const onSignInClick = () => {
    setUser(null);
    var provider = new firebase.auth.GoogleAuthProvider();
    firebaseApp
      .auth()
      .signInWithRedirect(provider)
      .then((result) => {
        var user = result.user;
        setUser(user);
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.error(errorMessage);
        setError(errorMessage);
        setUser(false);
      });
  };
  return (
    <div
      style={{
        maxWidth: 340,
        margin: "0 auto",
      }}
    >
      <h3>Sign In</h3>
      <p>Sign In with your Google account.</p>
      <Button loading={user === null} onClick={onSignInClick}>
        Sign In
      </Button>
      {error && (
        <Note label={false} type="error" style={{ marginTop: "1rem" }}>
          Error Signing in! Please try again.
        </Note>
      )}
    </div>
  );
};
