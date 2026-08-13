function enableNegativeLineTotals(){
  const discountFor=(line,amount,snapshot)=>{const rate=Math.min(100,Math.max(0,Number(line.discountRate||0))),fixed=Math.max(0,Number(line.discountAmount||0));return snapshot.discountScope==='line'?Math.min(amount,amount*rate/100+fixed):snapshot.discountScope==='all'&&snapshot.subtotal?amount*(snapshot.discount/snapshot.subtotal):0}
  allocateLineAmounts=function(snapshot){let paid=snapshot.paymentDeposits;const rows=state.invoiceLines.map(line=>{const amount=lineAmount(line),discount=discountFor(line,amount,snapshot),afterDiscount=amount-discount,lineDeposit=Math.max(0,Number(line.deposit||0)),payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid),pending=Math.max(0,Number(line.pendingCollection||0)),unpaid=afterDiscount-lineDeposit-payment;paid-=payment;return{line,amount,discount,lineDeposit,payment,pending,deposit:lineDeposit+payment,unpaid,outstanding:unpaid-pending}});if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.unpaid-=paid;last.outstanding-=paid}return rows}
  lineRow=function(line,index){const gross=lineAmount(line),snapshot=invoiceSnapshot(),discount=discountFor(line,gross,snapshot),net=gross-discount-Number(line.deposit||0);return`<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">−</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="ช่องทาง Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><div class="line-discount-fields"><label class="line-discount-field"><input class="line-discount-rate" data-line-index="${index}" type="number" min="0" max="100" step="0.01" value="${Math.min(100,Math.max(0,Number(line.discountRate||0)))}" placeholder="0" aria-label="ส่วนลดเปอร์เซ็นต์ ${esc(line.name)}"><span>%</span></label><label class="line-discount-field"><input class="line-discount-amount" data-line-index="${index}" type="number" min="0" step="0.01" value="${Math.max(0,Number(line.discountAmount||0))}" placeholder="0" aria-label="ส่วนลดเป็นเงิน ${esc(line.name)}"><span>Baht</span></label></div></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">ก่อนหัก ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="ลบรายการ"><span class="material-symbols-outlined">close</span></button></td></tr>`}
  renderFormLines();renderInvoicePreview();calculateInvoice()
}
document.addEventListener('DOMContentLoaded',()=>enableNegativeLineTotals());

function refreshInvoiceSummaryPanel(){const snapshot=invoiceSnapshot(),displayOutstanding=snapshot.outstandingDisplay??snapshot.outstanding;[['summary-total',snapshot.subtotal],['summary-deposit',snapshot.deposit],['summary-discount',snapshot.discount],['summary-outstanding',displayOutstanding],['preview-total',snapshot.subtotal],['preview-deposit',snapshot.deposit],['preview-discount',snapshot.discount],['preview-outstanding',displayOutstanding]].forEach(([id,value])=>{const element=$(`#${id}`);if(element)element.textContent=money(value)})}
document.addEventListener('DOMContentLoaded',()=>{const refresh=event=>{if(!event||event.target.closest?.('#view-invoice'))refreshInvoiceSummaryPanel()};document.addEventListener('input',refresh);document.addEventListener('change',refresh);document.addEventListener('click',event=>{if(event.target.closest?.('#add-accommodation,#add-addon,[data-line-index][data-qty],.remove-form-line'))setTimeout(refreshInvoiceSummaryPanel,0)});refreshInvoiceSummaryPanel()});

