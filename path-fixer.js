(function () {
  'use strict';

  // Keep this script harmless: only adjust link behavior without touching browser navigation.
  const REPO_PATH = '/anything-ar';

  const normalize = (href) => {
    if (!href || href.startsWith('//')) return href;
    if (href.startsWith('/')) {
      return href.includes(REPO_PATH) ? href : REPO_PATH + href;
    }
    return href;
  };

  const fixLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      const next = normalize(href);
      if (next && next !== href) {
        link.setAttribute('href', next);
      }
    });
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || !target.closest) return;
    const link = target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const next = normalize(href);
    if (next && next !== href) {
      link.setAttribute('href', next);
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLinks, { once: true });
  } else {
    fixLinks();
  }
})();
