import "./Gallery.css";
import gallery from "../../../assets/data/gallery";

function Gallery() {
  return (
    <section className="gallery">
      <div className="container">

        <div className="section-heading">
          <span>School Gallery</span>
          <h2>Life At Our School</h2>
          <p>
            Explore moments of learning, celebrations, sports and achievements.
          </p>
        </div>

        <div className="gallery-grid">

          {gallery.map((item) => (

            <div className="gallery-card" key={item.id}>

              <img
                src={item.image}
                alt={item.title}
              />

              <div className="gallery-overlay">

                <h3>{item.title}</h3>

              </div>

            </div>

          ))}

        </div>

        <div className="gallery-btn">

          <button>
            View Full Gallery
          </button>

        </div>

      </div>
    </section>
  );
}

export default Gallery;