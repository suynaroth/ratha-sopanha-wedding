export const config = {
  runtime: 'edge',
}

const BOT_UA_PATTERN = /facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher|twitterbot|slackbot|discordbot|telegrambot|linkedinbot|whatsapp|skypeuripreview|googlebot|bingbot/i

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export default function handler(req) {
  const currentUrl = new URL(req.url)
  const guestName = (currentUrl.searchParams.get('name') || '').trim()

  const title = 'សិរីមង្គលអាពាហ៍ពិពាហ៍ | សៀងហៃ និង វណ្ណលីដា'
  const description = '២៦ មេសា ២០២៦'
  // Use a horizontal image (1200x630) for best results on Messenger
  const image = `${currentUrl.origin}/icon/prewview.jpg`
  const appUrl = guestName
    ? `${currentUrl.origin}/?name=${encodeURIComponent(guestName)}`
    : `${currentUrl.origin}/`

  // Always serve OG HTML so any crawler can read preview metadata.
  // Real users are redirected client-side.
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta property="og:type" content="website" />
<meta property="og:site_name" content="Theab Studio" />
<meta property="og:url" content="${escapeHtml(currentUrl.href)}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="fb:app_id" content="2349312748908424" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<script>
  (function () {
    var ua = navigator.userAgent || '';
    if (!${BOT_UA_PATTERN}.test(ua)) {
      window.location.replace(${JSON.stringify(appUrl)});
    }
  })();
</script>
</head>
<body>
  <main style="font-family:Arial,sans-serif;padding:24px;text-align:center">
    <p>Opening invitation...</p>
    <p><a href="${escapeHtml(appUrl)}">Open invitation</a></p>
  </main>
</body>
</html>`,
    {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'no-store, max-age=0',
      },
    }
  )
}
