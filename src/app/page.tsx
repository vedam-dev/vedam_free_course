import Script from 'next/script';
export default function Home() {
  return (
    <>

      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-KC46RHD2WJ"
      />

      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KC46RHD2WJ');
          `,
        }}
      />

      <main>
        <h1>Hello Kids you will get free course herea and in replace we will theft your data!</h1>
      </main>
    </>
  );
}
