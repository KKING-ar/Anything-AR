// Global path fixer - ensures /anything-ar is included in all internal links
(function() {
  const REPO_PATH = '/anything-ar';
  
  // Fix all existing links on page load
  function fixExistingLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && !href.includes(REPO_PATH)) {
        link.setAttribute('href', REPO_PATH + href);
      }
    });
  }
  
  // Intercept dynamic link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Only process internal links (relative paths starting with /)
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      // If the link doesn't contain /anything-ar, add it
      if (!href.includes(REPO_PATH)) {
        const newHref = REPO_PATH + href;
        link.setAttribute('href', newHref);
      }
    }
  }, true);
  
  // Fix programmatic navigation (history.pushState, window.location, etc)
  const originalPush = window.history.pushState;
  const originalReplace = window.history.replaceState;
  
  window.history.pushState = function(...args) {
    if (typeof args[2] === 'string' && args[2].startsWith('/') && !args[2].includes(REPO_PATH)) {
      args[2] = REPO_PATH + args[2];
    }
    return originalPush.apply(window.history, args);
  };
  
  window.history.replaceState = function(...args) {
    if (typeof args[2] === 'string' && args[2].startsWith('/') && !args[2].includes(REPO_PATH)) {
      args[2] = REPO_PATH + args[2];
    }
    return originalReplace.apply(window.history, args);
  };
  
  // Fix window.location assignments
  Object.defineProperty(window, 'location', {
    set: function(url) {
      if (typeof url === 'string' && url.startsWith('/') && !url.includes(REPO_PATH)) {
        window.location.href = REPO_PATH + url;
        return;
      }
      window.location.href = url;
    },
    get: function() {
      return window.location;
    }
  });
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixExistingLinks);
  } else {
    fixExistingLinks();
  }
  
  // Also run on any dynamic content updates
  const observer = new MutationObserver(fixExistingLinks);
  observer.observe(document.body, { childList: true, subtree: true });
})();
