export const config = {
  runtime: 'edge',
}

export default function handler(req) {
  const { searchParams } = new URL(req.url)
  const guestName = searchParams.get('name') || 'សូមអញ្ជើញ'

  const title = 'សិរីមង្គលអាពាហ៍ពិពាហ៍'
  const description = `សុខភារុណ និង សុខសុទ្ធាវី | ១៦ ខែមីនា ឆ្នាំ ២០២៦`
  const image = 'https://sokphearun-soksotheavy.vercel.app/image/p01-v2.jpg'

  return new Response(`<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />

  <meta property="og:type" content="website" />

  <!-- WhatsApp / Telegram -->
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <script>
    location.replace('/?name=${encodeURIComponent(guestName)}')
  </script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
    },
  })
}
