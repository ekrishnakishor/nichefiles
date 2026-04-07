import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleBrandClick = () => {
    if (!isAdmin) {
      const password = window.prompt("Enter password to enter writing mode:");
      if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
        setIsAdmin(true);
      } else if (password !== null) {
        alert("Incorrect password.");
      }
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}></span>
      </div>

      <div className={styles.right}>
        {isAdmin && (
          <nav className={styles.menu}>
            <Link to="/" className={styles.menuLink}>
              Show all posts
            </Link>
            <a
              href="http://localhost:3333"
              target="_blank"
              rel="noreferrer"
              className={styles.menuLink}
            >
              Write a blog
            </a>
          </nav>
        )}

        <div className={styles.brandContainer} onClick={handleBrandClick}>
          <span className={styles.brandText}>
            niche<span className={styles.highlightF}>F</span>iles
          </span>
        </div>
      </div>
    </header>
  );
}
