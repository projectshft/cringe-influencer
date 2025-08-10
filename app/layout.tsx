import './globals.css';

export const metadata = {
	title: 'Cringe Influencer RAG',
	description: 'Backend dev paradise - no fancy styling here',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
