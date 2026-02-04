export const config = {
  runtime: 'edge',
}

export default function handler() {
  const title = 'សិរីមង្គលអាពាហ៍ពិពាហ៍'
  const description = `តុន សុខភារុណ និង ណុប សុខសុទ្ធាវី • ថ្ងៃចន្ទ ទី២៦ ខែមីនា ឆ្នាំ២០២៦`
  const image = 'https://sokphearun-soksotheavy.vercel.app/image/p01.jpg'
  const url = 'https://sokphearun-soksotheavy.vercel.app/'

  return new Response(`<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>

  <!-- Primary Meta Tags -->
  <meta name="title" content="${title}" />
  <meta name="description" content="${description}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="${title}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />

  <!-- Twitter / Telegram / WhatsApp -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

  <!-- Redirect to main site -->
  <meta http-equiv="refresh" content="0;url=/" />
</head>
<body>
  <script>
    window.location.href = '/';
  </script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
    },
  })
}
