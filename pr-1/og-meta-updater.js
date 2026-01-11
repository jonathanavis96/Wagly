// Script to dynamically set OG image URLs based on current location
(function() {
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
  const ogImageUrl = baseUrl + 'og_image.png';
  
  // Update OG image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute('content', ogImageUrl);
  
  // Update Twitter image
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) twitterImage.setAttribute('content', ogImageUrl);
  
  // Update OG URL
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', window.location.href.split('?')[0]);
  
  // Update Twitter URL
  const twitterUrl = document.querySelector('meta[name="twitter:url"]');
  if (twitterUrl) twitterUrl.setAttribute('content', window.location.href.split('?')[0]);
})();