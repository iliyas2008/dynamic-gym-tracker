import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import { CloseOutlined } from "@ant-design/icons";
import { daysUntilBirthday, getGreetingTime } from "../../utils/Utils";
import { useDarkMode } from "../../hooks/UseDarkMode";
import moment from "moment";

const Home = () => {
  const [data, setData] = useState([]);
  const { theme, dark } = useDarkMode();

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "members"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          if (daysUntilBirthday(doc.data().gymboyBirthday) === 0) {
            list.push({ key: doc.id, ...doc.data() });
          }
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const removePerson = (id) => {
    let newPerson = data.filter((person) => person.key !== id);
    setData(newPerson);
  };

  return (
    <div>
      <h2 style={{ color: `${theme.color}` }}>
        {getGreetingTime(moment())} friends !
      </h2>
      <p className="bg-primary text-white text-center p-2 rounded">
        {data.length} Birthdays Today !
      </p>
      {console.log(data)}
      {data?.map((person) => {
        const { key, gymboyName, gymboyAvatar } = person;
        return (
          <div
            className={`container w-auto align-items-center rounded-2 bg-warning ${dark? 'bg-opacity-25' :'bg-opacity-75'} p-2 my-2 mx-auto`}
            key={key}
          >
            <div className="avatar d-flex align-items-center">
              <img
                style={{ width: "3rem", height: "3rem", borderRadius: "50%" }}
                src={gymboyAvatar}
                alt={gymboyName}
              />
              <h3 className="mx-3 text-primary">{gymboyName}</h3>
              <button
                className="btn btn-light btn-sm ms-auto"
                onClick={() => {
                  removePerson(key);
                }}
              >
                <CloseOutlined />{" "}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
