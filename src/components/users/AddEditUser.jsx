import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Radio,
  DatePicker,
  Upload,
  Space,
  Spin,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";
import { useUserAuth } from "../../hooks/UseUserAuth";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const { RangePicker } = DatePicker;

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }

  return isJpgOrPng && isLt2M;
};

const AddEditUser = () => {
  const { addDataToFirebase, updateDataToFirebase } = useUserAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editableUser, setEditableUser] = useState(
    location.state !== null ? location.state.editableUser : {}
  );
  const { dark } = useDarkMode();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;
  const prevPaymentDetails = editableUser.paymentDetails
    
  const onFinish = (values) => {
    values = {
      ...values,
      activeStatus: true,
      gymboyBirthday: values.gymboyBirthday.format(),
      gymboyAvatar: imageUrl,
      paymentDetails: [{
        ...values.paymentDetails,
        validity: [
          values.paymentDetails.validity[0].format(),
          values.paymentDetails.validity[1].format(),
        ],
        paidOn: moment().format()
      }],
    };
    console.log("Success onFinish", values);
    if (imageUrl !== null) {
      if (location.pathname.includes("edit")) {
        const updateValue = {
          ...values,
          paymentDetails: [...prevPaymentDetails, ...values.paymentDetails],
        }
        console.log("Update Value:", updateValue);
        updateDataToFirebase(editableUser.key, updateValue)
        navigate("/users")
      } else {
        console.log("Add Value:", values);
        addDataToFirebase(values);
      }
    }
    form.resetFields();
    setImageUrl(null);
    message.success("Success");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const firebaseUpload = async ({ onError, onSuccess, file, onProgress }) => {
    const fileNameById = form.getFieldValue("gymboyId");

    if (fileNameById) {
      const fileName = `${fileNameById}.${file.type.split("/")[1]}`;

      const storageRef = ref(storage, `portfolio/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      try {
        uploadTask.on(
          "state_changed",
          (snap) =>
            onProgress(
              {
                percent: Math.round(
                  (snap.bytesTransferred / snap.totalBytes) * 100
                ),
              },
              setLoading(true)
            ),
          (err) => onError(message.error(err)),
          () =>
            onSuccess(
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setLoading(false);
                setImageUrl(url);
                message.success(`File uploaded successfully`);
              })
            )
        );
      } catch (e) {
        onError(e);
      }
    } else {
      message.error("Input the ID first to proceed with picture !");
    }
  };
  const uploadButton = (
    <div>
      {loading ? <Spin /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  
  const setFormValues = () => {
    const latestPaymentDetails = prevPaymentDetails.reduce((a, b) => a.paidOn > b.paidOn ? a : b)
    setImageUrl(editableUser.gymboyAvatar);
    form.setFieldsValue({
      gymboyId: editableUser.gymboyId,
      gymboyName: editableUser.gymboyName,
      gymboyAddress: editableUser.gymboyAddress,
      gymboyBirthday: moment(editableUser.gymboyBirthday),
      gymboyBloodGroup: editableUser.gymboyBloodGroup,
      gymboyEducation: editableUser.gymboyEducation,
      gymboyHeight: editableUser.gymboyHeight,
      gymboyWeight: editableUser.gymboyWeight,
      gymboyGender: editableUser.gymboyGender,
      gymboyIncome: editableUser.gymboyIncome,
      gymboyOccupation: editableUser.gymboyOccupation,
      gymboyMobile: editableUser.gymboyMobile,
      gymboyProblems: editableUser.gymboyProblems,
      paymentDetails: {
        fee: latestPaymentDetails.fee,
        validity: [
          moment(latestPaymentDetails.validity[0]),
          moment(latestPaymentDetails.validity[1]),
        ],
      },
    });
  };

  useEffect(() => {
    if (location.state !== null) {
      setEditableUser(location.state.editableUser);
      setFormValues();
    }
  }, [location]);

  return (
    <div>
      <h2 className={`${dark && "text-white"} text-center mb-3`}>
        {location.pathname.includes("edit") ? "Edit" : "Add"} Gymboy
      </h2>
      <Form
        form={form}
        name="add_edit_user"
        initialValues={{
          gymboyGender: "male",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="d-flex flex-column-reverse">
          <div className="row align-items-center justify-content-between me-3">
            <Form.Item
              name="gymboyName"
              className="col-12 col-sm-4 col-md-4 col-lg-3 me-2"
              rules={[
                {
                  required: true,
                  message: "Please input name!",
                },
                {
                  min: 3,
                  message: "Input atleast 3 character !",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter a Name !" />
            </Form.Item>
            <Form.Item
              className="col-12 col-sm-4 col-md-4 col-lg-3 me-2"
              name="gymboyAddress"
              rules={[
                {
                  required: true,
                  message: "Please input address!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter a Address !" />
            </Form.Item>
            <Form.Item
              className="col-12 col-sm-4 col-md-4 col-lg-3 me-2"
              name="gymboyEducation"
              rules={[
                {
                  required: true,
                  message: "Please input education!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter a Education !" />
            </Form.Item>

            <Form.Item
              className="col-12 col-sm-4 col-md-4 col-lg-3 me-2"
              name="gymboyOccupation"
              rules={[
                {
                  required: true,
                  message: "Please input occupation!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter a Occupation !" />
            </Form.Item>

            <Form.Item
              className="col-12 col-sm-4 col-md-4 col-lg-3 me-2"
              name="gymboyIncome"
              rules={[
                {
                  required: true,
                  message: "Please input income!",
                },
              ]}
              hasFeedback
            >
              <Input type="number" placeholder="Enter a Income !" />
            </Form.Item>

            <Form.Item
              className="col-12 col-sm-4 col-md-4 col-lg-3 me-2"
              name="gymboyMobile"
              rules={[
                {
                  required: true,
                  message: "Please input mobile number!",
                },
                {
                  len: 10,
                  message: "Please input only 10 digits!",
                },
              ]}
              hasFeedback
            >
              <Input type="number" placeholder="Enter a Mobile Number !" />
            </Form.Item>
            <Form.Item
              className="col-12 col-sm-6 col-md-6 col-lg-3 me-2"
              name={["paymentDetails", "validity"]}
              rules={[
                {
                  required: true,
                  message: "Please input payment details!",
                },
              ]}
              hasFeedback
            >
              <RangePicker className="col-12 col-sm-12 col-md-8 col-lg-12" />
            </Form.Item>
            <Form.Item
              className="col-12 col-sm-6 col-md-4 col-lg-3 me-2"
              name={["paymentDetails", "fee"]}
              rules={[
                {
                  required: true,
                  message: "Please input fee!",
                },
              ]}
              hasFeedback
            >
              <Input type="number" placeholder="Enter a fee !" />
            </Form.Item>
            <Form.Item
              className="col-12 col-sm-4 col-md-12 col-lg-3 me-2"
              name="gymboyProblems"
              rules={[
                {
                  required: true,
                  message: "Please input Problems!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter a Problems !" />
            </Form.Item>
          </div>
          <div className="d-flex flex-column justify-content-between flex-sm-row gap-5">
            <div className="d-flex flex-column align-items-center gap-1">
              <Form.Item
                name="gymboyId"
                rules={[
                  {
                    required: true,
                    message: "Please input your ID!",
                  },
                ]}
                hasFeedback
              >
                <Input type="number" placeholder="Enter an ID !" />
              </Form.Item>
              <div className="d-flex flex-column align-items-center">
                <Form.Item className="mb-0" name="gymboyAvatar">
                  <ImgCrop grid rotate>
                    <Upload
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                      customRequest={(e) => firebaseUpload(e)}
                    >
                      {imageUrl ? (
                        <Image
                          preview={false}
                          src={imageUrl}
                          style={{
                            width: "100%",
                          }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
                <Form.Item name="gymboyGender" hasFeedback>
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value="male">Male</Radio.Button>
                    <Radio.Button value="female">Female</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
            <div>
              <Form.Item
                name="gymboyBirthday"
                rules={[
                  {
                    required: true,
                    message: "Please input date of birth!",
                  },
                ]}
                hasFeedback
              >
                <DatePicker className="col-11 col-sm-8 col-md-10 col-lg-10" />
              </Form.Item>
              <Form.Item
                className="col-11 col-sm-8 col-md-10 col-lg-10"
                name="gymboyBloodGroup"
                rules={[
                  {
                    required: true,
                    message: "Please select a blood group!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  showSearch
                  placeholder="Select a Blood Group"
                  optionFilterProp="children"
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="o_positive">O+</Option>
                  <Option value="o_negative">O-</Option>
                  <Option value="a_positive">A+</Option>
                  <Option value="a_negative">A-</Option>
                  <Option value="b_positive">B+</Option>
                  <Option value="b_negative">B-</Option>
                  <Option value="ab_positive">AB+</Option>
                  <Option value="ab_negative">AB-</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="gymboyHeight"
                className="col-12 col-sm-8 col-md-10 col-lg-10"
                rules={[
                  {
                    required: true,
                    message: "Please input height!",
                  },
                  {
                    max: 3,
                    message: "Reached max height!",
                  },
                ]}
                hasFeedback
              >
                {/* <Tooltip
                  trigger={["focus"]}
                  title={"Input a number"}
                  placement="topLeft"
                  overlayClassName="numeric-input"
                > */}

                <Input
                  className="col-11 col-sm-12 col-md-12"
                  type="number"
                  min="100"
                  max="220"
                  addonAfter="cm"
                  placeholder="Enter a height !"
                />
                {/* </Tooltip> */}
              </Form.Item>

              <Form.Item
                name="gymboyWeight"
                className="col-12 col-sm-12 col-md-10 col-lg-10"
                rules={[
                  {
                    required: true,
                    message: "Please input weight!",
                  },
                ]}
                hasFeedback
              >
                {/* <Tooltip
                  trigger={["focus"]}
                  title={"Input a number"}
                  placement="topLeft"
                  overlayClassName="numeric-input"
                > */}
                <Input
                  className="col-11 col-sm-8 col-md-12"
                  type="number"
                  min="30"
                  max="220"
                  addonAfter="kg"
                  placeholder="Enter a weight !"
                />
                {/* </Tooltip> */}
              </Form.Item>
            </div>
          </div>
        </div>
        <Form.Item
        className="text-center"
        >
          <Space size="large">
            <Button type="primary" htmlType="submit">
              {location.pathname.includes("edit") ? "Update" : "Save"}
            </Button>
            <Button
              type="dashed"
              htmlType="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEditUser;
