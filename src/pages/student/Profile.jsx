import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";
import studentData from "../../data/studentData";

import "./Profile.css";

function Profile() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <h1 className="page-title">Student Profile</h1>

          <div className="profile-container">

            {/* Left Profile Card */}

            <div className="profile-card">

              <img
                 src="/student.png"
                alt={studentData.name}
                 className="profile-image"
              />

              <h2>{studentData.name}</h2>

              <p>Class : {studentData.class}</p>

              <p>Roll No : {studentData.rollNo}</p>

              <p>Enrollment No : {studentData.enrollmentNo}</p>

              <p>Academic Year : {studentData.academicYear}</p>

            </div>

            {/* Right Details */}

            <div className="profile-details">

              <h2>Student Information</h2>

              <table>

                <tbody>

                  <tr>
                    <td>Name</td>
                    <td>{studentData.name}</td>
                  </tr>

                  <tr>
                    <td>Enrollment No</td>
                    <td>{studentData.enrollmentNo}</td>
                  </tr>

                  <tr>
                    <td>Class</td>
                    <td>{studentData.class}</td>
                  </tr>

                  <tr>
                    <td>Roll No</td>
                    <td>{studentData.rollNo}</td>
                  </tr>

                  <tr>
                    <td>Date of Birth</td>
                    <td>{studentData.dob}</td>
                  </tr>

                  <tr>
                    <td>Gender</td>
                    <td>{studentData.gender}</td>
                  </tr>

                  <tr>
                    <td>Blood Group</td>
                    <td>{studentData.bloodGroup}</td>
                  </tr>

                  <tr>
                    <td>Father's Name</td>
                    <td>{studentData.fatherName}</td>
                  </tr>

                  <tr>
                    <td>Mother's Name</td>
                    <td>{studentData.motherName}</td>
                  </tr>

                  <tr>
                    <td>Mobile</td>
                    <td>{studentData.mobile}</td>
                  </tr>

                  <tr>
                    <td>Email</td>
                    <td>{studentData.email}</td>
                  </tr>

                  <tr>
                    <td>Address</td>
                    <td>{studentData.address}</td>
                  </tr>

                  <tr>
                    <td>Admission Date</td>
                    <td>{studentData.admissionDate}</td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;