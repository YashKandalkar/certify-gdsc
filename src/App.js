import { useEffect, useState, useRef } from "react";
import firebase from "firebase/app";
import { Page, Button, Note, Link } from "@geist-ui/react";
import { CertificateTable } from "./components/CertificateTable";
import { CreateCertificate } from "./components/CreateCertificate";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App({ firebaseApp }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      firebaseApp.auth().onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(false);
        }
      });
    }
    return () => (mounted.current = false);
  }, [firebaseApp, mounted]);

  const onSignInClick = () => {
    setUser(null);
    var provider = new firebase.auth.GoogleAuthProvider();
    firebaseApp
      .auth()
      .signInWithPopup(provider)
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

  const onSignOutClick = () => {
    setUser(null);
    firebaseApp.auth().signOut();
  };
  return (
    <Router>
      <div className="App">
        <Page>
          <Page.Header style={{ display: "flex", alignItems: "center" }}>
            <h2>Certify GDSC</h2>
            {user && (
              <Button style={{ marginLeft: "auto" }} onClick={onSignOutClick}>
                Sign Out
              </Button>
            )}
          </Page.Header>
          <Page.Content>
            <Switch>
              <Route exact path="/">
                {!user ? (
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
                      <Note
                        label={false}
                        type="error"
                        style={{ marginTop: "1rem" }}
                      >
                        Error Signing in! Please try again.
                      </Note>
                    )}
                  </div>
                ) : (
                  <CertificateTable />
                )}
              </Route>
              <Route path="/edit/:id">
                <CreateCertificate user={user} />
              </Route>
            </Switch>
          </Page.Content>
          <Page.Footer>
            <div
              style={{
                margin: "3rem auto",
                maxWidth: 300,
                textAlign: "center",
              }}
            >
              Made in a hurry by{" "}
              <Link href="https://github.com/YashKandalkar" color>
                YashKandalkar
              </Link>
            </div>
          </Page.Footer>
        </Page>
      </div>
    </Router>
  );
}

export default App;
