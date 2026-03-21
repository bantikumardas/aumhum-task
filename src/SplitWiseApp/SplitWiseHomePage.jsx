import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GROUP_COLORS = [
  ["#6366f1", "#818cf8"],
  ["#22c55e", "#4ade80"],
  ["#f59e0b", "#fbbf24"],
  ["#ec4899", "#f472b6"],
  ["#06b6d4", "#22d3ee"],
  ["#8b5cf6", "#a78bfa"],
  ["#f97316", "#fb923c"],
];

function getGroupColor(id) {
  return GROUP_COLORS[id % GROUP_COLORS.length];
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .gp-root {
    min-height: 100vh;
    background: #070710;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    position: relative;
    overflow-x: hidden;
  }

  /* Subtle noise grain overlay */
  .gp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  }

  /* Ambient glow */
  .gp-glow {
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* Header */
  .gp-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(7,7,16,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .gp-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .gp-brand-dot {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #6366f1, #22c55e);
    box-shadow: 0 0 16px rgba(99,102,241,0.4);
  }
  .gp-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }
  .gp-header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .gp-avatar-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 40px;
    padding: 6px 14px 6px 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
  }
  .gp-avatar-circle {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .gp-logout-btn {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    color: #fca5a5;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    padding: 7px 14px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .gp-logout-btn:hover {
    background: rgba(239,68,68,0.2);
    border-color: rgba(239,68,68,0.4);
  }

  /* Main content */
  .gp-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 32px 80px;
    position: relative;
    z-index: 1;
  }

  /* Page title area */
  .gp-page-top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }
  .gp-title {
    font-family: 'Syne', sans-serif;
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
    color: #fff;
  }
  .gp-title span {
    background: linear-gradient(90deg, #6366f1, #22c55e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .gp-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    margin-top: 8px;
    font-weight: 300;
  }
  .gp-new-btn {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 12px 22px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    transition: transform 0.15s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .gp-new-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.5);
  }

  /* Stats row */
  .gp-stats {
    display: flex;
    gap: 12px;
    margin-bottom: 36px;
    flex-wrap: wrap;
  }
  .gp-stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 16px 24px;
    min-width: 120px;
  }
  .gp-stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
  }
  .gp-stat-label {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* Search bar */
  .gp-search-wrap {
    position: relative;
    margin-bottom: 32px;
    max-width: 400px;
  }
  .gp-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    opacity: 0.35;
    pointer-events: none;
  }
  .gp-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 11px 14px 11px 40px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, background 0.2s;
  }
  .gp-search::placeholder { color: rgba(255,255,255,0.2); }
  .gp-search:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.06);
  }

  /* Groups grid */
  .gp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 20px;
  }

  /* Group card */
  .gp-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 24px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    animation: cardFadeIn 0.4s ease both;
  }
  .gp-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.15);
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  }
  .gp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--card-gradient);
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 20px 20px 0 0;
  }
  .gp-card:hover::before { opacity: 1; }

  /* Glow blob inside card */
  .gp-card-glow {
    position: absolute;
    top: -30px; right: -30px;
    width: 120px; height: 120px;
    border-radius: 50%;
    opacity: 0.08;
    filter: blur(30px);
    background: var(--card-color-1);
    pointer-events: none;
  }

  @keyframes cardFadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .gp-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .gp-card-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    background: var(--card-gradient-bg);
    color: var(--card-color-1);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .gp-card-arrow {
    width: 32px; height: 32px;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    transition: background 0.2s, color 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .gp-card:hover .gp-card-arrow {
    background: rgba(255,255,255,0.1);
    color: #fff;
    transform: translate(2px, -2px);
  }

  .gp-card-name {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
    letter-spacing: -0.3px;
    position: relative;
    z-index: 1;
  }
  .gp-card-desc {
    font-size: 13px;
    color: rgba(255,255,255,0.38);
    line-height: 1.5;
    margin-bottom: 20px;
    font-weight: 300;
    position: relative;
    z-index: 1;
  }
  .gp-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
    position: relative;
    z-index: 1;
  }
  .gp-card-meta {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .gp-card-date {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
  }
  .gp-card-creator-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 4px 10px 4px 4px;
  }
  .gp-creator-dot {
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: var(--card-gradient);
    flex-shrink: 0;
  }
  .gp-creator-name {
    font-size: 11px;
    color: rgba(255,255,255,0.45);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Loading skeleton */
  .gp-skeleton {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 24px;
    overflow: hidden;
    position: relative;
  }
  .gp-skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }
  .sk-block {
    background: rgba(255,255,255,0.06);
    border-radius: 6px;
    margin-bottom: 12px;
  }

  /* Error */
  .gp-error {
    text-align: center;
    padding: 80px 20px;
  }
  .gp-error-icon { font-size: 48px; margin-bottom: 16px; }
  .gp-error-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }
  .gp-error-msg { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 24px; }
  .gp-retry-btn {
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 10px;
    color: #818cf8;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .gp-retry-btn:hover { background: rgba(99,102,241,0.25); }

  /* Empty */
  .gp-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: rgba(255,255,255,0.3);
  }
  .gp-empty-icon { font-size: 52px; margin-bottom: 16px; filter: grayscale(1) opacity(0.4); }
  .gp-empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    margin-bottom: 6px;
  }

  @media (max-width: 600px) {
    .gp-main { padding: 28px 16px 60px; }
    .gp-title { font-size: 28px; }
    .gp-header { padding: 0 16px; }
    .gp-grid { grid-template-columns: 1fr; }
  }
