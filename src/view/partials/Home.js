import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../Components/firebase/firebase"; // Assuming you have a firebase config file
import { useNavigate } from "react-router-dom";
import Typed from "typed.js"; // Import Typed.js directly
import { ToastContainer, toast } from "react-toastify";
import emailjs from "emailjs-com";
import ScrollReveal from "scrollreveal";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
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
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useViewport from "../../hooks/useViewport";
import { getAllUsers } from "../account/getUserData";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const { width } = useViewport(); // Get the viewport width
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [loop, setLoop] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    if (width >= 1785) {
      setSlidesPerView(4);
    } else if (width >= 991 && width < 1600) {
      setSlidesPerView(3);
    } else if (width >= 600 && width < 991) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(1);
    }
  }, [width]);

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
          forceUpdate();
        },
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
              forceUpdate();
            },
          });
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send email.", {
            autoClose: 2000,
            onClose: () => {
              forceUpdate();
            },
          });
        }
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
  const homePage = () => {
    if (dropdownOpen) {
      setDropdownOpen(false); // Close dropdown if open
    }
    navigate("/#home");
  };
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const usersData = await getAllUsers();
        let allBookings = [];
          Object.keys(usersData).forEach((userId) => {
            const userData = usersData[userId];
            if (userData.bookings) {
              Object.keys(userData.bookings).forEach((bookingId) => {
                const booking = userData.bookings[bookingId];
                allBookings.push({
                  userId,
                  bookingId,
                  ...booking,
                });
              });
            }
          });

  
        setBookedSlots(allBookings);
      } catch (error) {
        console.error("Failed to fetch all bookings:", error);
      }
    };
  
    fetchAllBookings();
  }, [user]);


  useEffect(() => {
    const hasEnoughSlides = bookedSlots.length > slidesPerView;
    setLoop(hasEnoughSlides);
  }, [bookedSlots.length, slidesPerView]);

  const renderRatedBookings = () => {
    const ratedBookings = bookedSlots.filter(
      (booking) => booking.status === "Rated" && booking.rating > 3
    );

    return ratedBookings.map((booking, index) => (
      <SwiperSlide key={booking.id} virtualIndex={index}>
        <div className="testimonial-box">
          <img
            className="testimonial-avatar"
            src={booking.petOwner.avatar}
            alt="User Avatar"
          />
          <div className="testimonial-content">
            <div style={{ fontSize: "3rem", color: "var(--text-color)" }}>
              Rating:
            </div>
            <Box
              sx={{
                marginTop: "12px",
                width: 200,
                display: "flex",
                alignItems: "center",
                float: "right",
              }}
            >
              <Box sx={{ ml: 2, fontSize: "2rem", marginRight: "12px" }}>
                {booking.rating.toFixed(1)}
              </Box>
              <Rating
                name="read-only"
                value={booking.rating}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "gold",
                  },
                }}
              />
            </Box>
            <div className="testimonial-text">
              <div
                style={{
                  fontSize: "3rem",
                  color: "var(--text-color)",
                  marginBottom: "20px",
                  marginTop: "10px",
                }}
              >
                Review:
              </div>
              {booking.review}
            </div>
            <p className="testimonial-signature">
              {booking.petOwner.username}, {booking.pet.name}
            </p>
          </div>
        </div>
      </SwiperSlide>
    ));
  };

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
              srcSet="https://static.wixstatic.com/media/84770f_cc7fbf222d044cf09028f921a0cfe36e~mv2.png/v1/crop/x_0,y_0,w_5002,h_3009/fill/w_1163,h_699,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/shutterstock_184908566%20copy.png"
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
              srcSet="https://static.wixstatic.com/media/84770f_ec1b885cde544df1bf299c3d35749700~mv2_d_3848_3848_s_4_2.jpg/v1/fill/w_513,h_513,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_ec1b885cde544df1bf299c3d35749700~mv2_d_3848_3848_s_4_2.jpg"
              fetchpriority="high"
            ></img>
          </div>
          <div className="about-text" data-aos="fade-left">
            <span className="text-about">
            Awarded for outstanding creative vision and innovation in game direction and design.
            </span>
            <p className="font_1">
              <span className="text1-about">
              I am deeply honored to receive the "Veterinarians of the Year" award. 
              I sincerely thank the organizers and colleagues for their trust and votes. 
              Thank you to all pet owners for your continued trust and support. 
              I am committed to continuing my dedication to providing the best veterinary care services. 
              Sincerely, thank you!
              </span>
            </p>
          </div>
          
        </div>
        <div style={{ marginTop: "10px", marginRight: "700px" }}>
          <div className="name">Jonny Sin</div>
                <div className="title" style={{ marginBottom: "80px"}}>Sharp</div>
                </div>
        <div className="about-container2">
          <div className="about-text2" data-aos="fade-right">
            <span className="text-about2">
            There are also other doctors who have also made efforts this year
            </span>
          </div>
          <div className="testimonials-vet">
        <div className="testimonial-vet">
            <div className="quote">
                <p>"Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat ."</p>
            </div>
            <div className="profile">
                <img src="https://via.placeholder.com/80" alt="John Larson"/>
                <div className="name">John Larson</div>
                <div className="title">Entrepreneur</div>
            </div>
        </div>
        <div className="testimonial-vet">
            <div className="quote">
                <p>"Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper."</p>
            </div>
            <div className="profile">
                <img src="https://via.placeholder.com/80" alt="Saul Goodman"/>
                <div className="name">Saul Goodman</div>
                <div className="title">CEO & Founder</div>
            </div>
        </div>
        <div className="testimonial-vet">
            <div className="quote">
                <p>"Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa."</p>
            </div>
            <div className="profile">
                <img src="https://via.placeholder.com/80" alt="Sara Wilsson"/>
                <div className="name">Sara Wilsson</div>
                <div className="title">Designer</div>
            </div>
        </div>
    </div>
        </div>
        <div className="font_2" data-aos="zoom-in-up">
          <h3>What Our Happy Clients Say</h3>
        </div>
        <div>
          <div className="testimonial-container" data-aos="fade-up">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={50}
              slidesPerView={slidesPerView}
              loop={loop}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
            >
              {renderRatedBookings()}
            </Swiper>
          </div>
        </div>
      </section>
      <section className="services" id="services">
        <div className="font_3" data-aos="zoom-in-down">
          <h3 style={{ marginTop: "68px" }}>
            Your pet deserves to be pampered!
          </h3>
        </div>
        <div className="big-line"></div>

        <div className="card-container">
          <div className="card" data-aos="fade-right" onClick={book}>
            <h2>GROOMING</h2>

            <p>
              This service includes bathing, hair cutting and eye cleaning,
              combing, and skin examinations, requiring the groomer to
              understand the pet's temperament.
            </p>
            <img
              className="card-avatar"
              src="https://bpanimalhospital.com/wp-content/uploads/shutterstock_1547371985.jpg"
              alt="User Avatar"
            />
            <div className="pricing">30 min: $21.00 | 60 min: $36.00</div>
          </div>
          <div className="card" data-aos="fade-up" onClick={book}>
            <h2>CHECK UP</h2>

            <p>
              This service involves a comprehensive physical examination of the
              pet's body, including measurements of temperature, blood pressure,
              heart rate and weight
            </p>
            <img
              className="card-avatar"
              src="https://www.cherrycreekvet.com/blog/wp-content/uploads/2024/03/iStock-1445008380-3-1-2000x1333.jpg"
              alt="User Avatar"
            />
            <div className="pricing">$50.00</div>
          </div>
          <div className="card" data-aos="fade-left" onClick={book}>
            <h2>Vaccination</h2>

            <p>
              Pet immunizations are crucial for preventative pet healthcare,
              protecting against harmful illnesses, and are widely discussed
              among veterinarians and pet owners
            </p>
            <img
              className="card-avatar"
              src="https://media.istockphoto.com/id/966384466/vi/anh/c%E1%BA%AFt-h%C3%ACnh-%E1%BA%A3nh-ng%C6%B0%E1%BB%9Di-%C4%91%C3%A0n-%C3%B4ng-c%E1%BA%A7m-beagle-trong-khi-b%C3%A1c-s%C4%A9-th%C3%BA-y-ti%C3%AAm-b%E1%BA%B1ng-%E1%BB%91ng-ti%C3%AAm-v%C3%A0o-n%C3%B3.jpg?s=612x612&w=0&k=20&c=ViUs_0PoS5B26q7ScYHNx21sj8hMlcburn_H_aREbSM="
              alt="User Avatar"
            />
            <div className="pricing">$36.00</div>
          </div>
          <div className="card" data-aos="fade-right" onClick={book}>
            <h2>PET VETERINARY</h2>

            <p>
              This service offers complete medical care for animals, including
              the identification and management of diseases, traumas, and other
              health issues.
            </p>
            <img
              className="card-avatar"
              src="https://media.istockphoto.com/id/1171733307/vi/anh/b%C3%A1c-s%C4%A9-th%C3%BA-y-v%E1%BB%9Bi-ch%C3%B3-v%C3%A0-m%C3%A8o-ch%C3%B3-con-v%C3%A0-m%C3%A8o-con-t%E1%BA%A1i-b%C3%A1c-s%C4%A9.jpg?s=612x612&w=0&k=20&c=eZRCsHMznU16Nr89IkT6ETLH3Enzt9TwBUx4mIxZhzE="
              alt="User Avatar"
            />
            <div className="pricing">30 min: $21.00 | 60 min: $36.00</div>
          </div>
        </div>
        <div className="font_4" data-aos="flip-up">
          <h3>Pet Moment!</h3>
        </div>
        <div className="big-line"></div>
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
            className="round-image"
            style={{
              width: "179px",
              height: "178px",
              objectFit: "fill",
              marginLeft: "-200px",
            }}
            width="479"
            height="478"
            srcSet="https://static.wixstatic.com/media/84770f_346b425b1fe54554a98a4425fa8333cb~mv2_d_3760_3760_s_4_2.jpg/v1/fill/w_599,h_599,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_346b425b1fe54554a98a4425fa8333cb~mv2_d_3760_3760_s_4_2.jpg"
            fetchpriority="high"
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
              transform:
                "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
              transformStyle: "preserve-3d",
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
            <a
              href="#home"
              onClick={homePage}
              className="logo"
              style={{ textDecoration: "none", color: "#7b2cbf" }}
            >
              <FontAwesomeIcon icon={faPaw} /> Pet Center
            </a>
            <div className="footer-info">
              <p>Address: Nha Van Hoa Sinh Vien Lang Dai Hoc Thu Duc</p>
              <p>Hotline: 0762 029 029</p>
              <p>Email: xxxxx@hotmail.com</p>
            </div>
            <div className="footer-title">
              Continuously improve service quality and level of expertise
              Bringing customers the most perfect services...
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
