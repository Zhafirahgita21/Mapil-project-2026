import { NextResponse } from 'next/server';
import pool, { ensureTable } from '../../../../lib/db.js';

// DELETE: Hapus wishlist berdasarkan ID
export async function DELETE(request, { params }) {
  try {
    await ensureTable();
    const { id } = await params;
    await pool.query('DELETE FROM wishlist WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Wishlist berhasil dihapus' });
  } catch (error) {
    console.error('Error DELETE wishlist:', error);
    return NextResponse.json(
      { message: 'Gagal menghapus data', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update status (tercapai / belum tercapai)
export async function PATCH(request, { params }) {
  try {
    await ensureTable();
    const { id } = await params;
    const { status } = await request.json();

    if (!['tercapai', 'belum tercapai'].includes(status)) {
      return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 });
    }

    await pool.query('UPDATE wishlist SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ message: 'Status berhasil diupdate' });
  } catch (error) {
    console.error('Error PATCH wishlist:', error);
    return NextResponse.json(
      { message: 'Gagal update status', error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Edit nama, deskripsi, dan harga wishlist
export async function PUT(request, { params }) {
  try {
    await ensureTable();
    const { id } = await params;
    const { nama_wishlist, deskripsi, harga } = await request.json();

    if (!nama_wishlist || !nama_wishlist.trim()) {
      return NextResponse.json({ message: 'Nama wishlist wajib diisi' }, { status: 400 });
    }

    await pool.query(
      'UPDATE wishlist SET nama_wishlist = ?, deskripsi = ?, harga = ? WHERE id = ?',
      [nama_wishlist.trim(), deskripsi || '', Number(harga) || 0, id]
    );
    return NextResponse.json({ message: 'Wishlist berhasil diupdate' });
  } catch (error) {
    console.error('Error PUT wishlist:', error);
    return NextResponse.json(
      { message: 'Gagal mengupdate data', error: error.message },
      { status: 500 }
    );
  }
}