import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import { CloseOutlined } from "@ant-design/icons";
import { calculateAge, daysUntilBirthday, getGreetingTime } from "../../utils/Utils";
import { useDarkMode } from "../../hooks/UseDarkMode";
import moment from "moment";
import defaultAvatar from "../../assets/avatar-icon.png";
import {
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, Image, Table } from "antd";

const Home = () => {
  const [bdayPeople, setBdayPeople] = useState([]);
  const [data, setData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const { theme, dark } = useDarkMode();

  const getTotalRevenue = (paymentArray) => {
    return paymentArray
      .map(({ fee }) => parseInt(fee))
      .reduce(function (a, b) {
        return a + b;
      }, 0);
  };
  const getRecentJoinees = (profileData) => {
    const sortedArray = [...profileData].sort((a, b) => Date.parse(new Date(a.createdOn)) - Date.parse(new Date(b.createdOn)))
    return sortedArray.reverse().slice(0, 5)
  }
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

  useEffect(() => {
    let payData = [];

    data.map(({ paymentDetails }) => payData.push(...paymentDetails));

    setPaymentData(payData);
  }, [data]);

  const removePerson = (id) => {
    let newPerson = data.filter((person) => person.key !== id);
    setBdayPeople(newPerson);
  };

  const columns = [
    {
      key: "key",
      title: () => {
        return (
          <p>
            Id
          </p>
        );
      },
      dataIndex: "gymboyId",
      render: (text) => (
          <p> {text}</p>
      ),
    },
    {
      title: "Avatar",
      dataIndex: "gymboyAvatar",
      render: (record, record2) =>
        record !== null || "" ? (
          <Avatar
            shape="square"
            size={{
              xs: 24,
              sm: 32,
              md: 40,
              lg: 64,
              xl: 80,
              xxl: 100,
            }}
            src={defaultAvatar}
          />
        ) : (
          <Avatar
            shape="square"
            size={{
              xs: 24,
              sm: 32,
              md: 40,
              lg: 64,
              xl: 80,
              xxl: 100,
            }}
            src={
              <Image
                src={record}
                preview={{
                  mask: <EyeOutlined />,
                }}
                alt={`${record2.gymboyName.replace(" ", "_")}_${record2.key}`}
              />
            }
          />
        ),
      responsive: ["lg"],
    },
    {
      key: "key",
      title: () => {
        return (
          <p>
            Name
          </p>
        );
      },
      dataIndex: "gymboyName",
      render: (text) => (
          <p> {text}</p>
      ),
    },
    {
      title: "Age",
      dataIndex: "gymboyBirthday",
      render: (record) => (
        <div className="text-info">{calculateAge(record)}</div>
      ),
      responsive: ["md"],
    }]

  return (
    <div>
      <h2 style={{ color: `${theme.color}` }}>
        {getGreetingTime(moment())} friends !
      </h2>
      <div className="row justify-content-between align-items-center gap-2">
        <div
          className="col-md-3 bg-danger text-white text-center p-2 rounded d-flex justify-content-center align-items-center"
          style={{ fontSize: "1rem", height: "7rem", cursor: "pointer" }}
        >
          <p>
            Total Users:&ensp;
            {data.length}
            <br />
            Active:&ensp;
            {data.filter(({ activeStatus }) => activeStatus===true).length}
            <br />
            Inactive:&ensp;
            {data.filter(({ activeStatus }) => activeStatus===false).length}
          </p>
        </div>
        <div
          className="col-md-3 bg-primary text-white text-center p-2 rounded d-flex justify-content-center align-items-center"
          style={{ fontSize: "1rem", height: "7rem", cursor: "pointer" }}
        >
          <p>
            Total Revenue:
            <br />
            {getTotalRevenue(paymentData)}
          </p>
        </div>
        <div
          className="col-md-3 bg-success text-white text-center p-2 rounded d-flex justify-content-center align-items-center"
          style={{ fontSize: "1rem", height: "7rem", cursor: "pointer" }}
        >
          <p>{bdayPeople.length} Birthdays Today !</p>
        </div>
      </div>
      {console.log(bdayPeople)}
      {bdayPeople?.map((person) => {
        const { key, gymboyName, gymboyAvatar } = person;
        return (
          <div
            className={`container w-auto align-items-center rounded-2 bg-warning ${
              dark ? "bg-opacity-25" : "bg-opacity-75"
            } p-2 my-2 mx-auto`}
            key={key}
          >
            <div className="avatar d-flex align-items-center">
              {gymboyAvatar === null || "" ? (
                <img
                  style={{ width: "3rem", height: "3rem", borderRadius: "50%" }}
                  src={gymboyAvatar}
                  alt={gymboyName}
                />
              ) : (
                <img
                  style={{ width: "3rem", height: "3rem", borderRadius: "50%" }}
                  src={defaultAvatar}
                  alt={gymboyName}
                />
              )}
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
      <Table showHeader title={() => (<div className="h4 text-primary">Recent Joinees</div>)} className="m-2" dataSource={getRecentJoinees(data)} columns={columns} size="small" pagination={false} />
    </div>
  );
};

export default Home;
