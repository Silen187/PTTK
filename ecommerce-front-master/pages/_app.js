
import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { Helmet } from "react-helmet";
import { SessionProvider } from "next-auth/react";

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif; 
  }
`;

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <GlobalStyles />
        <CartContextProvider>
          {/* <Header /> */}
          <Component {...pageProps} />
        </CartContextProvider>
      </>
    </SessionProvider>
  );
}
