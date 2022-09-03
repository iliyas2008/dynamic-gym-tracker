import React from "react";
import { useEffect, useState } from "react";
import moment from "moment";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import {
  Input,
  Table,
  Modal,
  Avatar,
  Image,
  Form,
  DatePicker,
  Empty,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useUserAuth } from "../../hooks/UseUserAuth";
import { useDarkMode } from "../../hooks/UseDarkMode";
import avatarIcon from "../../assets/avatar-icon.png";

const { RangePicker } = DatePicker;

const SubCollectionCreateForm = ({ payeeId, visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Add payment details"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values, payeeId);
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name={["paymentDetails", "validity"]}
          rules={[
            {
              required: true,
              message: "Please input payment details!",
            },
          ]}
          hasFeedback
        >
          <RangePicker className="col-12" />
        </Form.Item>
        <Form.Item
          name={["paymentDetails", "fee"]}
          rules={[
            {
              required: true,
              message: "Please input fee!",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter a fee !" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Payment = () => {
  const [visible, setVisible] = useState(false);
  const [payeeId, setPayeeId] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [firebaseError, setFirebaseError] = useState("");
  const { updatePaymentData } = useUserAuth();
  const { dark } = useDarkMode();

  const onCreate = (values, id) => {
    const prevPaymentDetails = data.find((d) => d.key === id).paymentDetails;
    console.log(prevPaymentDetails);
    values = {
      ...values,
      paymentDetails: [
        ...prevPaymentDetails,
        {
          ...values.paymentDetails,
          validity: [
            values.paymentDetails.validity[0].format(),
            values.paymentDetails.validity[1].format(),
          ],
          paidOn: moment().format(),
        },
      ],
    };
    console.log("Received values of form: ", values, id);
    updatePaymentData(id, values);
    setVisible(false);
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "members"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ key: doc.id, ...doc.data() });
        });
        list = list.filter((data) => data.activeStatus === true);
        setData(list);
        setFilteredData(list);
      },
      (error) => {
        console.log(error);
        setFirebaseError(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const result = data.filter((datum) => {
      return (
        datum.gymboyName.toLowerCase().match(search.toLowerCase()) ||
        datum.gymboyId.match(search) ||
        datum.gymboyAddress.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredData(result);
  }, [search, data]);

  const checkStatus = (arrObj) => {
    // const startDate = moment(arrObj[0])
    const endDate = moment(arrObj[1]);
    const daysDiffEndDate = endDate.diff(moment(), "days");

    let status = false;
    let daysDiff = 0;
    let comment = "Payment exeeds more than a month !";
    switch (true) {
      case daysDiffEndDate === 0:
        status = false;
        comment = `Pay by tomorrow !`;
        daysDiff = daysDiffEndDate;
        break;
      case daysDiffEndDate <= -1:
        status = false;
        daysDiff = daysDiffEndDate;
        if (daysDiffEndDate < -30) {
          comment = `Payment pending from ${Math.abs(
            endDate.diff(moment(), "months")
          )} month !`;
        } else {
          comment = `Payment pending from ${Math.abs(
            daysDiffEndDate
          )} days ago !`;
        }
        break;
      case daysDiffEndDate >= 1:
        status = true;
        daysDiff = daysDiffEndDate;
        if (daysDiffEndDate > 30) {
          comment = `Next payment in ${Math.abs(
            endDate.diff(moment(), "months")
          )} month !`;
        } else {
          comment = `Next payment in ${Math.abs(daysDiffEndDate)} days !`;
        }
        break;
      default:
        break;
    }
    return { status, daysDiff, comment };
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
      render: (text, record) => {
        return (
          <div className="text-primary text-capitalize">
            <p>{text}</p>
            <p className="d-lg-none">
              <br /> {`(${record.gymboyName})`}
            </p>
          </div>
        );
      },
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
            src={avatarIcon}
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
      title: "Action",
      dataIndex: "",
      filters: [
        {
          text: "Paid",
          value: true,
        },
        {
          text: "Unpaid",
          value: false,
        },
      ],
      align: "center",
      onFilter: (value, record) => {
        const latestPaymentDetails = record.paymentDetails.reduce((a, b) =>
          a.paidOn > b.paidOn ? a : b
        );
        return checkStatus(latestPaymentDetails.validity).status === value;
      },
      filterSearch: true,
      render: (record) => {
        const latestPaymentDetails = record.paymentDetails.reduce((a, b) =>
          a.paidOn > b.paidOn ? a : b
        );
        let tagColor =
          checkStatus(latestPaymentDetails.validity).daysDiff > 0
            ? "0, 255, 0"
            : "255, 0, 0";
        return (
          <>
            <div
              className="d-flex flex-column justify-content-center align-items-center"
              aria-label="Action Buttons"
            >
              <div
                style={{
                  color: `rgb(${tagColor})`,
                  backgroundColor: `rgba(${tagColor}, 0.09)`,
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                {checkStatus(latestPaymentDetails.validity).comment}
              </div>
              {checkStatus(latestPaymentDetails.validity).status === false && (
                <button
                  type="button"
                  className={`btn ${
                    dark ? "btn-warning text-primary" : "btn-dark"
                  } btn-sm me-2 mt-2`}
                  onClick={() => {
                    setPayeeId(record.key);
                    setVisible(true);
                  }}
                >
                  Pay
                </button>
              )}
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <nav
            aria-label="breadcrumb"
            className={`${
              dark ? "text-white bg-dark" : "bg-light"
            } rounded-3 p-3 mb-4`}
          >
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Payment
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <Table
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: "red" }}>{firebaseError.message}</span>
              }
            />
          ),
        }}
        title={() => (
          <div className="d-flex flex-column-reverse flex-sm-row gap-4 justify-content-between">
            <div className="text-start">
              <Input
                name="tableDataSearch"
                placeholder="Search here !"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        )}
        columns={columns}
        dataSource={filteredData}
        bordered
        sticky
      />
      {visible && (
        <SubCollectionCreateForm
          payeeId={payeeId}
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default Payment;
