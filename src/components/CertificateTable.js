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
} from "@geist-ui/react";
import { Edit2, Share2, Trash } from "@geist-ui/react-icons";
import { useState } from "react";
import { createCertificate, getCertificates } from "../firebase/api";
import { firebaseApp } from "../firebase/init";
import { toTitleCase } from "../utils";

export const CertificateTable = () => {
  const [loading, setLoading] = useState(false);
  const [certs, setCerts] = useState(null);
  const mounted = useRef(false);
  const inputRef = useRef(null);
  const user = firebaseApp.auth().currentUser;
  const { visible, setVisible, bindings } = useModal();

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

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      getCertificates(user, (data) => {
        const tableData = Object.entries(data).map(([key, cert]) => {
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
              <Link href={`/fill/${key}`}>
                <Share2 size={20} />
              </Link>
            ),
            delete: <Trash color="red" size={20} />,
          };
        });
        setCerts(tableData);
      });
    }
    return () => {
      mounted.current = false;
    };
  }, [user]);

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
            <Text h2 style={{ marginBottom: 0 }}>
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
    </div>
  );
};
