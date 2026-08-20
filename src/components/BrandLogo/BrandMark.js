import React from "react";
import markSrc from "../../assets/brand/kinecat-mark.png";
import "./BrandMark.css";

const BrandMark = ({ size = 28, className = "" }) => (
  <img
    src={markSrc}
    alt=""
    className={["brand-mark", className].filter(Boolean).join(" ")}
    width={size}
    height={size}
    draggable={false}
  />
);

export default BrandMark;
