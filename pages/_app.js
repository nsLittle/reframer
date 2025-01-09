import '../styles/globals.css';
// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

function MyApp({ Component, pageProps }) {
  return (

      <>
        <Component {...pageProps} />
      </>

  );
}

export default MyApp;
