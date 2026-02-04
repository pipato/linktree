import dynamic from 'next/dynamic'
import Head from 'next/head'

// Import dynamically to avoid SSR issues with canvas
const TwilightLinktree = dynamic(
  () => import('../components/TwilightLinktree'),
  { ssr: false }
)

export default function Home() {
  const siteUrl = 'https://daer.so'
  const title = 'Daeryeok Amara'
  const description = 'Systems Architect. Operating from Vancouver, BC. Critical Infrastructure, Cognitive Search, and Signal Intelligence.'
  
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B1018" />
        
        {/* Canonical */}
        <link rel="canonical" href={siteUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta property="og:site_name" content="Daeryeok Amara" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <TwilightLinktree />
    </>
  )
}
