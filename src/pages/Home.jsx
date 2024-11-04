import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const auth = useSelector((state) => state.auth);
  console.log(auth);
  return (
    <div>
      <h1>Home page</h1>
      <p>ID : {auth.user.id}</p>
      <p>Username : {auth.user.username}</p>
      <p>Email : {auth.user.email}</p>
    </div>
  );
}

export default Home;
