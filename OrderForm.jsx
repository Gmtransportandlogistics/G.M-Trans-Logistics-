import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SignatureCanvas from "react-signature-canvas";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const OrderForm = () => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        cellNumber: "",
        collectionAddress: "",
        deliveryAddress: "",
        preferredTime: "",
        parcelType: "",
        specialNotes: "",
    });
    const [collectionCoords, setCollectionCoords] = useState([-26.2041, 28.0473]);
    const [deliveryCoords, setDeliveryCoords] = useState([-25.7461, 28.1881]);
    const [orderId, setOrderId] = useState("");
    const sigCanvas = useRef(null);
    const formRef = useRef(null);
    useEffect(() => {
        setOrderId(`GMT-${Date.now()}`);
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const clearSignature = () => sigCanvas.current.clear();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sigCanvas.current.isEmpty()) {
            try {
                const sigDataUrl = sigCanvas.current.toDataURL();
                const blob = await fetch(sigDataUrl).then(res => res.blob());
                const sigRef = ref(storage, `signatures/${orderId}-client.png`);
                await uploadBytes(sigRef, blob);
                const sigUrl = await getDownloadURL(sigRef);
                const orderData = { ...formData, userId: currentUser.uid, orderId, clientSignatureUrl: sigUrl, companySignatureUrl: "", status: "Pending Confirmation", price: "", timestamp: new Date(), };
                await addDoc(collection(db, "orders"), orderData);
                await setDoc(doc(db, "users", currentUser.uid), { ...formData, lastOrder: orderId, }, { merge: true });
                const whatsappMsg = `NEW ORDER - ${orderId}\nClient: ${formData.firstName} ${formData.lastName}\nCell: ${formData.cellNumber}\nCollection: ${formData.collectionAddress}\nDelivery: ${formData.deliveryAddress}\nTime: ${formData.preferredTime}\nParcel: ${formData.parcelType}\nNotes: ${formData.specialNotes}\nSignature: ${sigUrl}`;
                window.open(`https://wa.me/+27621216131?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
                emailjs.send( 
                    "YOUR_EMAILJS_SERVICE_ID", 
                    "YOUR_EMAILJS_TEMPLATE_ID", 
                    { ...formData, orderId, sigUrl, to_email: "gmtlogistics@gmail.com", }, 
                    "YOUR_EMAILJS_PUBLIC_KEY" 
                ).then(() => toast.success("Email sent successfully!"));
                toast.success("Order submitted! Await confirmation with pricing.");
                formRef.current.reset();
                clearSignature();
            } catch (error) {
                toast.error("Failed to submit order. Please try again.");
                console.error(error);
            }
        } else {
            toast.error("Please sign the form to proceed.");
        }
    };
    return (
        <div className="order-form">
            <h2>G.M.T Logistics - Collection & Delivery Order</h2>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Cell Number (WhatsApp/Calling)</label>
                    <input type="tel" name="cellNumber" value={formData.cellNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Collection Address</label>
                    <textarea name="collectionAddress" value={formData.collectionAddress} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Collection Location Map</label>
                    <MapContainer center={collectionCoords} zoom={13} className="map-container">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={collectionCoords}>
                            <Popup>Collection Address</Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Delivery Location Map</label>
                    <MapContainer center={deliveryCoords} zoom={13} className="map-container">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={deliveryCoords}>
                            <Popup>Delivery Address</Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="form-group">
                    <label>Preferred Collection/Delivery Time</label>
                    <input type="datetime-local" name="preferredTime" value={formData.preferredTime} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Parcel Type</label>
                    <select name="parcelType" value={formData.parcelType} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        <option value="Documents">Documents</option>
                        <option value="Small Package">Small Package</option>
                        <option value="Large Package">Large Package</option>
                        <option value="Fragile Items">Fragile Items</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Special Handling Notes</label>
                    <textarea name="specialNotes" value={formData.specialNotes} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Client Signature</label>
                    <div className="signature-container">
                        <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 500, height: 200, className: "sigCanvas" }} />
                    </div>
                    <button type="button" className="btn-secondary" onClick={clearSignature}>Clear Signature</button>
                </div>
                <button type="submit" className="btn-primary">Submit Order</button>
            </form>
        </div>
    );
};
export default OrderForm;