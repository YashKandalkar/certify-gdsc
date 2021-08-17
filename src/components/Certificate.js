import {
  Spacer,
  Text,
  Button,
  Note,
  Card,
  useToasts,
  Loading,
} from "@geist-ui/react";
import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { setCertificateInfo } from "../firebase/api";
import { firebaseApp } from "../firebase/init";

export const Certificate = ({ data, id }) => {
  const [unsaved, setUnsaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [color, setColor] = useState(data.textColor || "#000");
  const [font, setFont] = useState(data.textFont || 20);
  const [bounds, setBounds] = useState(
    data.nameTextBoxBounds === true
      ? {
          xPercent: 0,
          yPercent: 0,
          widthPercent: 0.5,
          heightPercent: 0.5,
        }
      : data.nameTextBoxBounds
  );

  const [, setToast] = useToasts();
  const imageRef = useRef(null);

  const onColorChange = (event) => {
    const value = event.target.value;
    setColor(value);
    setUnsaved(true);
  };

  const onFontChange = (event) => {
    const value = event.target.value;
    setFont(Number(value));
    setUnsaved(true);
  };

  const onSave = () => {
    setCertificateInfo(
      firebaseApp.auth().currentUser,
      id,
      {
        ...data,
        textColor: color,
        textFont: font,
        nameTextBoxBounds: bounds,
      },
      () => {
        setToast({ text: "Saved!", type: "success" });
        setUnsaved(false);
      }
    );
  };

  return (
    <>
      <Spacer h={0.5} />
      {unsaved && (
        <Note
          type="warning"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "480px",
          }}
        >
          You have unsaved changes!
          <Button
            style={{ minWidth: "fit-content", marginLeft: "auto" }}
            onClick={onSave}
          >
            Save
          </Button>
        </Note>
      )}
      <Spacer h={1} />
      <Card style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text p style={{ margin: "0 0 0 0" }}>
            Text Color:&nbsp;
          </Text>
          <input
            defaultValue={color}
            type={"color"}
            onChange={onColorChange}
            style={{
              border: "none",
              background: "none",
              width: "28px",
              height: "28px",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text p style={{ margin: "0 16px 0 0" }}>
            Font Size:
          </Text>
          <input
            defaultValue={font}
            type={"number"}
            placeholder="Font Size"
            onChange={onFontChange}
            style={{ maxWidth: "90px", textAlign: "center" }}
          />
        </div>
      </Card>

      <Spacer h={3} />
      <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
        <img
          alt="Certificate Template"
          ref={imageRef}
          src={data.imageUrl}
          onLoad={() => setImageLoaded(true)}
          style={{
            borderRadius: 6,
            boxShadow: "rgb(136 136 136) 3px 3px 5px",
          }}
        />
        {imageLoaded ? (
          <Rnd
            size={{
              width: bounds.widthPercent * imageRef.current.width,
              height: bounds.heightPercent * imageRef.current.height,
            }}
            position={{
              x: bounds.xPercent * imageRef.current.width,
              y: bounds.yPercent * imageRef.current.height,
            }}
            onDragStop={(e, d) => {
              setBounds({
                ...bounds,
                xPercent: d.x / imageRef.current.width,
                yPercent: d.y / imageRef.current.height,
              });
              setUnsaved(true);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setBounds({
                ...bounds,
                widthPercent:
                  Number(ref.style.width.slice(0, -2)) /
                  imageRef.current.width,
                heightPercent:
                  Number(ref.style.height.slice(0, -2)) /
                  imageRef.current.height,
              });
              setUnsaved(true);
            }}
            bounds={"parent"}
            style={{
              border: "1px solid #ccc",
              color: color,
              fontSize: font,
              lineHeight: 1,
            }}
          >
            Test Name
          </Rnd>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};
