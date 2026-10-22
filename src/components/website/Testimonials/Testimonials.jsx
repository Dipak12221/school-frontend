import "./Testimonials.css";
import testimonials from "../../../assets/data/testimonials";
import { FaStar } from "react-icons/fa";

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">

        <div className="section-heading">
          <span>Testimonials</span>
          <h2>What Parents & Students Say</h2>
          <p>
            Hear from our students and parents about their experience with our school.
          </p>
        </div>

        <div className="testimonial-grid">

          {testimonials.map((item) => (

            <div className="testimonial-card" key={item.id}>

              <img src={item.image} alt={item.name} />

              <h3>{item.name}</h3>

              <span>{item.role}</span>

              <div className="rating">

                {[...Array(item.rating)].map((_, index) => (
                  <FaStar key={index} />
                ))}

              </div>

              <p>{item.review}</p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;