import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PopupCard from '@/components/popup/PopupCard';
import { mockPopups } from '@/data/mockPopups';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Discover the Hottest <br />
          <span className={styles.heroAccent}>Pop-up Stores</span>
        </h1>
        <p className={styles.heroSubtitle}>
          이번 주말, 어디 갈지 고민되시나요? <br />
          전국의 힙한 팝업스토어를 팝스팟에서 찾아보세요.
        </p>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="지역, 브랜드, 키워드로 검색해보세요"
            className={styles.searchInput}
          />
          <button className={styles.searchBtn}>검색</button>
        </div>
      </section>

      {/* Popular Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔥 지금 가장 핫한 팝업</h2>
          <Link href="/popups" className={styles.sectionMore}>
            전체보기 &rarr;
          </Link>
        </div>

        <div className={styles.categoryList}>
          <button className={`${styles.categoryItem} ${styles.active}`}>전체</button>
          <button className={styles.categoryItem}>패션</button>
          <button className={styles.categoryItem}>뷰티</button>
          <button className={styles.categoryItem}>라이프스타일</button>
          <button className={styles.categoryItem}>푸드</button>
          <button className={styles.categoryItem}>캐릭터</button>
        </div>

        <div className={styles.grid}>
          {mockPopups.map((popup) => (
            <PopupCard key={popup.id} popup={popup} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
