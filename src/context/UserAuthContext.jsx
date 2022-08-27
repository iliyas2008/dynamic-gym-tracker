import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, storage } from "../firebase-config";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export const userAuthContext = createContext({});

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  async function logIn(email, password, remember) {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const currentUser = userCredential.user;
        if (remember) {
          localStorage.setItem("authUser", JSON.stringify(currentUser));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function logOut() {
    localStorage.removeItem("authUser")
    localStorage.removeItem("prevPath")
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleAuthProvider)
      .then((userCredential) => {
        // Signed in
        const currentUser = userCredential.user;
        localStorage.setItem("authUser", JSON.stringify(currentUser));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function addDataToFirebase(payload) {
    payload = {
      ...payload,
      createdOn: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, "members"), payload).then((doc) =>
        console.log(`Document with ${doc.id} has been created`)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function updateDataToFirebase(id, updatePayload) {
    updatePayload = {
      ...updatePayload,
      updatedOn: serverTimestamp(),
    };
    const docRef = doc(db, "members", id);
    try {
      await setDoc(docRef, updatePayload, {
        merge: true,
      }).then(() => console.log(`Document with ${id} has been updated`));
    } catch (err) {
      console.log(err);
    }
  }
  async function updatePaymentData(id, updatePayload) {
    updatePayload = {
      ...updatePayload,
      paidOn: serverTimestamp(),
    };
    const docRef = doc(db, "members", id);
    try {
      await setDoc(docRef, updatePayload, {
        merge: true,
      }).then(() => console.log(`Document with ${id} has been updated`));
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteDocFromFirebase(id, imgUrl) {
    const docRef = doc(db, "members", id);
    try {
      await deleteDoc(docRef).then(() =>{
          console.log(`Document with ${id} has been deleted`)
          if(imgUrl!=="") { deleteImgFromStorage(imgUrl) }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  async function deleteImgFromStorage(imgUrl) {
    // Create a reference to the file to delete
    var imageRef = ref(storage, imgUrl)
    // Delete the file
      deleteObject(imageRef)
      .then(() => console.log(`Document with ${imgUrl} has been deleted`))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        logIn,
        logOut,
        googleSignIn,
        addDataToFirebase,
        updateDataToFirebase,
        updatePaymentData,
        deleteDocFromFirebase,
        deleteImgFromStorage,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}
