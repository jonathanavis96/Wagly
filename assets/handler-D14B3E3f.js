async function t(e){const s=`
New Review Submission:

Name: ${e.name}
Role: ${e.title||"Not specified"}
Rating: ${e.rating}/5 stars
Comment: ${e.comment}

---
This review was submitted via the Wagly website.
  `;return console.log("Review submitted:",s),{success:!0,message:"Review submitted successfully"}}async function i(e){const s=`
Contact Form Submission:

Name: ${e.name}
Email: ${e.email}
Message: ${e.message}

---
This inquiry was submitted via the Wagly website contact form.
  `;return console.log("Contact submitted:",s),{success:!0,message:"Contact form submitted successfully"}}export{i as submitContact,t as submitReview};
