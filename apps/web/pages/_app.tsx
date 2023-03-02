import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

// Chakra
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

// Theme
import theme from "../ui/styles/theme";

// Fonts
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

export { reportWebVitals } from "next-axiom";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider>
          <Component {...pageProps} />
          <Analytics />
        </ColorModeProvider>
      </ChakraProvider>
    </>
  );
}
