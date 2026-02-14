import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack, BiCreditCard, BiDetail } from "react-icons/bi";
import {
    FaCreditCard,
    FaPaypal,
    FaGooglePay,
    FaApplePay,
    FaMoneyBillWave,
    FaDownload,
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaExclamationCircle,
    FaFilter,
    FaCalendarAlt,
    FaPrint,
    FaFileInvoice
} from "react-icons/fa";
import { MdPending, MdPayment, MdReceipt } from "react-icons/md";
import CustomButton from "../components/CustomButton";
import '../style/custom-theme.css';
import styles from "../style/PaymentHistory.module.css";

const PaymentHistory = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all'); // all, completed, pending, failed, refunded
    const [dateRange, setDateRange] = useState('all'); // all, today, week, month, year
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Sample payment data
    const payments = [
        {
            id: "PAY-2024-001",
            date: "2024-02-15T10:30:00",
            amount: 129.99,
            status: "completed",
            method: "credit_card",
            cardLast4: "4242",
            cardBrand: "Visa",
            invoiceNumber: "INV-2024-001",
            description: "Order #ORD-2024-001",
            receipt_url: "/receipts/INV-2024-001.pdf",
            billing_address: "123 Gold Street, Apt 4B, York, 1001, USA",
            transaction_id: "txn_1234567890",
            fees: 2.99,
            net_amount: 127.00
        },
        {
            id: "PAY-2024-002",
            date: "2024-02-10T14:45:00",
            amount: 79.99,
            status: "completed",
            method: "paypal",
            paypal_email: "john.doe@example.com",
            invoiceNumber: "INV-2024-002",
            description: "Order #ORD-2024-002",
            receipt_url: "/receipts/INV-2024-002.pdf",
            billing_address: "123 Gold Street, Apt 4B, York, 1001, USA",
            transaction_id: "pp_9876543210",
            fees: 1.99,
            net_amount: 78.00
        },
        {
            id: "PAY-2024-003",
            date: "2024-02-05T09:15:00",
            amount: 249.99,
            status: "pending",
            method: "bank_transfer",
            invoiceNumber: "INV-2024-003",
            description: "Order #ORD-2024-003",
            billing_address: "123 Gold Street, Apt 4B, York, 1001, USA",
            transaction_id: "bt_5555555555",
            expected_clearance: "2024-02-08"
        },
        {
            id: "PAY-2024-004",
            date: "2024-01-28T16:20:00",
            amount: 45.50,
            status: "failed",
            method: "credit_card",
            cardLast4: "1234",
            cardBrand: "Mastercard",
            invoiceNumber: "INV-2024-004",
            description: "Order #ORD-2024-004",
            failure_reason: "Insufficient funds",
            billing_address: "123 Gold Street, Apt 4B, York, 1001, USA",
            transaction_id: "txn_4444444444"
        },
        {
            id: "PAY-2024-005",
            date: "2024-01-15T11:10:00",
            amount: 189.99,
            status: "refunded",
            method: "google_pay",
            cardLast4: "5678",
            cardBrand: "Visa",
            invoiceNumber: "INV-2024-005",
            description: "Order #ORD-2024-005",
            refund_date: "2024-01-18",
            refund_reason: "Customer request",
            billing_address: "123 Gold Street, Apt 4B, York, 1001, USA",
            transaction_id: "txn_7777777777",
            original_transaction: "txn_6666666666"
        },
        {
            id: "PAY-2024-006",
            date: "2024-02-12T13:30:00",
            amount: 67.50,
            status: "completed",
            method: "apple_pay",
            cardLast4: "9012",
            cardBrand: "Amex",
            invoiceNumber: "INV-2024-006",
            description: "Order #ORD-2024-006",
            receipt_url: "/receipts/INV-2024-006.pdf",
            billing_address: "123 Gold Street, Apt 4B, York, 1001, USA",
            transaction_id: "txn_2222222222",
            fees: 1.50,
            net_amount: 66.00
        }
    ];

    // Filter payments based on status filter
    const filteredPayments = payments.filter(payment => {
        if (activeFilter === 'all') return true;
        return payment.status === activeFilter;
    });

    // Get payment method icon
    const getMethodIcon = (method) => {
        switch (method) {
            case 'credit_card': return <FaCreditCard />;
            case 'paypal': return <FaPaypal />;
            case 'google_pay': return <FaGooglePay />;
            case 'apple_pay': return <FaApplePay />;
            case 'bank_transfer': return <FaMoneyBillWave />;
            default: return <BiCreditCard />;
        }
    };

    // Get payment method name
    const getMethodName = (method) => {
        switch (method) {
            case 'credit_card': return 'Credit Card';
            case 'paypal': return 'PayPal';
            case 'google_pay': return 'Google Pay';
            case 'apple_pay': return 'Apple Pay';
            case 'bank_transfer': return 'Bank Transfer';
            default: return method;
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FaCheckCircle />;
            case 'pending': return <MdPending />;
            case 'failed': return <FaTimesCircle />;
            case 'refunded': return <FaExclamationCircle />;
            default: return <FaClock />;
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'failed': return '#ef4444';
            case 'refunded': return '#8b5cf6';
            default: return '#64748b';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Format short date
    const formatShortDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Handle view details
    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setShowDetails(true);
    };

    // Handle download receipt
    const handleDownloadReceipt = (payment) => {
        if (payment.receipt_url) {
            // In real app, this would trigger a download
            console.log('Downloading receipt for:', payment.id);
        }
    };

    // Calculate totals
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedAmount = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
    const refundedAmount = payments
        .filter(p => p.status === 'refunded')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />
            </div>

            <div className="container position-relative">
                <h1 className="thm-big-title">Payment History</h1>

                {/* Summary Cards */}


                {/* Filter Bar */}
                {/* <div className={styles.filterBar}>
                    <div className={styles.filterTabs}>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All Payments
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'completed' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('completed')}
                        >
                            Completed
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'pending' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'failed' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('failed')}
                        >
                            Failed
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'refunded' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('refunded')}
                        >
                            Refunded
                        </button>
                    </div>

                    <button
                        className={styles.filterToggle}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter /> Filters
                    </button>
                </div> */}

                {/* Advanced Filters */}
                {showFilters && (
                    <div className={styles.advancedFilters}>
                        <div className={styles.filterGroup}>
                            <label>Date Range</label>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {dateRange === 'custom' && (
                            <div className={styles.dateRangePicker}>
                                <input type="date" className={styles.dateInput} />
                                <span>to</span>
                                <input type="date" className={styles.dateInput} />
                            </div>
                        )}

                        <div className={styles.filterGroup}>
                            <label>Payment Method</label>
                            <select className={styles.filterSelect}>
                                <option value="all">All Methods</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="google_pay">Google Pay</option>
                                <option value="apple_pay">Apple Pay</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Min Amount</label>
                            <input type="number" placeholder="₹ 0" className={styles.filterInput} />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Max Amount</label>
                            <input type="number" placeholder="₹ 1000" className={styles.filterInput} />
                        </div>

                        <button className={styles.applyFiltersBtn}>
                            Apply Filters
                        </button>
                    </div>
                )}

                <div className="position-relative" style={{ zIndex: '55555' }}>
                    <div className="row col-xl-12 g-4 g-md-2 mx-auto justify-content-between">

                        {/* Payments List */}
                        {filteredPayments.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <BiCreditCard />
                                </div>
                                <h3>No payments found</h3>
                                <p>You haven't made any {activeFilter !== 'all' ? activeFilter : ''} payments yet</p>
                                <CustomButton
                                    text={"Make a Payment"}
                                    onClick={() => navigate('/payment')}
                                />
                            </div>
                        ) : (
                            !showDetails && filteredPayments.map((payment) => (
                                <div key={payment.id} className={styles.paymentCard}>
                                    {/* Payment Header */}
                                    <div className={styles.paymentHeader}>
                                        <div className={styles.paymentId}>
                                            <span>Payment ID:</span>
                                            <strong>{payment.id}</strong>
                                        </div>
                                        <div className={styles.paymentDate}>
                                            <FaCalendarAlt />
                                            <span>{formatShortDate(payment.date)}</span>
                                        </div>
                                    </div>

                                    {/* Payment Body */}
                                    <div className={styles.paymentBody}>
                                        <div className={styles.paymentInfo}>
                                            <div className={styles.paymentMethod}>
                                                <span className={styles.methodIcon}>
                                                    {getMethodIcon(payment.method)}
                                                </span>
                                                <div className={styles.methodDetails}>
                                                    <span className={styles.methodName}>
                                                        {getMethodName(payment.method)}
                                                    </span>
                                                    {payment.cardLast4 && (
                                                        <span className={styles.cardLast4}>
                                                            •••• {payment.cardLast4}
                                                        </span>
                                                    )}
                                                    {payment.paypal_email && (
                                                        <span className={styles.paypalEmail}>
                                                            {payment.paypal_email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.paymentAmount}>
                                                <span className={styles.amountLabel}>Amount</span>
                                                <strong className={styles.amountValue}>
                                                    ₹ {payment.amount.toFixed(2)}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className={styles.paymentStatus}>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    backgroundColor: `${getStatusColor(payment.status)}20`,
                                                    color: getStatusColor(payment.status)
                                                }}
                                            >
                                                {getStatusIcon(payment.status)}
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                            <span className={styles.invoiceNumber}>
                                                <MdReceipt /> {payment.invoiceNumber}
                                            </span>
                                        </div>

                                        <div className={styles.paymentDescription}>
                                            {payment.description}
                                        </div>

                                        {payment.failure_reason && (
                                            <div className={styles.failureReason}>
                                                <FaExclamationCircle />
                                                <span>{payment.failure_reason}</span>
                                            </div>
                                        )}

                                        {payment.refund_reason && (
                                            <div className={styles.refundReason}>
                                                <FaExclamationCircle />
                                                <span>Refunded: {payment.refund_reason}</span>
                                            </div>
                                        )}

                                        {payment.expected_clearance && (
                                            <div className={styles.clearanceInfo}>
                                                <FaClock />
                                                <span>Expected clearance: {formatShortDate(payment.expected_clearance)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Footer */}
                                    <div className={styles.paymentFooter}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleViewDetails(payment)}
                                        >
                                            <FaEye /> View Details
                                        </button>
                                        {payment.receipt_url && (
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleDownloadReceipt(payment)}
                                            >
                                                <FaDownload /> Receipt
                                            </button>
                                        )}
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => {/* Print receipt */ }}
                                        >
                                            <FaPrint /> Print
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Payment Details Modal */}
                {showDetails && selectedPayment && (
                    <div className={styles.modalOverlay} onClick={() => setShowDetails(false)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.modalClose} onClick={() => setShowDetails(false)}>
                                ×
                            </button>

                            <h2 className={styles.modalTitle}>
                                <BiDetail /> Payment Details
                            </h2>

                            <div className={styles.modalContent}>
                                {/* Payment Summary */}
                                <div className={styles.detailSection}>
                                    <h3>Payment Summary</h3>
                                    <div className={styles.detailGrid}>
                                        <div className={styles.detailRow}>
                                            <span>Payment ID:</span>
                                            <strong>{selectedPayment.id}</strong>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Date & Time:</span>
                                            <strong>{formatDate(selectedPayment.date)}</strong>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Status:</span>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    backgroundColor: `${getStatusColor(selectedPayment.status)}20`,
                                                    color: getStatusColor(selectedPayment.status)
                                                }}
                                            >
                                                {getStatusIcon(selectedPayment.status)}
                                                {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Invoice Number:</span>
                                            <strong>{selectedPayment.invoiceNumber}</strong>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Transaction ID:</span>
                                            <strong className={styles.transactionId}>{selectedPayment.transaction_id}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Details */}
                                <div className={styles.detailSection}>
                                    <h3>Amount Details</h3>
                                    <div className={styles.detailGrid}>
                                        <div className={styles.detailRow}>
                                            <span>Subtotal:</span>
                                            <strong>₹ {selectedPayment.amount.toFixed(2)}</strong>
                                        </div>
                                        {selectedPayment.fees && (
                                            <div className={styles.detailRow}>
                                                <span>Processing Fee:</span>
                                                <strong>-₹ {selectedPayment.fees.toFixed(2)}</strong>
                                            </div>
                                        )}
                                        {selectedPayment.net_amount && (
                                            <div className={styles.detailRow}>
                                                <span>Net Amount:</span>
                                                <strong className={styles.netAmount}>
                                                    ₹ {selectedPayment.net_amount.toFixed(2)}
                                                </strong>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className={styles.detailSection}>
                                    <h3>Payment Method</h3>
                                    <div className={styles.paymentMethodDetail}>
                                        <span className={styles.detailIcon}>
                                            {getMethodIcon(selectedPayment.method)}
                                        </span>
                                        <div>
                                            <strong>{getMethodName(selectedPayment.method)}</strong>
                                            {selectedPayment.cardLast4 && (
                                                <p>Card ending in {selectedPayment.cardLast4}</p>
                                            )}
                                            {selectedPayment.paypal_email && (
                                                <p>{selectedPayment.paypal_email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className={styles.detailSection}>
                                    <h3>Billing Address</h3>
                                    <p className={styles.address}>{selectedPayment.billing_address}</p>
                                </div>

                                {/* Description */}
                                <div className={styles.detailSection}>
                                    <h3>Description</h3>
                                    <p className={styles.description}>{selectedPayment.description}</p>
                                </div>

                                {/* Refund Information */}
                                {selectedPayment.status === 'refunded' && (
                                    <div className={styles.detailSection}>
                                        <h3>Refund Information</h3>
                                        <div className={styles.detailGrid}>
                                            <div className={styles.detailRow}>
                                                <span>Refund Date:</span>
                                                <strong>{formatDate(selectedPayment.refund_date)}</strong>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Refund Reason:</span>
                                                <strong>{selectedPayment.refund_reason}</strong>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span>Original Transaction:</span>
                                                <strong>{selectedPayment.original_transaction}</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Failure Information */}
                                {selectedPayment.status === 'failed' && (
                                    <div className={styles.detailSection}>
                                        <h3>Failure Information</h3>
                                        <p className={styles.failureMessage}>
                                            <FaExclamationCircle />
                                            {selectedPayment.failure_reason}
                                        </p>
                                    </div>
                                )}

                                {/* Clearance Information */}
                                {selectedPayment.expected_clearance && (
                                    <div className={styles.detailSection}>
                                        <h3>Clearance Information</h3>
                                        <p className={styles.clearanceMessage}>
                                            <FaClock />
                                            Expected clearance: {formatDate(selectedPayment.expected_clearance)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.modalFooter}>
                                <CustomButton
                                    text={"Close"}
                                    onClick={() => setShowDetails(false)}
                                />
                                {selectedPayment.receipt_url && (
                                    <CustomButton
                                        text={"Download Receipt"}
                                        onClick={() => handleDownloadReceipt(selectedPayment)}
                                        icon={<FaDownload />}
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

export default PaymentHistory;