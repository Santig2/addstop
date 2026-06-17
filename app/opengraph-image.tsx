import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ADDSPOT - Valet Parking Management'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0A0B0F, #1A1D2D)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: -200,
            width: 800,
            height: 800,
            background: 'rgba(91, 127, 255, 0.5)',
            borderRadius: '50%',
            filter: 'blur(150px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -200,
            width: 800,
            height: 800,
            background: 'rgba(97, 192, 191, 0.5)',
            borderRadius: '50%',
            filter: 'blur(150px)',
          }}
        />

        {/* Branding Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '80px 120px',
            borderRadius: '40px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo Text */}
          <div
            style={{
              fontSize: '140px',
              fontWeight: '900',
              letterSpacing: '-4px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1,
              fontFamily: 'sans-serif',
            }}
          >
            <span style={{ color: '#61c0bf' }}>ADD</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>SPOT</span>
            <span style={{ color: '#5B7FFF', fontSize: '100px', marginLeft: '20px' }}>✨</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '42px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 500,
              marginTop: '40px',
              letterSpacing: '2px',
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
          >
            El Futuro del Valet Parking
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
