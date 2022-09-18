import React from "react";
import defaultAvatar from "../../assets/avatar-icon.png";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { Button, Card, Space } from "antd";

const Notification = ({ notificationData, onclick }) => {
  const { dark } = useDarkMode();
  return (
    <Card
      title={<div style={{ color: dark ? "blue" : "whitesmoke" }}>Birthdays Today</div>}
      bordered={true}
      className="position-absolute p-1 rounded"
      style={{
        backgroundColor: `${dark ? "#f9fafd" : "#42464D"}`,
        width: "15rem",
        zIndex: 1000,
        right: "4rem",
        top: "12rem",
      }}
    >
      <div className="d-flex flex-column gap-3 m-2">
        {notificationData?.map((item) => {
          const { key, gymboyId, gymboyName, gymboyAvatar } = item;
          return (
            <Space key={key} size={20}>
              <img
                style={{ height: "4rem", width: "4rem" }}
                className="rounded-circle"
                src={gymboyAvatar === null || "" ? gymboyAvatar : defaultAvatar}
                alt={gymboyName}
              />
              <Space direction="vertical" size={10}>
                <h6 style={{ color: dark ? "blue" : "whitesmoke" }}>
                  {gymboyName}
                </h6>
                <h6 style={{ color: dark ? "darkslateblue" : "lightgrey" }}>
                  {" "}
                  {gymboyId}{" "}
                </h6>
              </Space>
            </Space>
          );
        })}
      </div>
      <div className="d-flex justify-content-center mt-3 mb-0">
        <Button type="danger" shape="round" onClick={onclick} block>
          Close
        </Button>
      </div>
    </Card>
  );
};

export default Notification;
