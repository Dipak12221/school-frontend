import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportPDF = (teachers) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Teacher List", 14, 15);

  const tableColumn = [
    "Teacher ID",
    "Name",
    "Subject",
    "Qualification",
    "Experience",
    "Mobile",
    "Status",
  ];

  const tableRows = teachers.map((teacher) => [
    teacher.teacherId,
    teacher.name,
    teacher.subject,
    teacher.qualification,
    teacher.experience,
    teacher.mobile,
    teacher.status,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 22,
  });

  doc.save("Teachers.pdf");
};

export const exportExcel = (teachers) => {
  const worksheet = XLSX.utils.json_to_sheet(teachers);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, "Teachers.xlsx");
};

export const printTeachers = (teachers) => {
  let html = `
    <html>
    <head>
      <title>Teachers List</title>

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

        h2{
          text-align:center;
          margin-bottom:20px;
        }

      </style>

    </head>

    <body>

      <h2>Teachers List</h2>

      <table>

        <thead>

          <tr>
            <th>Teacher ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Mobile</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>
  `;

  teachers.forEach((teacher) => {
    html += `
      <tr>
        <td>${teacher.teacherId}</td>
        <td>${teacher.name}</td>
        <td>${teacher.subject}</td>
        <td>${teacher.qualification}</td>
        <td>${teacher.experience}</td>
        <td>${teacher.mobile}</td>
        <td>${teacher.status}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>

    </body>

    </html>
  `;

  const printWindow = window.open("", "", "width=900,height=700");

  printWindow.document.write(html);

  printWindow.document.close();

  printWindow.focus();

  printWindow.print();

  printWindow.close();
};
