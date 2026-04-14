// src/pages/Read.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../client";
import BlogCard from "../components/BlogCard/BlogCard";
import styles from "./Read.module.css";

// 1. Import PortableText and the Syntax Highlighter tools
import { PortableText } from '@portabletext/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// You can change 'vscDarkPlus' to other themes like 'atomDark' or 'dracula' later!
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 2. Define how custom blocks (like 'code') should look
const myPortableTextComponents = {
  types: {
    code: ({ value }) => (
      <div style={{ margin: '2rem 0', borderRadius: '8px', overflow: 'hidden' }}>
        <SyntaxHighlighter
          language={value.language || 'text'}
          style={vscDarkPlus}
          customStyle={{ padding: '1.5rem', fontSize: '0.95rem' }}
        >
          {value.code}
        </SyntaxHighlighter>
      </div>
    ),
  },
};

export default function Read() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          <span>👁 {(post.views || 0) + 1} views</span>
        </div>

        <h1 className={styles.postTitle}>{post.title}</h1>

        <div className={styles.content}>
          {/* 3. Swap the raw text string for the PortableText component */}
          <PortableText 
            value={post.body} 
            components={myPortableTextComponents} 
          />
        </div>
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