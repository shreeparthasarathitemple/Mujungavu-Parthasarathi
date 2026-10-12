import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Image as ImageIcon, Users, Activity, Newspaper, Plus, ArrowRight, CalendarClock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getJson = async (url, opts) => {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const goTo = (tab) => { window.location.hash = tab; };

function StatCard({ icon: Icon, label, value, hint, tone, loading }) {
  return (
    <div className={`ov-stat tone-${tone}`}>
      <div className="ov-stat-icon"><Icon size={22} /></div>
      <div className="ov-stat-body">
        <span className="ov-stat-label">{label}</span>
        <span className="ov-stat-value">{loading ? <span className="ov-shimmer" /> : value}</span>
        {hint && !loading && <span className="ov-stat-hint">{hint}</span>}
      </div>
    </div>
  );
}

function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ announcements: [], festivals: [], gallery: [], news: [], analytics: null });

  useEffect(() => {
    (async () => {
      const [announcements, festivals, gallery, news, analytics] = await Promise.all([
        getJson(`${API_URL}/api/announcements/all`, { credentials: 'include' }),
        getJson(`${API_URL}/api/festivals`),
        getJson(`${API_URL}/api/gallery`),
        getJson(`${API_URL}/api/news/all`, { credentials: 'include' }),
        getJson(`${API_URL}/api/analytics/stats`, { credentials: 'include' }),
      ]);
      setData({
        announcements: Array.isArray(announcements) ? announcements : [],
        festivals: Array.isArray(festivals) ? festivals : [],
        gallery: Array.isArray(gallery) ? gallery : [],
        news: Array.isArray(news) ? news : [],
        analytics,
      });
      setLoading(false);
    })();
  }, []);

  const now = new Date();
  const upcoming = data.festivals
    .filter(f => f.eventDate && new Date(f.eventDate) >= now)
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  const nextFestival = upcoming[0];
  const daysToNext = nextFestival ? Math.ceil((new Date(nextFestival.eventDate) - now) / 86400000) : null;
  const activeAnnouncements = data.announcements.filter(a => a.isActive).length;
  const published = data.news.filter(n => n.status === 'published').length;
  const chartData = data.analytics?.chartData || [];
  const hasAnalytics = data.analytics && typeof data.analytics.totalVisitors === 'number';

  return (
    <div className="admin-tab-content">
      <div className="admin-header-inline">
        <h3>Dashboard</h3>
        <p>Everything happening on the temple website at a glance.</p>
      </div>

      <div className="ov-grid">
        <StatCard icon={Activity} tone="saffron" label="Page views today" loading={loading}
          value={hasAnalytics ? data.analytics.visitorsToday.toLocaleString('en-IN') : '—'}
          hint={hasAnalytics ? null : 'Analytics not available'} />
        <StatCard icon={Users} tone="maroon" label="Total page views" loading={loading}
          value={hasAnalytics ? data.analytics.totalVisitors.toLocaleString('en-IN') : '—'} />
        <StatCard icon={Calendar} tone="gold" label="Upcoming festivals" loading={loading}
          value={upcoming.length} hint={`${data.festivals.length} in total`} />
        <StatCard icon={Megaphone} tone="green" label="Live announcements" loading={loading}
          value={activeAnnouncements} hint={`${data.announcements.length} in total`} />
      </div>

      <div className="ov-main">
        <section className="ov-panel ov-chart">
          <div className="ov-panel-head">
            <h4>Page views</h4>
            <span className="ov-muted">Last 7 days</span>
          </div>
          <div className="ov-chart-box">
            {loading ? (
              <div className="ov-chart-empty"><span className="ov-shimmer wide" /></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ovVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e07a1f" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#e07a1f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short' })} tick={{ fill: '#9a8a7a', fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
                  <YAxis allowDecimals={false} tick={{ fill: '#9a8a7a', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e8dc" />
                  <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })} formatter={(v) => [v, 'Page views']} contentStyle={{ borderRadius: 12, border: '1px solid #f0e8dc', boxShadow: '0 10px 25px rgba(80,40,10,0.12)' }} />
                  <Area type="monotone" dataKey="visits" stroke="#e07a1f" strokeWidth={3} fill="url(#ovVisits)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#e07a1f' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="ov-chart-empty">
                <Activity size={28} />
                <p>No visit data yet. It will appear here as people visit the site.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="ov-side">
          <section className="ov-panel ov-next">
            <div className="ov-panel-head">
              <h4>Next festival</h4>
              <CalendarClock size={18} />
            </div>
            {loading ? (
              <span className="ov-shimmer wide" />
            ) : nextFestival ? (
              <>
                <div className="ov-next-days">
                  <strong>{daysToNext}</strong>
                  <span>{daysToNext === 1 ? 'day to go' : 'days to go'}</span>
                </div>
                <h5>{nextFestival.titleEn}</h5>
                <p className="ov-muted" lang="kn">{nextFestival.titleKn}</p>
                <p className="ov-next-date">
                  {new Date(nextFestival.eventDate).toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
              </>
            ) : (
              <p className="ov-muted">No upcoming festival has a date. Add one so visitors see a countdown.</p>
            )}
            <button type="button" className="ov-link" onClick={() => goTo('festivals')}>
              Manage festivals <ArrowRight size={15} />
            </button>
          </section>

          <section className="ov-panel">
            <div className="ov-panel-head"><h4>Quick actions</h4></div>
            <div className="ov-actions">
              <button type="button" onClick={() => goTo('announcements')}><Megaphone size={18} /> New announcement</button>
              <button type="button" onClick={() => goTo('festivals')}><Plus size={18} /> Add festival</button>
              <button type="button" onClick={() => goTo('news')}><Newspaper size={18} /> Write news</button>
              <button type="button" onClick={() => goTo('gallery')}><ImageIcon size={18} /> Upload photos</button>
            </div>
          </section>

          <section className="ov-panel ov-mini">
            <div><span className="ov-muted">Gallery items</span><strong>{loading ? '…' : data.gallery.length}</strong></div>
            <div><span className="ov-muted">Published news</span><strong>{loading ? '…' : published}</strong></div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AdminOverview;
