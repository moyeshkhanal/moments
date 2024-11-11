import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

      <body
        
      >
        {children}
      </body>
    </html>
  );
}
