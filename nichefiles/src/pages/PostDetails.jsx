import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { client } from '../client';
import BlogCard from '../components/BlogCard/BlogCard';
import styles from './PostDetail.module.css';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query to fetch the specific post AND 3 other recent posts
    const query = `{
      "mainPost": *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        publishedAt,
        "category": category->title,
        body,
        "bodyText": pt::text(body),
        views
      },
      "morePosts": *[_type == "post" && slug.current != $slug] | order(_createdAt desc) [0...3] {
        _id,
        title,
        "slug": slug.current,
        "category": category->title,
        "bodyText": pt::text(body),
        views
      }
    }`;

    client.fetch(query, { slug })
      .then((data) => {
        setPost(data.mainPost);
        setOtherPosts(data.morePosts);
        setLoading(false);
        window.scrollTo(0, 0); // Scroll to top when post loads
      })
      .catch(console.error);
  }, [slug]);

  if (loading) return <div className={styles.container}>Loading post...</div>;
  if (!post) return <div className={styles.container}>Post not found.</div>;

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <Link to="/" className={styles.backButton}>
        ← Back to home
      </Link>

      <article className={styles.article}>
        <div className={styles.meta}>
          <span className={styles.categoryTag}>{post.category}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>

        <h1 className={styles.title}>{post.title}</h1>
        
        {/* We will handle the Body rendering in the next step */}
        <div className={styles.content}>
          {post.bodyText} 
        </div>
      </article>

      {/* "Other Posts" Section */}
      <section className={styles.suggestions}>
        <h3 className={styles.suggestionTitle}>Keep Reading</h3>
        <div className={styles.grid}>
          {otherPosts.map((p) => (
            <BlogCard 
              key={p._id}
              title={p.title}
              category={p.category}
              excerpt={p.bodyText?.substring(0, 80) + '...'}
              views={p.views || 0}
              // This is where you'd link to the other posts
            />
          ))}
        </div>
      </section>
    </div>
  );
}