import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";

import settingsData from "../../data/settingsData";

import "./Settings.css";

function Settings() {

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <h1 className="page-title">

            Account Settings

          </h1>

          <div className="settings-card">

            <div className="profile-photo">

              <img src="/logo.png" alt="Student" />

              <button>
                Change Photo
              </button>

            </div>

            <div className="settings-form">

              <div className="form-group">

                <label>Student Name</label>

                <input
                  type="text"
                  defaultValue={settingsData.name}
                />

              </div>

              <div className="form-group">

                <label>Email</label>

                <input
                  type="email"
                  defaultValue={settingsData.email}
                />

              </div>

              <div className="form-group">

                <label>Phone</label>

                <input
                  type="text"
                  defaultValue={settingsData.phone}
                />

              </div>

              <div className="form-group">

                <label>Class</label>

                <input
                  type="text"
                  defaultValue={settingsData.class}
                  disabled
                />

              </div>

              <div className="form-group">

                <label>Roll No</label>

                <input
                  type="text"
                  defaultValue={settingsData.rollNo}
                  disabled
                />

              </div>

              <hr />

              <h3>Change Password</h3>

              <div className="form-group">

                <label>Current Password</label>

                <input
                  type="password"
                  placeholder="Enter Current Password"
                />

              </div>

              <div className="form-group">

                <label>New Password</label>

                <input
                  type="password"
                  placeholder="Enter New Password"
                />

              </div>

              <div className="form-group">

                <label>Confirm Password</label>

                <input
                  type="password"
                  placeholder="Confirm New Password"
                />

              </div>

              <div className="notification">

                <input type="checkbox" />

                <span>
                  Receive Email Notifications
                </span>

              </div>

              <button className="save-btn">

                Save Changes

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Settings;