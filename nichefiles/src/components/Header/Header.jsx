import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [commitCount, setCommitCount] = useState("..."); // Added state for commits

  useEffect(() => {
    // Fetch commit count from GitHub API
    const fetchCommits = async () => {
      try {
        // 👉 REPLACE THESE with your actual GitHub username and repository name!
        const response = await fetch(
          "https://api.github.com/repos/ekrishnakishor/nichefiles/commits?per_page=1"
        );
        
        const linkHeader = response.headers.get("link");
        if (linkHeader) {
          const match = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (match) {
            setCommitCount(match[1]);
          }
        } else {
          const data = await response.json();
          setCommitCount(data.length);
        }
      } catch (error) {
        console.error("Failed to fetch commits", error);
        setCommitCount("?");
      }
    };

    fetchCommits();
  }, []);

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
        <span style={{ fontSize: "0.9rem", fontWeight: "bold", opacity: 0.8 }}>
          📦 Commits: {commitCount}
        </span>
      </div>

      <div className={styles.right}>
        {isAdmin && (
          <nav className={styles.menu}>
            <Link to="/" className={styles.menuLink}>
              Show all posts
            </Link>
            <a
              href="https://nichefiles-blog.sanity.studio/"
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