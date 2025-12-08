'use client'

import dynamic from 'next/dynamic'

const WireframeBackground = dynamic(
  () => import('./WireframeBackground'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(180deg, #F8FAFC 0%, #EDF2F7 100%)',
        }}
      />
    ),
  }
)

export default function DynamicBackground() {
  return <WireframeBackground />
}
