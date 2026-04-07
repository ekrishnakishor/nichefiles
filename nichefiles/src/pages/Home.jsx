import { useState, useEffect } from 'react';
import { client } from '../client';
import BlogCard from '../components/BlogCard/BlogCard';
import styles from './Home.module.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsQuery = `*[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      "category": category->title,
      "bodyText": pt::text(body) 
    }`;

    const categoriesQuery = `*[_type == "category"] | order(title asc) {
      title
    }`;

    Promise.all([
      client.fetch(postsQuery),
      client.fetch(categoriesQuery)
    ])
      .then(([postsData, categoriesData]) => {
        setPosts(postsData);
        const fetchedCategories = categoriesData.map(c => c.title).filter(Boolean);
        setCategories(['All', ...fetchedCategories]);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading the void...</div>;

  // 1. Filter the posts for the grid based on the active category
  const displayedPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  // 2. The Fix: The Banner ALWAYS looks at the master `posts` array, never the filtered one!
  const latestPost = posts[0];
  
  // 3. Grid gets the filtered posts.
  const gridPosts = displayedPosts;

  return (
    <div>
      {/* GLOBAL HERO BANNER (Locks to the absolute newest post overall) */}
      {latestPost && (
        <section className={styles.heroSection}>
          <div className={styles.latestIndicator}>⚡️ Latest</div>
          <h1 className={styles.heroTitle}>{latestPost.title}</h1>
          <button style={{ fontSize: '1.2rem', padding: '0.8rem 1.5rem' }}>Read more</button>
          
          <div className={styles.heroMetrics}>
            <span>👁 0 views</span>
            <span>{latestPost.bodyText ? latestPost.bodyText.split(/\s+/).length : 0} words</span>
          </div>
        </section>
      )}

      {/* SCROLL SECTION */}
      <section className={styles.scrollSection}>
        
        {/* Category Bar */}
        <div className={styles.categoryBar}>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ 
                backgroundColor: activeCategory === cat ? 'var(--text-color)' : 'transparent',
                color: activeCategory === cat ? 'var(--bg-color)' : 'var(--text-color)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Grid */}
        {gridPosts.length === 0 ? (
          <div style={{ textAlign: 'center', margin: '6rem 0', opacity: 0.6 }}>
            <span style={{ fontSize: '4rem', display: 'block', margin: '0 auto 1rem' }}>📭</span>
            <h2>Nothing here yet.</h2>
            <p>I haven't written any posts for this category.</p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {gridPosts.map((post) => {
              const wordCount = post.bodyText ? post.bodyText.split(/\s+/).length : 0;
              const excerpt = post.bodyText ? post.bodyText.substring(0, 120) + '...' : 'No content...';

              return (
                <BlogCard 
                  key={post._id}
                  title={post.title}
                  category={post.category}
                  excerpt={excerpt}
                  words={wordCount}
                  views={0}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}