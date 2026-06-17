import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ADDSPOT - Valet Parking Management'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // Fetch the logo as base64 to embed it in the edge image
  const logoData = await fetch(
    new URL('../public/ADDSTOP LOG.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const logoBase64 = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #07090F 0%, #0E1120 50%, #111827 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: -150,
            left: -150,
            width: 700,
            height: 700,
            background: 'rgba(97, 192, 191, 0.35)',
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
        />
        {/* Glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -150,
            width: 700,
            height: 700,
            background: 'rgba(91, 127, 255, 0.35)',
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
        />

        {/* Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            background: 'rgba(255,255,255,0.04)',
            padding: '70px 100px',
            borderRadius: '40px',
            border: '1.5px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            gap: '36px',
          }}
        >
          {/* Logo image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoBase64}
            alt="ADDSPOT Logo"
            width={480}
            height={160}
            style={{ objectFit: 'contain' }}
          />

          {/* Divider */}
          <div
            style={{
              width: '300px',
              height: '2px',
              background: 'linear-gradient(to right, transparent, rgba(97,192,191,0.6), transparent)',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: '38px',
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 500,
              letterSpacing: '3px',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            El Futuro del Valet Parking
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
