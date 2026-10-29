'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [wishlist, setWishlist] = useState([]);
  const [namaWishlist, setNamaWishlist] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (Array.isArray(data)) setWishlist(data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const resetForm = () => {
    setNamaWishlist('');
    setDeskripsi('');
    setHarga('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaWishlist.trim()) return alert('Nama wishlist tidak boleh kosong!');

    setLoading(true);
    try {
      const url = editingId ? `/api/wishlist/${editingId}` : '/api/wishlist';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_wishlist: namaWishlist,
          deskripsi,
          harga: harga ? Number(harga) : 0,
        }),
      });

      if (res.ok) {
        resetForm();
        fetchWishlist();
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Terjadi kesalahan') + '\n' + (errorData.error || ''));
      }
    } catch (err) {
      console.error('Error submit:', err);
      alert('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNamaWishlist(item.nama_wishlist);
    setDeskripsi(item.deskripsi || '');
    setHarga(String(Math.round(Number(item.harga))));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return;
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (editingId === id) resetForm();
        fetchWishlist();
      }
    } catch (err) {
      console.error('Gagal menghapus:', err);
    }
  };

  const handleToggleStatus = async (item) => {
    const statusBaru = item.status === 'tercapai' ? 'belum tercapai' : 'tercapai';
    try {
      const res = await fetch(`/api/wishlist/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusBaru }),
      });
      if (res.ok) fetchWishlist();
    } catch (err) {
      console.error('Gagal update status:', err);
    }
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);

  return (
    <main className="container">
      <h1 className="title">My Wishlist 🎁</h1>

      <form onSubmit={handleSubmit} className="wishlist-form">
        <input
          type="text"
          placeholder="Nama Wishlist (contoh: Laptop Baru)"
          value={namaWishlist}
          onChange={(e) => setNamaWishlist(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="number"
          placeholder="Estimasi Harga (contoh: 15000000)"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Deskripsi (opsional)"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="textarea-field"
          rows={2}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Wishlist'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="btn-secondary">
            Batal Edit
          </button>
        )}
      </form>

      <div className="wishlist-list">
        {wishlist.length === 0 ? (
          <p className="empty-text">Belum ada wishlist. Yuk tambah!</p>
        ) : (
          wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div>
                <h3 className={`item-title ${item.status === 'tercapai' ? 'completed' : ''}`}>
                  {item.nama_wishlist}
                </h3>
                <p style={{ fontWeight: '600', color: '#059669', fontSize: '0.95rem', marginTop: '2px' }}>
                  {formatRupiah(item.harga)}
                </p>
                {item.deskripsi && <p className="item-desc">{item.deskripsi}</p>}
                <span className={`badge ${item.status === 'tercapai' ? 'badge-done' : 'badge-pending'}`}>
                  {item.status}
                </span>
              </div>
              <div className="action-buttons">
                <button onClick={() => handleToggleStatus(item)} className="btn-success">
                  {item.status === 'tercapai' ? 'Batal' : 'Selesai'}
                </button>
                <button onClick={() => handleEdit(item)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger">
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}