`;

function SkeletonCard() {
  return (
    <div className="gp-skeleton">
      <div className="sk-block" style={{ width: 52, height: 52, borderRadius: 14, marginBottom: 20 }} />
      <div className="sk-block" style={{ width: "70%", height: 16 }} />
      <div className="sk-block" style={{ width: "90%", height: 12 }} />
      <div className="sk-block" style={{ width: "60%", height: 12 }} />
      <div className="sk-block" style={{ width: "100%", height: 1, marginTop: 20 }} />
    </div>
  );
}

export default function GroupsPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail") || "User";
  const initials = email.slice(0, 2).toUpperCase();

  const fetchGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/splitwise/get/group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load groups");
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const filtered = groups.filter((g) =>
    g.groupName.toLowerCase().includes(search.toLowerCase()) ||
    (g.groupDescription || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="gp-root">
        <div className="gp-glow" />

        {/* Header */}
        <header className="gp-header">
          <div className="gp-brand">
            <div className="gp-brand-dot" />
            <span className="gp-brand-name">SplitMate</span>
          </div>
          <div className="gp-header-right">
            <div className="gp-avatar-pill">
              <div className="gp-avatar-circle">{initials}</div>
              {email}
            </div>
            <button className="gp-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="gp-main">
          {/* Top */}
          <div className="gp-page-top">
            <div>
              <div className="gp-title">
                Your <span>Groups</span>
              </div>
              <div className="gp-subtitle">
                Click any group to view expenses & settle up
              </div>
            </div>
            <button className="gp-new-btn">+ New Group</button>
          </div>

          {/* Stats */}
          {!loading && !error && (
            <div className="gp-stats">
              <div className="gp-stat">
                <div className="gp-stat-val">{groups.length}</div>
                <div className="gp-stat-label">Total Groups</div>
              </div>
              <div className="gp-stat">
                <div className="gp-stat-val">{filtered.length}</div>
                <div className="gp-stat-label">Showing</div>
              </div>
            </div>
          )}

          {/* Search */}
          {!loading && !error && groups.length > 0 && (
            <div className="gp-search-wrap">
              <span className="gp-search-icon">🔍</span>
              <input
                className="gp-search"
                placeholder="Search groups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="gp-error">
              <div className="gp-error-icon">⚠️</div>
              <div className="gp-error-title">Couldn't load groups</div>
              <div className="gp-error-msg">{error}</div>
              <button className="gp-retry-btn" onClick={fetchGroups}>
                Try Again
              </button>
            </div>
          )}

          {/* Grid */}
          {!error && (
            <div className="gp-grid">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : filtered.length === 0
                ? (
                  <div className="gp-empty">
                    <div className="gp-empty-icon">👥</div>
                    <div className="gp-empty-title">
                      {search ? "No groups match your search" : "No groups yet"}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      {search ? "Try a different keyword" : "Create your first group to get started"}
                    </div>
                  </div>
                )
                : filtered.map((group, i) => {
                    const [c1, c2] = getGroupColor(group.id);
                    const delay = `${i * 0.07}s`;
                    const creatorName =
                      group.createdBy?.userName ||
                      group.createdBy?.email ||
                      "Unknown";
                    const creatorInitials = getInitials(creatorName);

                    return (
                      <div
                        key={group.id}
                        className="gp-card"
                        style={{
                          "--card-color-1": c1,
                          "--card-color-2": c2,
                          "--card-gradient": `linear-gradient(135deg, ${c1}, ${c2})`,
                          "--card-gradient-bg": `${c1}18`,
                          animationDelay: delay,
                        }}
                        onClick={() => navigate(`/splitwise/group/${group.id}`)}
                      >
                        <div className="gp-card-glow" />

                        <div className="gp-card-top">
                          <div className="gp-card-icon">
                            {getInitials(group.groupName)}
                          </div>
                          <div className="gp-card-arrow">↗</div>
                        </div>

                        <div className="gp-card-name">{group.groupName}</div>
                        <div className="gp-card-desc">
                          {group.groupDescription || "No description provided"}
                        </div>

                        <div className="gp-card-footer">
                          <div className="gp-card-creator-pill">
                            <div
                              className="gp-creator-dot"
                              style={{
                                "--card-gradient": `linear-gradient(135deg, ${c1}, ${c2})`,
                                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                              }}
                            >
                              {creatorInitials}
                            </div>
                            <span className="gp-creator-name">
                              {creatorName.split("@")[0]}
                            </span>
                          </div>
                          <div className="gp-card-date">
                            {formatDate(group.createdDate)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}