import React, { useState } from "react";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
};

const IconEye = () => (
  <svg {...iconProps}>
    <path
      d="M1.5 8C1.5 8 3.5 3.5 8 3.5C12.5 3.5 14.5 8 14.5 8C14.5 8 12.5 12.5 8 12.5C3.5 12.5 1.5 8 1.5 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconEyeOff = () => (
  <svg {...iconProps}>
    <path
      d="M2 2L14 14M6.5 6.7C6.2 7.1 6 7.5 6 8C6 9.1 6.9 10 8 10C8.5 10 8.9 9.8 9.3 9.5M3.5 5.5C2.5 6.4 1.8 7.5 1.5 8C1.5 8 3.5 12.5 8 12.5C9.2 12.5 10.2 12.1 11.1 11.5M11.5 9.8C12.2 9.1 12.7 8.3 13 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? "Ocultar contraseña" : "Mostrar contraseña";

  return (
    <div className="password-input">
      <input
        id={id}
        className="form-input password-input__field"
        placeholder={placeholder}
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="new-password"
      />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setVisible((previous) => !previous)}
        aria-label={toggleLabel}
        title={toggleLabel}
      >
        {visible ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  );
};

export default PasswordInput;
