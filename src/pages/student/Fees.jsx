import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";

import feeData from "../../data/feeData";

import "./Fees.css";

function Fees() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          {/* ================= Heading ================= */}

          <h1 className="page-title">
            Fees Management
          </h1>

          {/* ================= Fee Summary ================= */}

          <div className="fee-summary">

            <div className="fee-card total">

              <h3>Total Fee</h3>

              <h2>₹{feeData.totalFee}</h2>

            </div>

            <div className="fee-card paid">

              <h3>Paid Fee</h3>

              <h2>₹{feeData.paidFee}</h2>

            </div>

            <div className="fee-card pending">

              <h3>Pending Fee</h3>

              <h2>₹{feeData.pendingFee}</h2>

            </div>

          </div>

          {/* ================= Payment History ================= */}

          <div className="payment-history">

            <h2>Payment History</h2>

            <table>

              <thead>

                <tr>

                  <th>Date</th>

                  <th>Amount</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {feeData.paymentHistory.map((payment, index) => (

                  <tr key={index}>

                    <td>{payment.date}</td>

                    <td>₹{payment.amount}</td>

                    <td>

                      <span
                        className={
                          payment.status === "Paid"
                            ? "status paid"
                            : "status pending"
                        }
                      >
                        {payment.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= Button ================= */}

          <button className="receipt-btn">

            Download Receipt

          </button>

        </div>

      </div>

    </div>
  );
}

export default Fees;