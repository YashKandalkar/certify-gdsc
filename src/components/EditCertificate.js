import { useRef, useEffect, useState, useCallback } from "react";
import { Note, Spinner, Text, Progress } from "@geist-ui/react";
import { useParams } from "react-router-dom";
import {
  getCertificateInfo,
  setCertificateInfo,
  uploadImage,
} from "../firebase/api";
import { toTitleCase } from "../utils";
import { Upload } from "@geist-ui/react-icons";
import { useDropzone } from "react-dropzone";
import { Certificate } from "./Certificate";

const centerDiv = {
  minHeight: "40vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

export const EditCertificate = ({ user }) => {
  const [uploadProgress, setUploadProgress] = useState({
    uploading: false,
    percent: 0,
  });
  const mounted = useRef(false);
  const params = useParams();
  const [data, setData] = useState(null);

  const onCertificateReceive = (data) => {
    console.log(data);
    setData(data);
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (user) {
        getCertificateInfo(user, params.id, onCertificateReceive, () => {
          setData(false);
          setTimeout(() => (window.location.href = "/"), 4000);
        });
      } else if (user === false) {
        setTimeout(() => (window.location.href = "/"), 4000);
      }
    }
    return () => {
      mounted.current = false;
    };
  }, [params.id, user]);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.error("file reading was aborted");
        reader.onerror = () => console.error("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          console.log(binaryStr);
          uploadImage(
            user,
            params.id,
            binaryStr,
            (progress) => {
              setUploadProgress({ percent: progress, uploading: true });
            },
            (downloadUrl) => {
              setUploadProgress({ percent: 100, uploading: false });
              setData({ ...data, imageUrl: downloadUrl });
              setCertificateInfo(user, params.id, {
                ...data,
                imageUrl: downloadUrl,
              });
            }
          );
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [data, params.id, user]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    accept: "image/*",
    multiple: false,
    maxFiles: 1,
    maxSize: 5e6, // 5 MB
  });

  return (
    <div>
      {user ? (
        data === null ? (
          <div style={centerDiv}>
            <Spinner />
          </div>
        ) : data === false ? (
          <div style={centerDiv}>
            <Text p>
              This page is not available or you are not authorized to view it!
            </Text>
            <Text small>Redirecting you to the home page...</Text>
          </div>
        ) : data.imageUrl === true ? (
          <>
            <Text h3>{toTitleCase(data.title)}</Text>
            <Text p>Upload Your Certificate Template</Text>
            {uploadProgress.uploading ? (
              <div style={{ ...centerDiv, maxWidth: 340, margin: "0 auto" }}>
                <Progress value={uploadProgress.percent} />
              </div>
            ) : (
              <div
                {...getRootProps()}
                style={{
                  ...centerDiv,
                  border: "dashed 2px #aaa",
                  cursor: "pointer",
                  backgroundColor: "#f1f1f1",
                }}
              >
                <>
                  <input {...getInputProps()} />

                  <Upload size={64} />
                  <Text p>Upload Your Certificate Template</Text>
                </>
              </div>
            )}
          </>
        ) : (
          <Certificate id={params.id} data={data} />
        )
      ) : (
        <div style={centerDiv}>
          {user === null ? (
            <Spinner />
          ) : (
            <>
              <Note label={false} type="error">
                You need to be logged in!
              </Note>
              <Text p>Redirecting you to homepage...</Text>
            </>
          )}
        </div>
      )}
    </div>
  );
};
