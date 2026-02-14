import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack, BiPackage, BiDetail } from "react-icons/bi";
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt, FaCreditCard, FaDownload, FaEye, FaRedo } from "react-icons/fa";
import { MdDeliveryDining, MdPending } from "react-icons/md";
import CustomButton from "../components/CustomButton";
import '../style/custom-theme.css';
import styles from "../style/OrderHistory.module.css";

const OrderHistory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all'); // all, pending, processing, shipped, delivered, cancelled

    // Sample order data
    const orders = [
        {
            id: "ORD-2024-001",
            date: "2024-02-15",
            status: "delivered",
            total: 129.99,
            items: 3,
            paymentMethod: "Credit Card",
            trackingNumber: "TRK123456789",
            estimatedDelivery: "2024-02-18",
            products: [
                { name: "Product 1", quantity: 2, price: 45.99 },
                { name: "Product 2", quantity: 1, price: 38.01 }
            ],
            shippingAddress: "123 Gold Street, Apt 4B, York, 1001, USA",
            billingAddress: "123 Gold Street, Apt 4B, York, 1001, USA"
        },
        {
            id: "ORD-2024-002",
            date: "2024-02-10",
            status: "shipped",
            total: 79.99,
            items: 1,
            paymentMethod: "PayPal",
            trackingNumber: "TRK987654321",
            estimatedDelivery: "2024-02-20",
            products: [
                { name: "Product 3", quantity: 1, price: 79.99 }
            ],
            shippingAddress: "123 Gold Street, Apt 4B, York, 1001, USA",
            billingAddress: "123 Gold Street, Apt 4B, York, 1001, USA"
        },
        {
            id: "ORD-2024-003",
            date: "2024-02-05",
            status: "processing",
            total: 249.99,
            items: 4,
            paymentMethod: "Debit Card",
            trackingNumber: null,
            estimatedDelivery: "2024-02-22",
            products: [
                { name: "Product 4", quantity: 1, price: 99.99 },
                { name: "Product 5", quantity: 2, price: 50.00 },
                { name: "Product 6", quantity: 1, price: 50.00 }
            ],
            shippingAddress: "123 Gold Street, Apt 4B, York, 1001, USA",
            billingAddress: "123 Gold Street, Apt 4B, York, 1001, USA"
        },
        {
            id: "ORD-2024-004",
            date: "2024-01-28",
            status: "pending",
            total: 45.50,
            items: 2,
            paymentMethod: "Cash on Delivery",
            trackingNumber: null,
            estimatedDelivery: "2024-02-25",
            products: [
                { name: "Product 7", quantity: 2, price: 22.75 }
            ],
            shippingAddress: "123 Gold Street, Apt 4B, York, 1001, USA",
            billingAddress: "123 Gold Street, Apt 4B, York, 1001, USA"
        },
        {
            id: "ORD-2024-005",
            date: "2024-01-15",
            status: "cancelled",
            total: 189.99,
            items: 2,
            paymentMethod: "Credit Card",
            trackingNumber: null,
            estimatedDelivery: null,
            products: [
                { name: "Product 8", quantity: 1, price: 129.99 },
                { name: "Product 9", quantity: 1, price: 60.00 }
            ],
            shippingAddress: "123 Gold Street, Apt 4B, York, 1001, USA",
            billingAddress: "123 Gold Street, Apt 4B, York, 1001, USA"
        }
    ];

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Filter orders based on active tab
    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(order => order.status === activeTab);

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <FaCheckCircle />;
            case 'shipped': return <FaTruck />;
            case 'processing': return <FaClock />;
            case 'pending': return <MdPending />;
            case 'cancelled': return <FaBox />;
            default: return <FaBox />;
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return '#10b981';
            case 'shipped': return '#3b82f6';
            case 'processing': return '#f59e0b';
            case 'pending': return '#8b5cf6';
            case 'cancelled': return '#ef4444';
            default: return '#64748b';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Handle view details
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    console.log(showDetails)

    // Handle track order
    const handleTrackOrder = (order) => {
        if (order.trackingNumber) {
            // Open tracking in new tab or show tracking modal
            window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank');
        }
    };

    // Handle reorder
    const handleReorder = (order) => {
        // Add to cart logic
        console.log('Reorder:', order.id);
    };

    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />
            </div>

            <div className="container position-relative">
                <h1 className="thm-big-title">Order History</h1>

                {/* Status Tabs */}


                <div className="position-relative" style={{ zIndex: '55555' }}>
                    <div className="row col-xl-10 g-4 g-md-2 col-lg-11 mx-auto justify-content-between">

                        {/* Orders List */}
                        {filteredOrders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <BiPackage />
                                </div>
                                <h3>No orders found</h3>
                                <p>You haven't placed any {activeTab !== 'all' ? activeTab : ''} orders yet</p>
                                <CustomButton
                                    text={"Start Shopping"}
                                    onClick={() => navigate('/shop')}
                                />
                            </div>
                        ) : (
                            !showDetails && filteredOrders.map((order) => (
                                <div key={order.id} className={styles.orderCard}>
                                    {/* Order Header */}
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderId}>
                                            <span>Order ID:</span>
                                            <strong>{order.id}</strong>
                                        </div>
                                        <div className={styles.orderDate}>
                                            <FaClock />
                                            <span>{formatDate(order.date)}</span>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className={styles.orderBody}>
                                        <div className={styles.orderInfo}>
                                            <div className={styles.orderStatus}>
                                                <span
                                                    className={styles.statusBadge}
                                                    style={{
                                                        backgroundColor: `${getStatusColor(order.status)}20`,
                                                        color: getStatusColor(order.status)
                                                    }}
                                                >
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className={styles.orderStats}>
                                                <div className={styles.stat}>
                                                    <span>Items:</span>
                                                    <strong>{order.items}</strong>
                                                </div>
                                                <div className={styles.stat}>
                                                    <span>Total:</span>
                                                    <strong>₹ {order.total.toFixed(2)}</strong>
                                                </div>
                                                <div className={styles.stat}>
                                                    <span>Payment:</span>
                                                    <strong>{order.paymentMethod}</strong>
                                                </div>
                                            </div>

                                            {order.trackingNumber && (
                                                <div className={styles.trackingInfo}>
                                                    <FaTruck />
                                                    <span>Tracking: {order.trackingNumber}</span>
                                                </div>
                                            )}

                                            {order.estimatedDelivery && (
                                                <div className={styles.estimatedDelivery}>
                                                    <MdDeliveryDining />
                                                    <span>Est. Delivery: {formatDate(order.estimatedDelivery)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Products Preview */}
                                        <div className={styles.productsPreview}>
                                            {order.products.map((product, idx) => (
                                                <div key={idx} className={styles.productTag}>
                                                    {product.name} x{product.quantity}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Footer */}
                                    <div className={styles.orderFooter}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            <FaEye /> View Details
                                        </button>
                                        {order.trackingNumber && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleTrackOrder(order)}
                                            >
                                                <FaTruck /> Track Order
                                            </button>
                                        )}
                                        {order.status !== 'cancelled' && (
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleReorder(order)}
                                            >
                                                <FaRedo /> Reorder
                                            </button>
                                        )}
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => {/* Download invoice */ }}
                                        >
                                            <FaDownload /> Invoice
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Order Details Modal */}
                {showDetails && selectedOrder && (
                    <div className={styles.modalOverlay} onClick={() => setShowDetails(false)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.modalClose} onClick={() => setShowDetails(false)}>
                                ×
                            </button>

                            <h2 className={styles.modalTitle}>
                                <BiDetail /> Order Details
                            </h2>

                            <div className={styles.modalContent}>
                                {/* Order Summary */}
                                <div className={styles.detailSection}>
                                    <h3>Order Summary</h3>
                                    <div className={styles.detailGrid}>
                                        <div className={styles.detailRow}>
                                            <span>Order ID:</span>
                                            <strong>{selectedOrder.id}</strong>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Order Date:</span>
                                            <strong>{formatDate(selectedOrder.date)}</strong>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Status:</span>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    backgroundColor: `${getStatusColor(selectedOrder.status)}20`,
                                                    color: getStatusColor(selectedOrder.status)
                                                }}
                                            >
                                                {getStatusIcon(selectedOrder.status)}
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Payment Method:</span>
                                            <strong>{selectedOrder.paymentMethod}</strong>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Total Amount:</span>
                                            <strong className={styles.totalAmount}> ₹ {selectedOrder.total.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Products */}
                                <div className={styles.detailSection}>
                                    <h3>Products</h3>
                                    <div className={styles.productsList}>
                                        {selectedOrder.products.map((product, idx) => (
                                            <div key={idx} className={styles.productItem}>
                                                <span className={styles.productName}>{product.name}</span>
                                                <span className={styles.productQty}>x{product.quantity}</span>
                                                <span className={styles.productPrice}>
                                                    ₹ {(product.price * product.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div className={styles.detailSection}>
                                    <h3>
                                        <FaMapMarkerAlt /> Shipping Address
                                    </h3>
                                    <p className={styles.address}>{selectedOrder.shippingAddress}</p>
                                </div>

                                {/* Billing Information */}
                                <div className={styles.detailSection}>
                                    <h3>
                                        <FaCreditCard /> Billing Address
                                    </h3>
                                    <p className={styles.address}>{selectedOrder.billingAddress}</p>
                                </div>

                                {/* Tracking Information */}
                                {selectedOrder.trackingNumber && (
                                    <div className={styles.detailSection}>
                                        <h3>
                                            <FaTruck /> Tracking Information
                                        </h3>
                                        <p className={styles.trackingNumber}>
                                            Tracking Number: <strong>{selectedOrder.trackingNumber}</strong>
                                        </p>
                                        {selectedOrder.estimatedDelivery && (
                                            <p className={styles.estimatedDate}>
                                                Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={styles.modalFooter}>
                                <CustomButton
                                    text={"Close"}
                                    onClick={() => setShowDetails(false)}
                                />
                                {selectedOrder.trackingNumber && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                                    <CustomButton
                                        text={"Track Order"}
                                        onClick={() => handleTrackOrder(selectedOrder)}
                                        icon={<FaTruck />}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <span style={{ zIndex: '654' }} className="thm-glow"></span>
            </div>
        </div>
    );
};

export default OrderHistory;