import styles from "./Header.module.css";

export default function Header({ pacifico }) {
  return (
    <header className={`${styles.header}`}>
      <div style={{ display: "flex" }}>
        <h1 className={`${pacifico.className} ${styles.heading}`}>DhenuTube</h1>
      </div>
    </header>
  );
}
