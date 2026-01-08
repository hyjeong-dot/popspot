import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3>PopSpot</h3>
                    <p>전국의 핫한 팝업스토어를 한눈에!<br />당신의 특별한 하루를 위한 가이드</p>
                </div>
                <div className={styles.column}>
                    <h3>메뉴</h3>
                    <ul>
                        <li><a href="#">팝업찾기</a></li>
                        <li><a href="#">플래너</a></li>
                        <li><a href="#">커뮤니티</a></li>
                        <li><a href="#">이벤트</a></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>고객지원</h3>
                    <ul>
                        <li><a href="#">공지사항</a></li>
                        <li><a href="#">자주 묻는 질문</a></li>
                        <li><a href="#">1:1 문의</a></li>
                        <li><a href="#">제휴 문의</a></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Contact</h3>
                    <ul>
                        <li>support@popspot.com</li>
                        <li>02-1234-5678</li>
                        <li>서울시 강남구 테헤란로 123</li>
                    </ul>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; 2026 PopSpot. All rights reserved.</p>
            </div>
        </footer>
    );
}
