import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="GPT3 Playground"
          />
          <meta property="og:site_name" content="bedtimestory.ai" />
          <meta
            property="og:description"
            content="Play with prompts and learn fast"
          />
          <meta property="og:title" content="GPT3 Playground" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="GPT3 Playground" />
          <meta
            name="twitter:description"
            content="Play with prompts and learn fast"
          />
          <meta
            property="og:image"
            content="https://story-playground.vercel.app/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://story-playground.vercel.app//og-image.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
