import "./Contact.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

function Contact() {
  return (
    <section className="contact">
      <div className="container">

        <div className="section-heading">
          <span>Contact Us</span>
          <h2>Get In Touch</h2>
          <p>
            We'd love to hear from you. Feel free to contact us anytime.
          </p>
        </div>

        <div className="contact-wrapper">

          {/* Left */}

          <div className="contact-info">

            <div className="info-box">
              <FaMapMarkerAlt />
              <div>
                <h3>Address</h3>
                <p>Your School Address, Bihar, India</p>
              </div>
            </div>

            <div className="info-box">
              <FaPhoneAlt />
              <div>
                <h3>Phone</h3>
                <p>+91 9876543210</p>
              </div>
            </div>

            <div className="info-box">
              <FaEnvelope />
              <div>
                <h3>Email</h3>
                <p>info@yourschool.com</p>
              </div>
            </div>

          </div>

          {/* Right */}

          <form className="contact-form">

            <input
              type="text"
              placeholder="Your Name"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              rows="6"
              placeholder="Your Message"
            ></textarea>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Contact;