import React, { useState } from "react";
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import axios from "axios";
const LoginFormModel = {
  username: "",
  password: "",
};

function LoginPage() {
  const [form, setForm] = useState(LoginFormModel);

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.id] = e.target.value;
    setForm(newForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const resp = await axios.post(
      import.meta.env.VITE_BASE_API_URL + "/api/v1/login/",
      form
    );
    console.log(resp);
    setForm(LoginFormModel);
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
