import './globals.css';

export const metadata = {
  title: 'Aplikasi Wishlist Kebutuhan',
  description: 'Kelola wishlist sehari-hari dengan MySQL & Aiven',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}