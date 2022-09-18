import React from "react";
import { useEffect, useState } from "react";
import {
  Input,
  Table,
  Modal,
  Avatar,
  Image,
  Switch,
  Tag,
  Space,
  Empty,
} from "antd";
import {
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/UseUserAuth";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { UseStateContext } from "../../hooks/UseStateContext";
import ReadExcelData from "./ReadExcelData";
import defaultAvatar from "../../assets/avatar-icon.png";
import { calculateAge } from "../../utils/Utils";

const ListUsers = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { updateDataToFirebase, deleteDocFromFirebase } = useUserAuth();
  const { data } = UseStateContext()
  const { dark } = useDarkMode();

  const navigate = useNavigate();

  const handleDelete = (obj) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure? You want to delete this member?",
      okText: "Yes",
      okType: "danger",
      onOk() {
        deleteDocFromFirebase(obj.key, obj.gymboyAvatar);
        navigate("/users");
      },
    });
  };
  const deleteAll = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure? You want to delete all?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        data.forEach(async (d) => {
          await deleteDocFromFirebase(d.key, d.gymboyAvatar);
        });
      },
    });
  };
  
  useEffect(() => {
    setFilteredData(data);
    const result = data.filter((datum) => {
      return (
        datum.gymboyName.toLowerCase().match(search.toLowerCase()) ||
        datum.gymboyId.match(search) ||
        datum.gymboyAddress.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredData(result);
  }, [search, data]);

  
  const switchStatus = (entry) => {
    entry = {
      ...entry,
      activeStatus: !entry.activeStatus,
    };
    updateDataToFirebase(entry.key, entry);
  };
  const columns = [
    {
      key: "key",
      title: () => {
        return (
          <p>
            Id<span className="d-lg-none"> / (Name)</span>
          </p>
        );
      },
      dataIndex: "gymboyId",
      sorter: (record1, record2) =>
        parseInt(record1.gymboyId) - parseInt(record2.gymboyId),
      defaultSortOrder: "ascend",
      render: (text, record) => (
        <Link
          to={`${record.key}`}
          className="text-decoration-none text-capitalize"
        >
          <p> {text}</p>
          <br />
          <p className="d-lg-none">{`(${record.gymboyName})`}</p>
        </Link>
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
      title: "Name",
      dataIndex: "gymboyName",
      filtered: true,
      sorter: (record1, record2) =>
        record1.gymboyName.localeCompare(record2.gymboyName),
      render: (text) => <div className="text-info text-capitalize">{text}</div>,
      responsive: ["lg"],
    },
    {
      title: "Age",
      dataIndex: "gymboyBirthday",
      filtered: true,
      sorter: (record1, record2) =>
        calculateAge(record1.gymboyBirthday) -
        calculateAge(record2.gymboyBirthday),
      render: (record) => (
        <div className="text-info">{calculateAge(record)}</div>
      ),
      responsive: ["md"],
    },
    {
      title: "Address",
      dataIndex: "gymboyAddress",
      sorter: (record1, record2) =>
        record1.gymboyAddress.localeCompare(record2.gymboyAddress),
      render: (text) => <div className="text-info text-capitalize">{text}</div>,
      responsive: ["lg"],
    },
    {
      title: "Status",
      dataIndex: "",
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => {
        return record.activeStatus === value;
      },
      shouldCellUpdate: (record, prevRecord) => {
        return record.activeStatus !== prevRecord.activeStatus;
      },
      render: (record) => {
        return (
          <div className="text-info">
            <Space direction="vertical">
              {record.activeStatus === true ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  ACTIVE
                </Tag>
              ) : (
                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                  INACTIVE
                </Tag>
              )}
              <Switch
                defaultChecked={record.activeStatus}
                onChange={() => switchStatus(record)}
              />
            </Space>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "",
      align: "center",
      render: (record) => (
        <>
          <div
            className="d-lg-none btn-group btn-group-sm"
            role="group"
            aria-label="Action Buttons"
          >
            <EditOutlined
              className="text-primary me-3"
              onClick={() => {
                navigate("edit", { state: { editableUser: record } });
              }}
            />
            <DeleteOutlined
              className="text-danger"
              onClick={() => {
                handleDelete(record);
              }}
            />
          </div>
          <div
            className="d-none d-lg-block"
            role="group"
            aria-label="Action Buttons"
          >
            <button
              type="button"
              className="btn btn-sm btn-primary me-2 mb-sm-1"
              onClick={() => {
                navigate("edit", { state: { editableUser: record } });
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger me-2"
              onClick={() => {
                handleDelete(record);
              }}
            >
              Delete
            </button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <nav
            aria-label="breadcrumb"
            className={`${dark ? "bg-dark" : "bg-light"} rounded-3 p-3 mb-4`}
          >
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Users
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div>
        <Table
          // loading={loading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          title={() => (
            <div className="d-flex flex-column-reverse flex-sm-row gap-4 justify-content-between">
              <div className="text-lg-start">
                <Input
                  name="tableDataSearch"
                  placeholder="Search here !"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="d-flex gap-2 flex-column flex-lg-row text-lg-end align-self-center">
                <button
                  onClick={deleteAll}
                  className={`btn btn-sm ${
                    dark ? "text-primary btn-warning" : "btn-dark"
                  }`}
                >
                  Delete All
                </button>
                <ReadExcelData />
                <Link to={"add"}>
                  <button
                    className={`btn btn-sm ${
                      dark ? "text-primary btn-warning" : "btn-dark"
                    }`}
                  >
                    Add New Member
                  </button>
                </Link>
              </div>
            </div>
          )}
          columns={columns}
          dataSource={filteredData}
          bordered
          sticky
        />
      </div>
    </div>
  );
};

export default ListUsers;
