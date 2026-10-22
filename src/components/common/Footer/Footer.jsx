import "./Footer.css";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="container footer-grid">

        <div>

          <h2>ABC Public School</h2>

          <p>
            Quality Education for a Better Tomorrow.
          </p>

        </div>

        <div>

          <h3>Quick Links</h3>

          <ul>

            <li>Home</li>

            <li>About</li>

            <li>Admission</li>

            <li>Gallery</li>

            <li>Contact</li>

          </ul>

        </div>

        <div>

          <h3>Contact</h3>

          <p>📞 +91 9876543210</p>

          <p>📧 info@yourschool.com</p>

          <p>📍 Bihar, India</p>

        </div>

        <div>

          <h3>Follow Us</h3>

          <div className="social-icons">

            <FaFacebookF />

            <FaInstagram />

            <FaYoutube />

            <FaTwitter />

          </div>

        </div>

      </div>

      <div className="copyright">

        © 2026 ABC Public School. All Rights Reserved.

      </div>

    </footer>
  );
}

export default Footer;