export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "unknown";
  const origin = new URL(request.url).origin;

  const embedUrl = `${origin}/chatbot-embed?userId=${userId}`;

  const jsCode = `
    console.log("✅ Injecting chatbot for userId: ${userId}");

    const iframe = document.createElement('iframe');
    iframe.src = "${embedUrl}";
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '480px';
    iframe.style.height = '700px';
    iframe.style.maxWidth = 'calc(100vw - 40px)';
    iframe.style.maxHeight = 'calc(100vh - 40px)';
    iframe.style.border = 'none';
    iframe.style.zIndex = 9999;
    iframe.style.overflow = 'hidden';

    if (window.matchMedia('(max-width: 640px)').matches) {
      iframe.style.left = 'auto';
      iframe.style.right = '8px';
      iframe.style.bottom = '8px';
      iframe.style.width = 'calc(100vw - 16px)';
      iframe.style.height = 'calc(100vh - 16px)';
      iframe.style.maxWidth = '420px';
      iframe.style.maxHeight = 'none';
    }
    
    document.body.appendChild(iframe);
  `;

  return new Response(jsCode, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
    },
  });
}