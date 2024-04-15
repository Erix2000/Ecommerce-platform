import React from 'react'
import ContentLoader from 'react-content-loader'

export default function CouponCardLoader({ type = true }) {
  return type ? (
    <ContentLoader
      speed={2}
      width={309}
      height={150}
      viewBox="0 0 309 150"
      backgroundColor="#d9d9d9"
      foregroundColor="#ababab"
    >
      <rect x="0" y="0" rx="0" ry="0" width="150" height="150" />
      <rect x="166" y="57" rx="0" ry="0" width="100" height="15" />
      <rect x="166" y="107" rx="0" ry="0" width="150" height="15" />
      <rect x="166" y="27" rx="0" ry="0" width="123" height="20" />
      <rect x="166" y="82" rx="0" ry="0" width="100" height="15" />
    </ContentLoader>
  ) : (
    <ContentLoader
      speed={2}
      width={309}
      height={150}
      viewBox="0 0 309 150"
      backgroundColor="#d9d9d9"
      foregroundColor="#ababab"
    >
      <rect x="136" y="57" rx="0" ry="0" width="85" height="15" />
      <rect x="136" y="82" rx="0" ry="0" width="120" height="15" />
      <rect x="136" y="107" rx="0" ry="0" width="120" height="15" />
      <rect x="0" y="0" rx="0" ry="0" width="120" height="150" />
      <rect x="136" y="27" rx="0" ry="0" width="115" height="20" />
    </ContentLoader>
  )
}
