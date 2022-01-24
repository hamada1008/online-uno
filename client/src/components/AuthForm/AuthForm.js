import { useState, useEffect, useContext } from "react";
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
        setUser({ isLogging: true });
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
        setUser({ isLogging: true });
      }
    } catch (err) {
      localStorage.clear();
      setError(err.response?.data?.msg);
    }
  };
  return (
    <div className="auth">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {register && (
          <div className="form-input-fields">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" placeholder="User Name" />
          </div>
        )}
        <div className="form-input-fields">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" placeholder="Email" />
        </div>
        <div className="form-input-fields">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="on"
          />
        </div>
        {register && (
          <div className="form-input-fields">
            <label htmlFor="password">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat Password"
              autoComplete="on"
            />
          </div>
        )}
        <button type="submit">
          {requestType.replace(
            requestType.charAt(0),
            requestType.charAt(0).toUpperCase()
          )}
        </button>
        {error && <p>{error}</p>}
      </form>
      <div className="form-buttons">
        <button onClick={() => setRegister((prevState) => !prevState)}>
          {register ? "Have an account?" : "New member?"}
        </button>
        <button onClick={guestRegister}>
          Be my <span>Guest</span> User
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
