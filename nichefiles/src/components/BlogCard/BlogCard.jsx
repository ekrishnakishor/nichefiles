import React from 'react';
import styles from './BlogCard.module.css';

// Added onReadMore to the destructured props
const BlogCard = ({ title, excerpt, category, views, words, onReadMore }) => {
  return (
    <div className={styles.card}>
      {category && <div className={styles.tag}>{category}</div>}
      
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.excerpt}>{excerpt}</p>
      
      <div className={styles.actions}>
        {/* Attached the click handler here */}
        <button onClick={onReadMore} className={styles.readMoreBtn}>
          Read more
        </button>
        
        <div className={styles.metrics}>
          <span>👁 {views} views</span>
          <span>{words} words</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;