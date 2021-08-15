import {
  Spacer,
  Divider,
  Text,
  Image,
  Button,
  useToasts,
} from "@geist-ui/react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { setCertificateInfo } from "../firebase/api";
import { firebaseApp } from "../firebase/init";
import { toTitleCase } from "../utils";

export const Certificate = ({ data, id }) => {
  const [unsaved, setUnsaved] = useState(false);
  const [color, setColor] = useState(data.textColor || "#000");
  const [font, setFont] = useState(data.textFont || 20);
  const [bounds, setBounds] = useState(
    data.nameTextBoxBounds || {
      x: 0,
      y: 0,
      width: 320,
      height: 200,
    }
  );
  const [displayedToast, setDisplayedToast] = useState(false);
  const [, setToast] = useToasts();

  const onColorChange = (event) => {
    const value = event.target.value;
    console.log(value);
    setColor(value);
    setUnsaved(true);
  };

  const onFontChange = (event) => {
    const value = event.target.value;
    console.log(value);
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

  useEffect(() => {
    if (unsaved && !displayedToast) {
      setToast({ text: "You have unsaved changes!", type: "warning" });
      setDisplayedToast(true);
    }
    return () => {};
  }, [setToast, unsaved, displayedToast]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text h3>{toTitleCase(data.title)}</Text>
        {unsaved && (
          <Button
            type="success-light"
            style={{ minWidth: "fit-content" }}
            onClick={onSave}
          >
            Save
          </Button>
        )}
      </div>
      <Divider />
      <Spacer h={2} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Text h4 style={{ marginBottom: 0, marginRight: 18 }}>
          Text Color
        </Text>
        <input
          defaultValue={color}
          type={"color"}
          onChange={onColorChange}
          style={{
            border: "none",
            background: "none",
            width: "32px",
            height: "32px",
          }}
        />
      </div>
      <Spacer h={0.75} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Text h4 style={{ margin: "0 18px", marginLeft: 0 }}>
          Font Size
        </Text>
        <input
          defaultValue={font}
          type={"number"}
          placeholder="Font Size"
          onChange={onFontChange}
          style={{ maxWidth: "90px" }}
        />
      </div>

      <Spacer h={5} />
      <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
        <Image src={data.imageUrl} />
        <Rnd
          size={{ width: bounds.width, height: bounds.height }}
          position={{ x: bounds.x, y: bounds.y }}
          onDragStop={(e, d) => {
            setBounds({ ...bounds, x: d.x, y: d.y });
            setUnsaved(true);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setBounds({
              ...bounds,
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            });
            setUnsaved(true);
          }}
          bounds={"parent"}
          style={{
            border: "1px solid #ccc",
            color: color,
            fontSize: font,
          }}
        >
          Test Name
        </Rnd>
      </div>
    </>
  );
};
