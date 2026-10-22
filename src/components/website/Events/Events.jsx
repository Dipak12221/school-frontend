import "./Events.css";
import events from "../../../assets/data/events";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

function Events() {
  return (
    <section className="events">
      <div className="container">

        <div className="section-heading">
          <span>School Events</span>
          <h2>Upcoming Events</h2>
          <p>
            Participate in our educational, cultural and sports activities.
          </p>
        </div>

        <div className="events-grid">

          {events.map((event) => (
            <div className="event-card" key={event.id}>

              <div className="event-date">
                <FaCalendarAlt />
                <span>{event.date}</span>
              </div>

              <h3>{event.title}</h3>

              <p>
                <FaMapMarkerAlt /> {event.location}
              </p>

              <button>
                Read More
              </button>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Events;