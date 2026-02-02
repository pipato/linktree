import dynamic from 'next/dynamic'
import Head from 'next/head'

// Import dynamically to avoid SSR issues with canvas
const TwilightLinktree = dynamic(
  () => import('../components/TwilightLinktree'),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      <Head>
        <title>twilight.signal</title>
        <meta name="description" content="A dreamy ethereal linktree with glitch effects" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TwilightLinktree />
    </>
  )
}
