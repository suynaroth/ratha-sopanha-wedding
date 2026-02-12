export const config = {
  runtime: 'edge',
}

export default function handler(req) {
  const { searchParams } = new URL(req.url)
  const guestName = searchParams.get('name') || 'សូមអញ្ជើញ'

  const title = 'សិរីមង្គលអាពាហ៍ពិពាហ៍'
  const description = `តង សៀង និង ឡាំ ដាណេ | ០៦ ខែមីនា ឆ្នាំ ២០២៦`
  const image = 'https://sieng-dane.vercel.app/icon/badge.png'

  return new Response(`<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:image" content="${image}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
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
