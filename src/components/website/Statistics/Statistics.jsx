import "./Statistics.css";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaAward,
  FaSchool,
} from "react-icons/fa";

function Statistics() {
  const stats = [
    {
      icon: <FaUserGraduate />,
      number: "3500+",
      title: "Students",
    },
    {
      icon: <FaChalkboardTeacher />,
      number: "150+",
      title: "Teachers",
    },
    {
      icon: <FaAward />,
      number: "98%",
      title: "Board Results",
    },
    {
      icon: <FaSchool />,
      number: "25+",
      title: "Years of Excellence",
    },
  ];

  return (
    <section className="statistics">
      <div className="container">

        <div className="statistics-heading">
          <span>School Statistics</span>
          <h2>Our Achievements</h2>
          <p>
            We take pride in our academic excellence and overall development of students.
          </p>
        </div>

        <div className="statistics-grid">

          {stats.map((item, index) => (
            <div className="statistics-card" key={index}>

              <div className="statistics-icon">
                {item.icon}
              </div>

              <h3>{item.number}</h3>

              <h4>{item.title}</h4>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Statistics;