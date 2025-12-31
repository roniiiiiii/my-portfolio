import Link from "next/link";
import styles from "./page.module.css";
import img1 from "./work1-detail-1.png"; // 👈 one image only
import P5Sketch from "@/components/P5Sketch";

export default function Work1Page() {
  return (
    <main className={styles.workPage}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <img
            src="/logo2.png"
            alt="Your Portfolio Logo"
            className={styles.logo}
          />
        </Link>
      </div>

      {/* Main content layout */}
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

        {/* Right side: Single image display */}
        <div className={styles.workGallery}>
          <div className={styles.singleImageContainer}>
            <img
              src={img1.src}
              alt="Postcard illustration"
              className={styles.galleryImage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
