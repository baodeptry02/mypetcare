// Footer.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faPaw } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const homePage = () => {
   
    window.location.hash = "/";
  };
  return (
    <footer className="footer-footer">
      <div className="footer-text">
      <p>Copyright &copy; 2024 by NJS1804 - Team3 | All Rights Reserved.</p>
      </div>
      <div className="footer-iconTop" style={{ fontSize: "2rem" }}>
        <a
          style={{
            padding: "1rem 1.2rem",
            borderRadius: "50%",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            cursor: "pointer",
            marginRight: "3rem"
          }}
          onClick={scrollToTop}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;