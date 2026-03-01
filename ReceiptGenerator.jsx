import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "../context/AuthContext";

const ReceiptGenerator = ({ order }) => {
    const { currentUser } = useAuth();
    const [showReceipt, setShowReceipt] = useState(false);

    const generatePDF = () => {
        const input = document.getElementById("receipt-content");
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`${order.orderId}-receipt.pdf`);
        });
    };

    return (
        <div>
            <button className="btn-primary" onClick={() => setShowReceipt(!showReceipt)}>
                {showReceipt ? "Hide Receipt" : "View Receipt"}
            </button>
            {showReceipt && (
                <div id="receipt-content" style={receiptStyle}>
                    <div style={headerStyle}>
                        <h1>G.M.T LOGISTICS</h1>
                        <p>Manager: Brave | Owner: Godfree</p>
                        <p>Cell/WhatsApp: +27 62 121 6131</p>
                        <p>Email: gmtlogistics@gmail.com | Social: GMTrans&Logistics</p>
                        <p>Operational: Mon-Sun | Cities: JHB, Pretoria, Harare, Highglen</p>
                    </div>
                    <div style={orderDetailsStyle}>
                        <h2>DELIVERY RECEIPT</h2>
                        <p><strong>Order ID:</strong> {order.orderId}</p>
                        <p><strong>Client:</strong> {order.firstName} {order.lastName}</p>
                        <p><strong>Cell:</strong> {order.cellNumber}</p>
                        <p><strong>Collection:</strong> {order.collectionAddress}</p>
                        <p><strong>Delivery:</strong> {order.deliveryAddress}</p>
                        <p><strong>Time:</strong> {new Date(order.preferredTime).toLocaleString()}</p>
                        <p><strong>Parcel Type:</strong> {order.parcelType}</p>
                        <p><strong>Special Notes:</strong> {order.specialNotes}</p>
                        <p><strong>Price:</strong> R{order.price} (ZAR)</p>
                        <p><strong>Status:</strong> {order.status}</p>
                    </div>
                    <div style={signaturesStyle}>
                        <div>
                            <p><strong>Client Signature:</strong></p>
                            <img src={order.clientSignatureUrl} alt="Client Signature" style={sigImgStyle} />
                        </div>
                        <div>
                            <p><strong>Company Signature:</strong></p>
                            <img src={order.companySignatureUrl || "https://via.placeholder.com/200x80?text=G.M.T+Logistics"} alt="Company Signature" style={sigImgStyle} />
                        </div>
                    </div>
                    <div style={footerStyle}>
                        <p>Thank you for choosing G.M.T Logistics | Code Signature: aGhost</p>
                    </div>
                </div>
            )}
            {showReceipt && (
                <button className="btn-secondary" onClick={generatePDF} style={{ marginTop: 10 }}>
                    Download PDF Receipt
                </button>
            )}
        </div>
    );
};

const receiptStyle = { maxWidth: "800px", margin: "20px auto", padding: "20px", border: "1px solid #003366", borderRadius: "8px", backgroundColor: "#fff", };
const headerStyle = { textAlign: "center", borderBottom: "2px solid #003366", paddingBottom: "10px", marginBottom: "20px", };
const orderDetailsStyle = { marginBottom: "20px", paddingLeft: "10px", };
const signaturesStyle = { display: "flex", justifyContent: "space-between", padding: "10px", borderTop: "2px solid #003366", marginBottom: "20px", };
const sigImgStyle = { width: "200px", height: "80px", border: "1px solid #ccc", borderRadius: "4px", };
const footerStyle = { textAlign: "center", fontSize: "14px", color: "#666", };

export default ReceiptGenerator;