function installEditableLineCategories(){[{type:'accommodation',id:'accommodation-category',values:['Accommodation','Inclusive Package','Package','Extra Bed','Complimentary']},{type:'addon',id:'addon-category',values:['Food & Beverage','BBQ','Minibar','Souvenir','Activities','Miscellaneous','Other Expenses']}].forEach(({type,id,values})=>{const select=$(`#${type}-select`),fields=select?.parentElement;if(!fields||$(`#${id}`))return;const input=document.createElement('input');input.id=id;input.type='text';input.className='invoice-category-input';input.placeholder='หมวด / พิมพ์หรือเลือก';input.setAttribute('list',`${id}-options`);input.setAttribute('aria-label',`หมวด ${type}`);const list=document.createElement('datalist');list.id=`${id}-options`;values.forEach(value=>{const option=document.createElement('option');option.value=value;list.appendChild(option)});fields.insertBefore(input,fields.querySelector('.button'));fields.appendChild(list)})}
function enableEditableLineCategories(){
  installEditableLineCategories()
  addLine=function(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),search=$(`#${type==='accommodation'?'accommodation':'addon'}-search`),categoryEl=type==='accommodation'?$('#accommodation-category'):$('#addon-category'),rateEl=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),qtyEl=type==='accommodation'?$('#accommodation-qty'):$('#addon-qty'),items=type==='accommodation'?accommodationItems:addonItems,selected=items[Number(select?.value)],typed=cleanEnglishText(search?.value?.trim()||''),item=selected||(!typed?null:{name:typed,category:type==='accommodation'?'Accommodation':'Miscellaneous',rate:Math.max(0,Number(rateEl?.value||0)),custom:true});if(!item){showToast('กรุณาเลือกรายการหรือพิมพ์รายการใหม่ก่อนเพิ่ม','error');return}const category=cleanEnglishText(categoryEl?.value?.trim()||item.category||(type==='accommodation'?'Accommodation':'Miscellaneous'));state.invoiceLines.push({type,name:item.name,category,sourceIndex:selected?Number(select.value):null,rate:Math.max(0,Number(rateEl?.value||item.rate||0)),deposit:0,depositMethod:'เงินสด',qty:Math.max(1,Number(qtyEl?.value||1)),discountRate:0,discountAmount:0,pendingCollection:0,pendingNote:''});if(select)select.value='';if(rateEl)rateEl.value='';if(qtyEl)qtyEl.value='1';if(search)search.value='';if(categoryEl)categoryEl.value='';renderFormLines();calculateInvoice();showToast(`เพิ่ม ${item.name} ลงในใบแจ้งหนี้แล้ว`)}
  installEditableLineCategories()
}
document.addEventListener('DOMContentLoaded',()=>enableEditableLineCategories());

function removeSearchClearButtons(){
  document.querySelectorAll('.invoice-search-clear').forEach(button=>button.remove());
  document.querySelectorAll('.invoice-search-wrap').forEach(wrapper=>{
    const input=wrapper.querySelector('.invoice-search-input');
    if(input)wrapper.replaceWith(input);
  });
}
document.addEventListener('DOMContentLoaded',()=>removeSearchClearButtons());

