import React from 'react'
import styles from "../style/ProfileDashboard.module.css";
import {
    BiUser,
    BiHistory,
    BiCreditCard,
    BiLogOut,
    BiEdit,
    BiSave,
    BiArrowBack,
    BiPackage,
    BiMoney,
    BiCalendar,
    BiMap,
    BiPhone,
    BiEnvelope,
    BiChevronRight,
    BiDownload,
    BiShow,
    BiHeart,
    BiStar,
    BiGift
} from "react-icons/bi";
import {
    FaCamera,
    FaCheckCircle,
    FaClock,
    FaShippingFast,
    FaWallet,
    FaMedal,
    FaFire,
    FaBolt,
    FaGem
} from "react-icons/fa";
import { orders } from '../../util/data';

function OrderHistory() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);


    return (
        <>
            <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                    <h2>
                        <BiHistory className={styles.tabIcon} />
                        Order History
                    </h2>
                    <span className={styles.totalCount}>{orders.length} orders</span>
                </div>

                {showOrderDetails && selectedOrder ? (
                    <div className={styles.orderDetails}>
                        <button
                            className={styles.backBtn}
                            onClick={() => setShowOrderDetails(false)}
                        >
                            <BiArrowBack /> Back to Orders
                        </button>
                        <h3>Order #{selectedOrder.id}</h3>
                        <div className={styles.orderDetailsCard}>
                            <div className={styles.detailRow}>
                                <span>Status:</span>
                                {getStatusBadge(selectedOrder.status)}
                            </div>
                            <div className={styles.detailRow}>
                                <span>Date:</span>
                                <span>{selectedOrder.date}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Total Amount:</span>
                                <span className={styles.amount}>{selectedOrder.amount}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Tracking:</span>
                                <span>{selectedOrder.tracking}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Estimated Delivery:</span>
                                <span>{selectedOrder.estimatedDelivery}</span>
                            </div>

                            <h4>Products</h4>
                            {selectedOrder.products.map((product, index) => (
                                <div key={index} className={styles.productItem}>
                                    <span>{product.name}</span>
                                    <span>{product.quantity}x {product.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.orderCards}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <div>
                                        <span className={styles.orderId}>{order.id}</span>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <BiChevronRight className={styles.cardArrow} />
                                </div>
                                <div className={styles.orderBody}>
                                    <div className={styles.orderInfo}>
                                        <BiCalendar />
                                        <span>{order.date}</span>
                                    </div>
                                    <div className={styles.orderInfo}>
                                        <BiPackage />
                                        <span>{order.items} items</span>
                                    </div>
                                    <div className={styles.orderInfo}>
                                        <IoMdPricetag />
                                        <span className={styles.amount}>{order.amount}</span>
                                    </div>
                                </div>
                                <div className={styles.orderFooter}>
                                    <button
                                        className={styles.viewDetailsBtn}
                                        onClick={() => handleOrderClick(order)}
                                    >
                                        <BiShow /> View Details
                                    </button>
                                    {order.status === 'Shipped' && (
                                        <button className={styles.trackBtn}>
                                            <MdLocalShipping /> Track
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default OrderHistory