import Link from "next/link";
import styles from "./page.module.css";

export default function Work1Page() {
  return (
    <main className={styles.workPage}>
      {/* Logo instead of nav bar */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <img
            src="/logo2.png"
            alt="Your Portfolio Logo"
            className={styles.logo}
          />
        </Link>
      </div>

      {/* Main content with two-column layout */}
      <div className={styles.workContent}>
        {/* Left side: Text content */}
        <div className={styles.workText}>
          <h1 className={styles.workTitle}>Title</h1>
          <div className={styles.workDescription}>
            <p>
              Text
            </p>
          </div>
        </div>

        {/* Right side: Image gallery */}
        <div className={styles.workGallery}>
          <div className={styles.galleryContainer}>
            <img src="/work1-detail-1.jpg" alt="Project detail 1" className={styles.galleryImage} />
            <img src="/work1-detail-2.jpg" alt="Project detail 2" className={styles.galleryImage} />
            <img src="/work1-detail-3.jpg" alt="Project detail 3" className={styles.galleryImage} />
            <img src="/work1-detail-4.jpg" alt="Project detail 4" className={styles.galleryImage} />
            <img src="/work1-detail-5.jpg" alt="Project detail 5" className={styles.galleryImage} />
          </div>
        </div>
      </div>
    </main>
  );
}
