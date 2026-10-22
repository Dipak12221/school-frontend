import "./PrincipalMessage.css";

function PrincipalMessage() {
  return (
    <section className="principal">
      <div className="container principal-container">

        {/* Left Side - Principal Image */}

        <div className="principal-image">

          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
            alt="Principal"
          />

        </div>

        {/* Right Side - Message */}

        <div className="principal-content">

          <span className="section-title">
            Principal's Message
          </span>

          <h2>Message From Our Principal</h2>

          <p>
            Dear Students, Parents and Visitors,
          </p>

          <p>
            Welcome to ABC Public School. Our mission is to provide
            quality education that inspires students to become lifelong
            learners and responsible citizens.
          </p>

          <p>
            We focus on academic excellence, discipline, creativity,
            leadership and character development so every child can
            achieve his or her full potential.
          </p>

          <h4>Dr. Rajesh Kumar</h4>

          <span>Principal</span>

        </div>

      </div>
    </section>
  );
}

export default PrincipalMessage;