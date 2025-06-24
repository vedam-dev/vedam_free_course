"use client";
import "./style.css";
import React, { useState } from "react";

const VideosPage = () => {
  const [shortcode, setShortcode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabaseData, setSupabaseData] = useState({});

  const handleFetch = async (e) => {
    e.preventDefault();
    setError("");
    setVideoData(null);
    setLoading(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortcode, username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setVideoData(data);
      } else {
        setError(data.error || "Failed to fetch video");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
    setLoading(false);
  };

  const handleSupabase = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/videos", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data.data);
    setSupabaseData(data.data);
  };

  return (
    <div>
      <div
        style={{
          maxWidth: 500,
          margin: "40px auto",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 12px #0001",
          background: "#fff",
        }}>
        <h2 style={{ textAlign: "center" }}>Fetch Streamable Video</h2>
        <form onSubmit={handleFetch}>
          <div style={{ marginBottom: 16 }}>
            <label>
              Shortcode
              <br />
              <input
                type="text"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>
              Username
              <br />
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(process.env.STREAMABLE_USERNAME || e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>
              Password
              <br />
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(process.env.STREAMABLE_PASSWORD || e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              background: "#0070f3",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
            }}>
            {loading ? "Fetching..." : "Fetch Video"}
          </button>
        </form>
        {error && <div style={{ marginTop: 16, color: "red" }}>{error}</div>}
        {videoData && videoData.files && videoData.files.mp4 && (
          <div style={{ marginTop: 24 }}>
            <video controls width="100%" src={videoData.files.mp4.url}>
              {/* Add this track element for accessibility */}
              <track
                kind="captions"
                src="" // You can provide a URL to captions file if available
                srcLang="en"
                label="English"
                default
              />
            </video>
            <div style={{ marginTop: 8 }}>
              <a
                href={`https://streamable.com/${shortcode}`}
                target="_blank"
                rel="noopener noreferrer">
                View on Streamable
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="video-container">
        <h2 className="video-title">Videos on Streamable</h2>
        <button className="fetch-button" onClick={handleSupabase}>
          Fetch Videos from Supabase
        </button>

        <div className="video-grid">
          {Array.isArray(supabaseData) && supabaseData.length > 0 ? (
            supabaseData.map((ele, idx) => (
              <div
                key={ele.id || idx} // Better to use a unique ID if available
                className="video-item"
                dangerouslySetInnerHTML={{ __html: ele.embedCode }}
              />
            ))
          ) : (
            <p className="no-videos">No videos found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
