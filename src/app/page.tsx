import Script from 'next/script';
export default function Home() {
  return (
    <>

      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-0XZNDQX2GJ"
      />
    
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0XZNDQX2GJ');
          `,
        }}
      />

      <main>
        <h1>Hello Worls!</h1>
       
      </main>
    </>
  );
}
