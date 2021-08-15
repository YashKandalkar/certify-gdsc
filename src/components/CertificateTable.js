import React from "react";
import { Button, Text } from "@geist-ui/react";
import { useState } from "react";
import { createCertificate } from "../firebase/api";
import { firebaseApp } from "../firebase/init";

export const CertificateTable = () => {
  const [loading, setLoading] = useState(false);
  const user = firebaseApp.auth().currentUser;
  const onCreate = (refKey) => {
    window.location.href = `/edit/${refKey}`;
  };

  const onCreateClick = () => {
    setLoading(true);
    console.log(user);
    createCertificate(user, onCreate);
  };
  return (
    <div>
      <div
        style={{
          minHeight: "40vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text p>You have not created any certificates yet!</Text>
        <Button onClick={onCreateClick} loading={loading}>
          Create Now
        </Button>
      </div>
    </div>
  );
};
