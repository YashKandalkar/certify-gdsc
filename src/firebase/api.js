import { firebaseApp } from "./init";

export const createCertificate = (user, onFinish, onError) => {
  console.log(user);
  firebaseApp
    .database()
    .ref(`/certificates/${user.uid}/`)
    .push()
    .then((ref) => {
      ref.set({
        imageUrl: true,
        nameTextBoxBounds: true,
      });
      onFinish(ref.key);
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
      }
    })
    .catch((err) => console.error(err));
};

export const uploadImage = (user, certificateUid) => {
  firebaseApp.storage().ref(`certificates/${user.uid}/${certificateUid}/`);
};
