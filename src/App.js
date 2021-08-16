import { useEffect, useState, useRef } from "react";
import { Page, Button, Link, Spinner } from "@geist-ui/react";
import { CertificateTable } from "./components/CertificateTable";
import { EditCertificate } from "./components/EditCertificate";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { FillCertificate } from "./components/FillCertificate";

function App({ firebaseApp }) {
  const [user, setUser] = useState(null);
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

  const onSignOutClick = () => {
    setUser(null);
    firebaseApp.auth().signOut();
  };
  return (
    <Router>
      <div className="App">
        <Page className={"page"}>
          <Page.Header
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link href="/">
              <h2 style={{ marginBottom: 0 }}>Certify GDSC</h2>
            </Link>
            {user && (
              <Button
                style={{ marginLeft: "auto", minWidth: "fit-content" }}
                onClick={onSignOutClick}
              >
                Sign Out
              </Button>
            )}
          </Page.Header>
          <Page.Content>
            <Switch>
              <Route exact path="/">
                {!user ? (
                  user === false ? (
                    <Login user={user} setUser={setUser} />
                  ) : (
                    <div
                      style={{
                        height: "40vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spinner />
                    </div>
                  )
                ) : (
                  <CertificateTable />
                )}
              </Route>
              <Route path="/edit/:id">
                <EditCertificate user={user} />
              </Route>
              <Route path="/fill/:id">
                <FillCertificate user={user} />
              </Route>
            </Switch>
          </Page.Content>
          <Page.Footer style={{ position: "relative" }}>
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
