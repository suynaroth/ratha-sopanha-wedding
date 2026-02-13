export const config = {
  runtime: 'edge',
}

const BOT_UA_PATTERN =
  /facebookexternalhit|facebot|twitterbot|slackbot|discordbot|telegrambot|linkedinbot|whatsapp|skypeuripreview|googlebot|bingbot|pinterest|vkshare/i

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export default function handler(req) {
  const currentUrl = new URL(req.url)
  const guestName = currentUrl.searchParams.get('name') || 'Guest'
  const userAgent = req.headers.get('user-agent') || ''
  const isBot = BOT_UA_PATTERN.test(userAgent)

  const title = 'សិរីមង្គលអាពាហ៍ពិពាហ៍'
  const description = `ចាន់ផារ៉ាត់ និង សុត្ថាចន្ធីម៉ា  | ១២ មីនា ២០២៦`
  const image = `${currentUrl.origin}/image/logo.png`
  const appUrl = `${currentUrl.origin}/?name=${encodeURIComponent(guestName)}`

  // Real users should open the app directly.
  if (!isBot) {
    return Response.redirect(appUrl, 302)
  }

  // Crawlers should receive stable OG metadata HTML.
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
  <meta property="og:image:type" content="image/png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body>
  <a href="${escapeHtml(appUrl)}">Open invitation</a>
</body>
</html>`,
    {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'public, max-age=0, s-maxage=600',
      },
    }
  )
}
