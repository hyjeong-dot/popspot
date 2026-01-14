'use client';

import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    info: FiInfo,
};

export function Toast({ message, type = 'info', isVisible, onClose }: ToastProps) {
    if (!isVisible) return null;

    const Icon = icons[type];

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <Icon className={styles.icon} size={20} />
            <span className={styles.message}>{message}</span>
            <button className={styles.closeBtn} onClick={onClose}>
                <FiX size={16} />
            </button>
        </div>
    );
}
