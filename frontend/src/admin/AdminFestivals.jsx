import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { toast } from './adminToast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const EMPTY_FORM = { titleEn: '', titleKn: '', descEn: '', descKn: '', eventDate: '' };

// Date -> value for <input type="datetime-local"> in the admin's local time
const toInputDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const formatDate = (iso) => new Date(iso).toLocaleString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
});

const statusOf = (f) => {
  if (!f.eventDate) return 'nodate';
  return new Date(f.eventDate) >= new Date() ? 'upcoming' : 'past';
};

const STATUS_LABEL = { upcoming: 'Upcoming', past: 'Completed', nodate: 'No date' };
const STATUS_ORDER = { upcoming: 0, nodate: 1, past: 2 };

const sortFestivals = (list) => [...list].sort((a, b) => {
  const r = STATUS_ORDER[statusOf(a)] - STATUS_ORDER[statusOf(b)];
  if (r !== 0 || !a.eventDate || !b.eventDate) return r;
  const diff = new Date(a.eventDate) - new Date(b.eventDate);
  return statusOf(a) === 'past' ? -diff : diff;
});

function AdminFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const setField = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const fetchFestivals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/festivals`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFestivals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast('Could not load festivals. Check your connection and refresh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const handleEdit = (f) => {
    setEditingId(f._id);
    setFormData({
      titleEn: f.titleEn || '',
      titleKn: f.titleKn || '',
      descEn: f.descEn || '',
      descKn: f.descKn || '',
      eventDate: toInputDate(f.eventDate),
    });
    document.querySelector('.af-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/festivals/${editingId}` : `${API_URL}/api/festivals`;
      const payload = {
        ...formData,
        // Send a full ISO date so the server stores the exact moment (admin's local time)
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
      };
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      toast(editingId ? 'Festival updated' : 'Festival added');
      handleCancelEdit();
      fetchFestivals();
    } catch (err) {
      console.error(err);
      toast(`Could not save festival: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (f) => {
    if (!window.confirm(`Delete "${f.titleEn}"? This cannot be undone.`)) return;
    setDeletingId(f._id);
    try {
      const res = await fetch(`${API_URL}/api/festivals/${f._id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast('Festival deleted');
      if (editingId === f._id) handleCancelEdit();
      fetchFestivals();
    } catch (err) {
      console.error(err);
      toast('Could not delete festival', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const sorted = sortFestivals(festivals);
  const upcomingCount = festivals.filter(f => statusOf(f) === 'upcoming').length;

  return (
    <div className="af-layout">
      <section className="af-card af-form-card">
        <h3>{editingId ? 'Edit Festival' : 'Add New Festival'}</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="af-lang-pair">
            <div className="form-group">
              <label htmlFor="af-title-en">Title (English)</label>
              <input id="af-title-en" type="text" value={formData.titleEn} onChange={setField('titleEn')} required />
            </div>
            <div className="form-group">
              <label htmlFor="af-title-kn">Title (Kannada)</label>
              <input id="af-title-kn" type="text" lang="kn" value={formData.titleKn} onChange={setField('titleKn')} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="af-desc-en">Description (English)</label>
            <textarea id="af-desc-en" rows={3} value={formData.descEn} onChange={setField('descEn')} required />
          </div>
          <div className="form-group">
            <label htmlFor="af-desc-kn">Description (Kannada)</label>
            <textarea id="af-desc-kn" rows={3} lang="kn" value={formData.descKn} onChange={setField('descKn')} required />
          </div>
          <div className="form-group">
            <label htmlFor="af-date">
              Event Date & Time
              <span className="af-hint">Optional. Shows a countdown on the website and lists the festival in date order.</span>
            </label>
            <input id="af-date" type="datetime-local" value={formData.eventDate} onChange={setField('eventDate')} />
          </div>
          <div className="af-actions">
            <button type="submit" className="premium-btn primary" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update Festival' : 'Add Festival'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="premium-btn secondary" disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="af-card">
        <div className="af-list-head">
          <h3>Festivals</h3>
          {!loading && (
            <span className="af-count">{festivals.length} total · {upcomingCount} upcoming</span>
          )}
        </div>

        {loading ? (
          <div className="af-list">
            <div className="af-skeleton" />
            <div className="af-skeleton" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="af-empty">
            <CalendarDays size={32} />
            <p>No festivals yet. Add the first one using the form.</p>
          </div>
        ) : (
          <ul className="af-list">
            {sorted.map(f => {
              const status = statusOf(f);
              return (
                <li key={f._id} className={`af-item ${status === 'past' ? 'past' : ''} ${editingId === f._id ? 'editing' : ''}`}>
                  <div className="af-item-top">
                    <span className={`af-badge ${status}`}>{STATUS_LABEL[status]}</span>
                    {f.eventDate && <span className="af-date">{formatDate(f.eventDate)}</span>}
                  </div>
                  <h4>{f.titleEn}</h4>
                  <p className="af-kn" lang="kn">{f.titleKn}</p>
                  <p className="af-desc">{f.descEn}</p>
                  <div className="af-item-actions">
                    <button type="button" className="af-btn" onClick={() => handleEdit(f)}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button type="button" className="af-btn danger" onClick={() => handleDelete(f)} disabled={deletingId === f._id}>
                      <Trash2 size={14} /> {deletingId === f._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminFestivals;
