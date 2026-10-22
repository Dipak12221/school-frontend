import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";

import transportData from "../../data/transportData";

import "./Transport.css";

function Transport() {

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <h1 className="page-title">
            Transport Details
          </h1>

          <div className="transport-card">

            <div className="transport-row">
              <strong>🚌 Bus Number</strong>
              <span>{transportData.busNo}</span>
            </div>

            <div className="transport-row">
              <strong>🛣 Route</strong>
              <span>{transportData.route}</span>
            </div>

            <div className="transport-row">
              <strong>👨‍✈️ Driver</strong>
              <span>{transportData.driverName}</span>
            </div>

            <div className="transport-row">
              <strong>📞 Contact</strong>
              <span>{transportData.driverPhone}</span>
            </div>

            <div className="transport-row">
              <strong>📍 Pickup Point</strong>
              <span>{transportData.pickupPoint}</span>
            </div>

            <div className="transport-row">
              <strong>⏰ Pickup Time</strong>
              <span>{transportData.pickupTime}</span>
            </div>

            <div className="transport-row">
              <strong>🏫 Drop Time</strong>
              <span>{transportData.dropTime}</span>
            </div>

            <div className="transport-row">
              <strong>🚍 Vehicle</strong>
              <span>{transportData.vehicleType}</span>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Transport;