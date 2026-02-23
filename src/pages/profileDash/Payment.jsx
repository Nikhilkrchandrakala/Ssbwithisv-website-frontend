import React from 'react'
import styles from "../style/ProfileDashboard.module.css";
import {
    BiCalendar,
    BiCreditCard,
    BiDownload,
  
} from "react-icons/bi";
import { payments } from '../../util/data';
import {  MdPayment } from "react-icons/md";


function Payment() {

    const getStatusBadge = (status) => {
        const statusClass = status.toLowerCase();
        const statusConfig = {
            success: { icon: FaCheckCircle, color: '#28a745' },
            delivered: { icon: FaCheckCircle, color: '#28a745' },
            processing: { icon: FaClock, color: '#ffc107' },
            shipped: { icon: FaShippingFast, color: '#17a2b8' }
        };

        const config = statusConfig[statusClass] || { icon: FaClock, color: '#6c757d' };
        const Icon = config.icon;

        return (
            <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
                <Icon size={12} />
                {status}
            </span>
        );
    };

    return (
        <>
            <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                    <h2>
                        <BiCreditCard className={styles.tabIcon} />
                        Payment History
                    </h2>
                    <span className={styles.totalCount}>{payments?.length} transactions</span>
                </div>

                <div className={styles.paymentCards}>
                    {payments.map((payment) => (
                        <div key={payment.id} className={styles.paymentCard}>
                            <div className={styles.paymentHeader}>
                                <span className={styles.paymentId}>{payment.id}</span>
                                {getStatusBadge(payment.status)}
                            </div>
                            <div className={styles.paymentBody}>
                                <div className={styles.paymentInfo}>
                                    <BiCalendar />
                                    <span>{payment.date}</span>
                                </div>
                                <div className={styles.paymentInfo}>
                                    <MdPayment />
                                    <span>{payment.method}</span>
                                    {payment.cardLast4 && <span> •••• {payment.cardLast4}</span>}
                                    {payment.upiId && <span> ({payment.upiId})</span>}
                                    {payment.bank && <span> ({payment.bank})</span>}
                                </div>
                                <div className={styles.paymentAmount}>
                                    <span>Amount:</span>
                                    <span className={styles.amount}>{payment.amount}</span>
                                </div>
                            </div>
                            <div className={styles.paymentFooter}>
                                <button className={styles.downloadBtn}>
                                    <BiDownload /> Receipt
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Payment