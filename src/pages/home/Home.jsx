import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { UseStateContext } from "../../hooks/UseStateContext";
import { EyeOutlined } from "@ant-design/icons";
import defaultAvatar from "../../assets/avatar-icon.png";
import { Avatar, Card, Col, Image, Row, Table } from "antd";
import {
  getGreetingTime,
} from "../../utils/Utils";

const Home = () => {
  const [paymentData, setPaymentData] = useState([]);
  const { theme } = useDarkMode();
  const { data, bdayPeople } = UseStateContext()

  const getTotalRevenue = (paymentArray) => {
    return paymentArray
      .map(({ fee }) => parseInt(fee))
      .reduce(function (a, b) {
        return a + b;
      }, 0);
  };
  const getRecentJoinees = (profileData) => {
    const sortedArray = [...profileData].sort(
      (a, b) =>
        Date.parse(new Date(a.createdOn)) - Date.parse(new Date(b.createdOn))
    );
    return sortedArray.reverse().slice(0, 5);
  };
  
  useEffect(() => {
    let payData = [];

    data.map(({ paymentDetails }) => payData.push(...paymentDetails));

    setPaymentData(payData);
  }, [data]);

  const columns = [
    {
      key: "key",
      dataIndex: "",
      render: (record) => (
      <div className="d-flex align-items-center" >
        {record !== null || "" ? (
        <Avatar
          shape="square"
          style={{
            width: "25%",
            height: "25%"
          }}
          src={<Image
            style={{
              width: "100%",
              height: "100%"
            }}
            src={defaultAvatar}
            preview={{
              mask: <EyeOutlined />,
            }}
            alt={`${record.gymboyName.replace(" ", "_")}_${record.key}`}
          />}
        />
      ) : (
        <Avatar
          shape="square"
          style={{
            width: "25%",
            height: "25%"
          }}
          src={
            <Image
              style={{
                width: "100%",
                height: "100%"
              }}
              src={record}
              preview={{
                mask: <EyeOutlined />,
              }}
              alt={`${record.gymboyName.replace(" ", "_")}_${record.key}`}
            />
          }
        />)}
        <div className="ms-2">
          <div className="fw-bolder">{record.gymboyName}</div>
          <div>{record.gymboyId}</div>
        </div>
    </div>),
    },
  ];

  return (
    <div>
      <h2 style={{ color: `${theme.color}` }}>
        {getGreetingTime(moment())} friends !
      </h2>
      <div className="site-card-wrapper mb-3">
        <Row gutter={[16, 24]}>
          <Col xs={24} lg={8}>
            <Card
              hoverable
              title="Member Details"
              headStyle={{ backgroundColor: "#a8071a", color: "white" }}
              style={{
                height: "10rem",
                backgroundColor: "#fff1f0",
                color: "#a8071a",
              }}
            >
              Total Users:&ensp;
              {data.length}
              <br />
              Active:&ensp;
              {data.filter(({ activeStatus }) => activeStatus === true).length}
              <br />
              Inactive:&ensp;
              {data.filter(({ activeStatus }) => activeStatus === false).length}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              hoverable
              title="Revenue Details"
              headStyle={{ backgroundColor: "#10239e", color: "white" }}
              style={{
                height: "10rem",
                backgroundColor: "#f0f5ff",
                color: "#10239e",
              }}
            >
              Total Revenue:&ensp;
              {getTotalRevenue(paymentData)}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              hoverable
              title="Birthday Details"
              headStyle={{ backgroundColor: "#237804", color: "white" }}
              style={{
                height: "10rem",
                backgroundColor: "#f6ffed",
                color: "#237804",
              }}
            >
              {bdayPeople.length} Birthdays Today !
            </Card>
          </Col>
        </Row>
      </div>
      <Row justify="end">
        <Col xs={24} sm={24} md={12} lg={8} >
        {getRecentJoinees(data).length > 0 && (
        <Table
          showHeader={false}
          title={() => <div className="h4 text-primary">Recent Joinees</div>}
          className="m-2"
          dataSource={getRecentJoinees(data)}
          columns={columns}
          pagination={false}
        />
      )}
        </Col>
      </Row>
    </div>
  );
};

export default Home;
