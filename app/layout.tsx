import { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/navbar/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import LocationFilter from "@/components/LocationFilter";

export const metadata: Metadata = {
  title: "Amahan Hotels",
  description: "Luxury Hotel",
  icons: {
    icon: "/logo.png",
  },
};

export const dynamic = 'force-dynamic'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar />
              <LocationFilter/>
              <section className="flex grow">
                <Container>
                  {children}
                </Container>
              </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
//youtube-Theo-t3.gg