import { useState, useEffect } from 'react';
import { client } from '../client';
import BlogCard from '../components/BlogCard/BlogCard';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Initialize navigation
  const navigate = useNavigate();

  // Updated Function: Now handles views AND navigation
  const handleReadMore = async (postId, slug) => {
    try {
      // 1. Update views in Sanity
      await client
        .patch(postId)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit();
      
      // 2. Update local state for immediate feedback
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, views: (post.views || 0) + 1 } : post
        )
      );

      // 3. Navigate to the post detail page
      navigate(`/read/${slug}`);
    } catch (err) {
      console.error("Failed to update view count:", err.message);
      // Navigate even if the view update fails so user experience isn't broken
      navigate(`/read/${slug}`);
    }
  };

  useEffect(() => {
    const postsQuery = `*[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      views,
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

  const displayedPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const latestPost = posts[0];
  const gridPosts = displayedPosts;

  return (
    <div>
      {/* GLOBAL HERO BANNER */}
      {latestPost && (
        <section className={styles.heroSection}>
          <div className={styles.latestIndicator}>⚡️ Latest</div>
          <h1 className={styles.heroTitle}>{latestPost.title}</h1>
          <button 
            onClick={() => handleReadMore(latestPost._id, latestPost.slug)}
            style={{ fontSize: '1.2rem', padding: '0.8rem 1.5rem' }}
          >
            Read more
          </button>
          
          <div className={styles.heroMetrics}>
            <span>👁 {latestPost.views || 0} views</span>
            <span>{latestPost.bodyText ? latestPost.bodyText.split(/\s+/).length : 0} words</span>
          </div>
        </section>
      )}

      {/* SCROLL SECTION */}
      <section className={styles.scrollSection}>
        
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
                  views={post.views || 0}
                  onReadMore={() => handleReadMore(post._id, post.slug)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}