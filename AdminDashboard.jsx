import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SignatureCanvas from "react-signature-canvas";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [price, setPrice] = useState("");
    const companySigCanvas = useRef(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const querySnapshot = await getDocs(collection(db, "orders"));
            const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(ordersList.filter(o => o.status === "Pending Confirmation"));
        };
        fetchOrders();
    }, []);

    const confirmOrder = async () => {
        if (!selectedOrder || !price || companySigCanvas.current.isEmpty()) return;
        try {
            const sigDataUrl = companySigCanvas.current.toDataURL();
            const blob = await fetch(sigDataUrl).then(res => res.blob());
            const sigRef = ref(storage, `signatures/${selectedOrder.orderId}-company.png`);
            await uploadBytes(sigRef, blob);
            const sigUrl = await getDownloadURL(sigRef);
            await updateDoc(doc(db, "orders", selectedOrder.id), {
                price,
                status: "Confirmed",
                companySignatureUrl: sigUrl,
            });
            const waMsg = `📦 G.M.T LOGISTICS ORDER CONFIRMED\nOrder ID: ${selectedOrder.orderId}\nPrice: R${price} (ZAR)\nReceipt Link: https://gmt-logistics-app.web.app/order/${selectedOrder.id}\nThank you for choosing us!`;
            window.open(`https://wa.me/${selectedOrder.cellNumber}?text=${encodeURIComponent(waMsg)}`, "_blank");
            emailjs.send(
                "YOUR_EMAILJS_SERVICE_ID",
                "YOUR_CONFIRMATION_TEMPLATE_ID",
                {
                    to_email: selectedOrder.email || currentUser.email,
                    orderId: selectedOrder.orderId,
                    price,
                    receipt_link: `https://gmt-logistics-app.web.app/order/${selectedOrder.id}`,
                },
                "YOUR_EMAILJS_PUBLIC_KEY"
            ).then(() => toast.success("Email confirmation sent!"));
            toast.success("Order confirmed and notifications sent!");
            setSelectedOrder(null);
            companySigCanvas.current.clear();
            setPrice("");
        } catch (error) {
            toast.error("Failed to confirm order.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard - Pending Orders</h2>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {orders.map(order => (
                    <div key={order.id} style={orderCardStyle} onClick={() => setSelectedOrder(order)}>
                        <h3>{order.orderId}</h3>
                        <p>{order.firstName} {order.lastName}</p>
                        <p>{order.cellNumber}</p>
                    </div>
                ))}
            </div>
            {selectedOrder && (
                <div style={confirmPanelStyle}>
                    <h3>Confirm Order: {selectedOrder.orderId}</h3>
                    <div className="form-group">
                        <label>Set Delivery Price (ZAR)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Company Signature</label>
                        <div className="signature-container">
                            <SignatureCanvas ref={companySigCanvas} penColor="#003366" canvasProps={{ width: 500, height: 200 }} />
                        </div>
                        <button type="button" className="btn-secondary" onClick={() => companySigCanvas.current.clear()}>Clear</button>
                    </div>
                    <button className="btn-primary" onClick={confirmOrder}>Confirm & Send Notifications</button>
                </div>
            )}
        </div>
    );
};

const orderCardStyle = { border: "1px solid #003366", borderRadius: "8px", padding: "15px", cursor: "pointer", width: "200px", };
const confirmPanelStyle = { marginTop: "20px", padding: "20px", border: "1px solid #003366", borderRadius: "8px", };

export default AdminDashboard;