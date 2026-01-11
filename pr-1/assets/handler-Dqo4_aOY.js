async function s(e){return console.log("Review received (not persisted):",{name:e.name,rating:e.rating,title:e.title,commentLength:e.comment.length}),await new Promise(t=>setTimeout(t,800)),{success:!0,message:"Thanks! Your review has been sent to our team."}}async function n(e){const t=`
Contact Form Submission:

Name: ${e.name}
Email: ${e.email}
Message: ${e.message}

---
This inquiry was submitted via the Wagly website contact form.
  `;return console.log("Contact submitted:",t),{success:!0,message:"Contact form submitted successfully"}}export{n as submitContact,s as submitReview};
