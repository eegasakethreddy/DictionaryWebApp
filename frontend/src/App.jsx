import React, { useEffect, useRef, useState } from "react";
import WordCard from "./components/WordCard";

const STORAGE_KEY = "dict_recent_searches_v1";

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setRecent(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // focus input on mount for keyboard accessibility
    inputRef.current?.focus();
  }, []);

  function addToRecent(word) {
    if (!word) return;
    const normalized = word.toLowerCase();
    setRecent(prev => {
      const next = [normalized, ...prev.filter(x => x !== normalized)].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function lookup(word) {
    setError(null);
    setData(null);
    if (!word?.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/lookup/${encodeURIComponent(word.trim())}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Lookup failed");
      }
      const json = await res.json();
      setData(json);
      addToRecent(word);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e?.preventDefault();
    await lookup(query);
  }

  function handleRecentClick(word) {
    setQuery(word);
    lookup(word);
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  }

  return (
    <div className="app-wrap">
      <div className="container" role="main">
        <header className="header-row">
          <div className="header-left">
            <div className="logo" aria-hidden>📘</div>
            <h1 className="header">Dictionary</h1>
          </div>
          <div className="recent-actions">
            <button className="ghost" onClick={() => { setQuery(""); setData(null); setError(null); inputRef.current?.focus(); }} aria-label="Clear search">Clear</button>
            <button className="ghost" onClick={() => { localStorage.clear(); setRecent([]); }} aria-label="Clear search history">Clear history</button>
          </div>
        </header>

        <form onSubmit={handleSearch} className="search-row" role="search" aria-label="Search form">
          <label htmlFor="search" className="sr-only">Search word</label>
          <input
            id="search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a word (e.g. 'hello')"
            aria-label="Search word"
          />
          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="content-grid">
          <aside className="sidebar" aria-label="Recent searches">
            <div className="sidebar-card">
              <div className="sidebar-title">Recent searches</div>
              {recent.length === 0 ? (
                <div className="muted">No recent searches yet.</div>
              ) : (
                <ul className="recent-list">
                  {recent.map((r, i) => (
                    <li key={r}>
                      <button className="chip" onClick={() => handleRecentClick(r)}>{r}</button>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{marginTop:8}}>
                <button className="linkish" onClick={clearHistory}>Clear</button>
              </div>
            </div>
          </aside>

          <section className="results" aria-live="polite">
            {error && <div className="error" role="alert">{error}</div>}

            {data && Array.isArray(data) ? (
              data.map((entry, idx) => <WordCard key={idx} entry={entry} />)
            ) : (
              <div className="word-card empty">
                <div className="word-title">Search for a word to see results.</div>
                <div className="muted">Try: <button className="chip" onClick={() => handleRecentClick("hello")}>hello</button></div>
              </div>
            )}
          </section>
        </div>

        <footer className="footer">
          <div>
            <label>EEGA SAKETH REDDY</label></div>
        </footer>
      </div>
    </div>
  );
}
