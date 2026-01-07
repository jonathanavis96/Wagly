/// <reference types="@types/deno" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type ReviewPayload = {
  rating: number;
  name: string;
  title?: string | null;
  comment: string;
};

function jsonResponse(data: unknown, status = 200, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow POST (optional, but keeps things clean)
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, { Allow: "POST, OPTIONS" });
  }

  try {
    // Guard content-type
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonResponse({ error: "Expected Content-Type: application/json" }, 400);
    }

    // Parse JSON safely
    let body: ReviewPayload | null = null;
    try {
      body = (await req.json()) as ReviewPayload;
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const rating = body?.rating;
    const name = (body?.name ?? "").trim();
    const title = (body?.title ?? "").trim();
    const comment = (body?.comment ?? "").trim();

    // Validate fields
    if (!name) return jsonResponse({ error: "Missing 'name'" }, 400);
    if (!comment) return jsonResponse({ error: "Missing 'comment'" }, 400);
    if (typeof rating !== "number" || Number.isNaN(rating) || rating < 1 || rating > 5) {
      return jsonResponse({ error: "Invalid 'rating' (must be a number 1-5)" }, 400);
    }

    // Read secret safely (works on Supabase Edge when set via `supabase secrets set ...`)
    let apiKey: string | undefined;
    try {
      apiKey = Deno.env.get("RESEND_API_KEY");
    } catch (e) {
      // This happens if you're not running in an environment that allows env access
      return jsonResponse(
        { error: "Env access not available for RESEND_API_KEY", details: String(e) },
        500,
      );
    }

    if (!apiKey) {
      return jsonResponse(
        { error: "Missing RESEND_API_KEY (set it in Supabase secrets)" },
        500,
      );
    }

    const emailContent = `
New Review Submission:

Name: ${name}
Role: ${title || "Not specified"}
Rating: ${rating}/5 stars
Comment: ${comment}

---
This review was submitted via the Wagly website.
`.trim();

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "reviews@wagly.com",
        to: "myhearthsidepets@gmail.com",
        subject: `New Wagly Review - ${rating}★ from ${name}`,
        html: `<pre>${emailContent}</pre>`,
      }),
    });

    if (!resendResp.ok) {
      const details = await resendResp.text().catch(() => "");
      return jsonResponse(
        {
          error: "Email service error",
          status: resendResp.status,
          statusText: resendResp.statusText,
          details,
        },
        502,
      );
    }

    return jsonResponse({ success: true, message: "Review submitted successfully" }, 200);
  } catch (error) {
    console.error("submit-review error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
