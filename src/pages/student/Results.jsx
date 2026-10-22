import { FaDownload } from "react-icons/fa";

import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";

import resultData from "../../data/resultData";

import "./Results.css";
import { jsPDF } from "jspdf";
import studentData from "../../data/studentData";

function Results() {
const downloadMarksheet = () => {

  const doc = new jsPDF();

  // ================= School Header =================

  doc.setFontSize(20);
  doc.text("ABC Public School", 65, 20);

  doc.setFontSize(16);
  doc.text("Student Marksheet", 72, 30);

  // ================= Student Information =================

  doc.setFontSize(12);

  doc.text(`Student Name : ${studentData.name}`, 20, 50);
  doc.text(`Enrollment No : ${studentData.enrollmentNo}`, 20, 60);
  doc.text(`Class : ${studentData.class}`, 20, 70);
  doc.text(`Roll No : ${studentData.rollNo}`, 20, 80);

  // ================= Exam Information =================

  doc.text(`Exam : ${resultData.exam}`, 20, 95);
  doc.text(`Total Marks : ${resultData.totalMarks}`, 20, 105);
  doc.text(`Obtained Marks : ${resultData.obtainedMarks}`, 20, 115);
  doc.text(`Percentage : ${resultData.percentage}`, 20, 125);
  doc.text(`Grade : ${resultData.grade}`, 20, 135);
  doc.text(`Result : ${resultData.result}`, 20, 145);

  // ================= Subject Table =================

  let y = 165;

  doc.setFontSize(13);

  doc.text("Subject", 20, y);
  doc.text("Marks", 90, y);
  doc.text("Grade", 155, y);

  y += 10;

  doc.setFontSize(12);

  resultData.subjects.forEach((subject) => {

    doc.text(subject.subject, 20, y);

    doc.text(`${subject.marks}/${subject.total}`, 90, y);

    doc.text(subject.grade, 155, y);

    y += 10;

  });

  // ================= Footer =================

  y += 20;

  doc.text("Principal Signature", 140, y);

  doc.save("Marksheet.pdf");

};
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          {/* ================= Page Title ================= */}

          <h1 className="page-title">
            Result Management
          </h1>

          <h2 className="exam-title">
            {resultData.exam}
          </h2>

          {/* ================= Result Summary ================= */}

          <div className="result-summary">

            <div className="result-card total">
              <h3>Total Marks</h3>
              <h2>{resultData.totalMarks}</h2>
            </div>

            <div className="result-card obtained">
              <h3>Obtained Marks</h3>
              <h2>{resultData.obtainedMarks}</h2>
            </div>

            <div className="result-card percentage">
              <h3>Percentage</h3>
              <h2>{resultData.percentage}</h2>
            </div>

            <div className="result-card grade">
              <h3>Grade</h3>
              <h2>{resultData.grade}</h2>
            </div>

            <div className="result-card status">
              <h3>Result</h3>
              <h2
                className={
                  resultData.result === "PASS"
                    ? "pass-status"
                    : "fail-status"
                }
              >
                {resultData.result}
              </h2>
            </div>

          </div>

          {/* ================= Subject Wise Result ================= */}

          <div className="result-table">

            <h2>Subject Wise Result</h2>

            <table>

              <thead>

                <tr>
                  <th>Subject</th>
                  <th>Obtained</th>
                  <th>Maximum</th>
                  <th>Grade</th>
                </tr>

              </thead>

              <tbody>

                {resultData.subjects.map((subject, index) => (

                  <tr key={index}>

                    <td>{subject.subject}</td>

                    <td>{subject.marks}</td>

                    <td>{subject.total}</td>

                    <td>{subject.grade}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= Final Result ================= */}

          <div className="final-result">

            <h2>

              Final Result :

              <span
                className={
                  resultData.result === "PASS"
                    ? "pass-status"
                    : "fail-status"
                }
              >
                {" "}
                {resultData.result}
              </span>

            </h2>

            <button
              className="marksheet-btn"
              onClick={downloadMarksheet}
            >
              <FaDownload />
              Download Marksheet
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Results;