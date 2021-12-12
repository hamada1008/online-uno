import React, { useState, useEffect } from "react";
import "./AuthForm.scss";
import axios from "axios";
import url from "../../data/backendUrl";

const AuthForm = () => {
  const [register, setRegister] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    error &&
      setTimeout(() => {
        setError("");
      }, 20000);
  }, [error]);

  const requestType = register ? "register" : "login";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target?.username?.value;
    const email = e.target?.email?.value;
    const password = e.target?.password?.value;
    const confirmPassword = e.target?.confirmPassword?.value;
    const user = register ? { username, email, password } : { email, password };
    if (register && password !== confirmPassword) {
      setError("Passwords did not match");
      return;
    }
    try {
      const response = await axios.post(url(requestType), user);
      response.data.success &&
        localStorage.setItem("authToken", response.data.msg);
      e.target.reset();
    } catch (err) {
      localStorage.removeItem("authToken");
      setError(err.response.data.msg);
    }
  };

  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {register && (
          <>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" />
          </>
        )}
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" />
        {register && (
          <>
            <label htmlFor="password">Confirm Password:</label>
            <input type="password" name="confirmPassword" />
          </>
        )}
        <button type="submit">
          {requestType.replace(
            requestType.charAt(0),
            requestType.charAt(0).toUpperCase()
          )}
        </button>
        {error && <p>{error}</p>}
      </form>
      <button onClick={() => setRegister((prevState) => !prevState)}>
        {register ? "Have an account? Login here" : "New member? Register here"}
      </button>
    </div>
  );
};

export default AuthForm;
