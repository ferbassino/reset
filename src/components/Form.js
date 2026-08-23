import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import BrandLogo from "./BrandLogo/BrandLogo";
import "./FormComponent.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://kinapp-api.vercel.app/";
const SUPPORT_EMAIL =
  process.env.REACT_APP_SUPPORT_EMAIL || "kinecatkinesiologia@gmail.com";
const WEB_APP_LOGIN_URL =
  process.env.REACT_APP_WEB_APP_URL ||
  "https://gestion-baskin.vercel.app/login";
const WEB_APP_FORGOT_URL =
  process.env.REACT_APP_WEB_APP_FORGOT_URL ||
  "https://gestion-baskin.vercel.app/forgot-password";

const BrandHeader = ({ tagline = "Gestión clínica y seguimiento de pacientes" }) => (
  <div className="reset-page__brand">
    <BrandLogo size="lg" />
    <span className="reset-page__badge">Profesional</span>
    {tagline ? <p className="reset-page__tagline">{tagline}</p> : null}
  </div>
);

const PageShell = ({ children }) => (
  <div className="reset-page reset-page--professional">
    <div className="reset-page__container">{children}</div>
  </div>
);

const FormComponent = () => {
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
        `${API_BASE_URL}verify-token?token=${token}&id=${id}`,
      );
      if (!data.success) setInvalidUser(data.error);
      setBusy(false);
    } catch (verifyError) {
      if (verifyError?.response?.data) {
        const { data } = verifyError.response;
        if (!data.success) setInvalidUser(data.error);
      }
      setBusy(false);
      console.log(verifyError);
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- validación única al montar con token/id de la URL
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;

    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError("La contraseña debe tener entre 8 y 20 caracteres");
    }

    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      setBusy(true);
      const { data } = await axios.post(
        `${API_BASE_URL}reset-password?token=${token}&id=${id}`,
        { password, id },
      );

      setBusy(false);
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = WEB_APP_LOGIN_URL;
        }, 3000);
      }
    } catch (submitError) {
      setBusy(false);
      if (submitError?.response?.data) {
        const { data } = submitError.response;
        if (!data.success) setError(data.error || data.message);
      }
      console.log(submitError);
    }
  };

  if (success) {
    return (
      <PageShell>
        <BrandHeader tagline="" />
        <div className="reset-card reset-card--status">
          <div className="status-icon status-icon--success">✓</div>
          <h1 className="reset-card__title">Contraseña restablecida</h1>
          <p className="reset-card__description">
            Tu contraseña fue actualizada correctamente. Serás redirigido al
            inicio de sesión en unos segundos.
          </p>
          <button
            type="button"
            className="form-button form-button--primary"
            onClick={() => {
              window.location.href = WEB_APP_LOGIN_URL;
            }}
          >
            Ir al inicio de sesión
          </button>
        </div>
      </PageShell>
    );
  }

  if (invalidUser) {
    return (
      <PageShell>
        <BrandHeader tagline="" />
        <div className="reset-card reset-card--status">
          <div className="status-icon status-icon--error">!</div>
          <h1 className="reset-card__title">Enlace no válido</h1>
          <p className="reset-card__description">
            {invalidUser ||
              "El enlace de restablecimiento no es válido o expiró."}
          </p>
          <button
            type="button"
            className="form-button form-button--secondary"
            onClick={() => {
              window.location.href = WEB_APP_FORGOT_URL;
            }}
          >
            Solicitar nuevo enlace
          </button>
          <p className="reset-card__description">
            ¿Necesitás ayuda?{" "}
            <a
              className="text-link"
              href={`mailto:${SUPPORT_EMAIL}?subject=Solicitud%20reset%20Kinecat`}
            >
              Contactar soporte
            </a>
          </p>
        </div>
      </PageShell>
    );
  }

  if (busy) {
    return (
      <PageShell>
        <BrandHeader />
        <div className="reset-card reset-card--status">
          <div className="spinner" aria-hidden="true" />
          <h1 className="reset-card__title">Verificando enlace</h1>
          <p className="reset-card__description">
            Estamos validando tu enlace de restablecimiento…
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <BrandHeader />
      <div className="reset-card">
        <h1 className="reset-card__title">Restablecer contraseña</h1>
        <p className="reset-card__description">
          Elegí una contraseña segura para tu cuenta de Kinecat
        </p>

        {error ? (
          <div className="form-alert form-alert--error" role="alert">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Nueva contraseña
            </label>
            <input
              id="password"
              className="form-input"
              placeholder="Ingresá tu nueva contraseña"
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
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              className="form-input"
              placeholder="Repetí tu nueva contraseña"
              type="password"
              name="confirmPassword"
              value={newPassword.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="form-button form-button--primary">
            Guardar contraseña
          </button>
        </form>

        <div className="reset-footer">
          <p>
            ¿Recordaste tu contraseña?{" "}
            <button
              type="button"
              className="text-link"
              onClick={() => {
                window.location.href = WEB_APP_LOGIN_URL;
              }}
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </PageShell>
  );
};

export default FormComponent;
