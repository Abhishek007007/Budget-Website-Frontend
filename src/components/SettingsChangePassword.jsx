import React, { useState } from "react";
import { Input, Button, Form, Alert } from "antd";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

const passwordChangeForm = {
  old_password: "",
  new_password: "",
  new_password1: "",
};

function SettingsChangePassword() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [form, setForm] = useState(passwordChangeForm);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  async function handleChangePassword() {
    const newErrors = [];
    if (
      form.old_password === "" ||
      form.new_password1 === "" ||
      form.new_password === ""
    ) {
      newErrors.push("fields cannot be empty");
    }
    if (form.new_password1 !== form.new_password) {
      newErrors.push("new passwords mismatch");
    }
    if (newErrors.length === 0) {
      try {
        const resp = await axiosPrivate.put("/api/v1/password_change/", {
          old_password: form.old_password,
          new_password: form.new_password,
        });
        setSuccessMessage("Password changed successfully!"); // Set success message
        setErrors([]); 
        setForm(passwordChangeForm); 
      } catch (error) {
        const newErrorMessages = [];
        for (const key of Object.keys(error.response.data)) {
          newErrorMessages.push(`${error.response.data[key]}`);
        }
        setErrors(newErrorMessages); 
        setSuccessMessage(""); 
      }
    }
    setErrors(newErrors);
  }

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
  }

  return (
    <>
      {isChangingPassword ? (
        <Form layout="vertical" className="w-100">
          <Form.Item label="Old Password">
            <Input
              type="password"
              onChange={handleChange}
              name="old_password"
              value={form.old_password}
              placeholder="Old Password"
            />
          </Form.Item>
          <Form.Item label="New Password">
            <Input
              type="password"
              onChange={handleChange}
              name="new_password"
              value={form.new_password}
              placeholder="New Password"
            />
          </Form.Item>
          <Form.Item label="Confirm New Password">
            <Input
              type="password"
              onChange={handleChange}
              name="new_password1"
              value={form.new_password1}
              placeholder="Confirm New Password"
            />
          </Form.Item>

          {/* Show error alert if there are errors */}
          {errors.length > 0 && (
            <Alert
              message={errors.map((val, idx) => <div key={idx}>{val}</div>)}
              type="error"
              showIcon
              style={{ marginBottom: "16px" }}
            />
          )}

          {/* Show success alert if password change is successful */}
          {successMessage && (
            <Alert
              message={successMessage}
              type="success"
              showIcon
              style={{ marginBottom: "16px" }}
            />
          )}

          <div className="w-100 d-flex flex-row justify-content-center gap-2">
            <Button
              type="primary"
              onClick={handleChangePassword}
            >
              Confirm
            </Button>
            <Button
              danger
              onClick={() => {
                setIsChangingPassword(false);
                setForm(passwordChangeForm);
                setErrors([]);
                setSuccessMessage(""); // Clear success message on cancel
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <div className="w-100 d-flex flex-row justify-content-between">
          <span className="align-content-center">
            Do you want to change your password?
          </span>
          <Button
            type="dashed"
            danger
            onClick={() => setIsChangingPassword(true)}
          >
            Change Password
          </Button>
        </div>
      )}
    </>
  );
}

export default SettingsChangePassword;
