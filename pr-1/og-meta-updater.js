// Script to dynamically set OG image URLs based on current location
(function() {
  // Get the base path from the current page URL
  // For /Wagly/pr-1/index.html -> /Wagly/pr-1/
  // For /Wagly/index.html -> /Wagly/
  // For /Wagly/ -> /Wagly/
  let pathname = window.location.pathname;
  
  // If pathname ends with index.html, remove it
  if (pathname.endsWith('index.html')) {
    pathname = pathname.slice(0, -10); // Remove 'index.html'
  }
  
  // Ensure trailing slash
  if (!pathname.endsWith('/')) {
    pathname = pathname + '/';
  }
  
  const baseUrl = window.location.origin + pathname;
  const ogImageUrl = baseUrl + 'og_image.png';
  const pageUrl = window.location.href.split('?')[0].split('#')[0];
  
  // Update OG image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute('content', ogImageUrl);
  
  // Update Twitter image
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) twitterImage.setAttribute('content', ogImageUrl);
  
  // Update OG URL
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', pageUrl);
  
  // Update Twitter URL
  const twitterUrl = document.querySelector('meta[name="twitter:url"]');
  if (twitterUrl) twitterUrl.setAttribute('content', pageUrl);
  
  console.log('OG Meta Updater:', {
    pathname: pathname,
    baseUrl: baseUrl,
    ogImageUrl: ogImageUrl,
    pageUrl: pageUrl
  });
})();