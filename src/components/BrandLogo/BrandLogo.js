import React from "react";
import BrandMark from "./BrandMark";
import "./BrandLogo.css";

const MARK_SIZES = {
  sm: 22,
  md: 28,
  lg: 56,
};

const BrandLogo = ({
  className = "",
  size = "md",
  showIcon = true,
  showText = true,
}) => (
  <span
    className={["brand-logo", `brand-logo--${size}`, className]
      .filter(Boolean)
      .join(" ")}
    aria-label="KineCat"
  >
    {showIcon && <BrandMark size={MARK_SIZES[size] ?? MARK_SIZES.md} />}
    {showText && (
      <span className="brand-logo__wordmark">
        <span className="brand-logo__kine">Kine</span>
        <span className="brand-logo__cat">Cat</span>
      </span>
    )}
  </span>
);

export default BrandLogo;
