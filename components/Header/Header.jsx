import styles from "./Header.module.css";

export default function Header() {

    return (
        <header className={`${styles.header}`} >
            <div style={{ display: "flex" }}>
                <img className={styles.icon} src="/favicon.ico" alt="" draggable={false} />
                <h1 className={styles.heading}>DhenuTube</h1>
            </div>
        </header>
    )
}