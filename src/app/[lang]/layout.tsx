import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { PageParams } from '@/types';
import React from 'react';
import { Navigation } from '@/app/components/navigation/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
	params: { lang },
}: {
	children: React.ReactNode;
	params: PageParams;
}) {
	return (
		<html lang={lang}>
			<body className={inter.className}>
				<Navigation lang={lang} />
				<div className="min-h-fillScreen">{children}</div>
			</body>
		</html>
	);
}
