import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../Components/firebase/firebase"; // Assuming you have a firebase config file
import { useNavigate } from "react-router-dom";
import Typed from "typed.js"; // Import Typed.js directly
import { ToastContainer, toast } from "react-toastify";
import emailjs from "emailjs-com";
import ScrollReveal from "scrollreveal";
import Aos from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useForceUpdate from "../../hooks/useForceUpdate";

function Home() {
  const typedElement = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const form = useRef();
  const [userName, setUserName] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;
  const [backgroundImage, setBackgroundImage] = useState("");
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    const currentImage = document.querySelector(
      `.list-images .slide:nth-child(${currentSlide + 1}) img`
    );
    if (currentImage) {
      setBackgroundImage(currentImage.src);
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  const currentSlideHandler = (n) => {
    setCurrentSlide(n - 1);
  };

  useEffect(() => {
    Aos.init({
      duration: 1000,
      easing: "ease",
      once: true,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const book = () => {
    if (user) {
      navigate("/book/select-pet");
    } else {
      navigate("/signIn");
      toast.error("Please log in first to continue your booking!", {
        autoClose: 2000,
        onClose: () => {
          forceUpdate()
        }
      });
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    formData.append("to_name", userName);
    emailjs
      .sendForm(
        "service_9sprp0p",
        "template_pz8ey59",
        form.current,
        "gWym0COHJFeyRWp5M"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Email sent successfully!", {
            autoClose: 2000,
            onClose: () => {
              forceUpdate()
            }
          })
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send email.", {
            autoClose: 2000,
            onClose: () => {
              forceUpdate()
            }
          })
        },
      );

    e.target.reset();
  };

  useEffect(() => {
    const options = {
      strings: ["Grooming", "Healthcare", "Daycare", "Bathing"],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 400,
      loop: true,
    };

    const typed = new Typed(typedElement.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  useEffect(() => {
    ScrollReveal().reveal(".home-content, .heading", {
      origin: "top",
      distance: "80px",
      duration: 2000,
      delay: 200,
    });
    ScrollReveal().reveal(
      ".home-img, .services-container, .portfolio-box, .contact form",
      { origin: "bottom", distance: "80px", duration: 2000, delay: 200 }
    );
    ScrollReveal().reveal(".home-container h1, .about-img", {
      origin: "left",
      distance: "80px",
      duration: 2000,
      delay: 200,
    });
    ScrollReveal().reveal(".home-container p, .about-content", {
      origin: "right",
      distance: "80px",
      duration: 2000,
      delay: 200,
    });
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
              src="https://static.wixstatic.com/media/84770f_cc7fbf222d044cf09028f921a0cfe36e~mv2.png/v1/crop/x_0,y_0,w_5002,h_3009/fill/w_1163,h_699,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/shutterstock_184908566%20copy.png"
              alt=""
              width="2400"
              height="559"
              srcset="https://static.wixstatic.com/media/84770f_cc7fbf222d044cf09028f921a0cfe36e~mv2.png/v1/crop/x_0,y_0,w_5002,h_3009/fill/w_1163,h_699,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/shutterstock_184908566%20copy.png"
              fetchpriority="high"
            ></img>
          </div>
        </section>
      </div>
      <section className="about" id="about">
        <div className="font_0" data-aos="fade-in">
          <h3>Hi, I'm Dr. Mark Edwards</h3>
        </div>

        <div className="about-container">
          <div className="about-image" data-aos="fade-right">
            <img
              className="img-about"
              src="https://static.wixstatic.com/media/84770f_ec1b885cde544df1bf299c3d35749700~mv2_d_3848_3848_s_4_2.jpg/v1/fill/w_513,h_513,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_ec1b885cde544df1bf299c3d35749700~mv2_d_3848_3848_s_4_2.jpg"
              alt=""
              width="410"
              height="410"
              srcset="https://static.wixstatic.com/media/84770f_ec1b885cde544df1bf299c3d35749700~mv2_d_3848_3848_s_4_2.jpg/v1/fill/w_513,h_513,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_ec1b885cde544df1bf299c3d35749700~mv2_d_3848_3848_s_4_2.jpg"
              fetchpriority="high"
            ></img>
          </div>
          <div className="about-text" data-aos="fade-left">
            <span className="text-about">
              Over 16 Years of Veterinary Experience
            </span>
            <p className="font_1">
              <span className="text1-about">
                I'm a paragraph. Click here to add your own text and edit me.
                It’s easy. Just click “Edit Text” or double click me to add your
                own content and make changes to the font. Feel free to drag and
                drop me anywhere you like on your page. I’m a great place for
                you to tell a story and let your users know a little more about
                you.
              </span>
            </p>

            <span className="text2-about">
              This is a great space to write long text about your company and
              your services. You can use this space to go into a little more
              detail about your company. Talk about your team and what services
              you provide. Tell your visitors the story of how you came up with
              the idea for your business and what makes you different from your
              competitors.
            </span>
          </div>
        </div>
        <div className="about-container">
          <div className="about-text2" data-aos="fade-right">
            <span className="text-about">
              Over 16 Years of Veterinary Experience
            </span>
            <p className="font_1">
              <span className="text1-about">
                I'm a paragraph. Click here to add your own text and edit me.
                It’s easy. Just click “Edit Text” or double click me to add your
                own content and make changes to the font. Feel free to drag and
                drop me anywhere you like on your page. I’m a great place for
                you to tell a story and let your users know a little more about
                you.
              </span>
            </p>

            <span className="text2-about">
              This is a great space to write long text about your company and
              your services. You can use this space to go into a little more
              detail about your company. Talk about your team and what services
              you provide. Tell your visitors the story of how you came up with
              the idea for your business and what makes you different from your
              competitors.
            </span>
          </div>
          <div className="about-image2" data-aos="fade-left">
            <img
              className="img-about"
              src="https://static.wixstatic.com/media/84770f_e57bb42011fe4e91992f1ceeece2a7b3~mv2_d_4000_3947_s_4_2.jpg/v1/fill/w_526,h_519,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_e57bb42011fe4e91992f1ceeece2a7b3~mv2_d_4000_3947_s_4_2.jpg"
              fetchpriority="high"
            ></img>
          </div>
        </div>
        <div className="font_2" data-aos="zoom-in-up">
          <h3>What Our Happy Clients Say</h3>
        </div>
        <div class="testimonial-container" data-aos="fade-up">
          <div class="testimonial-box">
            <img
              class="testimonial-avatar"
              src="https://static.wixstatic.com/media/c837a6_5a8f08d69ed14df69f51095a389122ea~mv2.png/v1/fill/w_113,h_113,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/test_3_2.png"
              alt="User Avatar"
            />
            <div class="testimonial-content">
              <p class="testimonial-text">
                “I'm a testimonial. Click to edit me and add text that says
                something nice about you and your services.”
              </p>
              <p class="testimonial-signature">Dani, Pacific Heights</p>
            </div>
          </div>
          <div class="testimonial-box2" data-aos="fade-up" data-aos-delay="400">
            <img
              class="testimonial-avatar2"
              src="https://static.wixstatic.com/media/c837a6_05f52a6820f34cba9902e759b418b5b6~mv2.png/v1/fill/w_113,h_113,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/test_1.png"
              alt="User Avatar"
            />
            <div class="testimonial-content2">
              <p class="testimonial-text2">
                “I'm a testimonial. Click to edit me and add text that says
                something nice about you and your services.”
              </p>
              <p class="testimonial-signature2">Dani, Pacific Heights</p>
            </div>
          </div>
          <div class="testimonial-box3" data-aos="fade-up" data-aos-delay="800">
            <img
              class="testimonial-avatar3"
              src="https://static.wixstatic.com/media/c837a6_6a568fac61d1476898f4ea6cccbef66c~mv2.png/v1/fill/w_118,h_113,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/test_2.png"
              alt="User Avatar"
            />
            <div class="testimonial-content3">
              <p class="testimonial-text3">
                “I'm a testimonial. Click to edit me and add text that says
                something nice about you and your services.”
              </p>
              <p class="testimonial-signature3">Dani, Pacific Heights</p>
            </div>
          </div>
        </div>
      </section>
      <section className="services" id="services">
        <div className="font_3" data-aos="zoom-in-down">
          <h3 style={{ marginTop: "68px" }}>
            Your pet deserves to be pampered!
          </h3>
        </div>
        <div class="big-line"></div>

        <div class="card-container">
          <div class="card" data-aos="fade-right">
            <img
              class="card-avatar"
              src="https://bpanimalhospital.com/wp-content/uploads/shutterstock_1547371985.jpg"
              alt="User Avatar"
            />
            <h2>GROOMING</h2>
            <div class="line"></div>
            <p>
              I'm a paragraph. Click here to add your own text and edit me. It’s
              easy. Just click “Edit Text” or double click me to add your own
              content and make changes to the font. I’m a great place for you to
              tell a story and let your users know a little more about you.
            </p>
            <div class="pricing">30 min: $21.00 | 60 min: $36.00</div>
            <a onClick={book} className="card-btn">
              Book now
            </a>
          </div>
          <div class="card" data-aos="fade-up">
            <img
              class="card-avatar"
              src="https://www.cherrycreekvet.com/blog/wp-content/uploads/2024/03/iStock-1445008380-3-1-2000x1333.jpg"
              alt="User Avatar"
            />
            <h2>HEALTH CARE</h2>
            <div class="line"></div>
            <p>
              I'm a paragraph. Click here to add your own text and edit me. It’s
              easy. Just click “Edit Text” or double click me to add your own
              content and make changes to the font. I’m a great place for you to
              tell a story and let your users know a little more about you.
            </p>
            <div class="pricing">30 min: $21.00 | 60 min: $36.00</div>
            <a onClick={book} className="card-btn">
              Book now
            </a>
          </div>
          <div class="card" data-aos="fade-left">
            <img
              class="card-avatar"
              src="https://www.bupa.com.au/healthlink/-/media/project/ncs/ncs-images/family-and-pregnancy/pets/5-golden-rules-for-dog-training/5-golden-rules-for-dog-training-body-1.ashx?mw=1920&hash=13980CBC1F3AF395E28CBEA282002950&h=590&w=886&la=en"
              alt="User Avatar"
            />
            <h2>DAYCARE</h2>
            <div class="line"></div>
            <p>
              I'm a paragraph. Click here to add your own text and edit me. It’s
              easy. Just click “Edit Text” or double click me to add your own
              content and make changes to the font. I’m a great place for you to
              tell a story and let your users know a little more about you.
            </p>
            <div class="pricing">30 min: $21.00 | 60 min: $36.00</div>
            <a onClick={book} className="card-btn">
              Book now
            </a>
          </div>
        </div>
        <div className="font_4" data-aos="flip-up">
          <h3>Pet Moment!</h3>
        </div>
        <div class="big-line"></div>
        <div className="slide-show-container">
          <div
            className="slide-show-background"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="slide-show">
            <div
              className="list-images"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <div className="slide">
                <div className="image-wrapper">
                  <img src="https://thuythithi.com/wp-content/uploads/2020/03/tim-bac-si-thu-y-uy-tin-chua-benh-cho-cho-meo-tai-tp-hcm.jpg"></img>
                </div>
              </div>
              <div className="slide">
                <div className="image-wrapper">
                  <img src="https://thuythithi.com/wp-content/uploads/2020/03/doi-ngay-bac-si-thu-y-khi-thay-nhung-dau-hieu-sau-de-thu-cung-cua-ban-luon-khoe-manh.jpg"></img>
                </div>
              </div>
              <div className="slide">
                <div className="image-wrapper">
                  <img src="https://media.istockphoto.com/id/1371820919/vi/anh/y-t%C3%A1-tr%E1%BA%BB-nh%C3%ACn-labrador.jpg?s=612x612&w=0&k=20&c=FMAM4UXefhcSVe82TTvMNEh8HtR7hIUjshzEK4e5Hd4="></img>
                </div>
              </div>
              <div className="slide">
                <div className="image-wrapper">
                  <img src="https://ttol.vietnamnetjsc.vn/images/2019/01/27/21/51/photo-1-15485795786021781044006.jpg"></img>
                </div>
              </div>
              <div className="slide">
                <div className="image-wrapper">
                  <img src="https://media.istockphoto.com/id/1044460686/vi/anh/b%C3%A1c-s%C4%A9-s%E1%BB%AD-d%E1%BB%A5ng-%E1%BB%91ng-nghe-tr%C3%AAn-m%E1%BB%99t-con.jpg?s=612x612&w=0&k=20&c=gbP097Z9ZDOzN2v_a7SVAmDYO2aZsGKmsRf5wCyHkHo="></img>
                </div>
              </div>
              <div className="slide">
                <div className="image-wrapper">
                  <img src="https://media.istockphoto.com/id/1303833920/vi/anh/nam-b%C3%A1c-s%C4%A9-th%C3%BA-y-ki%E1%BB%83m-tra-ch%C3%B3-t%E1%BA%A1i-ph%C3%B2ng-kh%C3%A1m-th%C3%BA-y.jpg?s=612x612&w=0&k=20&c=JpWoIV99ZHVm-jLZn_p2rSlSQ0MPqdQzB-QmXAmwnjQ="></img>
                </div>
              </div>
            </div>
            <div className="button-slide">
              <button className="prev" onClick={prevSlide}>
                &#10094;
              </button>
              <button className="next" onClick={nextSlide}>
                &#10095;
              </button>
            </div>
            <div className="dot-container">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => currentSlideHandler(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="contact" id="contact">
        <div className="question">
          <img
            src="https://static.wixstatic.com/media/84770f_346b425b1fe54554a98a4425fa8333cb~mv2_d_3760_3760_s_4_2.jpg/v1/fill/w_599,h_599,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_346b425b1fe54554a98a4425fa8333cb~mv2_d_3760_3760_s_4_2.jpg"
            alt=""
            class="round-image"
            style={{
              width: "179px",
              height: "178px",
              objectFit: "fill",
              marginLeft: "-200px",
            }}
            width="479"
            height="478"
            srcSet="https://static.wixstatic.com/media/84770f_346b425b1fe54554a98a4425fa8333cb~mv2_d_3760_3760_s_4_2.jpg/v1/fill/w_599,h_599,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_346b425b1fe54554a98a4425fa8333cb~mv2_d_3760_3760_s_4_2.jpg"
            fetchPriority="high"
          />
          <div className="quick-question" data-aos="flip-left">
            <p className="quick-question1">
              1. Has your pet had problems with eating recently?
            </p>
            <p className="quick-answer1">
              Yes, my pets have changed their food intake, they don't eat it all
              like before.
            </p>
            <p className="quick-question2">
              2. Does the pet show any abnormalities in behavior or health?
            </p>
            <p className="quick-answer1">
              Yes, my pet has been vomiting and showing signs of fatigue for the
              past few days.
            </p>
            <p className="quick-question3">
              3. Has your pet had any problems recently?{" "}
            </p>
            <p className="quick-answer1">
              No, my pet has not had any problems recently.
            </p>
          </div>
          <img
  className="image-70"
  src="https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/6353420dafc1661ee0ee3b4e_pet%20insurance%20(2).png"
  alt="Petotum"
  style={{
    opacity: 1,
    transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
    transformStyle: 'preserve-3d'
  }}
  sizes="(max-width: 479px) 100vw, (max-width: 767px) 83vw, (max-width: 991px) 85vw, (max-width: 1600px) 45vw, 1000px"
  data-w-id="abefafda-0c43-e7a4-fa4b-7ff2c7fd5cc9"
  loading="lazy"
  srcSet="https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/6353420dafc1661ee0ee3b4e_pet%20insurance%20(2)-p-500.png 500w, https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/6353420dafc1661ee0ee3b4e_pet%20insurance%20(2)-p-800.png 800w, https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/6353420dafc1661ee0ee3b4e_pet%20insurance%20(2)-p-1080.png 1080w, https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/6353420dafc1661ee0ee3b4e_pet%20insurance%20(2)-p-1600.png 1600w, https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/6353420dafc1661ee0ee3b4e_pet%20insurance%20(2)-p-2000.png 2000w, https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/6353420dafc1661ee0ee3b4e_pet%20insurance%20(2).png 2880w"
/>
        </div>
        <div className="form-contact" data-aos="flip-right">
          <h2 className="heading">
            Contact <span className="us">Us!</span>
          </h2>
          <form ref={form} onSubmit={sendEmail}>
            <div className="input-box">
              <input
                type="text"
                name="from_name"
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="from_email"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="input-box">
              <input
                type="number"
                name="from_phone"
                placeholder="Mobile Number"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Your Address"
                required
              />
            </div>
            <textarea
              name="message"
              cols="30"
              rows="10"
              placeholder="Your Message"
              required
            ></textarea>
            <input type="submit" value="Send Message" className="btn" />
          </form>
        </div>

      </section>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-info">
              <p>Address: Nha Van Hoa Sinh Vien Lang Dai Hoc Thu Duc</p>
              <p>Hotline: 0762 029 029</p>
              <p>Email: xxxxx@hotmail.com</p>
            </div>
            <div className="footer-title">
              Không ngừng nâng cao chất lượng phục vụ, nâng tầm chuyên môn để
              mang đến quý khách hàng những dịch vụ hoàn hảo nhất...
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
      </footer>
    </div>
  );
}

export default Home;
