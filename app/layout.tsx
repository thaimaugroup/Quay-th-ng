import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Hái Lộc Đầu Xuân - Festive Staff Input Form",
    description: "Chương trình vòng quay may mắn Tết Nguyên Đán",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
            </head>
            <body className="font-body bg-background-light text-gray-800 antialiased">{children}</body>
        </html>
    );
}
