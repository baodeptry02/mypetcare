import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../Components/firebase/firebase"; // Assuming you have a firebase config file
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import {Typed} from "react-typed";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import emailjs from 'emailjs-com';
=======
import { Typed } from "react-typed";
>>>>>>> 0863bb9ec12d5eb0b459cb4fe7364321edac34c0

function Home() {
  const typedElement = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const form = useRef();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập của người dùng khi component được tải
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Đặt trạng thái người dùng nếu đã đăng nhập
      } else {
        setUser(null); // Đặt trạng thái người dùng là null nếu chưa đăng nhập
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const book = () => {
<<<<<<< HEAD
    if (user) {
      navigate("/book");
    } else {
      navigate("/signIn"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
      toast.error("Please log in to continue your booking!");
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    formData.append('to_name', userName);
    emailjs.sendForm('service_9sprp0p', 'template_pz8ey59', form.current, 'gWym0COHJFeyRWp5M')
      .then((result) => {
        console.log(result.text);
        toast.success("Email sent successfully!");
      }, (error) => {
        console.log(error.text);
        toast.error("Failed to send email.");
      });

    e.target.reset();
=======
    navigate("/book");
>>>>>>> 0863bb9ec12d5eb0b459cb4fe7364321edac34c0
  };

  useEffect(() => {
    const options = {
      strings: ["Grooming", "Healthcare", "Daycare", "Training"],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 400,
      loop: true,
    };

    const typed = new Typed(typedElement.current, options);

    // Cleanup function to destroy Typed instance on component unmount
    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <div>
      <div id="root">
        <section className="home-section" id="home">
          <div className="home-content">
            <h3>Welcome to PetCenter</h3>
            <h1>Your One-Stop Solution for Pet Care</h1>
            <h3>
              We Provide{" "}
              <span ref={typedElement} className="multiple-text"></span> Service
            </h3>
            <p>
              At PetCenter, we enhance the lives of pets and their owners with a
              wide range of services. From grooming and veterinary care to
              training and daycare, we're here to support you and your furry
              friends.
            </p>
            <a onClick={book} className="btn">
              Book now
            </a>
          </div>
          <div className="home-img">
            <img
              src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dan47.info%2F2020%2F08%2Fbo-tranh-ho-map-u-gay-cuoi-tren-mang-xa-hoi.html&psig=AOvVaw3iIlrT26g2wgDaF9dzR5uP&ust=1716512659780000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLjtv9_JooYDFQAAAAAdAAAAABAE"
              alt=""
            />
          </div>
        </section>
      </div>
      <section className="about" id="about">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1640561676095!2d106.79814847609639!3d10.875123789279707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2zTmjDoCBWxINuIGjDs2EgU2luaCB2acOqbiBUUC5IQ00!5e0!3m2!1svi!2s!4v1715862724373!5m2!1svi!2s"
          width="600"
          height="450"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
<<<<<<< HEAD
      <section className="contact" id="contact">
        <h2 className="heading">
          Contact <span>Us!</span>
        </h2>
        <form ref={form} onSubmit={sendEmail}>
          <div className="input-box">
            <input type="text" name="from_name" placeholder="Full Name" required />
            <input type="email" name="from_email" placeholder="Email Address" required />
          </div>
          <div className="input-box">
            <input type="number" name="from_phone" placeholder="Mobile Number" required />
            <input type="text" name="subject" placeholder="Email Subject" required />
          </div>
          <textarea name="message" cols="30" rows="10" placeholder="Your Message" required></textarea>
          <input type="submit" value="Send Message" className="btn" />
        </form>
      </section>

      {/* footer design */}
      <footer className="footer">
        <div className="footer-text">
          <p>Copyright &copy; 2024 by NJS1804 - Team3 | All Rights Reserved.</p>
        </div>
        <div className="footer-iconTop" style={{fontSize: "2rem"}}>
          <a style={{padding: "1rem 1.2rem", borderRadius: "50%", display: "inline-flex"
    ,justifyContent: "center"
    ,alignItems: "center", color: "#fff"}} href="#home"><FontAwesomeIcon icon={faArrowUp} /></a>
        </div>
      </footer>
=======
      <section className="services" id="services">
        services
      </section>
      <section className="contact" id="contact">
        contact
      </section>
>>>>>>> 0863bb9ec12d5eb0b459cb4fe7364321edac34c0
    </div>
  );
}

export default Home;