// Final invoice rules: discount is a single entered Baht amount and
// collection from other points is recorded once for the whole bill.
function installFinalInvoiceRules(){
  if(typeof state.pendingCollectionTotal!=='number')state.pendingCollectionTotal=0;
  if(typeof state.pendingCollectionNote!=='string')state.pendingCollectionNote='';
  if(!state.closedInvoiceSnapshot)state.closedInvoiceSnapshot=null;

  const clampDiscount=(line,amount)=>Math.min(Math.max(0,Number(amount||0)),Math.max(0,Number(line.discountAmount||0)));
  const pendingTotal=()=>Math.max(0,Number(state.pendingCollectionTotal||0));

  const calculateLiveInvoiceSnapshot=()=>{
    const subtotal=state.invoiceLines.reduce((sum,line)=>sum+lineAmount(line),0);
    const scope=formValue('discount-scope','line');
    const enteredLineDiscount=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.discountAmount||0)),0);
    const allDiscount=Math.max(0,Number(formValue('discount-all-rate',0))||0);
    const discount=scope==='none'?0:scope==='all'?Math.min(subtotal,subtotal*allDiscount/100):Math.min(subtotal,enteredLineDiscount);
    const lineDeposits=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.deposit||0)),0);
    const paymentDeposits=state.payments.reduce((sum,payment)=>sum+Math.max(0,Number(payment.amount||0)),0);
    const deposit=lineDeposits+paymentDeposits;
    const pending=Math.min(Math.max(0,subtotal-discount-deposit),pendingTotal());
    const netTotal=Math.max(0,subtotal-discount);
    return {reference:formValue('folio',''),customer:formValue('customer',''),checkIn:formValue('check-in'),checkOut:formValue('check-out'),nights:formValue('no-of-night',''),remark:formValue('remark',''),docDate:formValue('doc-date'),villa:formValue('villa',''),subtotal,discount,lineDeposits,paymentDeposits,pendingTotal:pending,deposit,netTotal,outstanding:netTotal-deposit-pending,outstandingDisplay:netTotal-deposit,discountScope:scope,allAmount:allDiscount};
  };
  const settlementTotals=()=>{
    const snapshot=calculateLiveInvoiceSnapshot();
    const paid=settlementRows.reduce((sum,row)=>sum+Math.max(0,Number(row.amount||0)),0);
    const pending=pendingCollectionRows.reduce((sum,row)=>sum+Math.max(0,Number(row.amount||0)),0);
    const maximum=Math.max(0,snapshot.netTotal-snapshot.lineDeposits);
    const excess=Math.max(0,paid+pending-maximum);
    return {snapshot,paid,pending,maximum,excess};
  };
  invoiceSnapshot=function(){
    if(state.invoiceClosed&&state.closedInvoiceSnapshot)return {...state.closedInvoiceSnapshot};
    return calculateLiveInvoiceSnapshot();
  };

  allocateLineAmounts=function(snapshot){
    let paid=snapshot.paymentDeposits;
    const rows=state.invoiceLines.map(line=>{
      const amount=lineAmount(line);
      const discount=snapshot.discountScope==='line'?clampDiscount(line,amount):snapshot.discountScope==='all'&&snapshot.subtotal?amount*(snapshot.discount/snapshot.subtotal):0;
      const afterDiscount=amount-discount;
      const lineDeposit=Math.max(0,Number(line.deposit||0));
      const payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid);
      const unpaid=afterDiscount-lineDeposit-payment;
      paid-=payment;
      return {line,amount,discount,lineDeposit,payment,pending:0,deposit:lineDeposit+payment,unpaid,outstanding:unpaid};
    });
    if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.unpaid-=paid;last.outstanding-=paid}
    return rows;
  };

  lineRow=function(line,index){
    const gross=lineAmount(line),discount=clampDiscount(line,gross),net=Math.max(0,gross-discount);
    return `<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">−</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="ช่องทาง Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><input class="line-discount" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.discountAmount||0)}" placeholder="ยอดเงิน" aria-label="ส่วนลดเป็นยอดเงิน ${esc(line.name)}"></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">ก่อนหัก ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="ลบรายการ"><span class="material-symbols-outlined">close</span></button></td></tr>`;
  };

  previewItemRows=function(snapshot){
    const groups=[{label:'Accommodation & Inclusive Package',type:'accommodation'},{label:'Food and Beverages (add-on) and Other Expenses',type:'addon'}],breakdowns=allocateLineAmounts(snapshot);
    return groups.map(group=>{
      const matches=breakdowns.filter(row=>row.line.type===group.type);
      const lines=matches.map(row=>`<tr><td>${esc(row.line.category)}</td><td class="align-center">${row.line.qty}</td><td>${esc(row.line.name)}</td><td class="align-right">${money(row.amount)}</td><td class="align-right">${row.deposit?money(row.deposit):'-'}</td><td class="align-right invoice-discount-cell">${row.discount?money(row.discount):'-'}</td><td class="align-right">${row.outstanding<0?`<span class="invoice-overpaid">${money(row.outstanding)}</span>`:money(row.outstanding)}</td></tr>`).join('');
      const count=Math.max(matches.length,group.type==='accommodation'?7:14),blanks=Array.from({length:count-matches.length},()=>'<tr class="blank-line"><td></td><td></td><td></td><td></td><td>-</td><td>-</td><td>-</td></tr>').join('');
      return `<tr class="bill-section-row"><td colspan="7">${group.label}</td></tr>${lines}${blanks}`;
    }).join('');
  };

  $$('#view-invoice .invoice-line-group th').forEach(th=>{if(th.textContent.includes('ส่วนลด'))th.textContent='ส่วนลด (Baht)'});

  const baseRenderPreview=renderInvoicePreview;
  renderInvoicePreview=function(){
    baseRenderPreview();
    const previewSnapshot=invoiceSnapshot();
    [['preview-reference',previewSnapshot.reference],['preview-reference-meta',previewSnapshot.reference],['preview-customer',previewSnapshot.customer],['preview-check-in',previewSnapshot.checkIn?formatDate(previewSnapshot.checkIn):''],['preview-check-out',previewSnapshot.checkOut?formatDate(previewSnapshot.checkOut):''],['preview-nights',previewSnapshot.nights],['preview-remark',previewSnapshot.remark],['preview-invoice-date',previewSnapshot.docDate?formatDate(previewSnapshot.docDate):'']].forEach(([id,value])=>{if($(`#${id}`))$(`#${id}`).textContent=value||''});
    const noteBox=$('#preview-pending-notes');
    if(!noteBox)return;
    const methods=[...new Set([...state.invoiceLines.filter(line=>Number(line.deposit||0)>0).map(line=>line.depositMethod||'เงินสด'),...state.payments.filter(payment=>Number(payment.amount||0)>0).map(payment=>payment.method)])];
    if($('#preview-payment-method')&&!methods.length)$('#preview-payment-method').textContent='';
    const notes=[];
    if(methods.length)notes.push(`<div><strong>ชำระแล้วจากช่องทาง</strong><span>${esc(methods.join(', '))}</span></div>`);
    if(pendingTotal())notes.push(`<div><strong>รอเรียกเก็บทั้งบิล ${money(pendingTotal())}</strong><span>${esc(state.pendingCollectionNote||'รอเรียกเก็บจากจุดที่เกี่ยวข้อง')}</span></div>`);
    noteBox.innerHTML=notes.join('');
    noteBox.classList.toggle('long-note',String(state.pendingCollectionNote||'').length>90);
    const footer=noteBox.closest('.preview-footer');
    if(footer)footer.classList.toggle('has-pending-notes',notes.length>0);
  };

  const baseRenderPendingFormRows=renderPendingFormRows;
  renderPendingFormRows=function(){
    const box=$('#pending-form-rows');
    if(!box)return;
    box.innerHTML=`<div class="pending-form-row"><strong>รอเรียกเก็บทั้งบิล</strong><input class="whole-bill-pending-amount" type="number" min="0" step="0.01" value="${pendingTotal()}" placeholder="ยอดรอเรียกเก็บ"><input class="whole-bill-pending-note" value="${esc(state.pendingCollectionNote||'')}" placeholder="หมายเหตุ / จุดที่รอเก็บ"></div>`;
  };

  renderPendingCollectionRows=function(){
    const box=$('#pending-collection-rows');
    if(!box)return;
    box.innerHTML=`<div class="pending-collection-row"><div class="pending-collection-name"><strong>รอเรียกเก็บทั้งบิล</strong><small>รวมยอดจากทุกแผนก / จุดที่เกี่ยวข้อง</small></div><input data-pending-bill-field="amount" type="number" min="0" step="0.01" value="${pendingTotal()}" placeholder="ยอดรอเก็บ"><input data-pending-bill-field="note" value="${esc(state.pendingCollectionNote||'')}" placeholder="แผนก / จุดที่รอเก็บ"></div>`;
    box.querySelectorAll('[data-pending-bill-field]').forEach(input=>input.addEventListener('input',event=>{const field=event.target.dataset.pendingBillField;if(field==='amount')pendingCollectionRows[0].amount=Math.max(0,Number(event.target.value||0));else pendingCollectionRows[0].note=event.target.value;updateSettlementTotal()}));
  };

  const baseOpenSettlementModal=openSettlementModal;
  openSettlementModal=function(){
    settlementRows=state.payments.length?state.payments.map(payment=>({...payment})):[{method:'เงินสด',amount:0}];
    pendingCollectionRows=[{amount:pendingTotal(),note:state.pendingCollectionNote||''}];
    const root=$('#modal-root');
    if(!root)return;
    root.innerHTML=`<div class="modal-backdrop"><div class="modal settlement-modal" role="dialog" aria-modal="true"><div class="modal-header"><h3>ยืนยันการชำระเงินและปิดยอด</h3><button class="icon-button" data-close-modal aria-label="ปิด"><span class="material-symbols-outlined">close</span></button></div><div class="modal-body"><p class="muted">บันทึกช่องทางชำระ และรวมยอดที่รอเรียกเก็บจากทุกจุดเป็นยอดเดียวของบิล</p><div id="settlement-rows"></div><button type="button" class="button button-soft full-width" data-settlement-add><span class="material-symbols-outlined">add</span>เพิ่มช่องทางชำระ</button><section class="pending-collection-section"><div class="pending-collection-heading"><strong>ยอดรอเรียกเก็บทั้งบิล</strong><small>ไม่แยกตามรายการ ให้ระบุยอดรวมและหมายเหตุครั้งเดียว</small></div><div id="pending-collection-rows"></div></section><label class="settlement-slip">หลักฐานการชำระเงิน<input id="settlement-slip" type="file" accept="image/*,.pdf"></label><label class="settlement-preparer">ผู้จัดทำ / ผู้ปิดงาน<input id="settlement-preparer" list="preparer-options" placeholder="พิมพ์หรือเลือกชื่อผู้จัดทำ" required><datalist id="preparer-options"><option value="Now Narit"><option value="Mhew Kusu"><option value="Nattaya Phung"><option value="Nummim"><option value="Ple Theresa"></datalist></label><p id="settlement-total" class="settlement-total"></p></div><div class="modal-footer"><button class="button button-outline" type="button" data-close-modal>ยกเลิก</button><button class="button button-primary" type="button" data-settlement-confirm>ปิดยอดและเก็บหลักฐาน</button></div></div></div>`;
    renderSettlementRows();renderPendingCollectionRows();updateSettlementTotal();
  };

  updateSettlementTotal=function(){
    const el=$('#settlement-total');
    if(el){
      const totals=settlementTotals(),overLimit=totals.excess>0.005;
      el.classList.toggle('over-limit',overLimit);
      el.innerHTML=`รวมชำระ ${money(totals.paid)} <span>• ยอดรอเก็บทั้งบิล ${money(totals.pending)}</span>${overLimit?`<small class="settlement-limit-warning">ยอดรวมเกินใบแจ้งหนี้ ${money(totals.excess)} กรุณาปรับยอดก่อนปิดบิล</small>`:''}`;
      const confirm=$('[data-settlement-confirm]');
      if(confirm){confirm.disabled=overLimit;confirm.setAttribute('aria-disabled',String(overLimit));}
    }
  };

  document.addEventListener('click',event=>{
    const button=event.target.closest('#add-payment');
    if(!button)return;
    const amount=Math.max(0,Number($('#payment-amount')?.value||0));
    const snapshot=calculateLiveInvoiceSnapshot();
    const available=Math.max(0,snapshot.netTotal-snapshot.lineDeposits-snapshot.paymentDeposits);
    if(amount>available+0.005){
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast(`ยอดชำระเกินยอดคงเหลือของใบแจ้งหนี้ ${money(amount-available)}`,'error');
    }
  },true);

  finalizeInvoice=async function(){
    const preparer=($('#settlement-preparer')?.value||'').trim();
    if(!preparer){showToast('กรุณาลงชื่อผู้จัดทำก่อนปิดงาน','error');return}
    const enteredTotals=settlementTotals();
    if(enteredTotals.excess>0.005){
      updateSettlementTotal();
      showToast(`ยอดชำระรวมเกินยอดใบแจ้งหนี้ ${money(enteredTotals.excess)}`,'error');
      return;
    }
    const file=$('#settlement-slip')?.files?.[0];
    let proof=null;
    if(file){
      if(file.size>4*1024*1024){showToast('ไฟล์สลิปต้องมีขนาดไม่เกิน 4 MB','error');return}
      try{proof={name:file.name,size:file.size,type:file.type,data:await fileToDataUrl(file)}}catch{showToast('อ่านไฟล์สลิปไม่สำเร็จ','error');return}
    }
    const originalSnapshot=invoiceSnapshot();
    const displaySnapshot={...originalSnapshot,pendingTotal:0,outstanding:originalSnapshot.netTotal-originalSnapshot.deposit,outstandingDisplay:originalSnapshot.netTotal-originalSnapshot.deposit};
    const previousPayments=state.payments.map(payment=>({...payment})),previousTotal=state.pendingCollectionTotal,previousNote=state.pendingCollectionNote;
    state.payments=settlementRows.filter(row=>Number(row.amount||0)>0).map(row=>({method:row.method,amount:Number(row.amount||0)}));
    const pending=pendingCollectionRows[0]||{amount:0,note:''};
    state.pendingCollectionTotal=Math.max(0,Number(pending.amount||0));
    state.pendingCollectionNote=String(pending.note||'').trim();
    let settlementSnapshot=calculateLiveInvoiceSnapshot();
    state.pendingCollectionTotal=Math.min(state.pendingCollectionTotal,Math.max(0,settlementSnapshot.netTotal-settlementSnapshot.deposit));
    settlementSnapshot=calculateLiveInvoiceSnapshot();
    if(settlementSnapshot.deposit+settlementSnapshot.pendingTotal>settlementSnapshot.netTotal+0.005){
      state.payments=previousPayments;state.pendingCollectionTotal=previousTotal;state.pendingCollectionNote=previousNote;renderPayments();calculateInvoice();
      showToast(`ยอดชำระรวมเกินยอดใบแจ้งหนี้ ${money(settlementSnapshot.deposit+settlementSnapshot.pendingTotal-settlementSnapshot.netTotal)}`,'error');return;
    }
    if(settlementSnapshot.outstanding>0){
      state.payments=previousPayments;state.pendingCollectionTotal=previousTotal;state.pendingCollectionNote=previousNote;renderPayments();calculateInvoice();
      showToast(`ยังมียอดที่ยังไม่ชำระหรือยังไม่ระบุยอดรอเก็บ ${money(settlementSnapshot.outstanding)}`,'error');return;
    }
    state.closedInvoiceSnapshot=displaySnapshot;
    state.invoiceClosed=true;
    const record={reference:settlementSnapshot.reference,customer:settlementSnapshot.customer,villa:settlementSnapshot.villa,checkIn:settlementSnapshot.checkIn,checkOut:settlementSnapshot.checkOut,nights:settlementSnapshot.nights,remark:settlementSnapshot.remark,docDate:settlementSnapshot.docDate,total:settlementSnapshot.subtotal,discount:settlementSnapshot.discount,deposit:settlementSnapshot.deposit,pendingTotal:settlementSnapshot.pendingTotal,pendingCollectionTotal:settlementSnapshot.pendingTotal,pendingCollectionNote:state.pendingCollectionNote,preparer,closedAt:new Date().toLocaleString('th-TH'),proof,lines:state.invoiceLines.map(line=>({...line})),payments:state.payments.map(payment=>({...payment}))};
    state.closedBookings.unshift(record);saveClosedBookings();
    state.invoices.unshift({id:settlementSnapshot.reference,customer:settlementSnapshot.customer,time:'เมื่อสักครู่',total:settlementSnapshot.subtotal,status:'ชำระแล้ว',statusClass:'status-paid'});
    renderDashboard();renderBookingRecords();$('#modal-root').innerHTML='';calculateInvoice();setInvoicePage('preview');showToast('ปิดยอดและเก็บหลักฐานการจองแล้ว');
  };

  const baseResetInvoice=resetInvoice;
  resetInvoice=function(){
    const currentInvoicePage=state.invoicePage;
    state.invoiceClosed=false;
    state.closedInvoiceSnapshot=null;
    state.pendingCollectionTotal=0;
    state.pendingCollectionNote='';
    settlementRows=[];
    pendingCollectionRows=[];
    if($('#modal-root'))$('#modal-root').innerHTML='';
    if($('#preview-pending-notes'))$('#preview-pending-notes').innerHTML='';
    baseResetInvoice();
    renderPendingFormRows();
    renderPendingCollectionRows();
    renderInvoicePreview();
    calculateInvoice();
    setInvoicePage(currentInvoicePage);
  };

  // wireEvents registers the original reset handler before this final rule runs.
  // Replace the button so the new reset behavior is the only click handler.
  const resetButton=$('#reset-invoice');
  if(resetButton){
    const freshResetButton=resetButton.cloneNode(true);
    resetButton.replaceWith(freshResetButton);
    freshResetButton.addEventListener('click',()=>resetInvoice());
  }

  document.addEventListener('input',event=>{
    if(event.target.matches('.line-discount')){const line=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(line){line.discountAmount=Math.max(0,Number(event.target.value||0));line.discountRate=0;calculateInvoice()}}
    if(event.target.matches('.whole-bill-pending-amount,.whole-bill-pending-note')){if(event.target.matches('.whole-bill-pending-amount'))state.pendingCollectionTotal=Math.max(0,Number(event.target.value||0));else state.pendingCollectionNote=event.target.value;calculateInvoice()}
  });

  renderPendingFormRows();renderPendingCollectionRows();renderFormLines();renderInvoicePreview();calculateInvoice();
}
document.addEventListener('DOMContentLoaded',()=>installFinalInvoiceRules());

