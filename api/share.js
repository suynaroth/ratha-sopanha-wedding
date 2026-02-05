export const config = {
  runtime: 'edge',
}

export default function handler(request) {
  const title = 'សិរីមង្គលអាពាហ៍ពិពាហ៍'
  const description = `សុខភារុណ និង សុខសុទ្ធាវី | ២៦ ខែមីនា ឆ្នាំ ២០២៦`
  const image = 'https://sokphearun-soksotheavy.vercel.app/image/p01-v2.jpg'

  const reqUrl = new URL(request.url)
  const guest = (reqUrl.searchParams.get('name') || '').trim()
  const safeGuest = guest.replace(/[<>]/g, '')
  const redirectQuery = safeGuest ? `?name=${encodeURIComponent(safeGuest)}` : ''
  const finalUrl = `https://sokphearun-soksotheavy.vercel.app/${redirectQuery}`

  return new Response(`<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="utf-8" />

  <title>${title}</title>

  <!-- Primary Meta -->
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${reqUrl.href}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Telegram / Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">

  <!-- Redirect real users -->
  <script>
    setTimeout(() => {
      window.location.href = "${finalUrl}";
    }, 100);
  </script>
</head>
<body>
  <p>Loading invitation…</p>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'no-store',
    },
  })
}
