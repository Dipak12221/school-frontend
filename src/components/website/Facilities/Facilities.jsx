import "./Facilities.css";

import {
  FaLaptopCode,
  FaBook,
  FaBus,
  FaFlask,
  FaBasketballBall,
  FaChalkboardTeacher,
} from "react-icons/fa";

function Facilities() {
  const facilities = [
    {
      icon: <FaLaptopCode />,
      title: "Computer Lab",
      description: "Modern computer laboratory with high-speed internet.",
    },
    {
      icon: <FaBook />,
      title: "Library",
      description: "Thousands of books, journals and digital resources.",
    },
    {
      icon: <FaFlask />,
      title: "Science Lab",
      description: "Well-equipped Physics, Chemistry and Biology labs.",
    },
    {
      icon: <FaBus />,
      title: "Transport",
      description: "Safe and GPS-enabled school bus facility.",
    },
    {
      icon: <FaBasketballBall />,
      title: "Sports",
      description: "Indoor and outdoor sports with professional coaching.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Smart Classes",
      description: "Interactive digital classrooms for better learning.",
    },
  ];

  return (
    <section className="facilities">
      <div className="container">

        <div className="section-heading">
          <span>Our Facilities</span>
          <h2>World Class Infrastructure</h2>
          <p>
            We provide modern facilities that help students grow academically,
            physically and socially.
          </p>
        </div>

        <div className="facility-grid">

          {facilities.map((facility, index) => (
            <div className="facility-card" key={index}>

              <div className="facility-icon">
                {facility.icon}
              </div>

              <h3>{facility.title}</h3>

              <p>{facility.description}</p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Facilities;