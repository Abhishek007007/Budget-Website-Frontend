import React, { useState } from "react";
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { userLogin } from "../redux/authSlice";
import { useNavigate } from "react-router";

const LoginFormModel = {
  username: "",
  password: "",
};

function LoginPage() {
  const [form, setForm] = useState(LoginFormModel);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.id] = e.target.value;
    setForm(newForm);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // try {
    //   const resp = await axios.post(
    //     import.meta.env.VITE_BASE_API_URL + "/api/v1/login/",
    //     form
    //   );
    //   console.log(resp);
    //   Cookies.set("access", resp.data.access);
    //   Cookies.set("refresh", resp.data.refresh);
    dispatch(userLogin(form));
    setForm(LoginFormModel);
    navigate("/");
  }

  return (
    <div className="vh-100 vw-100 d-flex flex-row align-items-center justify-content-center">
      <MDBCard>
        <MDBCardBody>
          {/* <MDBCardTitle className="d-flex justify-content-center">
            Login
          </MDBCardTitle> */}
          <form action="" className="">
            <MDBInput
              className="mb-4"
              type="text"
              id="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
            />

            <MDBInput
              className="mb-4"
              type="password"
              id="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
            />

            <MDBBtn type="submit" block onClick={handleSubmit}>
              Login
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default LoginPage;
