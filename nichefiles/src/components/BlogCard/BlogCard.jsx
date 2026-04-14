import React from 'react';
import styles from './BlogCard.module.css';


const BlogCard = ({ title, excerpt, category, views, words, onReadMore }) => {
  return (
    <div className={styles.card}>
      {category && <div className={styles.tag}>{category}</div>}
      
      <h2 className={styles.title}>{title}</h2>
      <p>{excerpt}</p>
      
      <div className={styles.actions}>
        {/* 2. Attach the click event to the button */}
        <button onClick={onReadMore}>Read more</button>
        
        <div className={styles.metrics}>
          <span>👁 {views} views</span>
          <span>{words} words</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;