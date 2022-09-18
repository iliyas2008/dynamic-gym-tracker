import React from 'react';
import defaultAvatar from "../../assets/avatar-icon.png";
import { useDarkMode } from '../../hooks/UseDarkMode';
import { Button, Space } from 'antd';

const Notification = ({notificationData, onclick}) => {
  const { dark } = useDarkMode();
  return (
    <div className="position-absolute p-1 rounded"
    style={{backgroundColor: `${dark? "#f9fafd": "#42464D"}`, width: "15rem", zIndex:1000, right:"6rem", top:"6rem"}}
    >
      <div className="m-2">
        {notificationData?.map((item) => {
            const { key, gymboyId, gymboyName, gymboyAvatar } = item;
          return (<Space key={key} size={20}>
            <img style={{height: "4rem", width: "4rem"}} className="rounded-circle" src={gymboyAvatar === null || "" ? gymboyAvatar : defaultAvatar} alt={gymboyName} />
              <Space direction="vertical" size={10}>
              <h6 style={{color: dark? "blue" : "whitesmoke" }}>{gymboyName}</h6>
              <h6 style={{color: dark? "darkslateblue" : "lightgrey"  }}> {gymboyId} </h6>
              </Space>
              </Space>)
        })}
      </div>
      <div className="d-flex justify-content-center">
      <Button type="danger" shape='round' onClick={onclick} block>Close</Button>
      </div>
    </div>
  );
};

export default Notification;
