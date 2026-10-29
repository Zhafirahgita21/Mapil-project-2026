import { NextResponse } from 'next/server';
import pool, { ensureTable } from '../../../lib/db.js';

// GET: Ambil semua wishlist
export async function GET() {
  try {
    await ensureTable();
    const [rows] = await pool.query('SELECT * FROM wishlist ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error GET wishlist:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Tambah wishlist baru
export async function POST(request) {
  try {
    await ensureTable();
    const { nama_wishlist, deskripsi, harga } = await request.json();

    if (!nama_wishlist || !nama_wishlist.trim()) {
      return NextResponse.json(
        { message: 'Nama wishlist wajib diisi' },
        { status: 400 }
      );
    }

    const hargaAngka = Number(harga) || 0;

    const [result] = await pool.query(
      'INSERT INTO wishlist (nama_wishlist, deskripsi, harga) VALUES (?, ?, ?)',
      [nama_wishlist.trim(), deskripsi || '', hargaAngka]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        nama_wishlist,
        deskripsi,
        harga: hargaAngka,
        status: 'belum tercapai',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error POST wishlist:', error);
    return NextResponse.json(
      { message: 'Gagal menambah data', error: error.message },
      { status: 500 }
    );
  }
}