import axios from "axios";
import React, { useState } from "react";
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
        alert(resp.data.message);
        setErrors([]);
        setForm(passwordChangeForm);
        setIsChangingPassword(false);
      } catch (error) {
        for (const key of Object.keys(error.response.data)) {
          newErrors.push(`${key} : ${error.response.data[key]}`);
        }
        newErrors.push(JSON.stringify());
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
        <form className="w-100 d-flex flex-column gap-2">
          <div className="w-100 d-flex flex-row justify-content-evenly gap-2">
            <input
              type="password"
              onChange={handleChange}
              className="form-control"
              name="old_password"
              value={form.old_password}
              placeholder="Old Password"
            ></input>
            <input
              type="password"
              onChange={handleChange}
              className="form-control"
              name="new_password"
              value={form.new_password}
              placeholder="New Password"
            ></input>
            <input
              type="password"
              onChange={handleChange}
              className="form-control"
              name="new_password1"
              value={form.new_password1}
              placeholder="Confirm New Password"
            ></input>
          </div>
          {errors.length > 0 ? (
            <div className="w-100 d-flex flex-row justify-content-center">
              <ul>
                {errors.map((val, idx) => {
                  return <ol key={idx}>{val}</ol>;
                })}
              </ul>
            </div>
          ) : (
            <></>
          )}

          <div className="w-100 d-flex flex-row justify-content-center">
            <div className="d-flex flex-row justify-content-evenly gap-2">
              <button
                onClick={handleChangePassword}
                className="btn btn-primary"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setForm(passwordChangeForm);
                  setErrors([]);
                }}
                className="btn btn-danger"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="w-100 d-flex flex-row justify-content-between">
          <span className="align-content-center">
            Do you want to change your password?
          </span>
          <button
            onClick={() => setIsChangingPassword(true)}
            className="btn btn-outline-danger"
          >
            Change Password
          </button>
        </div>
      )}
    </>
  );
}

export default SettingsChangePassword;
