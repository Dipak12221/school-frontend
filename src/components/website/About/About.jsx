import "./About.css";

function About() {
  return (
    <section className="about">
      <div className="container about-container">

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80"
            alt="School"
          />
        </div>

        <div className="about-content">

          <h5>About Our School</h5>

          <h2>
            Welcome To ABC Public School
          </h2>

          <p>
            ABC Public School is committed to providing quality education
            with modern teaching methods, experienced faculty, smart
            classrooms and excellent infrastructure.
          </p>

          <p>
            Our mission is to develop responsible citizens with strong
            academic knowledge, leadership qualities and moral values.
          </p>

          <div className="about-cards">

            <div className="about-card">
              <h3>20+</h3>
              <span>Years Experience</span>
            </div>

            <div className="about-card">
              <h3>3000+</h3>
              <span>Students</span>
            </div>

            <div className="about-card">
              <h3>120+</h3>
              <span>Teachers</span>
            </div>

          </div>

          <button className="about-btn">
            Read More
          </button>

        </div>

      </div>
    </section>
  );
}

export default About;