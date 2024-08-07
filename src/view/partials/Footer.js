import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faPaw } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const shouldShowFooter =
    !location.pathname.startsWith("/forgot-password") &&
    !location.pathname.startsWith("/update-password") &&
    !location.pathname.startsWith("/reset-password") &&
    !location.pathname.startsWith("/booking-details") &&
    !location.pathname.startsWith("/vet") &&
    !location.pathname.startsWith("/admin") &&
    !location.pathname.startsWith("/manager") &&
    !location.pathname.startsWith("/pet-details")

  if (!shouldShowFooter) {
    return null; // Don't render the header if it's a login or admin page
  }
  return (
    <footer className="footer-footer">
      <div className="footer-text">
        <p>Copyright © 2024 by NJS1804 - Team3 | All Rights Reserved.</p>
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
            marginRight: "3rem",
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