function installInvoiceDraftActions(){
  const summary=$('#view-invoice .live-summary'),previewButton=summary?.querySelector('[data-invoice-page="preview"]');
  if(!summary||!previewButton||$('#save-draft'))return;
  const button=document.createElement('button');button.id='save-draft';button.type='button';button.className='button button-outline full-width';button.innerHTML='<span class="material-symbols-outlined">save</span>บันทึกแบบร่าง';previewButton.insertAdjacentElement('beforebegin',button);button.addEventListener('click',saveInvoiceDraft);
}
document.addEventListener('DOMContentLoaded',installInvoiceDraftActions);

function installInvoiceVillaCodeField(){
  const villa=$('#villa'),villaLabel=villa?.closest('label');
  if(!villaLabel||$('#villa-code'))return;
  const label=document.createElement('label');label.textContent='รหัส Villa / Room';
  const input=document.createElement('input');input.id='villa-code';input.type='text';input.placeholder='เช่น A — Rainy S';input.setAttribute('list','invoice-villa-code-options');input.autocomplete='off';
  const list=document.createElement('datalist');list.id='invoice-villa-code-options';list.innerHTML=(typeof CLOSE_ROUND_VILLA_CODES==='undefined'?[]:CLOSE_ROUND_VILLA_CODES).map(item=>`<option value="${esc(item.value)}"></option>`).join('');label.append(input,list);villaLabel.insertAdjacentElement('afterend',label);
}
document.addEventListener('DOMContentLoaded',installInvoiceVillaCodeField);
function normalizeInvoiceVillaOptions(){
  const select=$('#villa');if(!select)return;
  const seen=new Set();
  [...select.options].forEach(option=>{
    const match=DATA.villas.find(v=>v.reference===option.value||v.name===option.value);
    if(!option.value){return}
    if(!match){option.remove();return}
    option.value=match.name;option.textContent=match.name;
    if(seen.has(match.name))option.remove();else seen.add(match.name);
  });
}
document.addEventListener('DOMContentLoaded',normalizeInvoiceVillaOptions);
document.addEventListener('DOMContentLoaded',()=>{
  const button=$('#save-draft');if(button&&!button.dataset.villaCodeSync){button.dataset.villaCodeSync='true';button.addEventListener('click',()=>{const drafts=loadInvoiceDrafts();if(drafts[0]){drafts[0].fields['villa-code']=$('#villa-code')?.value||'';try{localStorage.setItem('scenery-invoice-drafts',JSON.stringify(drafts))}catch{}}})}
  document.addEventListener('click',event=>{if(event.target.closest('#reset-invoice'))setTimeout(()=>{if($('#villa-code'))$('#villa-code').value=''},0)});
});

