import { useRef, useEffect } from "react";
import {
  Button,
  Text,
  Modal,
  useModal,
  Input,
  Table,
  Link,
  Spacer,
  Spinner,
  useToasts,
} from "@geist-ui/react";
import { Edit2, Share2, Trash } from "@geist-ui/react-icons";
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
  const [certs, setCerts] = useState(null);
  const [certToDelete, setCertToDelete] = useState(null);
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

  useEffect(() => {
    if (!mounted.current && certToDelete === null) {
      mounted.current = true;
      getCertificates(user, (data) => {
        const tableData = Object.entries(data)
          .reverse()
          .map(([key, cert]) => {
            return {
              title: (
                <Link href={`/edit/${key}`} color>
                  {toTitleCase(cert.title)}
                </Link>
              ),
              edit: (
                <Link href={`/edit/${key}`}>
                  <Edit2 size={20} />
                </Link>
              ),
              share: (
                <div style={{ cursor: "pointer" }}>
                  <Share2
                    size={20}
                    onClick={() => {
                      copyTextToClipboard(
                        document.location.href + "fill/" + key
                      );
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
        setCerts(tableData);
      });
    }
    return () => {
      mounted.current = false;
    };
  }, [setDeleteVisible, user, certToDelete, setToast]);

  return (
    <div>
      {certs?.length ? (
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

          <Table data={certs}>
            <Table.Column prop="title" label="Title" />
            <Table.Column prop="edit" label="edit" width={70} />
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
          {certs === null ? (
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
    </div>
  );
};
