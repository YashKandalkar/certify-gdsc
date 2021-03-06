import { useRef, useEffect, useCallback } from "react";
import {
  Button,
  Text,
  Modal,
  Input,
  Table,
  Link,
  Spacer,
  Spinner,
  Select,
  useModal,
  useToasts,
} from "@geist-ui/react";
import { Share2, Trash } from "@geist-ui/react-icons";
import { useState } from "react";
import {
  createCertificate,
  deleteCertificate,
  getCertificates,
} from "../firebase/api";
import { firebaseApp } from "../firebase/init";
import { copyTextToClipboard, toTitleCase } from "../utils";

export const CertificateTable = () => {
  const [loading, setLoading] = useState(false);
  const [rawCertData, setRawCertData] = useState(null);
  const [certToDelete, setCertToDelete] = useState(null);
  const [certToMakePrivate, setCertToMakePrivate] = useState(null);
  const mounted = useRef(false);
  const inputRef = useRef(null);
  const [, setToast] = useToasts();
  const user = firebaseApp.auth().currentUser;
  const { visible, setVisible, bindings } = useModal();
  const {
    visible: deleteVisible,
    setVisible: setDeleteVisible,
    bindings: deleteBindings,
  } = useModal();
  const {
    visible: privateModalVisible,
    setVisible: setPrivateModalVisible,
    bindings: privateModalBindings,
  } = useModal();

  const onCreate = (refKey) => {
    window.location.href = `/edit/${refKey}`;
  };

  const onCreateClick = () => {
    setLoading(true);
    if (inputRef?.current.value.trim()) {
      createCertificate(user, inputRef?.current.value, onCreate);
    } else {
      setLoading(false);
    }
  };

  const onDelete = () => {
    deleteCertificate(user, certToDelete, () => {
      setToast({ text: "Certificate deleted", type: "success" });
    });
    setCertToDelete(null);
    setDeleteVisible(false);
  };

  const onSelectChange = useCallback(
    (certificateUid, value) => {
      if (value === "public") {
        setRawCertData({
          ...rawCertData,
          [certificateUid]: {
            ...rawCertData[certificateUid],
            passHash: false,
          },
        });
      } else if (value === "private") {
        setPrivateModalVisible(true);
        setCertToMakePrivate(certificateUid);
      }
    },
    [rawCertData, setPrivateModalVisible]
  );

  useEffect(() => {
    if (!mounted.current && certToDelete === null) {
      mounted.current = true;
      getCertificates(user, (data) => {
        setRawCertData(data);
      });
    }
    return () => {
      mounted.current = false;
    };
  }, [certToDelete, user]);

  const onPrivateModalCancel = () => {
    setRawCertData({
      ...rawCertData,
      [certToMakePrivate]: {
        ...rawCertData[certToMakePrivate],
        passHash: false,
      },
    });
    document.getElementById(certToMakePrivate).value = "public";
    console.log(document.getElementById(certToMakePrivate));
    setPrivateModalVisible(false);
    setCertToMakePrivate(null);
  };

  let tableData;
  if (rawCertData) {
    tableData = Object.entries(rawCertData)
      .reverse()
      .map(([key, cert]) => {
        console.log(cert.passHash === false ? "public" : "private");
        return {
          title: (
            <Link href={`/edit/${key}`} color>
              {toTitleCase(cert.title)}
            </Link>
          ),
          visibility: (
            <Select
              key={key}
              id={key}
              placeholder="Visibility"
              value={"public"}
              initialValue={"public"}
              onChange={(val) => onSelectChange(key, val)}
              dropdownStyle={{
                overflow: "hidden",
                marginTop: -18,
              }}
            >
              <Select.Option
                style={{ maxWidth: "70px !important" }}
                value="public"
              >
                Public
              </Select.Option>
              <Select.Option value="private">Private</Select.Option>
            </Select>
          ),
          share: (
            <div style={{ cursor: "pointer" }}>
              <Share2
                size={20}
                onClick={() => {
                  copyTextToClipboard(document.location.href + "fill/" + key);
                  setToast({
                    text: "Share link copied to clipboard",
                    type: "success",
                  });
                }}
              />
            </div>
          ),
          delete: (
            <div style={{ cursor: "pointer" }}>
              <Trash
                color="red"
                size={20}
                onClick={() => {
                  setDeleteVisible(true);
                  setCertToDelete(key);
                }}
              />
            </div>
          ),
        };
      });
  }
  return (
    <div>
      {Object.keys(rawCertData || {}).length ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text h2 style={{ marginBottom: 0, fontSize: "1.95rem" }}>
              Your Certificates
            </Text>
            <Button
              style={{ minWidth: "fit-content" }}
              type="success"
              onClick={() => setVisible(true)}
            >
              Create
            </Button>
          </div>
          <Text p>
            Here, you will find all of the certificates you created
          </Text>
          <Spacer h={2} />

          <Table data={tableData}>
            <Table.Column prop="title" label="Title" />
            <Table.Column prop="visibility" label="Visibility" width={150} />
            <Table.Column prop="delete" label="delete" width={70} />
            <Table.Column prop="share" label="share" width={70} />
          </Table>
        </>
      ) : (
        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {rawCertData === null ? (
            <Spinner />
          ) : (
            <>
              <Text p>You have not created any certificates yet!</Text>
              <Button onClick={() => setVisible(true)}>Create Now</Button>
            </>
          )}
        </div>
      )}
      <Modal visible={visible} {...bindings}>
        <Modal.Title>Enter Title</Modal.Title>
        <Modal.Subtitle>
          A descriptive title for your certificate
        </Modal.Subtitle>
        <Modal.Content>
          <Input
            ref={inputRef}
            placeholder={"HackCon Participation Certificate"}
            width="100%"
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action loading={loading} onClick={onCreateClick}>
          Create
        </Modal.Action>
      </Modal>
      <Modal visible={deleteVisible} {...deleteBindings}>
        <Modal.Title>Delete</Modal.Title>
        <Modal.Subtitle>Delete Certificate</Modal.Subtitle>
        <Modal.Content>
          <p>
            Are you sure you want to delete this certificate?
            <br />
            All the responses from this certificate will be deleted as well.
          </p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setDeleteVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action type="error" onClick={onDelete}>
          Delete
        </Modal.Action>
      </Modal>
      <Modal
        onTouchCancel={onPrivateModalCancel}
        visible={privateModalVisible}
        {...privateModalBindings}
      >
        <Modal.Title>Private</Modal.Title>
        <Modal.Subtitle>Make Certificate Private</Modal.Subtitle>
        <Modal.Content>
          <p>
            Private Certificates require a password to be filled and
            downloaded.
          </p>
          <Input placeholder={"Password"} w={"100%"} />
        </Modal.Content>
        <Modal.Action passive onClick={onPrivateModalCancel}>
          Cancel
        </Modal.Action>
        <Modal.Action type="error" onClick={console.log}>
          Make Private
        </Modal.Action>
      </Modal>
    </div>
  );
};
