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

const EyeOpenIcon = () => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M1 1l22 22" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
);

const PasswordField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  hint = null,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="password-field">
        <input
          id={id}
          className="form-input password-field__input"
          placeholder={placeholder}
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          required
        />
        <button
          type="button"
          className="password-field__toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
        >
          {visible ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </button>
      </div>
      {hint ? <p className="input-hint">{hint}</p> : null}
    </div>
  );
};

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
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { token, id } = queryString.parse(location.search);

  const verifyToken = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}verify-token?token=${token}&id=${id}`,
      );
      if (!data.success) setInvalidUser(data.error);
    } catch (verifyError) {
      if (verifyError?.response?.data) {
        const { data } = verifyError.response;
        if (!data.success) setInvalidUser(data.error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- validación única al montar
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
      setIsSubmitting(true);
      const { data } = await axios.post(
        `${API_BASE_URL}reset-password?token=${token}&id=${id}`,
        { password, id },
      );

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || data.message || "No se pudo restablecer la contraseña");
      }
    } catch (submitError) {
      if (submitError?.response?.data) {
        const { data } = submitError.response;
        if (!data.success) setError(data.error || data.message);
      }
    } finally {
      setIsSubmitting(false);
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
            Tu contraseña fue actualizada correctamente. Podés iniciar sesión
            cuando quieras con la nueva contraseña.
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
          <p className="reset-card__footnote">
            Este enlace de restablecimiento ya no es válido. Cerrá esta pestaña
            si no vas a ingresar ahora.
          </p>
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

  if (isVerifying) {
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
          <PasswordField
            id="password"
            name="password"
            label="Nueva contraseña"
            placeholder="Ingresá tu nueva contraseña"
            value={newPassword.password}
            onChange={handleChange}
            hint="Entre 8 y 20 caracteres"
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar contraseña"
            placeholder="Repetí tu nueva contraseña"
            value={newPassword.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="form-button form-button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando…" : "Guardar contraseña"}
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
