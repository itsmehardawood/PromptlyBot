export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "unknown";
  const locale = searchParams.get("locale") || "en";

  const embedUrl = `https://promptly-bot.vercel.app/${locale}/chatbot-embed?userId=${userId}`;

  const jsCode = `
    console.log("✅ Injecting chatbot for userId: ${userId}");

    const iframe = document.createElement('iframe');
    iframe.src = "${embedUrl}";
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '530px';
    iframe.style.border = 'none';
    iframe.style.zIndex = 9999;
    
    document.body.appendChild(iframe);
  `;

  return new Response(jsCode, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
    },
  });
}
