import React, { useEffect } from "react";
import { Checkbox, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { FcNext } from "@react-icons/all-files/fc/FcNext";

const Login = () => {
  const [form] = Form.useForm();
  const { logIn, googleSignIn } = useUserAuth();
  const { dark } = useDarkMode();
  const navigate = useNavigate();

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (err) {
      console.log(err.message);
      message.error(err.message);
    }
  };

  const onFinishHandler = async (values) => {
    try {
      values = await form.validateFields();
      console.log("Success:", values);
      const { email, password, remember } = values;

      await logIn(email, password, remember);
      navigate("/");
    } catch (err) {
      message.error(err.message);
    }
  };

  const onFinishFailedHandler = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo);
  };
  const localUser = localStorage.getItem("authUser")
    
  useEffect(() => {
    if(localUser) {
      navigate("/")
    }
  }, [localUser, navigate])
  

  return (
    <div className="login-form">
      <h2 className={"text-center mb-3"}>Login</h2>

      <Form
        className="mt-2"
        size="middle"
        form={form}
        name="loginForm"
        initialValues={{
          remember: false,
        }}
        onFinish={onFinishHandler}
        onFinishFailed={onFinishFailedHandler}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Input valid email!",
            },
          ]}
        >
          <Input
            className={`${dark && "bg-dark"}`}
            prefix={<MailOutlined />}
            placeholder="Enter your email !"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              min: 6,
              message: "Input valid password!",
            },
          ]}
        >
          <Input.Password
            className={`${dark && "bg-dark"}`}
            prefix={ <LockOutlined /> }
            placeholder="Enter your password !"
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Checkbox className={`${dark && "text-white"}`}>Remember me</Checkbox>
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <div className="d-flex flex-column">
              <button
                className={`btn ${dark ? "btn-outline-light": "btn-outline-primary"} rounded mb-2`}
                disabled={
                  !form.isFieldsTouched(true) || 
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
                type="submit"
              >
                <FcNext /> Login
              </button>
              <button
                className={`btn ${dark ? "btn-light": "btn-dark"} rounded mb-2`}
                type="button"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle /> Login
              </button>
            </div>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
