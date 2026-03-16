import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div>
        <div className={styles.eyebrow}>CSE 564 · Lab #1 · Stony Brook University</div>
        <h1 className={styles.title}>Income &amp; Health in America</h1>
      </div>
      <div className={styles.divider} />
      <div className={styles.meta}>
        542 US Counties &nbsp;·&nbsp; 8 States &nbsp;·&nbsp; 21 Variables
        <br />
        County Health Rankings &amp; Roadmaps (fused dataset)
      </div>
      <span className={styles.badge}>D3.js v7 · Next.js 14</span>
    </header>
  );
}
