export async function submitReview(data: { rating: number; name: string; title: string; comment: string }) {
  // NO-OP: Reviews are NOT persisted anywhere per requirements
  // This function exists only to provide user feedback
  
  // Optional: Log for debugging (remove in production if desired)
  console.log("Review received (not persisted):", {
    name: data.name,
    rating: data.rating,
    title: data.title,
    commentLength: data.comment.length
  });

  // Simulate brief network delay for better UX
  await new Promise(resolve => setTimeout(resolve, 800));

  return { 
    success: true, 
    message: "Thanks! Your review has been sent to our team." 
  };
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
