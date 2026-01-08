import Image from 'next/image';
import { Popup } from '@/data/mockPopups';
import styles from './PopupCard.module.css';

interface PopupCardProps {
    popup: Popup;
}

export default function PopupCard({ popup }: PopupCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={popup.image}
                    alt={popup.title}
                    fill
                    className={styles.image}
                />
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{popup.category}</span>
                <h3 className={styles.title}>{popup.title}</h3>
                <p className={styles.brand}>{popup.brand}</p>

                <div className={styles.info}>
                    <span>📅 {popup.date}</span>
                    <span>📍 {popup.location}</span>
                </div>

                <div className={styles.tags}>
                    {popup.tags.map(tag => (
                        <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
