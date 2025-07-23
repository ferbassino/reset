import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./FormComponent.css";

const baseUrl = "https://kinapp-api.vercel.app/";

const FormComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const [invalidUser, setInvalidUser] = useState("");
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const { token, id } = queryString.parse(location.search);

  const verifyToken = async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}verify-token?token=${token}&id=${id}`
      );
      if (!data.success) setInvalidUser(data.error);
      setBusy(false);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setInvalidUser(data.error);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError("Password must be between 8 and 20 characters");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    try {
      setBusy(true);
      const { data } = await axios.post(
        `${baseUrl}reset-password?token=${token}&id=${id}`,
        { password, id }
      );

      setBusy(false);
      if (data.success) {
        navigate("/reset-password");
        setSuccess(true);
      }
    } catch (error) {
      setBusy(false);
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setError(data.error);
      }
      console.log(error);
    }
  };

  if (success)
    return (
      <div className="success-message">
        <h1 className="form-title">kinApp</h1>
        <h2>Password reset successfully</h2>
      </div>
    );

  if (invalidUser)
    return (
      <div className="invalid-message">
        <h1 className="form-title">kinApp</h1>
        <h2>{invalidUser}</h2>
      </div>
    );

  if (busy)
    return (
      <div className="loading-message">
        <h1 className="form-title">kinApp</h1>
        <h2>Please wait, verifying reset token...</h2>
      </div>
    );

  return (
    <div className="form-component">
      <h1 className="form-title">kinApp</h1>
      <h3 className="form-heading">Reset Password</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          placeholder="New Password"
          type="password"
          name="password"
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          placeholder="Confirm Password"
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          required
        />

        <button type="submit" className="form-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
