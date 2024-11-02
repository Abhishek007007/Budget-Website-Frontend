import React, { useState } from "react";
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import axios from "axios";
const RegistrationFormModel = {
  username: "",
  email: "",
  password: "",
  password2: "",
};

function RegistrationPage() {
  const [form, setForm] = useState(RegistrationFormModel);

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.id] = e.target.value;
    setForm(newForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const resp = await axios.post(
      import.meta.env.VITE_BASE_API_URL + "/api/v1/register/",
      form
    );
    console.log(resp);
    setForm(RegistrationFormModel);
  }

  return (
    <div className="vh-100 vw-100 d-flex flex-row align-items-center justify-content-center">
      <MDBCard>
        <MDBCardBody>
          {/* <MDBCardTitle className="d-flex justify-content-center">
            Register
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
              type="email"
              id="email"
              label="Email"
              value={form.email}
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
            <MDBInput
              className="mb-4"
              type="password"
              id="password2"
              label="Confirm Password"
              value={form.password2}
              onChange={handleChange}
            />
            <MDBBtn type="submit" block onClick={handleSubmit}>
              Register
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default RegistrationPage;
