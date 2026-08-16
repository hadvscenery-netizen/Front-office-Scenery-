/* Compact legacy-style screen layout for invoice and close-round pages. */
(() => {
  'use strict';
  if (window.__sceneryCloseRoundLegacyCompat) return;
  window.__sceneryCloseRoundLegacyCompat = true;

  const style = document.createElement('style');
  style.id = 'close-round-legacy-compat-style';
  style.textContent = [
    '@media screen {',
    '#view-invoice .invoice-preview-stage{padding:14px}',
    '#view-invoice .invoice-preview-sheet{width:min(100%,820px);min-width:0;padding:22px 24px 20px}',
    '#view-invoice .preview-header{min-height:112px;gap:20px}',
    '#view-invoice .preview-company{gap:11px;padding-top:4px;font-size:10px}',
    '#view-invoice .preview-company img{width:78px;height:78px}',
    'img[src*="login-logo.png"]{display:block!important;object-fit:contain!important;object-position:center!important;clip-path:none!important;mix-blend-mode:normal!important;background:transparent!important;border:0!important;overflow:visible!important}',
    '#view-invoice .preview-title{min-width:220px}',
    '#view-invoice .preview-title h1{font-size:30px;margin-bottom:10px}',
    '#view-invoice .preview-meta{gap:8px 12px}',
    '#view-invoice .preview-table-wrap{overflow-x:auto}',
    '#view-invoice .invoice-line-group .table-wrap{overflow-x:auto;border:1px solid #eadfd6;border-radius:8px;background:#fff}',
    '#view-invoice .invoice-line-group table{min-width:920px;table-layout:auto}',
    '#view-invoice .invoice-line-group tbody td{padding:9px 8px;vertical-align:middle;white-space:nowrap}',
    '#view-invoice .invoice-line-group tbody td:nth-child(1){min-width:92px}',
    '#view-invoice .invoice-line-group tbody td:nth-child(2){min-width:170px;white-space:normal}',
    '#view-invoice .invoice-line-group tbody td:nth-child(3){min-width:58px}',
    '#view-invoice .invoice-line-group tbody td:nth-child(4),#view-invoice .invoice-line-group tbody td:nth-child(5),#view-invoice .invoice-line-group tbody td:nth-child(6){min-width:112px}',
    '#view-invoice .invoice-line-group tbody td:nth-child(7){min-width:105px}',
    '#view-invoice .fallback-line-rate,#view-invoice .fallback-line-deposit,#view-invoice .fallback-line-discount{display:block;width:100%;min-width:96px;max-width:124px;height:36px;box-sizing:border-box;padding:7px 9px;border:1px solid #d8c8bc;border-radius:6px;background:#fffdfb;color:#3e342e;font:inherit;font-size:13px;line-height:20px;text-align:right;box-shadow:inset 0 1px 2px rgba(76,52,36,.05)}',
    '#view-invoice .fallback-line-rate:focus,#view-invoice .fallback-line-deposit:focus,#view-invoice .fallback-line-discount:focus{outline:0;border-color:#a56d3f;box-shadow:0 0 0 3px rgba(165,109,63,.15)}',
    '#view-invoice .fallback-remove-line{width:34px;height:34px;padding:0;border:1px solid #ead6d0;border-radius:6px;color:#b34d45;background:#fff7f5;display:inline-flex;align-items:center;justify-content:center}',
    '#view-invoice .fallback-remove-line:hover{background:#fbe5e1;color:#8f2f2a}',
    '#view-invoice .fallback-deposit-control{display:grid;grid-template-columns:minmax(96px,1fr);gap:5px;min-width:132px}',
    '#view-invoice .fallback-line-deposit-method{display:block;width:100%;height:32px;box-sizing:border-box;padding:5px 8px;border:1px solid #d8c8bc;border-radius:6px;background:#fffdfb;color:#3e342e;font:inherit;font-size:12px;line-height:20px}',
    '#view-invoice .fallback-line-deposit-method:focus{outline:0;border-color:#a56d3f;box-shadow:0 0 0 3px rgba(165,109,63,.15)}'
    '#view-close-round .close-round-detail-wrap{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}',
    '#view-close-round .close-round-detail-table{min-width:1800px;font-size:12px}',
    '#view-close-round .close-round-detail-table th,#view-close-round .close-round-detail-table td{padding:5px 6px}',
    '#view-close-round .close-round-detail-table th:nth-child(1),#view-close-round .close-round-detail-table td:nth-child(1){min-width:105px}',
    '#view-close-round .close-round-detail-table th:nth-child(2),#view-close-round .close-round-detail-table td:nth-child(2){min-width:110px}',
    '#view-close-round .close-round-detail-table th:nth-child(3),#view-close-round .close-round-detail-table td:nth-child(3){min-width:145px}',
    '#view-close-round .close-round-detail-table th:nth-child(4),#view-close-round .close-round-detail-table th:nth-child(5){min-width:58px}',
    '#view-close-round .close-round-detail-table th:last-child,#view-close-round .close-round-detail-table td:last-child{min-width:120px}',
    '#view-close-round .close-round-detail-table input,#view-close-round .close-round-detail-table select,#view-close-round .close-round-detail-table textarea{min-height:32px;padding:5px 6px}',
    '}',
    '@media screen and (max-width:860px){',
    '#view-invoice .invoice-preview-sheet{padding:16px}',
    '#view-invoice .preview-header{min-height:96px;gap:12px}',
    '#view-invoice .preview-company img{width:64px;height:64px}',
    '#view-invoice .preview-title{min-width:175px}',
    '#view-invoice .preview-title h1{font-size:24px}',
    '}'
  ].join('');
  document.head.appendChild(style);

  function useCleanLogo(root = document) {
    root.querySelectorAll('img[src*="346973899_1639269593246469_4301917493848559029_n.jpg"]')
      .forEach(image => {
        if (image.dataset.cleanLogoReady) return;
        image.dataset.cleanLogoReady = 'true';
        const original = image.getAttribute('src');
        image.addEventListener('error', () => {
          image.onerror = null;
          image.src = original;
          image.style.clipPath = 'inset(4px 0 0 0)';
        }, { once: true });
        image.src = window.__SCENERY_CLEAN_LOGO_DATA || './login-logo.png?v=20260816-clean-logo-5';
      });
  }

  function applyLegacyOtherLabel() {
    useCleanLogo();
    document.querySelectorAll('#view-close-round th,#view-close-round h3,#view-close-round label,#view-close-round option')
      .forEach(node => {
        if (/^\u0e2d\u0e37\u0e48\u0e19\u0e46\s*\(/.test(node.textContent.trim())) node.textContent = '\u0e2d\u0e37\u0e48\u0e19\u0e46';
      });
    const categories = window.CLOSE_ROUND_CATEGORIES;
    const other = Array.isArray(categories) && categories.find(item => item.key === 'other');
    if (other) other.label = '\u0e2d\u0e37\u0e48\u0e19\u0e46';
  }

  applyLegacyOtherLabel();
  document.addEventListener('DOMContentLoaded', applyLegacyOtherLabel);
  new MutationObserver(applyLegacyOtherLabel).observe(document.body, { childList: true, subtree: true });
})();
