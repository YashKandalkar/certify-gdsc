import { firebaseApp } from "./init";

export const createCertificate = (user, title, onFinish, onError) => {
  console.log(user);
  firebaseApp
    .database()
    .ref(`/certificates/${user.uid}/`)
    .push()
    .then((ref) => {
      ref.set({
        title,
        imageUrl: true,
        nameTextBoxBounds: true,
        textColor: "#000",
        textFont: 20,
      });
      firebaseApp
        .database()
        .ref(`/users/${user.uid}/certificates/${ref.key}`)
        .set(true)
        .then(() => onFinish(ref.key));
    })
    .catch((err) => console.error(err));
};

export const getCertificateInfo = (
  user,
  certificateUid,
  onFinish,
  onError
) => {
  firebaseApp
    .database()
    .ref(`/certificates/${user.uid}/${certificateUid}`)
    .once("value", (snap) => {
      const val = snap.val();
      if (val) {
        onFinish(val);
      } else {
        onError();
      }
    })
    .catch((err) => console.error(err));
};

export const setCertificateInfo = (
  user,
  certificateUid,
  data,
  onFinish,
  onError
) => {
  firebaseApp
    .database()
    .ref(`/certificates/${user.uid}/${certificateUid}`)
    .set(data)
    .then(() => onFinish && onFinish())
    .catch((err) => console.error(err));
};

export const uploadImage = (
  user,
  certificateUid,
  bytes,
  onProgress,
  onFinish,
  onError
) => {
  const uploadTask = firebaseApp
    .storage()
    .ref(`certificates/${user.uid}/${certificateUid}/`)
    .put(bytes);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    },
    (error) => {
      console.error(error);
      onError && onError(error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        onFinish(downloadURL);
      });
    }
  );
};

export const getCertificates = (user, onFinish, onError) => {
  firebaseApp
    .database()
    .ref(`/certificates/${user.uid}`)
    .once("value", (snap) => {
      const val = snap.val();
      onFinish(val ?? {});
    })
    .catch((err) => console.error(err));
};

export const deleteCertificate = (user, certificateUid, onFinish, onError) => {
  firebaseApp
    .database()
    .ref(`/certificates/${user.uid}/${certificateUid}`)
    .remove()
    .then(() => {
      firebaseApp
        .database()
        .ref(`/users/${user.uid}/certificates/${certificateUid}`)
        .remove()
        .then(() => onFinish && onFinish());
    })
    .catch((err) => console.error(err));
};
