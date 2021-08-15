import React from "react";
import { Text } from "@geist-ui/react";
import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
// import { getCertificateInfo } from "../firebase/api";
// import { firebaseApp } from "../firebase/init";

export const CreateCertificate = ({ user }) => {
  const mounted = useRef(false);
  const params = useParams();
  //   const user = firebaseApp.auth().currentUser;
  const [data] = useState(null);

  //   const onCertificateReceive = () => {};

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      //   console.log(firebaseApp.auth().currentUser);
      //   getCertificateInfo(user, params.id, onCertificateReceive, () =>
      //     setData(false)
      //   );
    }
    return () => {
      mounted.current = false;
    };
  }, [params.id, user]);

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
        {data === false ? <Text p>Error!</Text> : <Text p>Coming Soon!</Text>}
      </div>
    </div>
  );
};
