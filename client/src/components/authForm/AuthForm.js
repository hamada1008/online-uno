import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/Contexts";
import "./AuthForm.scss";
import axios from "axios";
import url from "../../data/backendUrl";

const AuthForm = () => {
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);

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
      if (response?.data?.success) {
        localStorage.setItem("authToken", response.data.msg);
        localStorage.setItem("isGuest", "No");
        setUser({ isLoggedIn: true });
      }
    } catch (err) {
      localStorage.clear();
      setError(err.response?.data?.msg);
    }
    e.target.reset();
  };
  const guestRegister = async () => {
    try {
      const response = await axios.get(url("guest"));
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.msg);
        localStorage.setItem("isGuest", "Yes");
        setUser({ isLoggedIn: true });
      }
    } catch (err) {
      localStorage.clear();
      setError(err.response?.data?.msg);
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
        <input type="email" name="email" defaultValue="test@test.com" />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" defaultValue="123456" />
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
      <button onClick={guestRegister}>
        Want to try out the website? try from here
      </button>
    </div>
  );
};

export default AuthForm;
