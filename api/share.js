export const config = {
  runtime: 'edge',
}

export default function handler() {
  const title = 'សិរីមង្គលអាពាហ៍ពិពាហ៍'
  const description = `តុន សុខភារុណ និង ណុប សុខសុទ្ធាវី • ថ្ងៃចន្ទ ទី២៦ ខែមីនា ឆ្នាំ ២០២៦`
  const image = 'https://sokphearun-soksotheavy.vercel.app/image/p01.jpg'

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

</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
    },
  })
}
