import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ================= PDF =================

export const exportPDF = (students) => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Student List", 14, 18);

  autoTable(doc, {
    startY: 28,
    head: [[
      "Enrollment",
      "Name",
      "Class",
      "Roll No",
      "Mobile",
      "Status"
    ]],
    body: students.map(student => [
      student.enrollment,
      student.name,
      student.class,
      student.rollNo,
      student.mobile,
      student.status
    ])
  });

  doc.save("Students.pdf");

};

// ================= Excel =================

export const exportExcel = (students) => {

  const worksheet = XLSX.utils.json_to_sheet(students);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Students"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(file, "Students.xlsx");

};

// ================= Print =================

export const printStudents = (students) => {

  const printWindow = window.open("", "", "width=900,height=700");

  printWindow.document.write(`
    <html>
      <head>
        <title>Students</title>

        <style>

        body{
          font-family:Arial;
          padding:20px;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th,td{
          border:1px solid #000;
          padding:8px;
          text-align:left;
        }

        th{
          background:#eee;
        }

        </style>

      </head>

      <body>

        <h2>Student List</h2>

        <table>

          <tr>
            <th>Enrollment</th>
            <th>Name</th>
            <th>Class</th>
            <th>Roll No</th>
            <th>Mobile</th>
            <th>Status</th>
          </tr>

          ${students.map(student => `
            <tr>
              <td>${student.enrollment}</td>
              <td>${student.name}</td>
              <td>${student.class}</td>
              <td>${student.rollNo}</td>
              <td>${student.mobile}</td>
              <td>${student.status}</td>
            </tr>
          `).join("")}

        </table>

      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.print();

};