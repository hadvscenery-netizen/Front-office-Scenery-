function historyDisplayDate(key){
  const date=new Date(`${key}T00:00:00`);
  return Number.isNaN(date.getTime())?key:date.toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'});
}
function syncInvoiceHistoryState(){
  const today=historyDateKey();
  state.invoices=loadInvoiceHistory().filter(record=>record.businessDate===today).sort((a,b)=>String(b.time).localeCompare(String(a.time))).map(record=>({id:record.id,customer:record.customer,time:record.time,total:record.total,status:record.status,statusClass:record.statusClass}));
  renderDashboard();
  renderHistory();
}
function historyRowsForToday(){
  const query=($('#history-search')?.value||'').trim().toLowerCase();
  const statusFilter=$('#history-status-filter')?.value||'all';
  return loadInvoiceHistory().filter(record=>{
    const status=historyStatus(record);
    const haystack=[record.id,record.reference,record.customer,record.villa,record.time,record.businessDate,status.label,record.total,record.pendingTotal].join(' ').toLowerCase();
    return record.businessDate===historyDateKey()&&(!query||haystack.includes(query))&&(statusFilter==='all'||status.label===statusFilter);
  }).sort((a,b)=>String(b.time).localeCompare(String(a.time)));
}
function renderHistory(){
  const body=$('#history-body');
  if(!body)return;
  const today=historyDateKey();
  const dateFilter=$('#history-date-filter');
  if(dateFilter){dateFilter.innerHTML=`<option value="today">วันนี้ · ${historyDisplayDate(today)}</option>`;dateFilter.value='today'}
  const rows=historyRowsForToday();
  body.innerHTML=rows.map(record=>{
    const status=historyStatus(record),pending=historyPendingTotal(record);
    return `<tr><td>${esc(record.id)}</td><td><strong>${esc(record.customer||'-')}</strong><small class="table-subtext">${esc(record.villa||'-')} · ${esc(record.time)} น.</small></td><td>${esc(historyDisplayDate(record.businessDate))}</td><td class="align-right strong-number">${money(record.total)}</td><td>${pending?`<span class="warning-text">รอเรียกเก็บ ${money(pending)}</span>`:'<span class="positive-text">ครบถ้วน</span>'}</td><td><span class="status-chip ${status.className}">${status.label}</span></td><td><div class="history-actions"><button class="button button-outline action-small" data-history-edit="${esc(record.id)}"><span class="material-symbols-outlined">edit</span>แก้ไข</button><button class="button button-danger action-small" data-history-delete="${esc(record.id)}"><span class="material-symbols-outlined">delete</span>ลบ</button></div></td></tr>`;
  }).join('')||'<tr><td colspan="7"><div class="empty-state"><span class="material-symbols-outlined">receipt_long</span><p>ยังไม่มีประวัติใบแจ้งหนี้ของวันนี้</p><small>เมื่อยืนยันใบแจ้งหนี้แล้ว รายการจะปรากฏที่นี่</small></div></td></tr>';
  historyRenderedDay=today;
}
function openHistoryEdit(id){
  const record=loadInvoiceHistory().find(item=>item.id===id);
  if(!record)return;
  const body=`<div class="history-edit-form"><label>เลข Invoice<input value="${esc(record.id)}" disabled></label><label>ลูกค้า / บริษัท<input id="history-edit-customer" value="${esc(record.customer||'')}"></label><label>Villa / ห้องพัก<input id="history-edit-villa" value="${esc(record.villa||'')}"></label><label>ยอดสุทธิ<input id="history-edit-total" type="number" min="0" step="0.01" value="${Number(record.total||0)}"></label><label>ยอดรอเรียกเก็บ<input id="history-edit-pending" type="number" min="0" step="0.01" value="${historyPendingTotal(record)}"></label><small class="muted">ถ้ายอดรอเรียกเก็บมากกว่า 0 ระบบจะแสดงสถานะ “ค้างชำระ” อัตโนมัติ</small></div>`;
  openModal(`แก้ไขย้อนหลัง ${record.id}`,body,'<button class="button button-outline" data-close-modal>ยกเลิก</button><button class="button button-primary" data-history-save="'+esc(record.id)+'">บันทึกการแก้ไข</button>');
}
function editInvoiceHistory(id){
  const records=loadInvoiceHistory(),index=records.findIndex(record=>record.id===id);
  if(index<0)return;
  const total=Math.max(0,Number($('#history-edit-total')?.value||0)),pending=Math.max(0,Number($('#history-edit-pending')?.value||0));
  if(pending>total){showToast('ยอดรอเรียกเก็บต้องไม่มากกว่ายอดสุทธิ','error');return}
  const current=records[index];
  if(closeRoundIsLocked(current.businessDate)){showToast(`แก้ไขไม่ได้: รอบ ${current.businessDate} ถูก Submit และ Lock แล้ว`,'error');return}
  records[index]=normalizeHistoryRecord({...current,customer:($('#history-edit-customer')?.value||'').trim(),villa:($('#history-edit-villa')?.value||'').trim(),total,netTotal:total,discount:0,pendingTotal:pending,updatedAt:new Date().toISOString()});
  saveInvoiceHistory(records);
  state.closedBookings=state.closedBookings.map(record=>record.reference===id?{...record,customer:records[index].customer,villa:records[index].villa,total,pendingTotal:pending}:record);
  saveClosedBookings();
  $('#modal-root').innerHTML='';
  syncInvoiceHistoryState();
  recordAudit('แก้ไข Invoice','Invoice',id,current,records[index],{reason:'แก้ไขจากประวัติใบแจ้งหนี้'});
  showToast(`แก้ไขประวัติ ${id} แล้ว`);
}
function deleteInvoiceHistory(id){
  const records=loadInvoiceHistory();
  const current=records.find(record=>record.id===id);
  if(!current)return;
  if(closeRoundIsLocked(current.businessDate)){showToast(`ลบไม่ได้: รอบ ${current.businessDate} ถูก Submit และ Lock แล้ว`,'error');return}
  saveInvoiceHistory(records.filter(record=>record.id!==id));
  state.closedBookings=state.closedBookings.filter(record=>record.reference!==id);
  saveClosedBookings();
  syncInvoiceHistoryState();
  recordAudit('ลบ Invoice','Invoice',id,current,null,{reason:'ลบจากประวัติใบแจ้งหนี้'});
  showToast(`ลบประวัติ ${id} แล้ว`);
}
function requestDeleteInvoiceHistory(id){
  const record=loadInvoiceHistory().find(item=>item.id===id);
  if(!record)return;
  openModal(`ยืนยันลบประวัติ ${id}`,`<p>ต้องการลบใบแจ้งหนี้ของ <strong>${esc(record.customer||'-')}</strong> ออกจากประวัติใช่หรือไม่?</p><p class="muted">การลบจะนำรายการออกจากประวัติและข้อมูลการจองที่เกี่ยวข้อง</p>`,`<button class="button button-outline" data-close-modal>ยกเลิก</button><button class="button button-danger" data-history-delete-confirm="${esc(id)}"><span class="material-symbols-outlined">delete</span>ยืนยันลบ</button>`);
}
function exportInvoiceHistoryCsv(){
  const rows=historyRowsForToday();
  const headers=['Invoice','Customer','Villa','Business Date','Total','Pending','Status'];
  const values=rows.map(record=>[record.id,record.customer,record.villa,record.businessDate,record.total,historyPendingTotal(record),historyStatus(record).label]);
  const csv='\uFEFF'+[headers,...values].map(row=>row.map(csvEscape).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');
  link.href=url;link.download=`invoice-history-${historyDateKey()}.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('ส่งออกประวัติใบแจ้งหนี้เป็น CSV แล้ว');
}
function installInvoiceHistory(){
  const filterBar=$('#view-history .filter-bar');
  if(filterBar){
    const selects=filterBar.querySelectorAll('select');
    if(selects[0]){selects[0].id='history-status-filter';selects[0].innerHTML='<option value="all">ทุกสถานะ</option><option value="ชำระแล้ว">ชำระแล้ว</option><option value="ค้างชำระ">ค้างชำระ</option>'}
    if(selects[1]){selects[1].id='history-date-filter';selects[1].disabled=true}
    const exportButton=filterBar.querySelector('button');
    if(exportButton&&!exportButton.dataset.historyExport){exportButton.dataset.historyExport='true';exportButton.addEventListener('click',exportInvoiceHistoryCsv)}
  }
  const realHistory=loadInvoiceHistory();
  state.invoices=realHistory.filter(record=>record.businessDate===historyDateKey()).map(record=>({id:record.id,customer:record.customer,time:record.time,total:record.total,status:record.status,statusClass:record.statusClass}));
  renderDashboard();renderHistory();
  $('#history-search')?.addEventListener('input',renderHistory);
  $('#history-status-filter')?.addEventListener('change',renderHistory);
  document.addEventListener('click',event=>{
    const edit=event.target.closest('[data-history-edit]');
    if(edit){event.preventDefault();openHistoryEdit(edit.dataset.historyEdit);return}
    const remove=event.target.closest('[data-history-delete]');
    if(remove){event.preventDefault();requestDeleteInvoiceHistory(remove.dataset.historyDelete);return}
    const confirmDelete=event.target.closest('[data-history-delete-confirm]');
    if(confirmDelete){event.preventDefault();deleteInvoiceHistory(confirmDelete.dataset.historyDeleteConfirm);return}
    const save=event.target.closest('[data-history-save]');
    if(save){event.preventDefault();editInvoiceHistory(save.dataset.historySave)}
  });
  if(typeof finalizeInvoice==='function'&&!finalizeInvoice.__historyWrapped){
    const baseFinalize=finalizeInvoice;
    const wrappedFinalize=async function(){
      const beforeCount=state.closedBookings.length;
      await baseFinalize();
      if(state.closedBookings.length<=beforeCount)return;
      const source=state.closedBookings[0],now=new Date();
      source.villaCode=formValue('villa-code','');source.businessDate=source.docDate||historyDateKey(now);source.finalizedAt=now.toISOString();saveClosedBookings();
      const record=normalizeHistoryRecord({...source,id:source.reference,reference:source.reference,businessDate:historyDateKey(now),time:now.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'}),finalizedAt:now.toISOString(),netTotal:Math.max(0,Number(source.total||0)-Number(source.discount||0))});
      record.businessDate=source.businessDate;
      const records=loadInvoiceHistory().filter(item=>item.id!==record.id);
      saveInvoiceHistory([record,...records]);
      syncInvoiceHistoryState();
      if(typeof renderCloseRound==='function'&&state.currentView==='close-round')renderCloseRound();
    };
    wrappedFinalize.__historyWrapped=true;
    finalizeInvoice=wrappedFinalize;
  }
  setInterval(()=>{const today=historyDateKey();if(today!==historyRenderedDay){syncInvoiceHistoryState()}},60000);
}
document.addEventListener('DOMContentLoaded',installInvoiceHistory);

/* Keep finalized invoices visible even when the invoice document date is not today. */
function renderInvoiceHistoryAllRecords(){
  const body=$('#history-body');
  if(!body)return;
  const records=loadInvoiceHistory();
  const dateFilter=$('#history-date-filter');
  const previousDate=dateFilter?.value||'all';
  const dates=[...new Set(records.map(record=>record.businessDate).filter(Boolean))].sort().reverse();
  if(dateFilter){
    dateFilter.innerHTML='<option value="all">ทุกวัน</option>'+dates.map(date=>`<option value="${esc(date)}">${esc(historyDisplayDate(date))}</option>`).join('');
    dateFilter.value=dates.includes(previousDate)?previousDate:'all';
    dateFilter.disabled=false;
  }
  const query=($('#history-search')?.value||'').trim().toLowerCase();
  const statusFilter=$('#history-status-filter')?.value||'all';
  const selectedDate=dateFilter?.value||'all';
  const rows=records.filter(record=>{
    const status=historyStatus(record);
    const haystack=[record.id,record.reference,record.customer,record.villa,record.time,record.businessDate,status.label,record.total,record.pendingTotal].join(' ').toLowerCase();
    return (selectedDate==='all'||record.businessDate===selectedDate)&&(!query||haystack.includes(query))&&(statusFilter==='all'||status.label===statusFilter);
  }).sort((a,b)=>{
    const dateCompare=String(b.businessDate||'').localeCompare(String(a.businessDate||''));
    return dateCompare||String(b.time||'').localeCompare(String(a.time||''));
  });
  body.innerHTML=rows.map(record=>{
    const status=historyStatus(record),pending=historyPendingTotal(record);
    return `<tr><td>${esc(record.id)}</td><td><strong>${esc(record.customer||'-')}</strong><small class="table-subtext">${esc(record.villa||'-')} · ${esc(record.time||'-')} น.</small></td><td>${esc(historyDisplayDate(record.businessDate))}</td><td class="align-right strong-number">${money(record.total)}</td><td>${pending?`<span class="warning-text">รอเรียกเก็บ ${money(pending)}</span>`:'<span class="positive-text">ครบถ้วน</span>'}</td><td><span class="status-chip ${status.className}">${status.label}</span></td><td><div class="history-actions"><button class="button button-outline action-small" data-history-edit="${esc(record.id)}"><span class="material-symbols-outlined">edit</span>แก้ไข</button><button class="button button-danger action-small" data-history-delete="${esc(record.id)}"><span class="material-symbols-outlined">delete</span>ลบ</button></div></td></tr>`;
  }).join('')||'<tr><td colspan="7"><div class="empty-state"><span class="material-symbols-outlined">receipt_long</span><p>ไม่พบประวัติใบแจ้งหนี้</p><small>เมื่อยืนยันใบแจ้งหนี้แล้ว รายการจะปรากฏที่นี่</small></div></td></tr>';
  historyRenderedDay=historyDateKey();
}

function installInvoiceHistoryFiltersFix(){
  const dateFilter=$('#history-date-filter');
  if(!dateFilter)return;
  const search=$('#history-search');
  const status=$('#history-status-filter');
  const date=dateFilter;
  [search,status,date].forEach(element=>{
    if(!element)return;
    const clone=element.cloneNode(true);
    element.replaceWith(clone);
  });
  renderHistory=renderInvoiceHistoryAllRecords;
  $('#history-search')?.addEventListener('input',renderHistory);
  $('#history-status-filter')?.addEventListener('change',renderHistory);
  $('#history-date-filter')?.addEventListener('change',renderHistory);
  renderHistory();
}
document.addEventListener('DOMContentLoaded',installInvoiceHistoryFiltersFix);

/* Centralized quantity handler so +/- keeps working after line rows are re-rendered. */
function adjustInvoiceLineQuantity(index,delta){
  const line=state.invoiceLines[Number(index)];
  if(!line)return;
  line.qty=Math.max(1,Math.floor(Number(line.qty||1)+Number(delta||0)));
  renderFormLines();
  if(typeof calculateInvoice==='function')calculateInvoice();
  if(typeof refreshInvoiceSummaryPanel==='function')refreshInvoiceSummaryPanel();
}
function installInvoiceQuantityControls(){
  if(document.documentElement.dataset.invoiceQuantityControls==='ready')return;
  document.documentElement.dataset.invoiceQuantityControls='ready';
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-line-index][data-qty]');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    adjustInvoiceLineQuantity(button.dataset.lineIndex,button.dataset.qty);
  },true);
}
document.addEventListener('DOMContentLoaded',installInvoiceQuantityControls);

/* Search the large master-data lists before adding an invoice line. */
function installInvoiceItemSearch(){
  ['\u0e23\u0e31\u0e10 50%','\u0e17\u0e17\u0e17','\u0e44\u0e21\u0e48\u0e40\u0e23\u0e35\u0e22\u0e01\u0e40\u0e01\u0e47\u0e1a'].forEach(method=>{if(!paymentMethods.includes(method))paymentMethods.push(method)});
  [
    {type:'accommodation',selectId:'accommodation-select',inputId:'accommodation-search'},
    {type:'addon',selectId:'addon-select',inputId:'addon-search'}
  ].forEach(({type,selectId,inputId})=>{
    const select=$('#'+selectId);
    if(!select)return;
    const existing=$('#'+inputId);
    if(existing){
      if(existing.dataset.searchEnhanced)return;
      existing.dataset.searchEnhanced='true';
      const options=[...select.options].filter(option=>option.value!=='');
      const enhanceExistingSearch=()=>{
        const query=existing.value.trim().toLowerCase();
        const matches=options.filter(option=>option.textContent.toLowerCase().includes(query));
        const exact=options.find(option=>option.textContent.trim().toLowerCase()===query);
        if(exact||query&&matches.length===1){
          select.value=(exact||matches[0]).value;
          if(typeof fillRate==='function')fillRate(type);
        }else if(!query||!matches.length){
          select.value='';
        }
      };
      existing.addEventListener('input',enhanceExistingSearch);
      existing.addEventListener('change',enhanceExistingSearch);
      enhanceExistingSearch();
      return;
    }
    const input=document.createElement('input');
    input.id=inputId;
    input.type='search';
    input.className='invoice-search-input';
    input.placeholder='ค้นหารายการ...';
    input.setAttribute('aria-label','ค้นหารายการ');
    input.autocomplete='off';
    select.parentElement?.insertBefore(input,select);
    const options=[...select.options].filter(option=>option.value!=='');
    const filter=()=>{
      const query=input.value.trim().toLowerCase();
      const matches=options.filter(option=>option.textContent.toLowerCase().includes(query));
      options.forEach(option=>{option.hidden=Boolean(query)&&!option.textContent.toLowerCase().includes(query)});
      if(select.value&&!matches.some(option=>option.value===select.value))select.value='';
      if(query&&matches.length===1){
        select.value=matches[0].value;
        if(typeof fillRate==='function')fillRate(type);
      }
    };
    input.addEventListener('input',filter);
    filter();
  });
}

/* Normalize every finalized line into the workbook's income and payment columns. */
function installCloseRoundDataNormalization(){
  const categoryBase=closeRoundCategoryKey;
  closeRoundCategoryKey=function(line){
    const text=String(line?.category||'')+' '+String(line?.name||'');
    const value=text.toLowerCase();
    if(/extra.?bed|เตียงเสริม|ที่นอน/.test(value))return 'extraBed';
    if(/ht\s*\/?\s*sht|\bht\s*\d*/.test(value))return 'htSht';
    if(/food|beverage|bbq|package|afternoon|อาหาร|เครื่องดื่ม/.test(value))return 'food';
    const villaNames=Array.isArray(DATA?.villas)?DATA.villas.map(v=>String(v?.name||'').toLowerCase()).filter(Boolean):[];
    const isVilla=villaNames.some(name=>value.includes(name))||/villa|accommodation|วิลล่า|ห้องพัก|bathtub|jacuzzi|shower\s*duplex/.test(value);
    if(isVilla)return 'villa';
    if(/minibar|มินิบาร์/.test(value))return 'minibar';
    if(/dog|สุนัข|ชมสุนัข/.test(value))return 'dogActivity';
    if(/massage|นวด/.test(value))return 'massage';
    if(/\batv\b/.test(value))return 'atv';
    if(/\bev\b|charge\s*ev|ev\s*charger|ชาร์จ\s*ev/.test(value)&&!/e-voucher/.test(value))return 'ev';
    if(/souvenir|product|สินค้า|ของที่ระลึก/.test(value))return 'product';
    return categoryBase(line);
  };

  const paymentBase=closeRoundPaymentKey;
  closeRoundPaymentKey=function(method){
    const value=String(method||'').toLowerCase().replace(/\s+/g,'');
    if(/cash|เงินสด/.test(value))return 'cash';
    if(/card|credit|บัตรเครดิต/.test(value))return 'card';
    if(/qr|qrcode|คิวอาร์|คิวอาโค้ต/.test(value))return 'qr';
    if(/transfer|โอน|2c2p/.test(value))return 'transfer';
    if(/government|รัฐ50|รัฐบาล/.test(value))return 'government';
    if(/tat|ททท/.test(value))return 'tat';
    if(/nocharge|ไม่เรียกเก็บ|ฟรี/.test(value))return 'noCharge';
    return paymentBase(method);
  };

  const modelBase=closeRoundRecordModel;
  closeRoundRecordModel=function(record){
    const normalized={
      ...record,
      lines:Array.isArray(record?.lines)?record.lines.map(line=>({...line,qty:Math.max(1,Number(line.qty||1)),rate:Math.max(0,Number(line.rate||0)),deposit:Math.max(0,Number(line.deposit||0)),discountRate:Math.max(0,Number(line.discountRate||0)),discountAmount:Math.max(0,Number(line.discountAmount||0))})):[],
      payments:Array.isArray(record?.payments)?record.payments.map(payment=>({...payment,amount:Math.max(0,Number(payment.amount||0))})):[],
    };
    const row=modelBase(normalized);
    const pendingFromLines=normalized.lines.reduce((sum,line)=>sum+Math.max(0,Number(line.pendingCollection||0)),0);
    const pending=Math.max(0,Number(record?.pendingTotal||record?.pendingCollectionTotal||pendingFromLines||0));
    return {...row,pending,payments:{...row.payments,pending}};
  };
}

document.addEventListener('DOMContentLoaded',()=>{
  installInvoiceItemSearch();
  installCloseRoundDataNormalization();
});

/* Make the typed search value authoritative when adding an invoice line. */
function installInvoiceAddSelectionFix(){
  const customItemsKey='scenery-invoice-custom-items';
  const normalize=value=>cleanEnglishText(String(value||'')).trim().toLowerCase().replace(/\s+/g,' ');
  let customItems={accommodation:[],addon:[]};
  try{
    const saved=JSON.parse(localStorage.getItem(customItemsKey)||'{}');
    if(saved&&typeof saved==='object')customItems={accommodation:Array.isArray(saved.accommodation)?saved.accommodation:[],addon:Array.isArray(saved.addon)?saved.addon:[]};
  }catch{}
  const saveCustomItems=()=>{try{localStorage.setItem(customItemsKey,JSON.stringify(customItems))}catch{}};
  const baseItems=type=>type==='accommodation'?accommodationItems:addonItems;
  const allItems=type=>[...baseItems(type),...(customItems[type]||[])];
  const prefixFor=type=>type==='accommodation'?'accommodation':'addon';
  const optionsFor=type=>{
    const select=$(`#${prefixFor(type)}-select`);
    return [...select?.options||[]].filter(option=>option.value!=='');
  };
  const ensureSearchResults=type=>{
    const prefix=prefixFor(type),search=$(`#${prefix}-search`);
    if(!search)return null;
    let box=search.parentElement?.querySelector(`.invoice-search-results[data-results-for="${type}"]`);
    if(!box){box=document.createElement('div');box.className='invoice-search-results';box.dataset.resultsFor=type;search.insertAdjacentElement('afterend',box)}
    return box;
  };
  const renderSearchResults=type=>{
    const search=$(`#${prefixFor(type)}-search`),box=ensureSearchResults(type);
    if(!search||!box)return;
    const query=normalize(search.value);box.innerHTML='';
    if(!query){box.hidden=true;return}
    const matches=optionsFor(type).filter(option=>normalize(option.textContent).includes(query)).slice(0,50);
    if(!matches.length){box.hidden=true;return}
    matches.forEach(option=>{
      const button=document.createElement('button');button.type='button';button.className='invoice-search-result';button.textContent=option.textContent;button.addEventListener('mousedown',event=>event.preventDefault());button.addEventListener('click',()=>{search.value=option.textContent;const select=$(`#${prefixFor(type)}-select`);if(select)select.value=option.value;if(typeof fillRate==='function')fillRate(type);search.dispatchEvent(new Event('input',{bubbles:true}));search.focus()});box.appendChild(button);
    });
    box.hidden=false;
  };
  const refreshSuggestions=type=>{
    const prefix=prefixFor(type),select=$(`#${prefix}-select`),search=$(`#${prefix}-search`),list=$(`#${prefix}-options`);
    if(!select||!search)return;
    const query=normalize(search.value);
    if(list){
      list.innerHTML='';
      optionsFor(type).filter(option=>query&&normalize(option.textContent).includes(query)).forEach(option=>{
        const suggestion=document.createElement('option');suggestion.value=option.textContent;list.appendChild(suggestion);
      });
    }
    renderSearchResults(type);
  };
  const ensureCustomOptions=type=>{
    const select=$(`#${prefixFor(type)}-select`),base=baseItems(type);
    if(!select)return;
    (customItems[type]||[]).forEach((item,index)=>{
      const value=String(base.length+index);
      if([...select.options].some(option=>option.value===value))return;
      const option=document.createElement('option');option.value=value;option.textContent=item.name;option.dataset.custom='true';select.appendChild(option);
    });
  };
  const wireSearch=type=>{
    const prefix=prefixFor(type),search=$(`#${prefix}-search`),select=$(`#${prefix}-select`);
    if(!search||!select||search.dataset.addSelectionFix)return;
    search.dataset.addSelectionFix='true';
    ensureCustomOptions(type);
    const sync=()=>{
      const query=normalize(search.value),options=optionsFor(type),exact=options.find(option=>normalize(option.textContent)===query),matches=options.filter(option=>normalize(option.textContent).includes(query));
      if(exact){select.value=exact.value;if(typeof fillRate==='function')fillRate(type)}
      else if(query&&matches.length===1){select.value=matches[0].value;if(typeof fillRate==='function')fillRate(type)}
      else if(query&&!matches.some(option=>option.value===select.value))select.value='';
      refreshSuggestions(type);
    };
    search.addEventListener('input',sync);search.addEventListener('change',sync);search.addEventListener('focus',()=>refreshSuggestions(type));sync();
  };
  ['accommodation','addon'].forEach(type=>{ensureCustomOptions(type);wireSearch(type)});
  addLine=function(type){
    const prefix=prefixFor(type),select=$(`#${prefix}-select`),search=$(`#${prefix}-search`),categoryEl=type==='accommodation'?$('#accommodation-category'):$('#addon-category'),rateEl=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),qtyEl=type==='accommodation'?$('#accommodation-qty'):$('#addon-qty'),items=allItems(type),query=normalize(search?.value),options=optionsFor(type),exact=options.find(option=>normalize(option.textContent)===query),matches=options.filter(option=>normalize(option.textContent).includes(query));
    let item=null,index=null;
    if(query){
      if(matches.length>1&&!exact){showToast('พบหลายรายการ กรุณาเลือกจากรายการที่แสดงก่อนเพิ่ม','error');return}
      const chosen=exact||matches[0];
      if(chosen){index=Number(chosen.value);item=items[index]}
      else item={name:cleanEnglishText(search.value.trim()),category:type==='accommodation'?'Accommodation':'Miscellaneous',rate:0,custom:true};
    }else if(select?.value!==''){
      index=Number(select.value);item=items[index];
    }
    if(!item){showToast('กรุณาเลือกรายการหรือพิมพ์รายการใหม่ก่อนเพิ่ม','error');return}
    const category=cleanEnglishText(categoryEl?.value?.trim()||item.category||(type==='accommodation'?'Accommodation':'Miscellaneous'));
    const rate=Math.max(0,Number(rateEl?.value||item.rate||0)),qty=Math.max(1,Number(qtyEl?.value||1));
    if(item.custom&&!customItems[type].some(saved=>normalize(saved.name)===normalize(item.name))){customItems[type].push({name:item.name,category,rate});saveCustomItems();ensureCustomOptions(type)}
    state.invoiceLines.push({type,name:item.name,category,sourceIndex:index,rate,deposit:0,depositMethod:'เงินสด',qty,discountRate:0,discountAmount:0,pendingCollection:0,pendingNote:''});
    if(select)select.value='';if(rateEl)rateEl.value='';if(qtyEl)qtyEl.value='1';if(search)search.value='';if(categoryEl)categoryEl.value='';refreshSuggestions(type);renderFormLines();if(typeof calculateInvoice==='function')calculateInvoice();showToast(`เพิ่ม ${item.name} ลงในใบแจ้งหนี้แล้ว`);
  };
}
document.addEventListener('DOMContentLoaded',installInvoiceAddSelectionFix);

