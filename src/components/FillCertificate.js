import { useState, useEffect, useRef } from "react";
import { getCertificateInfoForFilling } from "../firebase/api";
import { useParams } from "react-router-dom";
import { toTitleCase, centerDiv } from "../utils";
import {
  Note,
  Spinner,
  Text,
  Modal,
  Input,
  Divider,
  Card,
  useModal,
  Spacer,
  Button,
} from "@geist-ui/react";
import { Download } from "@geist-ui/react-icons";

export const FillCertificate = ({ user }) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const mounted = useRef(false);
  const nameInputRef = useRef(null);
  const imageRef = useRef(null);
  const params = useParams();

  let certificateNotComplete = false;
  const bounds = data?.nameTextBoxBounds;

  const { visible, setVisible, bindings } = useModal(true);

  const onCertificateReceive = (data) => {
    setData(data);
  };

  if (data && (data.imageUrl === true || data.nameTextBoundBox === true)) {
    certificateNotComplete = true;
    setTimeout(() => (window.location.href = "/"), 4000);
  }

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (user) {
        getCertificateInfoForFilling(params.id, onCertificateReceive, () => {
          // The certificate doesn't exist or doesn't belong to the user
          setData(false);
          setTimeout(() => (window.location.href = "/"), 4000);
        });
      } else if (user === false) {
        // The user is not logged in
        setTimeout(() => (window.location.href = "/"), 4000);
      }
    }
    return () => {
      mounted.current = false;
    };
  }, [params.id, user]);

  const onNextClick = () => {
    setVisible(false);
  };

  const onDownloadClick = () => {
    setDownloadLoading(true);
    // draws the image on canvas, draws the text on the canvas, then saves the image
    const canvas = document.createElement("canvas");
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.setAttribute("crossOrigin", "Anonymous");
    img.onload = () => {
      ctx.font = data.textFont.toString() + "px Arial";
      ctx.fillStyle = data.textColor;

      ctx.drawImage(
        img,
        0,
        0,
        imageRef.current.width,
        imageRef.current.height
      );

      ctx.fillText(
        name,
        bounds.xPercent * imageRef.current.width,
        bounds.yPercent * imageRef.current.height
      );

      console.log(
        bounds.xPercent * imageRef.current.width,
        bounds.yPercent * imageRef.current.height
      );

      const link = document.getElementById("link");
      link.setAttribute("download", "test.png");
      link.setAttribute(
        "href",
        canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      console.log("downloading");
      link.click();
      setDownloadLoading(false);
    };
    img.src = data.imageUrl;
  };

  return (
    <div>
      <a href={"/"} id="link" style={{ display: "none" }}>
        a
      </a>
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
        ) : certificateNotComplete ? (
          <>
            <Text h3>{toTitleCase(data.title)}</Text>
            <div style={centerDiv}>
              <Text p>
                This certificate is not complete yet, please contact the
                author.
              </Text>
              <Text small>Redirecting you to the home page...</Text>
            </div>
          </>
        ) : (
          <>
            <Text h3 style={{ margin: 0 }}>
              {toTitleCase(data.title)}
            </Text>
            <Divider />
            <Spacer h={1} />
            <Card style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text p style={{ margin: "0 16px 0 0" }}>
                  Name:
                </Text>
                <Input
                  value={name}
                  placeholder={"Name"}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </Card>
            <Spacer h={1.5} />
            <div
              style={{
                position: "relative",
                maxWidth: 640,
                margin: "0 auto",
                borderRadius: "4px",
                lineHeight: 0,
              }}
            >
              <img
                alt="Certificate Template"
                ref={imageRef}
                src={data.imageUrl}
                style={{
                  borderRadius: 6,
                  boxShadow: "rgb(136 136 136) 3px 3px 5px",
                }}
              />
              {imageRef.current && (
                <div
                  style={{
                    position: "absolute",
                    left: bounds.xPercent * imageRef.current.width,
                    top: bounds.yPercent * imageRef.current.height,
                    color: data.textColor,
                    fontSize: data.textFont,
                  }}
                >
                  {name}
                </div>
              )}
            </div>
            <Button
              type={"success"}
              loading={downloadLoading}
              style={{
                margin: "1rem auto",
                display: "flex",
                alignItems: "center",
              }}
              onClick={onDownloadClick}
            >
              <Download size={20} />
              &nbsp;&nbsp; Download
            </Button>
            <Modal
              disableBackdropClick
              keyboard={false}
              visible={visible}
              {...bindings}
            >
              <Modal.Title>Name</Modal.Title>
              <Modal.Subtitle>
                This name will be visible on the certificate.
              </Modal.Subtitle>
              <Modal.Content>
                <Input
                  width={"100%"}
                  placeholder={"Name"}
                  ref={nameInputRef}
                  onChange={(e) => setName(e.target.value)}
                />
              </Modal.Content>

              <Modal.Action
                disabled={
                  !nameInputRef.current ||
                  nameInputRef.current.value.trim() === ""
                }
                onClick={onNextClick}
              >
                Next
              </Modal.Action>
            </Modal>
          </>
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
