import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { daysUntilBirthday } from "../utils/Utils";

const initialState = {
    notification: false,
  }

export const StateContext = createContext(initialState)

export const StateContextProvider = ({children}) => {
    const [isClicked, setIsClicked] = useState(initialState);
    const [bdayPeople, setBdayPeople] = useState([]);
    const [data, setData] = useState([]);
    
    const handleClick = (clicked, bool) => setIsClicked({ ...initialState, [clicked]: bool });

    useEffect(() => {
      const unsub = onSnapshot(
        collection(db, "members"),
        (snapShot) => {
          let bdayList = [];
          let listComplete = [];
          snapShot.docs.forEach((doc) => {
            listComplete.push({ key: doc.id, ...doc.data() });
            if (daysUntilBirthday(doc.data().gymboyBirthday) === 0) {
              bdayList.push({ key: doc.id, ...doc.data() });
            }
          });
          setBdayPeople(bdayList);
          setData(listComplete);
        },
        (error) => {
          console.log(error);
        }
      );
  
      return () => {
        unsub();
      };
    }, []);
  
    return <StateContext.Provider
    value={{
        initialState,
        handleClick,
        isClicked,
        setIsClicked,
        data,
        bdayPeople
      }}>
        {children}
    </StateContext.Provider>
}