function historyInvoiceDetailBody(record){
  const lines=Array.isArray(record.lines)?record.lines:[];
  const lineRows=lines.map(line=>{
    const gross=Math.max(0,Number(line.qty||0)*Number(line.rate||0));
    const rateDiscount=Math.min(100,Math.max(0,Number(line.discountRate||0)));
    const fixedDiscount=Math.max(0,Number(line.discountAmount||0));
    const discount=Math.min(gross,gross*rateDiscount/100+fixedDiscount);
    return '<tr><td>'+esc(line.category||'-')+'</td><td>'+esc(line.name||'-')+'</td><td class="align-center">'+Number(line.qty||0)+'</td><td class="align-right">'+money(line.rate)+'</td><td class="align-right">'+money(discount)+'</td><td class="align-right">'+money(line.deposit)+'</td><td class="align-right strong-number">'+money(Math.max(0,gross-discount))+'</td></tr>';
  }).join('');
  const paymentRows=(Array.isArray(record.payments)?record.payments:[]).filter(payment=>Number(payment.amount||0)>0).map(payment=>'<div><span>'+esc(payment.method||'-')+'</span><strong>'+money(payment.amount)+'</strong></div>').join('')||'<div><span>-</span><strong>'+money(0)+'</strong></div>';
  const subtotal=lines.reduce((sum,line)=>sum+Math.max(0,Number(line.qty||0)*Number(line.rate||0)),0);
  const pending=historyPendingTotal(record);
  const outstanding=Math.max(0,Number(record.total||0)-Number(record.deposit||0));
  return '<div class="history-invoice-form"><div class="form-grid three"><label>เลข Invoice<input value="'+esc(record.id||record.reference||'')+'" disabled></label><label>ลูกค้า / บริษัท<input value="'+esc(record.customer||'')+'" disabled></label><label>Villa / Room<input value="'+esc(record.villa||'')+'" disabled></label><label>Check-in<input value="'+esc(record.checkIn||'')+'" disabled></label><label>Check-out<input value="'+esc(record.checkOut||'')+'" disabled></label><label>วันที่เอกสาร<input value="'+esc(record.businessDate||record.docDate||'')+'" disabled></label><label>จำนวนคืน<input value="'+esc(record.nights||'')+'" disabled></label><label class="span-two">หมายเหตุ<input value="'+esc(record.remark||record.pendingCollectionNote||'')+'" disabled></label></div><div class="table-wrap"><table><thead><tr><th>หมวด</th><th>รายการ</th><th>จำนวน</th><th class="align-right">Rate</th><th class="align-right">ส่วนลด</th><th class="align-right">Deposit</th><th class="align-right">ยอดสุทธิ</th></tr></thead><tbody>'+lineRows+'</tbody></table></div><div class="history-payment-list"><h4>ช่องทางชำระเงิน</h4>'+paymentRows+'</div><div class="history-invoice-totals"><div><span>ยอดก่อนส่วนลด</span><strong>'+money(subtotal)+'</strong></div><div><span>ส่วนลด</span><strong>'+money(record.discount)+'</strong></div><div><span>Deposit รวม</span><strong>'+money(record.deposit)+'</strong></div><div><span>ยอดค้างชำระ</span><strong>'+money(outstanding)+'</strong></div><div><span>ยอดรอเก็บ</span><strong>'+money(pending)+'</strong></div><div class="total-row"><span>ยอดสุทธิ</span><strong>'+money(record.total)+'</strong></div></div></div>';
}

