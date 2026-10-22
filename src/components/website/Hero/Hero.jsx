import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="container hero-content">

          <h4>Welcome To</h4>

          <h1>
            ABC PUBLIC SCHOOL
          </h1>

          <p>
            Affiliated to CBSE | Excellence in Education | Building Future Leaders
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Online Admission
            </button>

            <button className="secondary-btn">
              Explore More
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;