function normalizeReceptionLabels(){
  document.querySelectorAll('.topbar-context strong').forEach(element=>{element.textContent='RECEPTION'});
  document.querySelectorAll('#view-close-round option').forEach(option=>{option.textContent=option.textContent.replace(/\s*·\s*Zone A/g,'')});
  document.querySelectorAll('#view-users th').forEach(cell=>{if(cell.textContent.trim()==='จุดขาย')cell.textContent='หน่วยงาน'});
  document.querySelectorAll('#view-users td').forEach(cell=>{if(cell.textContent.trim()==='Zone A')cell.textContent='RECEPTION';if(cell.textContent.trim()==='ทุกจุดขาย')cell.textContent='ทุกหน่วยงาน'});
  document.querySelectorAll('#view-audit p,#view-audit small').forEach(element=>{element.textContent=element.textContent.replace(/จุดขาย/g,'หน่วยงาน').replace(/Zone A/g,'RECEPTION')});
}
document.addEventListener('DOMContentLoaded',normalizeReceptionLabels);

/* Round 0 audit trail: every important local action is recorded and can be
 * mirrored to the configured backend by supabase-bridge.js. */
const AUDIT_LOG_KEY='scenery-audit-log';
function loadAuditLogs(){try{const value=JSON.parse(localStorage.getItem(AUDIT_LOG_KEY)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
function saveAuditLogs(entries){try{localStorage.setItem(AUDIT_LOG_KEY,JSON.stringify(entries.slice(0,500)))}catch{}}
function recordAudit(action,entityType,entityId,beforeData=null,afterData=null,metadata={}){
  const entry={id:`AUD-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,action,entityType,entityId:String(entityId||''),beforeData,afterData,metadata,actor:window.scenerySupabase?.userEmail||'local-user',createdAt:new Date().toISOString()};
  saveAuditLogs([entry,...loadAuditLogs()]);
  renderAuditLog();
  try{window.scenerySupabase?.recordAudit?.(entry)}catch{}
  return entry;
}
function renderAuditLog(){
  const list=$('#view-audit .audit-list');
  if(!list)return;
  const rows=loadAuditLogs().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  list.innerHTML=rows.map(entry=>{const when=new Date(entry.createdAt);const time=Number.isNaN(when.getTime())?'-':when.toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'});const detail=entry.entityId?`${entry.entityType} ${entry.entityId}`:entry.entityType;return `<div class="audit-item"><span class="audit-icon brown"><span class="material-symbols-outlined">fact_check</span></span><div><strong>${esc(entry.action)} <b>${esc(detail)}</b></strong><p>${esc(entry.metadata?.reason||'บันทึกการทำรายการในระบบ')}</p><small>${esc(entry.actor||'ผู้ใช้งาน')} · ${esc(time)}</small></div><span class="status-chip neutral">${esc(entry.action)}</span></div>`}).join('')||'<div class="empty-state"><span class="material-symbols-outlined">fact_check</span><p>ยังไม่มีรายการตรวจสอบ</p><small>Audit Log จะแสดงเมื่อมีการทำรายการจริง</small></div>';
}
function exportAuditLogCsv(){
  const rows=loadAuditLogs(),headers=['Time','Action','Entity Type','Entity ID','Actor','Reason'];
  const values=rows.map(entry=>[entry.createdAt,entry.action,entry.entityType,entry.entityId,entry.actor,entry.metadata?.reason||'']);
  const csv='\uFEFF'+[headers,...values].map(row=>row.map(csvEscape).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=`audit-log-${historyDateKey()}.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('ส่งออก Audit Log เป็น CSV แล้ว');
}
document.addEventListener('DOMContentLoaded',()=>{renderAuditLog();const button=$('#view-audit .page-heading button');button?.addEventListener('click',exportAuditLogCsv)});
function closeRoundIsLocked(date){return loadClosedRounds().some(round=>round.businessDate===date&&['Submitted','Approved'].includes(round.status))}

/* Invoice history: real finalized invoices only, stored day by day. */
const INVOICE_HISTORY_KEY='scenery-invoice-history';
let historyRenderedDay='';
function historyDateKey(date=new Date()){
  const year=date.getFullYear(),month=String(date.getMonth()+1).padStart(2,'0'),day=String(date.getDate()).padStart(2,'0');
  return `${year}-${month}-${day}`;
}
function loadInvoiceHistory(){try{const raw=JSON.parse(localStorage.getItem(INVOICE_HISTORY_KEY)||'[]');return Array.isArray(raw)?raw.map(normalizeHistoryRecord):[]}catch{return[]}}
function saveInvoiceHistory(records){try{localStorage.setItem(INVOICE_HISTORY_KEY,JSON.stringify(records))}catch{showToast('บันทึกประวัติใบแจ้งหนี้ไม่สำเร็จ','error')}}
function historyPendingTotal(record){
  if(Number(record.pendingTotal||0)>0)return Math.max(0,Number(record.pendingTotal||0));
  return (record.pendingCollections||[]).reduce((sum,row)=>sum+Math.max(0,Number(row.amount||0)),0);
}
function historyStatus(record){
  const pending=historyPendingTotal(record);
  return pending>0?{label:'ค้างชำระ',className:'status-pending'}:{label:'ชำระแล้ว',className:'status-paid'};
}
function normalizeHistoryRecord(record){
  const total=Math.max(0,Number(record.netTotal??(Number(record.total||0)-Number(record.discount||0)))||0);
  const pendingTotal=historyPendingTotal(record);
  const status=historyStatus({...record,pendingTotal});
  return {...record,id:record.id||record.reference||`INV-${Date.now()}`,reference:record.reference||record.id||'',businessDate:record.businessDate||historyDateKey(),time:record.time||'ไม่ระบุเวลา',total,netTotal:total,pendingTotal,status:status.label,statusClass:status.className};
}
