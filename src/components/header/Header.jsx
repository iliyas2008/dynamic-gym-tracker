import React from "react";
import { PageHeader } from "antd";
import { RiCake2Fill } from "react-icons/ri";
import { useUserAuth } from "../../hooks/UseUserAuth";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { UseStateContext } from "../../hooks/UseStateContext";
import NavButton from "../common/NavButton";
import Notification from "../notification/Notification";
import logo from "../../assets/gymlogo.jpg"

const Header = () => {
  const { dark, theme } = useDarkMode();
  const { handleClick, bdayPeople, isClicked } = UseStateContext();
  const { user } = useUserAuth();

  return (
    <>
      <PageHeader
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          padding: ".75rem",
          backgroundColor: theme.backgroundColor
        }}
        className="site-page-header-responsive"
        title={
          <span
            style={{
              color: "blue",
            }}
          >
            Dynamic Gym Tracker
          </span>
        }
        subTitle="Pondicherry"
        avatar={{
          src: logo,
        }}
        extra={
          <>
          {(user && bdayPeople.length > 0) && (
                <NavButton
                  title="Birthdays"
                  badgeCount={bdayPeople.length}
                  customFunc={() => handleClick("notification", true)}
                  color="orange"
                  bgColor={dark ? "black" : "white"}
                  icon={<RiCake2Fill />}
                  disabled={bdayPeople.length > 0 ? true : false}
                />
              )}
              {isClicked.notification && (
                <Notification
                  notificationData={bdayPeople}
                  onclick={() =>
                    bdayPeople.length > 0 && handleClick("notification", false)
                  }
                />
              )}
          </>
        }
      />
    </>
  );
};

export default Header;
