const Login = ({ setUser }) => {
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
