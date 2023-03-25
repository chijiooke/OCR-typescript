import { DocumentText, Scan } from "iconsax-react";
import heroImage from "../../assets/hero3.png";
import "./hero-section.css"

export const HeroSection = () => {
  return (
    <div className="hero__section">
      <img src={heroImage} className="hero__image" />
      <h1 className="hero__title">
        SKANN<span style={{ color: "red" }}>Я</span>.ocr
      </h1>
      <p className="hero__subtext">
        A simple <b>image to text/pdf </b>
        tool built with typescript and node.js
      </p>
      <div className="hero__value__props__wrapper">
        <p className="hero__value_props">
          <Scan size="32" />
          Extract text off of images
        </p>
        <p className="hero__value_props">
          <DocumentText size="32" />
          Convert images to PDFs
        </p>
      </div>
    </div>
  );
};
