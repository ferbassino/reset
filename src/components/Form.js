import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

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

      console.log(data);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setInvalidUser(data.error);
        return console.log(error.response.data);
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
      return setError("password must be between 8 and 20 characters");
    }
    if (password !== confirmPassword) {
      return setError("password does not match!!");
    }
    try {
      setBusy(true);
      const { data } = await axios.post(
        `${baseUrl}reset-password?token=${token}&id=${id}`,
        { password }
      );

      setBusy(false);
      if (data.success) {
        navigate("/reset-password");
        setSuccess(true);
      }
      console.log(data);
    } catch (error) {
      setBusy(false);
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setError(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  if (success)
    return (
      <div>
        <h1 className="text-center">Password reset successfully</h1>
      </div>
    );
  if (invalidUser)
    return (
      <div>
        <h1 className="text-center">{invalidUser}</h1>
      </div>
    );

  if (busy)
    return (
      <div>
        <h1 className="text-center">
          wait a moment, we are verifying reset token...
        </h1>
      </div>
    );

  return (
    <div style={{ width: 400 }} className=" text-center m-auto">
      <h3>Reset password</h3>
      {error && <h3 style={{ color: "#f54272" }}>{error}</h3>}
      <div className="m-2">
        <Form.Control
          placeholder="********"
          type="password"
          name="password"
          //   aria-describedby="passwordHelpBlock"
          onChange={handleChange}
          //   value={password}
        />
      </div>
      <div className="m-2">
        <Form.Control
          placeholder="********"
          type="password"
          name="confirmPassword"
          aria-describedby="passwordHelpBlock"
          onChange={handleChange}
          //   value={confirmPassword}
        />
      </div>
      <div className="m-2">
        <Button variant="secondary" onClick={handleSubmit}>
          Reset password
        </Button>
      </div>
    </div>
  );
};

export default FormComponent;
