// api/send-welcome.js
// Called automatically after user signs up
// Uses your Resend key to send a welcome email

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://neuraltrade-website.vercel.app')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { email, name } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  const firstName = name ? name.split(' ')[0] : 'Trader'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NeuralTrade AI <hello@neuraltrade.ai>',
        to: email,
        subject: '🤖 Welcome to NeuralTrade AI — You\'re In!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:32px;margin-bottom:8px;">🤖</div>
      <div style="font-size:22px;font-weight:700;background:linear-gradient(135deg,#00d4ff,#7b2fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#00d4ff;">
        NeuralTrade AI
      </div>
    </div>

    <!-- Card -->
    <div style="background:#13131a;border:1px solid #1e1e2e;border-radius:20px;padding:36px;">
      <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 8px;">
        Welcome, ${firstName}! 🎉
      </h1>
      <p style="color:#666;font-size:15px;margin:0 0 24px;line-height:1.6;">
        Your NeuralTrade AI account is ready. The AI that trades smarter — for everyone.
      </p>

      <!-- Steps -->
      <div style="margin-bottom:28px;">
        <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;">
          <div style="background:linear-gradient(135deg,#00d4ff,#7b2fff);border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;text-align:center;line-height:28px;">1</div>
          <div>
            <div style="color:#fff;font-size:14px;font-weight:600;">Connect your Bybit API</div>
            <div style="color:#555;font-size:13px;margin-top:2px;">Add your exchange API key to activate trading</div>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;">
          <div style="background:linear-gradient(135deg,#00d4ff,#7b2fff);border-radius:50%;width:28px;height:28px;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;text-align:center;line-height:28px;">2</div>
          <div>
            <div style="color:#fff;font-size:14px;font-weight:600;">Choose your plan</div>
            <div style="color:#555;font-size:13px;margin-top:2px;">Start free or upgrade to Pro for Claude AI brain</div>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="background:linear-gradient(135deg,#00d4ff,#7b2fff);border-radius:50%;width:28px;height:28px;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;text-align:center;line-height:28px;">3</div>
          <div>
            <div style="color:#fff;font-size:14px;font-weight:600;">Watch AI trade for you</div>
            <div style="color:#555;font-size:13px;margin-top:2px;">24/7 automated trading while you live your life</div>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <a href="https://neuraltrade-website.vercel.app/dashboard.html"
         style="display:block;text-align:center;background:linear-gradient(135deg,#00d4ff,#7b2fff);color:#fff;font-size:15px;font-weight:700;padding:14px;border-radius:12px;text-decoration:none;margin-bottom:20px;">
        Go to Dashboard →
      </a>

      <!-- Upgrade nudge -->
      <div style="background:#1a0f2e;border:1px solid #7b2fff33;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#a855f7;font-size:13px;font-weight:600;margin-bottom:4px;">🚀 Upgrade to Pro — $49/mo</div>
        <div style="color:#555;font-size:12px;">Claude AI brain + 11 coins + live news + social sentiment</div>
        <a href="https://neuraltrade-website.vercel.app/billing.html"
           style="display:inline-block;margin-top:10px;color:#a855f7;font-size:12px;text-decoration:underline;">
          See all plans →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#333;font-size:12px;line-height:1.6;">
        NeuralTrade AI · Built for everyone 🌍<br/>
        <a href="https://neuraltrade-website.vercel.app" style="color:#444;text-decoration:none;">neuraltrade-website.vercel.app</a>
      </p>
    </div>
  </div>
</body>
</html>
        `
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend error:', data)
      return res.status(500).json({ error: data.message || 'Email failed' })
    }

    return res.status(200).json({ success: true, id: data.id })

  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
