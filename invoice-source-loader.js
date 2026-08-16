/* Invoice form data is driven by ข้อมูลสร้างใบแจ้งหนี้.txt. */
(() => {
  const CUSTOM_KEY = 'scenery-invoice-custom-items';
  const clean = value => String(value ?? '').replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
  const numberFrom = value => Number(String(value ?? '').replace(/,/g, '')) || 0;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const notify = (message, type = 'success') => {
    if (typeof window.showToast === 'function') { window.showToast(message, type); return; }
    const region = document.getElementById('toast-region');
    if (!region) return;
    region.textContent = message;
    region.dataset.type = type;
    region.classList.add('is-visible');
    window.setTimeout(() => region.classList.remove('is-visible'), 2600);
  };
  const renderFallbackLines = () => {
    const state = window.sceneryAppState;
    const invoiceLines = Array.isArray(state?.invoiceLines) ? state.invoiceLines : [];
    const money = value => `฿${Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const row = (line, index) => {
      const gross = Math.max(0, Number(line.qty || 0) * Number(line.rate || 0));
      const discount = Math.max(0, Number(line.discountAmount || 0));
      const total = Math.max(0, gross - discount);
      const label = escapeHtml(line.name);
      return '<tr data-fallback-line-index="' + index + '">' +
        '<td>' + escapeHtml(line.category) + '</td>' +
        '<td>' + label + '</td>' +
        '<td class="align-center">' + Number(line.qty || 0) + '</td>' +
        '<td class="align-right"><input class="fallback-line-rate" data-fallback-line-index="' + index + '" type="number" min="0" step="0.01" value="' + Number(line.rate || 0) + '" aria-label="แก้ Rate ' + label + '"></td>' +
        '<td class="align-right"><input class="fallback-line-deposit" data-fallback-line-index="' + index + '" type="number" min="0" step="0.01" value="' + Number(line.deposit || 0) + '" aria-label="แก้ Deposit ' + label + '"></td>' +
        '<td class="align-right"><input class="fallback-line-discount" data-fallback-line-index="' + index + '" type="number" min="0" step="0.01" value="' + discount + '" aria-label="แก้ส่วนลด ' + label + '"></td>' +
        '<td class="align-right strong-number">' + money(total) + '</td>' +
        '<td class="align-right"><button type="button" class="icon-button fallback-remove-line" data-fallback-line-index="' + index + '" aria-label="ลบรายการ"><span class="material-symbols-outlined">delete</span></button></td>' +
      '</tr>';
    };
    [['accommodation', '#form-accommodation-lines', '#accommodation-empty'], ['addon', '#form-addon-lines', '#addon-empty']].forEach(([type, bodySelector, emptySelector]) => {
      const body = document.querySelector(bodySelector);
      if (!body) return;
      const matches = invoiceLines.map((line, index) => ({ line, index })).filter(item => item.line.type === type);
      body.innerHTML = matches.map(item => row(item.line, item.index)).join('');
      const empty = document.querySelector(emptySelector);
      if (empty) empty.style.display = matches.length ? 'none' : 'block';
    });
    const grossTotal = invoiceLines.reduce((sum, line) => sum + Math.max(0, Number(line.qty || 0) * Number(line.rate || 0)), 0);
    const depositTotal = invoiceLines.reduce((sum, line) => sum + Math.max(0, Number(line.deposit || 0)), 0);
    const discountTotal = invoiceLines.reduce((sum, line) => sum + Math.max(0, Number(line.discountAmount || 0)), 0);
    const outstanding = Math.max(0, grossTotal - discountTotal - depositTotal);
    [['#summary-total', grossTotal], ['#summary-deposit', depositTotal], ['#summary-discount', discountTotal], ['#summary-outstanding', outstanding]].forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = money(value);
    });
    const preview = document.querySelector('#preview-invoice-lines');
    if (preview) preview.innerHTML = invoiceLines.map(line => {
      const gross = Math.max(0, Number(line.qty || 0) * Number(line.rate || 0));
      const discount = Math.max(0, Number(line.discountAmount || 0));
      return '<tr><td>' + escapeHtml(line.category) + '</td><td class="align-center">' + Number(line.qty || 0) + '</td><td>' + escapeHtml(line.name) + '</td><td class="align-right">' + money(gross) + '</td><td>' + (line.deposit ? money(line.deposit) : '-') + '</td><td class="align-right">' + (discount ? money(discount) : '-') + '</td><td class="align-right">' + money(Math.max(0, gross - discount)) + '</td></tr>';
    }).join('');
  };
  const updateFallbackTotals = () => {
    const state = window.sceneryAppState;
    const invoiceLines = Array.isArray(state?.invoiceLines) ? state.invoiceLines : [];
    const money = value => `฿${Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const grossTotal = invoiceLines.reduce((sum, line) => sum + Math.max(0, Number(line.qty || 0) * Number(line.rate || 0)), 0);
    const depositTotal = invoiceLines.reduce((sum, line) => sum + Math.max(0, Number(line.deposit || 0)), 0);
    const discountTotal = invoiceLines.reduce((sum, line) => sum + Math.max(0, Number(line.discountAmount || 0)), 0);
    const set = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = money(value); };
    set('#summary-total', grossTotal);
    set('#summary-deposit', depositTotal);
    set('#summary-discount', discountTotal);
    set('#summary-outstanding', Math.max(0, grossTotal - discountTotal - depositTotal));
    invoiceLines.forEach((line, index) => {
      const row = document.querySelector('tr[data-fallback-line-index="' + index + '"]');
      if (!row) return;
      const total = Math.max(0, Number(line.qty || 0) * Number(line.rate || 0) - Number(line.discountAmount || 0));
      const totalCell = row.querySelector('td:nth-child(7)');
      if (totalCell) totalCell.textContent = money(total);
    });
  };
  const installFallbackLineControls = () => {
    if (window.__SCENERY_FALLBACK_LINE_CONTROLS) return;
    window.__SCENERY_FALLBACK_LINE_CONTROLS = true;
    const updateLineFromInput = input => {
      const state = window.sceneryAppState;
      const index = Number(input.dataset.fallbackLineIndex);
      const line = state?.invoiceLines?.[index];
      if (!line) return false;
      if (input.classList.contains('fallback-line-rate')) line.rate = Math.max(0, numberFrom(input.value));
      if (input.classList.contains('fallback-line-deposit')) line.deposit = Math.max(0, numberFrom(input.value));
      if (input.classList.contains('fallback-line-discount')) line.discountAmount = Math.max(0, numberFrom(input.value));
      return true;
    };
    document.addEventListener('input', event => {
      const input = event.target.closest?.('.fallback-line-rate, .fallback-line-deposit, .fallback-line-discount');
      if (!input || !updateLineFromInput(input)) return;
      updateFallbackTotals();
    });
    document.addEventListener('change', event => {
      const input = event.target.closest?.('.fallback-line-rate, .fallback-line-deposit, .fallback-line-discount');
      if (!input || !updateLineFromInput(input)) return;
      renderFallbackLines();
    });
    document.addEventListener('click', event => {
      const button = event.target.closest?.('.fallback-remove-line');
      if (!button) return;
      const state = window.sceneryAppState;
      const index = Number(button.dataset.fallbackLineIndex);
      if (!Array.isArray(state?.invoiceLines) || !state.invoiceLines[index]) return;
      const removed = state.invoiceLines.splice(index, 1)[0];
      renderFallbackLines();
      notify(`ลบ ${removed.name} ออกจากใบแจ้งหนี้แล้ว`);
    });
  };
  installFallbackLineControls();;

  function parseItem(line) {
    let name = clean(line);
    if (!name || /^มีรายการ/.test(name)) return null;
    let rate = 0;
    let price = name.match(/\s+ราคา\s*([\d,]+(?:\.\d+)?)\s*(?:บาท|Bath|Baht)?\s*$/i);
    if (!price) price = name.match(/\s+([\d,]+(?:\.\d+)?)\s*(?:บาท|Bath|Baht)?\s*$/i);
    if (price) {
      rate = numberFrom(price[1]);
      name = name.slice(0, price.index).trim();
    }
    name = name.replace(/\s+เด้ง$/, '').trim();
    return name ? { name, rate } : null;
  }

  function parseSource(text) {
    const result = { accommodation: [], addon: [] };
    let family = '';
    let category = '';
    String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/).forEach(rawLine => {
      const line = clean(rawLine);
      if (!line) return;
      const heading = line.match(/^หัวข้อ\s+(.+)$/);
      if (heading) { family = heading[1]; category = ''; return; }
      const categoryMatch = line.match(/^หมวด\s+(.+)$/);
      if (categoryMatch) {
        category = clean(categoryMatch[1]);
        const target = /^Accommodation/i.test(family) ? result.accommodation : result.addon;
        if (!target.some(item => item.category === category)) target.push({ category, items: [] });
        return;
      }
      if (!category) return;
      const parsed = parseItem(line);
      if (!parsed) return;
      const target = /^Accommodation/i.test(family) ? result.accommodation : result.addon;
      const bucket = target.find(item => item.category === category);
      if (bucket && !bucket.items.some(item => item.name === parsed.name)) bucket.items.push({ ...parsed, category });
    });
    return result;
  }

  function readCustom() {
    try {
      const value = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  }

  function saveCustom(items) {
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(items)); } catch {}
  }

  function flatten(data) {
    return Object.values(data).flatMap(groups => groups.flatMap(group => group.items.map(item => ({ ...item }))));
  }

  function mergeCustom(data) {
    const custom = readCustom();
    custom.forEach(item => {
      const groups = data[item.type] || [];
      let bucket = groups.find(group => group.category === item.category);
      if (!bucket) { bucket = { category: item.category, items: [] }; groups.push(bucket); }
      if (!bucket.items.some(existing => existing.name === item.name)) bucket.items.push({ name: item.name, rate: numberFrom(item.rate), category: item.category, custom: true });
    });
  }

  function optionList(group) {
    return group.map(item => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}${item.rate ? ` — ฿${item.rate.toLocaleString('th-TH')}` : ''}</option>`).join('');
  }

  function replaceWithClone(element) {
    if (!element) return null;
    const clone = element.cloneNode(true);
    element.replaceWith(clone);
    return clone;
  }

  function applyForm(data) {
    const villa = document.querySelector('#villa');
    if (villa) {
      const villaGroups = data.accommodation.filter(group => !/^(Extra_Bed|Complimentary|Package)$/i.test(group.category));
      const names = villaGroups.flatMap(group => group.items.map(item => item.name.replace(/\s+Villa$/i, '').trim()));
      villa.innerHTML = `<option value="">เลือก Villa / Room</option>${[...new Set(names)].map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}`;
    }

    const configs = [
      { type: 'accommodation', categoryId: 'accommodation-category', selectId: 'accommodation-select', rateId: 'accommodation-rate', qtyId: 'accommodation-qty', source: data.accommodation },
      { type: 'addon', categoryId: 'addon-category', selectId: 'addon-select', rateId: 'addon-rate', qtyId: 'addon-qty', source: data.addon }
    ];
    configs.forEach(config => {
      let categoryEl = replaceWithClone(document.querySelector(`#${config.categoryId}`));
      const oldSelect = document.querySelector(`#${config.selectId}`);
      document.querySelectorAll(`#${config.type}-search, #${config.type}-options`).forEach(element => element.remove());
      if (!categoryEl || !oldSelect) return;
      categoryEl.innerHTML = `<option value="">เลือกหมวด</option>${config.source.map(group => `<option value="${escapeHtml(group.category)}">${escapeHtml(group.category)}</option>`).join('')}`;

      const itemInput = document.createElement('input');
      itemInput.id = `${config.type}-item-input`;
      itemInput.className = 'invoice-item-input';
      itemInput.type = 'text';
      itemInput.setAttribute('list', `${config.type}-source-options`);
      itemInput.placeholder = 'เลือกหรือพิมพ์รายการใหม่';
      itemInput.autocomplete = 'off';
      oldSelect.replaceWith(itemInput);
      const datalist = document.createElement('datalist');
      datalist.id = `${config.type}-source-options`;
      itemInput.insertAdjacentElement('afterend', datalist);
      const rateEl = document.querySelector(`#${config.rateId}`);
      const qtyEl = document.querySelector(`#${config.qtyId}`);
      const button = replaceWithClone(document.querySelector(`#add-${config.type}`));

      const selectedGroup = () => config.source.find(group => group.category === categoryEl.value);
      const refreshItems = () => {
        const group = selectedGroup();
        itemInput.value = '';
        if (rateEl) rateEl.value = '';
        datalist.innerHTML = group ? optionList(group.items) : '';
        itemInput.disabled = !group;
        itemInput.placeholder = group ? 'เลือกหรือพิมพ์รายการใหม่' : 'เลือกหมวดก่อน';
      };
      const fillKnownRate = () => {
        const group = selectedGroup();
        const item = group?.items.find(entry => entry.name.toLowerCase() === itemInput.value.trim().toLowerCase());
        if (item && rateEl) rateEl.value = item.rate || '';
      };
      categoryEl.addEventListener('change', refreshItems);
      itemInput.addEventListener('input', fillKnownRate);
      itemInput.addEventListener('change', fillKnownRate);
      button?.addEventListener('click', event => {
        event.preventDefault();
        const group = selectedGroup();
        const name = itemInput.value.trim();
        if (!group) { notify('กรุณาเลือกหมวดก่อนเพิ่มรายการ', 'error'); return; }
        if (!name) { notify('กรุณาเลือกรายการหรือพิมพ์รายการใหม่ก่อนเพิ่ม', 'error'); return; }
        let item = group.items.find(entry => entry.name.toLowerCase() === name.toLowerCase());
        if (!item) {
          item = { name, rate: numberFrom(rateEl?.value), category: group.category, custom: true };
          group.items.push(item);
          const custom = readCustom().filter(entry => !(entry.type === config.type && entry.category === group.category && entry.name.toLowerCase() === name.toLowerCase()));
          custom.push({ type: config.type, category: group.category, name, rate: item.rate });
          saveCustom(custom);
          datalist.innerHTML = optionList(group.items);
        }
        const amount = numberFrom(rateEl?.value || item.rate);
        const lines = window.sceneryAppState?.invoiceLines;
        if (!lines) return;
        lines.push({ type: config.type, name: item.name, category: group.category, sourceIndex: null, rate: amount, deposit: 0, depositMethod: 'เงินสด', qty: Math.max(1, numberFrom(qtyEl?.value || 1)), discountRate: 0, discountAmount: 0, pendingCollection: 0, pendingNote: '' });
        categoryEl.value = '';
        itemInput.value = '';
        if (rateEl) rateEl.value = '';
        if (qtyEl) qtyEl.value = '1';
        refreshItems();
        if (typeof renderFormLines === 'function') renderFormLines();
        if (typeof calculateInvoice === 'function') calculateInvoice();
        renderFallbackLines();
        notify(`เพิ่ม ${item.name} ลงในใบแจ้งหนี้แล้ว`);
      });
      refreshItems();
    });
  }

  async function load() {
    try {
      const response = await fetch(`invoice-source.txt?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('invoice source unavailable');
      const data = parseSource(await response.text());
      mergeCustom(data);
      window.INVOICE_SOURCE_DATA = data;
      applyForm(data);
    } catch (error) {
      console.error('Invoice source data could not be loaded', error);
      notify('โหลดข้อมูลสร้างใบแจ้งหนี้ไม่สำเร็จ', 'error');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
