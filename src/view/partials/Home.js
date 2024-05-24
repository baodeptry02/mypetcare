import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../Components/firebase/firebase"; // Assuming you have a firebase config file
import { useNavigate } from "react-router-dom";
import { Typed } from "react-typed";

function Home() {
  const typedElement = useRef(null);
  const navigate = useNavigate();

  const book = () => {
    navigate("/book");
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
              <span ref={typedElement} className="multiple-text"></span>Service
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
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
      <section className="services" id="services">
        services
      </section>
      <section className="contact" id="contact">
        contact
      </section>
    </div>
  );
}

export default Home;
