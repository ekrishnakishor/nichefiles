// src/pages/Read.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../client";
import BlogCard from "../components/BlogCard/BlogCard";
import styles from "./Read.module.css";

export default function Read() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch the specific post and a few suggestions
    const query = `{
      "currentPost": *[_type == "post" && slug.current == $slug][0] {
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

    client
      .fetch(query, { slug })
      .then((data) => {
        setPost(data.currentPost);
        setSuggestions(data.morePosts);
        setLoading(false);
        window.scrollTo(0, 0);

        // THE NEW API CALL!
        if (data.currentPost && data.currentPost._id) {
          fetch("/api/increment-views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: data.currentPost._id }),
          })
            .then((res) => {
              if (!res.ok) console.error("API failed to update views");
            })
            .catch((err) => console.error("Network error:", err));
        }
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className={styles.container}>Loading post...</div>;
  if (!post) return <div className={styles.container}>Post not found.</div>;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>
        ← Back
      </Link>

      <article className={styles.article}>
        <div className={styles.meta}>
          {post.category && <span className={styles.tag}>{post.category}</span>}
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          {/* We show the views + 1 locally so the user instantly sees their own view counted */}
          <span>👁 {(post.views || 0) + 1} views</span>
        </div>

        <h1 className={styles.postTitle}>{post.title}</h1>

        <div className={styles.content}>{post.bodyText}</div>
      </article>

      <section className={styles.otherPosts}>
        <h3>More from nicheFiles</h3>
        <div className={styles.suggestionGrid}>
          {suggestions.map((p) => {
            const wordCount = p.bodyText ? p.bodyText.split(/\s+/).length : 0;
            return (
              <BlogCard
                key={p._id}
                title={p.title}
                category={p.category}
                excerpt={p.bodyText?.substring(0, 100) + "..."}
                words={wordCount}
                views={p.views || 0}
                onReadMore={() => (window.location.href = `/read/${p.slug}`)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
