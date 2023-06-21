import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { toast } from "react-toastify";

import LayoutComponent from "../Components/Layout";

const user = () => {
  const [userInfo, setUserInfo] = useState({ name: "" });
  const [form] = Form.useForm();
  useEffect(() => {
    toast("Loading", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    axios
      .get("/api/users")
      .then(({ data }) => {
        form.setFieldsValue({ name: data.user.name });
        setUserInfo({ name: data.user.name });
        toast.dismiss();
      })
      .catch((err) => console.log(err));
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.replace(
      "/?message=Session%20Expired%20Please%20Login%20Again"
    );
  };
  const updateUser = (values) => {
    toast("Updating user", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log({ values });
    axios
      .patch("/api/users", values)
      .then(({ data }) => {
        toast.dismiss();
        setUserInfo({ name: data.user.name });
        toast("User Updated Successfully", {
          position: "bottom-right",
          hideProgressBar: true,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <LayoutComponent>
      <h1 className="mb-5 text-xl	">DashBoard</h1>
      <div className="w-1/2">
        <Form
          form={form}
          onValuesChange={(change) => console.log(change)}
          name="basic"
          onFinish={updateUser}
          autoComplete="off">
          <Form.Item
            label="name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              danger
              type="primary"
              htmlType="button"
              onClick={() => logoutUser()}>
              Logout
            </Button>
          </Form.Item>
        </Form>
      </div>
    </LayoutComponent>
  );
};

export default user;
