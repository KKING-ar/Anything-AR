(() => {
  const REPO_PATH = '/anything-ar';

  const normalizeHref = (href) => {
    if (!href || href.startsWith('//')) return href;
    if (href.startsWith('/')) {
      return href.includes(REPO_PATH) ? href : REPO_PATH + href;
    }
    return href;
  };

  const fixLink = (link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const nextHref = normalizeHref(href);
    if (nextHref && nextHref !== href) {
      link.setAttribute('href', nextHref);
    }
  };

  const fixAllLinks = () => {
    document.querySelectorAll('a[href]').forEach(fixLink);
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    const link = target && target.closest ? target.closest('a[href]') : null;
    if (!link) return;
    fixLink(link);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllLinks, { once: true });
  } else {
    fixAllLinks();
  }
})();
