import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./FormComponent.css";

// Importar el logo SVG
import Logo from "../assets/favicon.svg";

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
    setError(""); // Limpiar errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;

    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError("La contraseña debe tener entre 8 y 20 caracteres");
    }

    if (password !== confirmPassword) {
      return setError("¡Las contraseñas no coinciden!");
    }

    try {
      setBusy(true);
      const { data } = await axios.post(
        `${baseUrl}reset-password?token=${token}&id=${id}`,
        { password, id }
      );

      setBusy(false);
      if (data.success) {
        setSuccess(true);
        // Redirigir automáticamente después de 3 segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
        <div className="logo-container">
          <img src={Logo} alt="Baskin Logo" className="logo" />
          <h1 className="form-title">Baskin</h1>
        </div>
        <div className="success-icon">✓</div>
        <h2>¡Contraseña restablecida con éxito!</h2>
        <p>Tu contraseña ha sido actualizada correctamente.</p>
        <p className="redirect-message">
          Serás redirigido a la página de inicio de sesión en 3 segundos...
        </p>
        <button
          className="form-button secondary"
          onClick={() => navigate("/login")}
        >
          Ir al inicio de sesión ahora
        </button>
      </div>
    );

  if (invalidUser)
    return (
      <div className="invalid-message">
        <div className="logo-container">
          <img src={Logo} alt="Baskin Logo" className="logo" />
          <h1 className="form-title">Baskin</h1>
        </div>
        <div className="error-icon">✗</div>
        <h2>{invalidUser}</h2>
        <p>El enlace de restablecimiento no es válido o ha expirado.</p>
        <button
          className="form-button secondary"
          onClick={() => navigate("/forgot-password")}
        >
          Solicitar nuevo enlace
        </button>
      </div>
    );

  if (busy)
    return (
      <div className="loading-message">
        <div className="logo-container">
          <img src={Logo} alt="Baskin Logo" className="logo" />
          <h1 className="form-title">Baskin</h1>
        </div>
        <div className="spinner"></div>
        <h2 className="loading-text">
          Verificando enlace de restablecimiento...
        </h2>
        <p className="loading-subtext">Por favor, espera un momento.</p>
      </div>
    );

  return (
    <div className="form-component">
      <div className="form-header">
        <div className="logo-container">
          <img src={Logo} alt="Baskin Logo" className="logo" />
          <h1 className="form-title">Baskin</h1>
        </div>
        <p className="form-subtitle">Análisis Biomecánico Inteligente</p>
      </div>

      <div className="form-card">
        <h2 className="form-heading">Restablecer Contraseña</h2>
        <p className="form-description">
          Crea una nueva contraseña segura para tu cuenta
        </p>

        {error && (
          <div className="form-error" role="alert">
            <span className="error-icon-small">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Nueva Contraseña
            </label>
            <input
              id="password"
              className="form-input"
              placeholder="Ingresa tu nueva contraseña"
              type="password"
              name="password"
              value={newPassword.password}
              onChange={handleChange}
              required
            />
            <p className="input-hint">Entre 8 y 20 caracteres</p>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              className="form-input"
              placeholder="Confirma tu nueva contraseña"
              type="password"
              name="confirmPassword"
              value={newPassword.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="form-button primary">
            Restablecer Contraseña
          </button>
        </form>

        <div className="form-footer">
          <p>
            ¿Recordaste tu contraseña?{" "}
            <button className="text-link" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
          </p>
          <p className="security-note">
            🔒 Tus datos están protegidos con encriptación de nivel empresarial
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
