import "./ChairmanMessage.css";

function ChairmanMessage() {
  return (
    <section className="chairman">
      <div className="container chairman-container">
        {/* Left Content */}

        <div className="chairman-content">
          <span className="section-title">Chairman's Message</span>

          <h2>Message From Our Chairman</h2>

          <p>Dear Parents, Students and Well Wishers,</p>

          <p>
            At R.B.G Public School, we believe education is the strongest
            foundation for a successful future. Our vision is to provide
            students with quality education supported by modern technology,
            experienced teachers and strong moral values.
          </p>

          <p>
            We continuously strive to create an environment where every student
            discovers their potential, develops confidence and becomes a
            responsible citizen.
          </p>

          <h4>Mr. Amit Sharma</h4>

          <span>Chairman</span>
        </div>

        {/* Right Image */}

        <div className="chairman-image">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
            alt="Chairman"
          />
        </div>
      </div>
    </section>
  );
}

export default ChairmanMessage;
