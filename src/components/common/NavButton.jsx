import { Avatar, Badge, Tooltip } from "antd";

const NavButton = ({
  title,
  customFunc,
  icon,
  color,
  bgColor,
  badgeCount,
  disabled
}) => (
  <Tooltip placement="bottom" title={title}>
    <Badge style={{top: "1.2rem", right: ".25rem"}} count={badgeCount}>
      <Avatar
        onClick={() => disabled && customFunc()}
        style={{
          backgroundColor: bgColor,
          color,
          top: "0.5rem",
          cursor: "pointer",
          margin: 0
        }}
        shape="circle"
        size="large"
        icon={icon}

      />
    </Badge>
  </Tooltip>
);
export default NavButton;
