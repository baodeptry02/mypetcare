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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <a href="#home" onClick={homePage} className="footer-logo">
            <FontAwesomeIcon icon={faPaw} /> Pet Center
          </a>
          <div className="footer-info">
            <p>Nha Van Hoa Sinh Vien Lang Dai Hoc Thu Duc</p>
            <p>Hotline: 0762 029 029</p>
            <p>Email: xxxxx@hotmail.com</p>
          </div>
          <div className="footer-title">
            Không ngừng nâng cao chất lượng phục vụ, nâng tầm chuyên môn để mang
            đến quý khách hàng những dịch vụ hoàn hảo nhất...
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <p>
            <a href="#">Giới thiệu</a>
          </p>
          <p>
            <a href="#">Liên hệ</a>
          </p>
          <p>
            <a href="#">Tin tức</a>
          </p>
        </div>
        <div className="footer-section">
          <h3>Chính Sách</h3>
          <p>
            <a href="#">Chính sách chung</a>
          </p>
          <p>
            <a href="#">Chính sách bảo mật thông tin</a>
          </p>
        </div>
        <div className="footer-section footer-map">
          <h3>Bản Đồ</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1640561676095!2d106.79814847609639!3d10.875123789279707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2zTmjDoCBWxINuIGjDs2EgU2luaCB2acOqbiBUUC5IQ00!5e0!3m2!1svi!2s!4v1715862724373!5m2!1svi!2s"
            width="400"
            height="350"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
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