export async function submitReview(data: { rating: number; name: string; title: string; comment: string }) {
  const emailContent = `
New Review Submission:

Name: ${data.name}
Role: ${data.title || "Not specified"}
Rating: ${data.rating}/5 stars
Comment: ${data.comment}

---
This review was submitted via the Wagly website.
  `;

  console.log("Review submitted:", emailContent);
  return { success: true, message: "Review submitted successfully" };
}

export async function submitContact(data: { name: string; email: string; message: string }) {
  const emailContent = `
Contact Form Submission:

Name: ${data.name}
Email: ${data.email}
Message: ${data.message}

---
This inquiry was submitted via the Wagly website contact form.
  `;

  console.log("Contact submitted:", emailContent);
  return { success: true, message: "Contact form submitted successfully" };
}