function historyInformationBillBody(record){
  const lines=Array.isArray(record.lines)?record.lines:[],lineRows=lines.map(line=>{
    const qty=Math.max(1,Number(line.qty||1)),rate=Math.max(0,Number(line.rate||0)),gross=qty*rate;
    const rateDiscount=Math.min(100,Math.max(0,Number(line.discountRate||0))),fixedDiscount=Math.max(0,Number(line.discountAmount||0));
    const discount=Math.min(gross,gross*rateDiscount/100+fixedDiscount),deposit=Math.max(0,Number(line.deposit||0));
    return '<tr><td>'+esc(line.category||'-')+'</td><td class="align-center">'+qty+'</td><td>'+esc(line.name||'-')+'</td><td class="align-right">'+money(rate)+'</td><td class="align-right">'+money(deposit)+'</td><td class="align-right">'+money(discount)+'</td><td class="align-right">'+money(Math.max(0,gross-discount))+'</td></tr>';
  }).join('')||'<tr class="blank-line"><td colspan="7">-</td></tr>';
  const subtotal=lines.reduce((sum,line)=>sum+Math.max(1,Number(line.qty||1))*Math.max(0,Number(line.rate||0)),0),discount=Math.max(0,Number(record.discount||0)),total=Math.max(0,Number(record.total||0)),deposit=Math.max(0,Number(record.deposit||0));
  const displayTotal=total||Math.max(0,subtotal-discount),outstanding=Math.max(0,displayTotal-deposit-discount);
  const paymentMethods=[...new Set((Array.isArray(record.payments)?record.payments:[]).filter(payment=>Number(payment.amount||0)>0).map(payment=>payment.method||'-'))].join(', ')||'-';
  return '<div class="history-information-bill-wrap"><div class="invoice-preview-stage"><article class="invoice-preview-sheet history-information-bill"><header class="preview-header"><div class="preview-company"><img src="346973899_1639269593246469_4301917493848559029_n.jpg" alt="The Scenery"><div><p>234 Moo 7, Suan Phueng</p><p>Ratchaburi 70180</p><p>Tel : +66 81 000 7070</p><p>Fax : +66 32 206 370</p><p>www.sceneryvintagefarm.com</p></div></div><div class="preview-title"><h1>INFORMATION<br>BILL</h1><div><span>Invoice No</span><strong>'+esc(record.id||record.reference||'-')+'</strong></div><div><span>Date</span><strong>'+esc(formatDate(record.docDate||record.businessDate||''))+'</strong></div></div></header><div class="preview-meta"><div><span>Reference No.</span><strong>'+esc(record.reference||record.id||'-')+'</strong></div><div class="guest-meta"><span>Guest Name / No. of Guest</span><strong>'+esc(record.customer||'-')+'</strong></div><div><span>Check-in Date</span><strong>'+esc(formatDate(record.checkIn||''))+'</strong></div><div><span>Check-out Date</span><strong>'+esc(formatDate(record.checkOut||''))+'</strong></div><div><span>No. of Nights</span><strong>'+esc(record.nights||'-')+'</strong></div><div><span>Remark</span><strong>'+esc(record.remark||paymentMethods||'-')+'</strong></div></div><div class="preview-table-wrap"><table class="invoice-preview-table"><thead><tr><th>Category</th><th>QTY</th><th>Description</th><th>Rate<br>(per total QTY)</th><th>Deposit</th><th>Discount</th><th>Total THB</th></tr></thead><tbody>'+lineRows+'</tbody></table></div><footer class="preview-footer"><div class="preview-agreement">I agree that my liability for this bill is not waived and agree to be held personally liable in the event that the indicated person, company or association fails to pay for any part of the full amount of these charges.<div class="signature-row"><span>Guest Signature</span><span>Receptionist</span></div></div><div class="preview-totals"><div><span>Total</span><strong>'+money(displayTotal)+'</strong></div><div><span>Deposit</span><strong>'+money(deposit)+'</strong></div><div><span>Discount</span><strong>'+money(discount)+'</strong></div><div class="total-outstanding"><span>Outstanding</span><strong>'+money(outstanding)+'</strong></div><small>THAI BAHT</small></div></footer></article></div></div>';
}

