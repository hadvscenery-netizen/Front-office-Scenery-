Warning: truncated output (original token count: 89841)
Total output lines: 2126

const DATA=window.DATA_MASTER||{villas:[],accommodationItems:[],addonItems:[]};
const villaOptions=DATA.villas;
const villaBathTypes={'02 Pangola':'Jacuzzi','03 Hamata':'Jacuzzi','04 Barbados':'Jacuzzi_Deluxe','05 Merino':'BathTub','06 Corriedale':'BathTub','06 Corredale':'BathTub','07 Katahdin':'BathTub_Deluxe','08 Mulato':'Jacuzzi','010 Napier':'Jacuzzi','011 Setaria':'Jacuzzi','012 Alfalfa':'Jacuzzi','013 Rapunzel':'Villa'};
function cleanEnglishText(value){return String(value??'').replace(/\bBath\b/g,'Baht').replace(/\bFlaver\b/g,'Flavor').replace(/\bGrand ma\b/g,'Grandma').replace(/Food_Beverage/g,'Food & Beverage').replace(/Afternoon_Tea/g,'Afternoon Tea').replace(/Extra_Bed/g,'Extra Bed').replace(/BathTub_Deluxe/g,'Bathtub Deluxe').replace(/BathTub/g,'Bathtub').replace(/Jacuzzi_Deluxe/g,'Jacuzzi Deluxe').replace(/\s*\?\s*/g,' - ')}
const accommodationItems=[...DATA.accommodationItems.map(item=>{const villaName=Object.keys(villaBathTypes).find(name=>item.name.startsWith(`${name} `)||String(item.villa||'').startsWith(`${name} `));const normalized={...item,name:cleanEnglishText(item.name),category:cleanEnglishText(item.category)};return villaName?{...normalized,label:`${villaName} ${cleanEnglishText(villaBathTypes[villaName])}`,name:`${villaName} ${cleanEnglishText(villaBathTypes[villaName])}`,category:cleanEnglishText(villaBathTypes[villaName]),villa:villaName}:normalized}),{name:'E-Voucher Dinner 800 Baht (22)',category:'Package',rate:800},{name:'E-Voucher Dinner 1200 Baht (22)',category:'Package',rate:1200}].filter((item,index,items)=>items.findIndex(other=>other.name===item.name)===index);
const addonItems=[...DATA.addonItems.map(item=>({...item,name:cleanEnglishText(item.name),category:cleanEnglishText(item.category)})),{name:'E-Voucher Dinner 800 Baht (22)',category:'Food & Beverage',rate:800},{name:'E-Voucher Dinner 1200 Baht (22)',category:'Food & Beverage',rate:1200}].filter((item,index,items)=>items.findIndex(other=>other.name===item.name)===index);
const paymentMethods=['à¹€à¸‡à¸´à¸™à¸ªà¸”','à¹‚à¸­à¸™','à¸šà¸±à¸•à¸£à¹€à¸„à¸£à¸”à¸´à¸•','à¸„à¸´à¸§à¸­à¸²à¹‚à¸„à¹‰à¸•','2C2P'];
const state={invoiceLines:[],payments:[],currentView:'dashboard',invoicePage:'form',invoiceNumber:85,invoices:[],drafts:[{id:'DF-260717-A',label:'à¸šà¸±à¸•à¸£à¸à¸´à¸ˆà¸à¸£à¸£à¸¡à¹à¸à¸° + à¸«à¸à¹‰à¸² 4 à¸Šà¸¸à¸”',total:1200,time:'5 à¸™à¸²à¸—à¸µà¸—à¸µà¹ˆà¹à¸¥à¹‰à¸§'},{id:'DF-260717-B',label:'à¸‚à¸­à¸‡à¸—à¸µà¹ˆà¸£à¸°à¸¥à¸¶à¸: à¸à¸£à¸°à¹€à¸›à¹‹à¸²à¸ªà¸²à¸™ 2 à¹ƒà¸š',total:640,time:'12 à¸™à¸²à¸—à¸µà¸—à¸µà¹ˆà¹à¸¥à¹‰à¸§'},{id:'DF-260716-Z',label:'à¹€à¸«à¸¡à¸²à¸ˆà¹ˆà¸²à¸¢: à¸„à¸“à¸°à¸—à¸±à¸¨à¸™à¸¨à¸¶à¸à¸©à¸² 45 à¸—à¹ˆà¸²à¸™',total:12500,time:'à¹€à¸¡à¸·à¹ˆà¸­à¸§à¸²à¸™'}],closedBookings:loadClosedBookings()};
window.sceneryAppState=state;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],money=v=>{const n=Number(v||0),magnitude=n<0?-n:n,formatted=magnitude.toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});return n<0?`-à¸¿${formatted}`:`à¸¿${formatted}`},esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function loadClosedBookings(){try{return JSON.parse(localStorage.getItem('scenery-closed-bookings')||'[]')}catch{return[]}}
function saveClosedBookings(){try{localStorage.setItem('scenery-closed-bookings',JSON.stringify(state.closedBookings))}catch{}}
function showToast(message,type='success'){const region=$('#toast-region');if(!region)return;const toast=document.createElement('div');toast.className=`toast ${type}`;toast.innerHTML=`<span class="material-symbols-outlined">${type==='error'?'error':'check_circle'}</span><span>${esc(message)}</span>`;region.appendChild(toast);setTimeout(()=>toast.classList.add('show'),10);setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),250)},3200)}
function setView(view){state.currentView=view;$$('.view').forEach(s=>s.classList.toggle('active',s.id===`view-${view}`));$$('.nav-item').forEach(i=>i.classList.toggle('active',i.dataset.view===view));$('#sidebar')?.classList.remove('open');if(view==='master')renderBookingRecords();if(view==='close-round'&&typeof renderCloseRound==='function')renderCloseRound();if(view==='drawer'&&typeof cashDrawerV2Render==='function')cashDrawerV2Render()}
function setInvoicePage(page){state.invoicePage=page;$$('.invoice-page').forEach(s=>s.classList.toggle('active',s.dataset.invoicePage===page));$$('.invoice-page-tab').forEach(b=>b.classList.toggle('active',b.dataset.invoicePage===page));if(page==='preview')renderInvoicePreview()}
function renderDashboard(){const d=$('#dashboard-invoices');if(d)d.innerHTML=state.invoices.slice(0,4).map(i=>`<tr><td>${esc(i.id)}</td><td>${esc(i.customer)}</td><td class="muted">${esc(i.time)}</td><td class="align-right"><strong>${money(i.total)}</strong></td><td><span class="status-chip ${i.statusClass}">${esc(i.status)}</span></td><td class="align-right"><button class="icon-button" aria-label="à¹€à¸¡à¸™à¸¹ ${esc(i.id)}"><span class="material-symbols-outlined">more_vert</span></button></td></tr>`).join('');const drafts=$('#draft-list');if(drafts)drafts.innerHTML=state.drafts.map(d=>`<div class="draft-item"><div class="draft-top"><strong>${esc(d.id)}</strong><small>${esc(d.time)}</small></div><p>${esc(d.label)}</p><div class="draft-bottom"><span class="amount">${money(d.total)}</span><button class="text-button" data-view="invoice">à¹à¸à¹‰à¹„à¸‚</button></div></div>`).join('')}
function renderHistory(){const b=$('#history-body');if(!b)return;const q=($('#history-search')?.value||'').trim().toLowerCase(),rows=state.invoices.filter(i=>`${i.id} ${i.customer}`.toLowerCase().includes(q));b.innerHTML=rows.map(i=>`<tr><td>${esc(i.id)}</td><td><strong>${esc(i.customer)}</strong><small class="table-subtext">${esc(i.time)} à¸™.</small></td><td>17 à¸.à¸„. 2026</td><td class="align-right strong-number">${money(i.total)}</td><td>${i.status==='à¸Šà¸³à¸£à¸°à¹à¸¥à¹‰à¸§'?'<span class="positive-text">à¸„à¸£à¸šà¸–à¹‰à¸§à¸™</span>':'<span class="warning-text">à¸„à¹‰à¸²à¸‡à¸Šà¸³à¸£à¸°</span>'}</td><td><span class="status-chip ${i.statusClass}">${esc(i.status)}</span></td><td><button class="button button-outline action-small" data-action="detail" data-id="${esc(i.id)}">à¹€à¸›à¸´à¸”à¸šà¸´à¸¥</button></td></tr>`).join('')||'<tr><td colspan="7"><div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸à¸²à¸£</p></div></td></tr>'}
function renderBookingRecords(){const view=$('#view-master');if(!view)return;let panel=$('#booking-records-panel');if(!panel){panel=document.createElement('article');panel.id='booking-records-panel';panel.className='panel booking-records-panel';view.appendChild(panel)}panel.innerHTML=`<div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">folder_shared</span></span><h3>à¸«à¸¥à¸±à¸à¸à¸²à¸™à¸à¸²à¸£à¸ˆà¸­à¸‡à¸—à¸µà¹ˆà¸›à¸´à¸”à¸¢à¸­à¸”à¹à¸¥à¹‰à¸§</h3></div><span class="count-chip">${state.closedBookings.length} à¸£à¸²à¸¢à¸à¸²à¸£</span></div>${state.closedBookings.length?`<div class="table-wrap"><table><thead><tr><th>Invoice</th><th>Guest / Villa</th><th>à¸§à¸±à¸™à¸—à¸µà¹ˆà¸›à¸´à¸”à¸¢à¸­à¸”</th><th class="align-right">à¸¢à¸­à¸”à¸£à¸§à¸¡</th><th>à¸ªà¸–à¸²à¸™à¸°</th></tr></thead><tbody>${state.closedBookings.map(r=>`<tr><td class="mono">${esc(r.reference)}</td><td><strong>${esc(r.customer)}</strong><small class="table-subtext">${esc(r.villa||'-')}</small></td><td>${esc(r.closedAt)}</td><td class="align-right strong-number">${money(r.total)}</td><td><span class="status-chip success">à¸Šà¸³à¸£à¸°à¸„à¸£à¸šà¹à¸¥à¹‰à¸§</span></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state"><span class="material-symbols-outlined">folder_open</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸à¸²à¸£à¸›à¸´à¸”à¸¢à¸­à¸”</p><small>à¹€à¸¡à¸·à¹ˆà¸­à¸à¸”à¸›à¸´à¸”à¸¢à¸­à¸” à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸ˆà¸°à¸–à¸¹à¸à¹€à¸à¹‡à¸šà¸«à¸¥à¸±à¸à¸à¸²à¸™à¹„à¸§à¹‰à¸—à¸µà¹ˆà¸™à¸µà¹ˆ</small></div>'}`}
function formValue(id,fallback=''){const element=$(`#${id}`);return element?.dataset.dateValue??element?.value??fallback}function formatDate(value){if(!value)return'-';const date=new Date(`${value}T00:00:00`);return Number.isNaN(date.getTime())?'-':date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}function lineAmount(line){return Math.max(0,Number(line.qty||0)*Number(line.rate||0))}
function discountRateOptions(selected=0){return[0,5,10,15,20,25,30,50].map(n=>`<option value="${n}" ${Number(selected)===n?'selected':''}>à¸¥à¸” ${n}%</option>`).join('')}
function paymentMethodOptions(selected='à¹€à¸‡à¸´à¸™à¸ªà¸”'){return paymentMethods.map(method=>`<option value="${esc(method)}" ${method===selected?'selected':''}>${esc(method)}</option>`).join('')}
function invoiceSnapshot(){const subtotal=state.invoiceLines.reduce((s,l)=>s+lineAmount(l),0),scope=formValue('discount-scope','line'),allRate=Math.max(0,Number(formValue('discount-all-rate',0))||0),lineDiscount=scope==='line'?state.invoiceLines.reduce((s,l)=>s+lineAmount(l)*(Number(l.discountRate||0)/100),0):0,discount=scope==='all'?subtotal*allRate/100:lineDiscount,lineDeposits=state.invoiceLines.reduce((s,l)=>s+Math.max(0,Number(l.deposit||0)),0),paymentDeposits=state.payments.reduce((s,p)=>s+Math.max(0,Number(p.amount||0)),0),pendingTotal=state.invoiceLines.reduce((s,l)=>s+Math.max(0,Number(l.pendingCollection||0)),0),deposit=lineDeposits+paymentDeposits,netTotal=Math.max(0,subtotal-discount);return{reference:formValue('folio','INV-260717-085'),customer:formValue('customer','-'),checkIn:formValue('check-in'),checkOut:formValue('check-out'),nights:formValue('no-of-night','1'),remark:formValue('remark','-'),docDate:formValue('doc-date'),villa:formValue('villa',''),subtotal,discount,lineDeposits,paymentDeposits,pendingTotal,deposit,netTotal,outstanding:netTotal-deposit-pendingTotal,discountScope:scope,allRate}}
function allocateLineAmounts(snapshot){let paid=snapshot.paymentDeposits;const rows=state.invoiceLines.map(line=>{const amount=lineAmount(line),discount=snapshot.discountScope==='line'?amount*Number(line.discountRate||0)/100:amount*(snapshot.allRate/100),afterDiscount=Math.max(0,amount-discount),lineDeposit=Math.max(0,Number(line.deposit||0)),payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid),pending=Math.max(0,Number(line.pendingCollection||0));paid-=payment;return{line,amount,discount,lineDeposit,payment,pending,deposit:lineDeposit+payment,outstanding:afterDiscount-lineDeposit-payment-pending}});if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.outstanding-=paid}return rows}
function lineRow(line,index){const gross=lineAmount(line),snapshot=invoiceSnapshot(),discount=snapshot.discountScope==='line'?gross*Number(line.discountRate||0)/100:snapshot.discountScope==='all'?gross*snapshot.allRate/100:0,net=Math.max(0,gross-discount);return`<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">âˆ’</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡ Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><select class="line-discount" data-line-index="${index}" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸” ${esc(line.name)}">${discountRateOptions(line.discountRate)}</select></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">à¹€à¸•à¹‡à¸¡ ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"><span class="material-symbols-outlined">delete</span></button></td></tr>`}
function renderFormLines(){const a=$('#form-accommodation-lines'),b=$('#form-addon-lines');if(!a||!b)return;const indexed=state.invoiceLines.map((line,index)=>({line,index}));a.innerHTML=indexed.filter(x=>x.line.type==='accommodation').map(x=>lineRow(x.line,x.index)).join('');b.innerHTML=indexed.filter(x=>x.line.type==='addon').map(x=>lineRow(x.line,x.index)).join('');if($('#accommodation-empty'))$('#accommodation-empty').style.display=state.invoiceLines.some(l=>l.type==='accommodation')?'none':'block';if($('#addon-empty'))$('#addon-empty').style.display=state.invoiceLines.some(l=>l.type==='addon')?'none':'block';renderInvoicePreview()}
function renderPayments(){const list=$('#payment-list');if(!list)return;list.innerHTML=state.payments.map((p,i)=>`<div class="payment-pill"><span class="material-symbols-outlined">${p.method==='à¹€à¸‡à¸´à¸™à¸ªà¸”'?'payments':p.method==='à¸šà¸±à¸•à¸£à¹€à¸„à¸£à¸”à¸´à¸•'?'credit_card':'qr_code_2'}</span><span>${esc(p.method)}</span><strong>${money(p.amount)}</strong><button type="button" data-payment-index="${i}" aria-label="à¸¥à¸šà¸à¸²à¸£à¸Šà¸³à¸£à¸°"><span class="material-symbols-outlined">close</span></button></div>`).join('');calculateInvoice()}
function calculateInvoice(){const s=invoiceSnapshot();[['summary-total',s.subtotal],['summary-deposit',s.deposit],['summary-discount',s.discount]].forEach(([id,v])=>{if($(`#${id}`))$(`#${id}`).textContent=money(v)});if($('#summary-outstanding'))$('#summary-outstanding').textContent=state.invoiceClosed&&s.outstanding===0?'':money(s.outstanding);renderInvoicePreview()}
function previewItemRows(snapshot){const groups=[{label:'Accommodation & Inclusive Package',type:'accommodation'},{label:'Food and Beverages (add-on) and Other Expenses',type:'addon'}],breakdowns=allocateLineAmounts(snapshot);return groups.map(g=>{const matches=breakdowns.filter(x=>x.line.type===g.type),lines=matches.map(x=>{const rate=snapshot.discountScope==='line'?Number(x.line.discountRate||0):snapshot.discountScope==='all'?Number(snapshot.allRate||0):0,discountLabel=rate?`<span class="invoice-discount-rate">${rate}%</span><small class="invoice-discount-amount">${money(x.discount)}</small>`:'-',totalLabel=x.pending?`<span class="invoice-pending">à¸£à¸­à¹€à¸à¹‡à¸š ${money(x.pending)}</span>`:x.outstanding<0?`<span class="invoice-overpaid">${money(x.outstanding)}</span>`:state.invoiceClosed&&x.outstanding===0?'':money(x.outstanding);return`<tr><td>${esc(x.line.category)}</td><td class="align-center">${x.line.qty}</td><td>${esc(x.line.name)}</td><td class="align-right">${money(x.amount)}</td><td class="align-right">${x.deposit?money(x.deposit):'-'}</td><td class="align-right invoice-discount-cell">${discountLabel}</td><td class="align-right">${totalLabel}</td></tr>`}).join(''),count=Math.max(matches.length,g.type==='accommodation'?7:14),blanks=Array.from({length:count-matches.length},()=>'<tr class="blank-line"><td></td><td></td><td></td><td></td><td>-</td><td>-</td><td>-</td></tr>').join('');return`<tr class="bill-section-row"><td colspan="7">${g.label}</td></tr>${lines}${blanks}`}).join('')}
function renderInvoicePreview(){if(!$('#invoice-preview-sheet'))return;const s=invoiceSnapshot(),set=(id,v)=>{if($(`#${id}`))$(`#${id}`).textContent=v},methods=[...new Set([...state.invoiceLines.filter(l=>Number(l.deposit||0)>0).map(l=>l.depositMethod||'à¹€à¸‡à¸´à¸™à¸ªà¸”'),...state.payments.filter(p=>Number(p.amount||0)>0).map(p=>p.method)])].join(', ')||'-';set('preview-reference',s.reference);set('preview-reference-meta',s.reference);set('preview-customer',s.customer);set('preview-check-in',formatDate(s.checkIn));set('preview-check-out',formatDate(s.checkOut));set('preview-nights',s.nights);set('preview-remark',s.remark||'-');set('preview-invoice-date',formatDate(s.docDate));set('preview-payment-method',methods);set('preview-total',money(s.subtotal));set('preview-deposit',money(s.deposit));set('preview-discount',money(s.discount));set('preview-outstanding',state.invoiceClosed&&s.outstanding===0?'':money(s.outstanding));if($('#preview-invoice-lines'))$('#preview-invoice-lines').innerHTML=previewItemRows(s)}
function fillRate(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),input=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),items=type==='accommodation'?accommodationItems:addonItems,item=items[Number(select?.value)];if(input)input.value=item?.rate||0}
function addLine(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),rateEl=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),qtyEl=type==='accommodation'?$('#accommodation-qty'):$('#addon-qty'),items=type==='accommodation'?accommodationItems:addonItems,item=items[Number(select?.value)];if(!item){showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¸à¹ˆà¸­à¸™à¹€à¸žà¸´à¹ˆà¸¡','error');return}state.invoiceLines.push({type,name:type==='accommodation'&&item.villa?item.villa:item.name,category:item.category,sourceIndex:Number(select.value),rate:Math.max(0,Number(rateEl?.value||0)),deposit:0,depositMethod:'à¹€à¸‡à¸´à¸™à¸ªà¸”',qty:Math.max(1,Number(qtyEl?.value||1)),discountRate:0});select.value='';rateEl.value='';qtyEl.value='1';const search=$(`#${type==='accommodation'?'accommodation':'addon'}-search`);if(search)search.value='';renderFormLines();showToast(`à¹€à¸žà¸´à¹ˆà¸¡ ${item.name} à¸¥à¸‡à¹ƒà¸™à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸¥à¹‰à¸§`)}
function closeInvoice(){const form=$('#invoice-entry-form');if(form&&!form.reportValidity()){setInvoicePage('form');showToast('à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸—à¸µà¹ˆà¸ˆà¸³à¹€à¸›à¹‡à¸™à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸¢à¸­à¸”','error');return}if(!state.invoiceLines.length){showToast('à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸¢à¸­à¸”','error');return}openSettlementModal()}
function exportPdf(){setInvoicePage('preview');setTimeout(()=>window.print(),80)}
function resetInvoice(){state.invoiceLines=[];state.payments=[];state.invoiceClosed=false;state.itemSearch={};const defaults={folio:'',customer:'','check-in':'','check-out':'','no-of-night':'',remark:'','doc-date':'','villa':'','discount-scope':'line','discount-all-rate':'0','cashier':''};Object.entries(defaults).forEach(([id,v])=>{if($(`#${id}`))$(`#${id}`).value=v});['accommodation-rate','accommodation-qty','addon-rate','addon-qty','payment-amount'].forEach(id=>{if($(`#${id}`))$(`#${id}`).value=''});$$('.invoice-search-input').forEach(input=>input.value='');$$('.invoice-search-clear').forEach(button=>button.hidden=true);renderFormLines();renderPayments();setInvoicePage('form');showToast('à¹€à¸£à¸´à¹ˆà¸¡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹ƒà¸«à¸¡à¹ˆà¹à¸¥à¹‰à¸§')}
function openModal(title,body,actions='<button class="button button-primary" data-close-modal>à¸›à¸´à¸”à¸«à¸™à¹‰à¸²à¸•à¹ˆà¸²à¸‡</button>'){const root=$('#modal-root');if(!root)return;root.innerHTML=`<div class="modal-backdrop" data-close-modal><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-header"><h3>${esc(title)}</h3><button class="icon-button" data-close-modal aria-label="à¸›à¸´à¸”"><span class="material-symbols-outlined">close</span></button></div><div class="modal-body">${body}</div><div class="modal-footer">${actions}</div></div></div>`}
function wireEvents(){document.addEventListener('click',event=>{const viewTrigger=event.target.closest('[data-view]');if(viewTrigger){event.preventDefault();setView(viewTrigger.dataset.view);return}const pageTrigger=event.target.closest('[data-invoice-page]');if(pageTrigger){event.preventDefault();setInvoicePage(pageTrigger.dataset.invoicePage);return}if(event.target.closest('[data-close-modal]')){$('#modal-root').innerHTML='';return}const qty=event.target.closest('[data-line-index][data-qty]');if(qty){const i=Number(qty.dataset.lineIndex);state.invoiceLines[i].qty=Math.max(1,state.invoiceLines[i].qty+Number(qty.dataset.qty));renderFormLines();return}const remove=event.target.closest('.remove-form-line');if(remove){state.invoiceLines.splice(Number(remove.dataset.lineIndex),1);renderFormLines();return}const history=event.target.closest('[data-action="detail"]');if(history)openModal(`à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸” ${history.dataset.id}`,'<p>à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸™à¸µà¹‰à¸ªà¸²à¸¡à¸²à¸£à¸–à¹ƒà¸Šà¹‰à¹€à¸›à¹‡à¸™à¸•à¹‰à¸™à¸—à¸²à¸‡à¸ªà¸³à¸«à¸£à¸±à¸š Void, Adjustment à¸«à¸£à¸·à¸­ Refund à¹„à¸”à¹‰ à¹‚à¸”à¸¢à¸£à¸°à¸šà¸šà¸ˆà¸°à¹€à¸à¹‡à¸šà¸›à¸£à¸°à¸§à¸±à¸•à¸´à¹€à¸”à¸´à¸¡à¹„à¸§à¹‰à¹€à¸ªà¸¡à¸­</p>')});document.addEventListener('click',event=>{const button=event.target.closest('[data-payment-index]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();state.payments.splice(Number(button.dataset.paymentIndex),1);renderPayments();showToast('à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¹à¸¥à¹‰à¸§')},true);$('#open-sidebar')?.addEventListener('click',()=>$('#sidebar')?.classList.add('open'));$('#close-sidebar')?.addEventListener('click',()=>$('#sidebar')?.classList.remove('open'));$('#login-form')?.addEventListener('submit',e=>{e.preventDefault();try{const email=String($('#username')?.value||'').trim();if(email)localStorage.setItem('scenery-last-login-email',email)}catch{}$('#password').value='';$('#login-screen')?.classList.add('is-hidden');$('#app-screen')?.classList.remove('is-hidden');showToast('à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸£à¸°à¸šà¸šà¸ªà¸³à¹€à¸£à¹‡à¸ˆ')});$('#toggle-password')?.addEventListener('click',()=>{const input=$('#password');if(input)input.type=input.type==='password'?'text':'password'});$('#forgot-password')?.addEventListener('click',()=>openModal('à¸¥à¸·à¸¡à¸£à¸«à¸±à¸ªà¸œà¹ˆà¸²à¸™?','<p>à¸à¸£à¸¸à¸“à¸²à¸•à¸´à¸”à¸•à¹ˆà¸­à¸œà¸¹à¹‰à¸”à¸¹à¹à¸¥à¸£à¸°à¸šà¸šà¸«à¸£à¸·à¸­à¸à¹ˆà¸²à¸¢à¹„à¸­à¸—à¸µà¹€à¸žà¸·à¹ˆà¸­à¸£à¸µà¹€à¸‹à¹‡à¸•à¸£à¸«à¸±à¸ªà¸œà¹ˆà¸²à¸™à¸‚à¸­à¸‡à¸„à¸¸à¸“</p>'));$('#help-button')?.addEventListener('click',()=>openModal('à¸¨à¸¹à¸™à¸¢à¹Œà¸Šà¹ˆà¸§à¸¢à¹€à¸«à¸¥à¸·à¸­','<p>à¹€à¸¥à¸·à¸­à¸ â€œà¸«à¸™à¹‰à¸²à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥â€ à¹€à¸žà¸·à¹ˆà¸­à¹€à¸£à¸´à¹ˆà¸¡à¸ªà¸£à¹‰à¸²à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰ à¹à¸¥à¸°à¸•à¸£à¸§à¸ˆà¸œà¸¥à¹„à¸”à¹‰à¸—à¸µà¹ˆ â€œà¸«à¸™à¹‰à¸²à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰â€</p>'));$('#add-accommodation')?.addEventListener('click',()=>addLine('accommodation'));$('#add-addon')?.addEventListener('click',()=>addLine('addon'));$('#accommodation-select')?.addEventListener('change',()=>fillRate('accommodation'));$('#addon-select')?.addEventListener('change',()=>fillRate('addon'));$('#add-payment')?.addEventListener('click',()=>{const amount=Number($('#payment-amount')?.value||0);if(amount<=0){showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸ˆà¸³à¸™à¸§à¸™à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸£à¸±à¸šà¸Šà¸³à¸£à¸°','error');return}state.payments.push({method:$('#payment-method').value,amount});$('#payment-amount').value='';renderPayments();showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¸£à¸²à¸¢à¸à¸²à¸£à¸£à¸±à¸šà¸Šà¸³à¸£à¸°à¹à¸¥à¹‰à¸§')});['folio','customer','check-in','check-out','no-of-night','remark','doc-date','discount-scope','discount-all-rate','villa','cashier'].forEach(id=>{$(`#${id}`)?.addEventListener('input',calculateInvoice);$(`#${id}`)?.addEventListener('change',calculateInvoice)});document.addEventListener('input',event=>{if(event.target.matches('.line-rate')){const l=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(l){l.rate=Math.max(0,Number(event.target.value||0));calculateInvoice()}}});document.addEventListener('change',event=>{if(event.target.matches('.line-discount')){const l=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(l){l.discountRate=Number(event.target.value||0);calculateInvoice()}}});$('#reset-invoice')?.addEventListener('click',resetInvoice);$('#export-pdf')?.addEventListener('click',exportPdf);$('#close-invoice')?.addEventListener('click',closeInvoice);$('#history-search')?.addEventListener('input',renderHistory);$('#global-search')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim()){setView('history');$('#history-search').value=e.target.value.trim();renderHistory()}})}
let settlementRows=[],pendingCollectionRows=[];
function installDepositHeaders(){document.querySelectorAll('#view-invoice .invoice-line-group thead tr').forEach(row=>{if(row.querySelector('.deposit-column'))return;const header=document.createElement('th');header.className='deposit-column align-right';header.textContent='Deposit';row.insertBefore(header,row.children[4]||null)})}
function installSearchableItemFields(){[{id:'accommodation-select',prefix:'accommodation',type:'accommodation'},{id:'addon-select',prefix:'addon',type:'addon'}].forEach(({id,prefix,type})=>{const select=$(`#${id}`);if(!select||$(`#${prefix}-search`))return;const input=document.createElement('input');input.type='text';input.id=`${prefix}-search`;input.className='invoice-search-input';input.setAttribute('list',`${prefix}-options`);input.setAttribute('inputmode','search');input.dataset.source=id;input.autocomplete='off';input.placeholder='';const list=document.createElement('datalist');list.id=`${prefix}-options`;[...select.options].slice(1).forEach(option=>{const item=document.createElement('option');item.value=option.textContent;list.appendChild(item)});select.options[0].textContent='';select.hidden=true;select.insertAdjacentElement('beforebegin',input);select.insertAdjacentElement('afterend',list);const choose=()=>{const value=input.value.trim().toLowerCase(),option=[...select.options].slice(1).find(o=>o.textContent.trim().toLowerCase()===value);select.value=option?option.value:'';if(option){fillRate(type);select.dispatchEvent(new Event('change',{bubbles:true}))}else{const rate=$(`#${prefix}-rate`);if(rate)rate.value=''}};input.addEventListener('input',choose);input.addEventListener('change',choose)});}
function installPreviewPaymentMeta(){const meta=$('#invoice-preview-sheet .preview-meta');if(!meta||$('#preview-payment-method'))return;const guestLabel=meta.querySelector('.guest-meta span');if(guestLabel)guestLabel.textContent='Guest Name / No. of Guest';const reference=meta.children[0];if(!reference)return;const row=document.createElement('div');row.className='preview-payment-method-row';row.innerHTML='<span>Payment Method</span><strong id="preview-payment-method">-</strong>';const wrapper=document.createElement('div');wrapper.className='preview-reference-payment-row';reference.parentNode.insertBefore(wrapper,reference);wrapper.append(reference,row)}
function renderSettlementRows(){const box=$('#settlement-rows');if(!box)return;box.innerHTML=settlementRows.map((row,index)=>`<div class="settlement-row"><select data-settlement-index="${index}" data-settlement-field="method">${paymentMethodOptions(row.method)}</select><input data-settlement-index="${index}" data-settlement-field="amount" type="number" min="0" step="0.01" value="${Number(row.amount||0)}" placeholder="à¸ˆà¸³à¸™à¸§à¸™à¹€à¸‡à¸´à¸™"><button type="button" class="icon-button" data-settlement-remove="${index}" aria-label="à¸¥à¸šà¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸Šà¸³à¸£à¸°"><span class="material-symbols-outlined">delete</span></button></div>`).join('')}
function renderPendingCollectionRows(){const box=$('#pending-collection-rows');if(!box)return;box.innerHTML=state.invoiceLines.map((line,index)=>{const row=pendingCollectionRows[index]||{amount:0,note:''};return`<div class="pending-collection-row"><div class="pending-collection-name"><strong>${esc(line.name)}</strong><small>${esc(line.category||'à¸£à¸²à¸¢à¸à¸²à¸£')}</small></div><input data-pending-line-index="${index}" data-pending-field="amount" type="number" min="0" step="0.01" value="${Number(row.amount||0)}" placeholder="à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸š"><input data-pending-line-index="${index}" data-pending-field="note" value="${esc(row.note||'')}" placeholder="à¹à¸œà¸™à¸ / à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸£à¸­à¹€à¸à¹‡à¸š"></div>`}).join('')||'<p class="muted">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸³à¸«à¸™à¸”à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸š</p>';box.querySelectorAll('[data-pending-line-index]').forEach(input=>input.addEventListener('input',event=>{const index=Number(event.target.dataset.pendingLineIndex),row=pendingCollectionRows[index]||(pendingCollectionRows[index]={amount:0,note:''});if(event.target.dataset.pendingField==='amount')row.amount=Math.max(0,Number(event.target.value||0));else row.note=event.target.value;updateSettlementTotal()}))}
function openSettlementModal(){settlementRows=state.payments.length?state.payments.map(p=>({...p})): [{method:'à¹€à¸‡à¸´à¸™à¸ªà¸”',amount:0}];pendingCollectionRows=state.invoiceLines.map(line=>({amount:Number(line.pendingCollection||0),note:line.pendingNote||''}));const root=$('#modal-root');if(!root)return;root.innerHTML=`<div class="modal-backdrop"><div class="modal settlement-modal" role="dialog" aria-modal="true"><div class="modal-header"><h3>à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™à¹à¸¥à¸°à¸›à¸´à¸”à¸¢à¸­à¸”</h3><button class="icon-button" data-close-modal aria-label="à¸›à¸´à¸”"><span class="material-symbols-outlined">close</span></button></div><div class="modal-body"><p class="muted">à¹à¸¢à¸à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¹à¸¥à¸°à¸ˆà¸³à¸™à¸§à¸™à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸¥à¸¹à¸à¸„à¹‰à¸²à¸Šà¸³à¸£à¸°à¹„à¸”à¹‰à¸«à¸¥à¸²à¸¢à¸£à¸²à¸¢à¸à¸²à¸£</p><div id="settlement-rows"></div><button type="button" class="button button-soft full-width" data-settlement-add><span class="material-symbols-outlined">add</span>à¹€à¸žà¸´à¹ˆà¸¡à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸Šà¸³à¸£à¸°</button><section class="pending-collection-section"><div class="pending-collection-heading"><strong>à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸šà¸ˆà¸²à¸à¹à¸œà¸™à¸ / à¸ˆà¸¸à¸”à¸­à¸·à¹ˆà¸™</strong><small>à¸£à¸°à¸šà¸¸à¸£à¸²à¸¢à¸à¸²à¸£à¸—à¸µà¹ˆà¸›à¸´à¸”à¸‡à¸²à¸™à¹„à¸”à¹‰à¹‚à¸”à¸¢à¸¢à¸±à¸‡à¸£à¸­à¹€à¸à¹‡à¸šà¸ˆà¸²à¸à¸ˆà¸¸à¸”à¸­à¸·à¹ˆà¸™</small></div><div id="pending-collection-rows"></div></section><label class="settlement-slip">à¸«à¸¥à¸±à¸à¸à¸²à¸™à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™<input id="settlement-slip" type="file" accept="image/*,.pdf"></label><label class="settlement-preparer">à¸œà¸¹à¹‰à¸ˆà¸±à¸”à¸—à¸³ / à¸œà¸¹à¹‰à¸›à¸´à¸”à¸‡à¸²à¸™<input id="settlement-preparer" list="preparer-options" placeholder="à¸žà¸´à¸¡à¸žà¹Œà¸«à¸£à¸·à¸­à¹€à¸¥à¸·à¸­à¸à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸ˆà¸±à¸”à¸—à¸³" required><datalist id="preparer-options"><option value="Now Narit"><option value="Mhew Kusu"><option value="Nattaya Phung"><option value="Nummim"><option value="Ple Theresa"></datalist></label><p id="settlement-total" class="settlement-total"></p></div><div class="modal-footer"><button class="button button-outline" type="button" data-close-modal>à¸¢à¸à¹€à¸¥à¸´à¸</button><button class="button button-primary" type="button" data-settlement-confirm>à¸›à¸´à¸”à¸¢à¸­à¸”à¹à¸¥à¸°à¹€à¸à¹‡à¸šà¸«à¸¥à¸±à¸à¸à¸²à¸™</button></div></div></div>`;renderSettlementRows();renderPendingCollectionRows();updateSettlementTotal()}
function updateSettlementTotal(){const el=$('#settlement-total');if(el){const paid=settlementRows.reduce((s,row)=>s+Math.max(0,Number(row.amount||0)),0),pending=pendingCollectionRows.reduce((s,row)=>s+Math.max(0,Number(row.amount||0)),0);el.innerHTML=`à¸£à¸§à¸¡à¸Šà¸³à¸£à¸° ${money(paid)} <span>â€¢ à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸š ${money(pending)}</span>`}}
function fileToDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)})}
async function finalizeInvoice(){const preparer=($('#settlement-preparer')?.value||'').trim();if(!preparer){showToast('à¸à¸£à¸¸à¸“à¸²à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸ˆà¸±à¸”à¸—à¸³à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸‡à¸²à¸™','error');return}const file=$('#settlement-slip')?.files?.[0];let proof=null;if(file){if(file.size>4*1024*1024){showToast('à¹„à¸Ÿà¸¥à¹Œà¸ªà¸¥à¸´à¸›à¸•à¹‰à¸­à¸‡à¸¡à¸µà¸‚à¸™à¸²à¸”à¹„à¸¡à¹ˆà¹€à¸à¸´à¸™ 4 MB','error');return}try{proof={name:file.name,size:file.size,type:file.type,data:await fileToDataUrl(file)}}catch{showToast('à¸­à¹ˆà¸²à¸™à¹„à¸Ÿà¸¥à¹Œà¸ªà¸¥à¸´à¸›à¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ','error');return}}const previousPending=state.invoiceLines.map(line=>({pendingCollection:line.pendingCollection,pendingNote:line.pendingNote}));state.payments=settlementRows.filter(row=>Number(row.amount||0)>0).map(row=>({method:row.method,amount:Number(row.amount||0)}));const pendingCollections=pendingCollectionRows.map((row,index)=>({lineIndex:index,amount:Math.max(0,Number(row.amount||0)),note:String(row.note||'').trim()}));state.invoiceLines.forEach((line,index)=>{line.pendingCollection=pendingCollections[index]?.amount||0;line.pendingNote=pendingCollections[index]?.note||''});const s=invoiceSnapshot();if(s.outstanding>0){state.invoiceLines.forEach((line,index)=>Object.assign(line,previousPending[index]||{}));showToast(`à¸¢à¸±à¸‡à¸¡à¸µà¸¢à¸­à¸”à¸—à¸µà¹ˆà¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸Šà¸³à¸£à¸°à¸«à¸£à¸·à¸­à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸š ${money(s.outstanding)}`,'error');return}state.invoiceClosed=true;const record={reference:s.reference,customer:s.customer,villa:s.villa,total:s.subtotal,discount:s.discount,deposit:s.deposit,pendingTotal:s.pendingTotal,pendingCollections:pendingCollections.filter(row=>row.amount>0),preparer,closedAt:new Date().toLocaleString('th-TH'),proof,lines:state.invoiceLines.map(l=>({...l})),payments:state.payments.map(p=>({...p}))};state.closedBookings.unshift(record);saveClosedBookings();state.invoices.unshift({id:s.reference,customer:s.customer,time:'à¹€à¸¡à¸·à¹ˆà¸­à¸ªà¸±à¸à¸„à¸£à¸¹à¹ˆ',total:s.subtotal,status:'à¸Šà¸³à¸£à¸°à¹à¸¥à¹‰à¸§',statusClass:'status-paid'});renderDashboard();renderBookingRecords();$('#modal-root').innerHTML='';calculateInvoice();setInvoicePage('preview');showToast('à¸›à¸´à¸”à¸¢à¸­à¸”à¹à¸¥à¸°à¹€à¸à¹‡à¸šà¸«à¸¥à¸±à¸à¸à¸²à¸™à¸à¸²à¸£à¸ˆà¸­à¸‡à¹à¸¥à¹‰à¸§')}
function loadInvoiceDrafts(){try{return JSON.parse(localStorage.getItem('scenery-invoice-drafts')||'[]')}catch{return[]}}
function saveInvoiceDraft(){const drafts=loadInvoiceDrafts(),fields={};['folio','customer','check-in','check-out','no-of-night','remark','doc-date','discount-scope','discount-all-rate','villa','cashier'].forEach(id=>{if($(`#${id}`))fields[id]=$(`#${id}`).value});drafts.unshift({id:`DF-${Date.now()}`,reference:fields.folio||'-',customer:fields.customer||'-',savedAt:new Date().toLocaleString('th-TH'),fields,lines:state.invoiceLines.map(l=>({...l})),payments:state.payments.map(p=>({...p}))});try{localStorage.setItem('scenery-invoice-drafts',JSON.stringify(drafts.slice(0,50)));showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸šà¸šà¸£à¹ˆà¸²à¸‡à¹à¸¥à¹‰à¸§')}catch{showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¹à¸šà¸šà¸£à¹ˆà¸²à¸‡à¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ','error')}}
function loadInvoiceDraft(index){const draft=loadInvoiceDrafts()[Number(index)];if(!draft)return;Object.entries(draft.fields||{}).forEach(([id,value])=>{if($(`#${id}`))$(`#${id}`).value=value});state.invoiceLines=(draft.lines||[]).map(l=>({...l,depositMethod:l.depositMethod||'à¹€à¸‡à¸´à¸™à¸ªà¸”'}));state.payments=(draft.payments||[]).map(p=>({...p}));state.invoiceClosed=false;state.closedInvoiceSnapshot=null;state.pendingCollectionTotal=0;state.pendingCollectionNote='';$$('.invoice-search-input').forEach(input=>{const select=$(`#${input.dataset.source}`),option=[...select.options].find(o=>o.value===String(state.invoiceLines.find(l=>l.type===(input.dataset.source==='accommodation-select'?'accommodation':'addon'))?.sourceIndex||''));if(option)input.value=option.textContent});$('#modal-root').innerHTML='';renderFormLines();renderPayments();setInvoicePage('form');showToast('à¹€à¸›à¸´à¸”à¹à¸šà¸šà¸£à¹ˆà¸²à¸‡à¹à¸¥à¹‰à¸§')}
function openDraftPicker(){const drafts=loadInvoiceDrafts(),body=drafts.length?`<div class="draft-picker-list">${drafts.map((draft,index)=>`<div class="draft-picker-row"><div><strong>${esc(draft.reference)}</strong><small>${esc(draft.customer)} Â· ${esc(draft.savedAt)}</small></div><button class="button button-outline action-small" type="button" data-draft-load="${index}">à¹€à¸›à¸´à¸”</button><button class="icon-button" type="button" data-draft-delete="${index}" aria-label="à¸¥à¸šà¹à¸šà¸šà¸£à¹ˆà¸²à¸‡"><span class="material-symbols-outlined">delete</span></button></div>`).join('')}</div>`:'<div class="empty-state"><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¹à¸šà¸šà¸£à¹ˆà¸²à¸‡</p><small>à¸šà¸±à¸™à¸—à¸¶à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹„à¸§à¹‰à¹€à¸žà¸·à¹ˆà¸­à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£à¸ à¸²à¸¢à¸«à¸¥à¸±à¸‡</small></div>';openModal('à¹à¸šà¸šà¸£à¹ˆà¸²à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰',body,'<button class="button button-outline" data-close-modal>à¸›à¸´à¸”</button>')}
function installInvoiceTools(){const actions=$('#view-invoice .heading-actions');if(!actions||$('#save-invoice-draft'))return;const save=document.createElement('button');save.id='save-invoice-draft';save.type='button';save.className='button button-soft';save.innerHTML='<span class="material-symbols-outlined">save</span>à¸šà¸±à¸™à¸—à¸¶à¸à¹à¸šà¸šà¸£à¹ˆà¸²à¸‡';const open=document.createElement('button');open.id='open-invoice-drafts';open.type='button';open.className='button button-outline';open.innerHTML='<span class="material-symbols-outlined">folder_open</span>à¹à¸šà¸šà¸£à¹ˆà¸²à¸‡';actions.insertBefore(save,actions.firstChild);actions.insertBefore(open,actions.children[1]||null);save.addEventListener('click',saveInvoiceDraft);open.addEventListener('click',openDraftPicker)}
buildInvoiceWorkspace();installDepositHeaders();installSearchableItemFields();installPreviewPaymentMeta();installInvoiceTools();state.invoiceClosed=false;document.addEventListener('input',event=>{if(event.target.matches('.line-deposit')){const line=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(line){line.deposit=Math.max(0,Number(event.target.value||0));calculateInvoice()}}if(event.target.matches('[data-settlement-index][data-settlement-field="amount"]')){settlementRows[Number(event.target.dataset.settlementIndex)].amount=Number(event.target.value||0);updateSettlementTotal()}});document.addEventListener('change',event=>{if(event.target.matches('.line-deposit-method')){const line=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(line)line.depositMethod=event.target.value;renderInvoicePreview()}if(event.target.matches('[data-settlement-index][data-settlement-field="method"]')){settlementRows[Number(event.target.dataset.settlementIndex)].method=event.target.value;updateSettlementTotal()}});document.addEventListener('click',event=>{const remove=event.target.closest('.remove-form-line');if(!remove)return;event.preventDefault();event.stopPropagation();const index=Number(remove.dataset.lineIndex);if(!Number.isInteger(index)||!state.invoiceLines[index])return;state.invoiceLines.splice(index,1);renderFormLines();showToast('à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸­à¸­à¸à¸ˆà¸²à¸à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸¥à¹‰à¸§')},true);document.addEventListener('click',event=>{const addSettlement=event.target.closest('[data-settlement-add]');if(addSettlement){event.preventDefault();settlementRows.push({method:'à¹€à¸‡à¸´à¸™à¸ªà¸”',amount:0});renderSettlementRows();updateSettlementTotal();return}const removeSettlement=event.target.closest('[data-settlement-remove]');if(removeSettlement){event.preventDefault();settlementRows.splice(Number(removeSettlement.dataset.settlementRemove),1);if(!settlementRows.length)settlementRows.push({method:'à¹€à¸‡à¸´à¸™à¸ªà¸”',amount:0});renderSettlementRows();updateSettlementTotal();return}if(event.target.closest('[data-settlement-confirm]')){event.preventDefault();finalizeInvoice();return}const loadDraft=event.target.closest('[data-draft-load]');if(loadDraft){event.preventDefault();loadInvoiceDraft(loadDraft.dataset.draftLoad);return}const deleteDraft=event.target.closest('[data-draft-delete]');if(deleteDraft){event.preventDefault();const drafts=loadInvoiceDrafts();drafts.splice(Number(deleteDraft.dataset.draftDelete),1);localStorage.setItem('scenery-invoice-drafts',JSON.stringify(drafts));openDraftPicker()}});document.addEventListener('DOMContentLoaded',()=>{renderDashboard();renderHistory();renderBookingRecords();renderFormLines();renderPayments();wireEvents()});

function roundMetricValue(index){const value=$$('#view-close-round .round-metrics article')[index]?.querySelector('strong')?.textContent||'0';return Number(value.replace(/[^0-9.-]/g,''))||0}
function loadClosedRounds(){try{return JSON.parse(localStorage.getItem('scenery-closed-rounds')||'[]')}catch{return[]}}
function submitCloseRound(){const date=$('#view-close-round input[type="date"]')?.value||new Date().toISOString().slice(0,10),rounds=loadClosedRounds();if(closeRoundIsLocked(date)){showToast('à¸£à¸­à¸šà¸§à¸±à¸™à¸™à¸µà¹‰à¸–à¸¹à¸ Submit à¹à¸¥à¸° Lock à¹à¸¥à¹‰à¸§','error');return}const record={id:`CR-${date.replaceAll('-','')}-${Date.now()}`,businessDate:date,status:'Submitted',submittedAt:new Date().toISOString(),totals:{sales:roundMetricValue(0),deposit:roundMetricValue(1),outstanding:roundMetricValue(2),difference:roundMetricValue(3)}};try{localStorage.setItem('scenery-closed-rounds',JSON.stringify([record,...rounds].slice(0,90)))}catch{showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¸ªà¸–à¸²à¸™à¸°à¸›à¸´à¸”à¸£à¸­à¸šà¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ','error');return}recordAudit('Submit à¹à¸¥à¸° Lock','Close Round',record.id,null,record,{reason:`à¸›à¸´à¸”à¸£à¸­à¸š Business Date ${date}`});$('#modal-root').innerHTML='';const button=$('#submit-round');if(button){button.disabled=true;button.innerHTML='<span class="material-symbols-outlined">lock</span>à¸£à¸­à¸šà¸–à¸¹à¸à¸¥à¹‡à¸­à¸à¹à¸¥à¹‰à¸§'}renderCloseRound();showToast(`Submit à¹à¸¥à¸° Lock à¸£à¸­à¸š ${date} à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`)}
document.addEventListener('DOMContentLoaded',()=>{const button=$('#submit-round');if(!button)return;const date=$('#view-close-round input[type="date"]')?.value||new Date().toISOString().slice(0,10);if(loadClosedRounds().some(round=>round.businessDate===date&&round.status==='Submitted')){button.disabled=true;button.innerHTML='<span class="material-symbols-outlined">lock</span>à¸£à¸­à¸šà¸–à¸¹à¸à¸¥à¹‡à¸­à¸à¹à¸¥à¹‰à¸§'}button.addEventListener('click',()=>openModal('à¸¢à¸·à¸™à¸¢à¸±à¸™ Submit à¹à¸¥à¸° Lock à¸£à¸­à¸š','<p>à¹€à¸¡à¸·à¹ˆà¸­à¸¢à¸·à¸™à¸¢à¸±à¸™à¹à¸¥à¹‰à¸§ à¸£à¸­à¸šà¸™à¸µà¹‰à¸ˆà¸°à¸–à¸¹à¸à¸¥à¹‡à¸­à¸à¹à¸¥à¸°à¹„à¸¡à¹ˆà¸„à¸§à¸£à¹à¸à¹‰à¹„à¸‚à¸£à¸²à¸¢à¸à¸²à¸£à¸¢à¹‰à¸­à¸™à¸«à¸¥à¸±à¸‡à¹‚à¸”à¸¢à¸•à¸£à¸‡</p><p class="muted">à¸à¸£à¸¸à¸“à¸²à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¸¢à¸­à¸”à¸„à¹‰à¸²à¸‡à¸Šà¸³à¸£à¸°à¹à¸¥à¸°à¸£à¸²à¸¢à¸à¸²à¸£à¸œà¸´à¸”à¸›à¸à¸•à¸´à¸à¹ˆà¸­à¸™à¸ªà¹ˆà¸‡à¸à¹ˆà¸²à¸¢à¸šà¸±à¸à¸Šà¸µ</p>','<button class="button button-outline" data-close-modal>à¸¢à¸à¹€à¸¥à¸´à¸</button><button class="button button-primary" data-submit-round>à¸¢à¸·à¸™à¸¢à¸±à¸™ Submit à¹à¸¥à¸° Lock</button>'));document.addEventListener('click',event=>{if(event.target.closest('[data-submit-round]')){event.preventDefault();submitCloseRound()}})});

function enhanceInvoiceWorkspace(){
  const discountRate=$('#discount-all-rate');
  if(discountRate){const input=document.createElement('input');input.id='discount-all-rate';input.type='number';input.min='0';input.step='0.01';input.value=discountRate.value||'0';input.placeholder='à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¹‡à¸™à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™';input.setAttribute('aria-label','à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥à¹€à¸›à¹‡à¸™à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™');discountRate.replaceWith(input);const label=input.closest('label');if(label)label.firstChild.textContent='à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥ (Baht) ';input.addEventListener('input',calculateInvoice)}
  $$('#view-invoice .invoice-line-group th').forEach(th=>{if(th.textContent.trim()==='à¸ªà¹ˆà¸§à¸™à¸¥à¸”')th.textContent='à¸ªà¹ˆà¸§à¸™à¸¥à¸” (Baht)'})
  $$('#villa option').forEach(option=>{option.textContent=cleanEnglishText(option.textContent)})
  const nightsInput=$('#no-of-night');if(nightsInput?.parentElement)nightsInput.parentElement.firstChild.textContent='No. of Nights ';
  const guestMeta=$('#invoice-preview-sheet .guest-meta span');if(guestMeta)guestMeta.textContent='Guest Name / No. of Guests';
  $$('.invoice-search-input').forEach(input=>{input.placeholder='à¸„à¹‰à¸™à¸«à¸²à¸«à¸£à¸·à¸­à¸žà¸´à¸¡à¸žà¹Œà¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸«à¸¡à¹ˆ';input.setAttribute('aria-label','à¸„à¹‰à¸™à¸«à¸²à¸«à¸£à¸·à¸­à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸«à¸¡à¹ˆ')})
  const adjustments=$('#view-invoice .invoice-adjustments');
  if(adjustments&&!$('#pending-form-section'))adjustments.insertAdjacentHTML('beforeend','<section id="pending-form-section" class="pending-form-section"><div class="line-group-heading"><strong>à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹ƒà¸™à¸à¸²à¸£à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š</strong><small>à¸£à¸°à¸šà¸¸à¸¢à¸­à¸”à¹à¸¥à¸°à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸•à¸´à¸”à¸•à¸²à¸¡ à¸¢à¸­à¸”à¸™à¸µà¹‰à¸ˆà¸°à¹à¸ªà¸”à¸‡à¹ƒà¸™à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸¥à¸°à¸—à¹‰à¸²à¸¢à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</small></div><div id="pending-form-rows"></div></section>');
  const footer=$('#invoice-preview-sheet .preview-footer');
  if(footer&&!$('#preview-pending-notes'))footer.insertAdjacentHTML('afterbegin','<section id="preview-pending-notes" class="preview-pending-notes" aria-label="à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹ƒà¸™à¸à¸²à¸£à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š"></section>');
  $$('#invoice-preview-sheet .preview-meta span').forEach(span=>{if(span.textContent.trim()==='No. Of Night')span.textContent='No. of Nights'});

  invoiceSnapshot=function(){const subtotal=state.invoiceLines.reduce((sum,line)=>sum+lineAmount(line),0),scope=formValue('discount-scope','line'),lineDiscount=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.discountAmount||0)),0),allDiscount=Math.max(0,Number(formValue('discount-all-rate',0))||0),discount=scope==='none'?0:scope==='all'?Math.min(subtotal,allDiscount):Math.min(subtotal,lineDiscount),lineDeposits=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.deposit||0)),0),paymentDeposits=state.payments.reduce((sum,payment)=>sum+Math.max(0,Number(payment.amount||0)),0),pendingTotal=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.pendingCollection||0)),0),deposit=lineDeposits+paymentDeposits,netTotal=Math.max(0,subtotal-discount);return{reference:formValue('folio','INV-260717-085'),customer:formValue('customer','-'),checkIn:formValue('check-in'),checkOut:formValue('check-out'),nights:formValue('no-of-night','1'),remark:formValue('remark','-'),docDate:formValue('doc-date'),villa:formValue('villa',''),subtotal,discount,lineDeposits,paymentDeposits,pendingTotal,deposit,netTotal,outstanding:netTotal-deposit-pendingTotal,discountScope:scope,allAmount:allDiscount}}
  allocateLineAmounts=function(snapshot){let paid=snapshot.paymentDeposits;const rows=state.invoiceLines.map(line=>{const amount=lineAmount(line),discount=snapshot.discountScope==='line'?Math.min(amount,Math.max(0,Number(line.discountAmount||0))):snapshot.discountScope==='all'&&snapshot.subtotal?amount*(snapshot.discount/snapshot.subtotal):0,afterDiscount=Math.max(0,amount-discount),lineDeposit=Math.max(0,Number(line.deposit||0)),payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid),pending=Math.max(0,Number(line.pendingCollection||0)),unpaid=Math.max(0,afterDiscount-lineDeposit-payment);paid-=payment;return{line,amount,discount,lineDeposit,payment,pending,deposit:lineDeposit+payment,unpaid,outstanding:unpaid-pending}});if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.unpaid-=paid;last.outstanding-=paid}return rows}
  lineRow=function(line,index){const gross=lineAmount(line),discount=Math.min(gross,Math.max(0,Number(line.discountAmount||0))),net=Math.max(0,gross-discount);return`<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">âˆ’</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡ Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><input class="line-discount" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.discountAmount||0)}" placeholder="à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¹‡à¸™à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™ ${esc(line.name)}"></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">à¸à¹ˆà¸­à¸™à¸«à¸±à¸ ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"><span class="material-symbols-outlined">close</span></button></td></tr>`}
  const originalRenderFormLines=renderFormLines;renderFormLines=function(){originalRenderFormLines();renderPendingFormRows()}
  renderPendingFormRows=function(){const box=$('#pending-form-rows');if(!box)return;box.innerHTML=state.invoiceLines.map((line,index)=>`<div class="pending-form-row"><strong>${esc(line.name)}</strong><input class="form-pending-amount" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.pendingCollection||0)}" placeholder="à¸¢à¸­à¸”à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š"><input class="form-pending-note" data-line-index="${index}" value="${esc(line.pendingNote||'')}" placeholder="à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸ / à¹à¸œà¸™à¸ / à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸£à¸­à¹€à¸à¹‡à¸š"></div>`).join('')||'<p class="muted">à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£à¸à¹ˆà¸­à¸™à¸£à¸°à¸šà¸¸à¸¢à¸­à¸”à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š</p>'}
  addLine=function(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),search=$(`#${type==='accommodation'?'accommodation':'addon'}-search`),rateEl=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),qtyEl=type==='accommodation'?$('#accommodation-qty'):$('#addon-qty'),items=type==='accommodation'?accommodationItems:addonItems,selected=items[Number(select?.value)],typed=cleanEnglishText(search?.value?.trim()||''),item=selected||(!typed?null:{name:typed,category:type==='accommodation'?'Accommodation':'Miscellaneous',rate:Math.max(0,Number(rateEl?.value||0)),custom:true});if(!item){showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¸«à¸£à¸·à¸­à¸žà¸´à¸¡à¸žà¹Œà¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸«à¸¡à¹ˆà¸à¹ˆà¸­à¸™à¹€à¸žà¸´à¹ˆà¸¡','error');return}state.invoiceLines.push({type,name:item.name,category:item.category,sourceIndex:selected?Number(select.value):null,rate:Math.max(0,Number(rateEl?.value||item.rate||0)),deposit:0,depositMethod:'à¹€à¸‡à¸´à¸™à¸ªà¸”',qty:Math.max(1,Number(qtyEl?.value||1)),discountAmount:0,pendingCollection:0,pendingNote:''});if(select)select.value='';if(rateEl)rateEl.value='';if(qtyEl)qtyEl.value='1';if(search)search.value='';renderFormLines();showToast(`à¹€à¸žà¸´à¹ˆà¸¡ ${item.name} à¸¥à¸‡à¹ƒà¸™à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸¥à¹‰à¸§`)}
  fillRate=function(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),input=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),items=type==='accommodation'?accommodationItems:addonItems,item=items[Number(select?.value)];if(input&&item)input.value=item.rate||0}
  previewItemRows=function(snapshot){const groups=[{label:'Accommodation & Inclusive Package',type:'accommodation'},{label:'Food and Beverages (add-on) and Other Expenses',type:'addon'}],breakdowns=allocateLineAmounts(snapshot);return groups.map(group=>{const matches=breakdowns.filter(row=>row.line.type===group.type),lines=matches.map(row=>{const discountLabel=row.discount?money(row.discount):'-',totalLabel=row.unpaid<0?`<span class="invoice-overpaid">${money(row.unpaid)}</span>`:money(row.unpaid);return`<tr><td>${esc(row.line.category)}</td><td class="align-center">${row.line.qty}</td><td>${esc(row.line.name)}</td><td class="align-right">${money(row.amount)}</td><td class="align-right">${row.deposit?money(row.deposit):'-'}</td><td class="align-right invoice-discount-cell">${discountLabel}</td><td class="align-right">${totalLabel}</td></tr>`}).join(''),count=Math.max(matches.length,group.type==='accommodation'?7:14),blanks=Array.from({length:count-matches.length},()=>'<tr class="blank-line"><td></td><td></td><td></td><td></td><td>-</td><td>-</td><td>-</td></tr>').join('');return`<tr class="bill-section-row"><td colspan="7">${group.label}</td></tr>${lines}${blanks}`}).join('')}
  renderInvoicePreview=function(){if(!$('#invoice-preview-sheet'))return;const s=invoiceSnapshot(),set=(id,value)=>{if($(`#${id}`))$(`#${id}`).textContent=value},methods=[...new Set([...state.invoiceLines.filter(line=>Number(line.deposit||0)>0).map(line=>line.depositMethod||'à¹€à¸‡à¸´à¸™à¸ªà¸”'),...state.payments.filter(payment=>Number(payment.amount||0)>0).map(payment=>payment.method)])].join(', ')||'-';set('preview-reference',s.reference);set('preview-reference-meta',s.reference);set('preview-customer',s.customer);set('preview-check-in',formatDate(s.checkIn));set('preview-check-out',formatDate(s.checkOut));set('preview-nights',s.nights);set('preview-remark',s.remark||'-');set('preview-invoice-date',formatDate(s.docDate));set('preview-payment-method',methods);set('preview-total',money(s.subtotal));set('preview-deposit',money(s.deposit));set('preview-discount',money(s.discount));set('preview-outstanding',state.invoiceClosed&&s.outstanding===0?'':money(s.outstanding));const noteBox=$('#preview-pending-notes');if(noteBox){const noteLines=state.invoiceLines.filter(line=>String(line.pendingNote||'').trim()),notes=noteLines.map(line=>`<div><strong>${esc(line.name)}</strong><span>${esc(line.pendingNote)}</span></div>`).join('');noteBox.innerHTML=notes;noteBox.classList.toggle('long-note',noteLines.some(line=>String(line.pendingNote||'').length>90));const previewFooter=noteBox.closest('.preview-footer');if(previewFooter)previewFooter.classList.toggle('has-pending-notes',Boolean(notes))}if($('#preview-invoice-lines'))$('#preview-invoice-lines').innerHTML=previewItemRows(s)}
  renderPendingFormRows();renderFormLines();renderInvoicePreview()
}
document.addEventListener('DOMContentLoaded',()=>{enhanceInvoiceWorkspace();document.addEventListener('input',event=>{if(event.target.matches('.line-discount')){const line=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(line){line.discountAmount=Math.max(0,Number(event.target.value||0));calculateInvoice()}}if(event.target.matches('.form-pending-amount,.form-pending-note')){const line=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(line){if(event.target.matches('.form-pending-amount'))line.pendingCollection=Math.max(0,Number(event.target.value||0));else line.pendingNote=event.target.value;calculateInvoice()}}})});

function switchLineDiscountToPercent(){
  $$('#view-invoice .invoice-line-group th').forEach(th=>{if(th.textContent.trim()==='à¸ªà¹ˆà¸§à¸™à¸¥à¸” (Baht)'||th.textContent.trim()==='à¸ªà¹ˆà¸§à¸™à¸¥à¸”')th.textContent='à¸ªà¹ˆà¸§à¸™à¸¥à¸” (%)'})
  invoiceSnapshot=function(){const subtotal=state.invoiceLines.reduce((sum,line)=>sum+lineAmount(line),0),scope=formValue('discount-scope','line'),lineDiscount=state.invoiceLines.reduce((sum,line)=>sum+lineAmount(line)*(Math.min(100,Math.max(0,Number(line.discountRate||0)))/100),0),allDiscount=Math.max(0,Number(formValue('discount-all-rate',0))||0),discount=scope==='none'?0:scope==='all'?Math.min(subtotal,allDiscount):Math.min(subtotal,lineDiscount),lineDeposits=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.deposit||0)),0),paymentDeposits=state.payments.reduce((sum,payment)=>sum+Math.max(0,Number(payment.amount||0)),0),pendingTotal=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.pendingCollection||0)),0),deposit=lineDeposits+paymentDeposits,netTotal=Math.max(0,subtotal-discount);return{reference:formValue('folio','INV-260717-085'),customer:formValue('customer','-'),checkIn:formValue('check-in'),checkOut:formValue('check-out'),nights:formValue('no-of-night','1'),remark:formValue('remark','-'),docDate:formValue('doc-date'),villa:formValue('villa',''),subtotal,discount,lineDeposits,paymentDeposits,pendingTotal,deposit,netTotal,outstanding:netTotal-deposit-pendingTotal,discountScope:scope,allAmount:allDiscount}}
  allocateLineAmounts=function(snapshot){let paid=snapshot.paymentDeposits;const rows=state.invoiceLines.map(line=>{const amount=lineAmount(line),rate=Math.min(100,Math.max(0,Number(line.discountRate||0))),discount=snapshot.discountScope==='line'?amount*rate/100:snapshot.discountScope==='all'&&snapshot.subtotal?amount*(snapshot.discount/snapshot.subtotal):0,afterDiscount=Math.max(0,amount-discount),lineDeposit=Math.max(0,Number(line.deposit||0)),payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid),pending=Math.max(0,Number(line.pendingCollection||0)),unpaid=Math.max(0,afterDiscount-lineDeposit-payment);paid-=payment;return{line,amount,discount,lineDeposit,payment,pending,deposit:lineDeposit+payment,unpaid,outstanding:unpaid-pending}});if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.unpaid-=paid;last.outstanding-=paid}return rows}
  lineRow=function(line,index){const gross=lineAmount(line),rate=Math.min(100,Math.max(0,Number(line.discountRate||0))),snapshot=invoiceSnapshot(),discount=snapshot.discountScope==='line'?gross*rate/100:snapshot.discountScope==='all'&&snapshot.subtotal?gross*(snapshot.discount/snapshot.subtotal):0,net=Math.max(0,gross-discount);return`<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">âˆ’</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡ Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><div class="discount-input-wrap"><input class="line-discount" data-line-index="${index}" type="number" min="0" max="100" step="0.01" value="${rate}" placeholder="%" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¸­à¸£à¹Œà¹€à¸‹à¹‡à¸™à¸•à¹Œ ${esc(line.name)}"><span>%</span></div></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">à¸à¹ˆà¸­à¸™à¸«à¸±à¸ ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"><span class="material-symbols-outlined">close</span></button></td></tr>`}
  addLine=function(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),search=$(`#${type==='accommodation'?'accommodation':'addon'}-search`),rateEl=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),qtyEl=type==='accommodation'?$('#accommodation-qty'):$('#addon-qty'),items=type==='accommodation'?accommodationItems:addonItems,selected=items[Number(select?.value)],typed=cleanEnglishText(search?.value?.trim()||''),item=selected||(!typed?null:{name:typed,category:type==='accommodation'?'Accommodation':'Miscellaneous',rate:Math.max(0,Number(rateEl?.value||0)),custom:true});if(!item){showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¸«à¸£à¸·à¸­à¸žà¸´à¸¡à¸žà¹Œà¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸«à¸¡à¹ˆà¸à¹ˆà¸­à¸™à¹€à¸žà¸´à¹ˆà¸¡','error');return}state.invoiceLines.push({type,name:item.name,category:item.category,sourceIndex:selected?Number(select.value):null,rate:Math.max(0,Number(rateEl?.value||item.rate||0)),deposit:0,depositMethod:'à¹€à¸‡à¸´à¸™à¸ªà¸”',qty:Math.max(1,Number(qtyEl?.value||1)),discountRate:0,pendingCollection:0,pendingNote:''});if(select)select.value='';if(rateEl)rateEl.value='';if(qtyEl)qtyEl.value='1';if(search)search.value='';renderFormLines();showToast(`à¹€à¸žà¸´à¹ˆà¸¡ ${item.name} à¸¥à¸‡à¹ƒà¸™à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸¥à¹‰à¸§`)}
  document.addEventListener('input',event=>{if(event.target.matches('.line-discount')){const line=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(line){line.discountRate=Math.min(100,Math.max(0,Number(event.target.value||0)));calculateInvoice()}}})
  renderInvoicePreview();renderFormLines()
}
document.addEventListener('DOMContentLoaded',()=>switchLineDiscountToPercent());

function enableDualLineDiscount(){
  const clampRate=value=>Math.min(100,Math.max(0,Number(value||0))),fixedDiscount=line=>Math.max(0,Number(line.discountAmount||0)),lineDiscount=(line,amount,snapshot)=>snapshot.discountScope==='line'?Math.min(amount,amount*clampRate(line.discountRate)/100+fixedDiscount(line)):snapshot.discountScope==='all'&&snapshot.subtotal?amount*(snapshot.discount/snapshot.subtotal):0;
  $$('#view-invoice .invoice-line-group th').forEach(th=>{if(th.textContent.includes('à¸ªà¹ˆà¸§à¸™à¸¥à¸”'))th.textContent='à¸ªà¹ˆà¸§à¸™à¸¥à¸” (% / Baht)'})
  invoiceSnapshot=function(){const subtotal=state.invoiceLines.reduce((sum,line)=>sum+lineAmount(line),0),scope=formValue('discount-scope','line'),lineDiscountTotal=state.invoiceLines.reduce((sum,line)=>sum+lineDiscount(line,lineAmount(line),{discountScope:'line'}),0),allDiscount=Math.max(0,Number(formValue('discount-all-rate',0))||0),discount=scope==='none'?0:scope==='all'?Math.min(subtotal,allDiscount):Math.min(subtotal,lineDiscountTotal),lineDeposits=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.deposit||0)),0),paymentDeposits=state.payments.reduce((sum,payment)=>sum+Math.max(0,Number(payment.amount||0)),0),pendingTotal=state.invoiceLines.reduce((sum,line)=>sum+Math.max(0,Number(line.pendingCollection||0)),0),deposit=lineDeposits+paymentDeposits,netTotal=Math.max(0,subtotal-discount);return{reference:formValue('folio','INV-260717-085'),customer:formValue('customer','-'),checkIn:formValue('check-in'),checkOut:formValue('check-out'),nights:formValue('no-of-night','1'),remark:formValue('remark','-'),docDate:formValue('doc-date'),villa:formValue('villa',''),subtotal,discount,lineDeposits,paymentDeposits,pendingTotal,deposit,netTotal,outstanding:netTotal-deposit-pendingTotal,discountScope:scope,allAmount:allDiscount}}
  const dualDiscountSnapshot=invoiceSnapshot;
  invoiceSnapshot=function(){const snapshot=dualDiscountSnapshot();if(snapshot.discountScope!=='all')return snapshot;const rate=Math.min(100,Math.max(0,Number(snapshot.allAmount||0))),discount=Math.min(snapshot.subtotal,snapshot.subtotal*rate/100),netTotal=Math.max(0,snapshot.subtotal-discount);return {...snapshot,discount,netTotal,outstanding:netTotal-snapshot.deposit-snapshot.pendingTotal}}
  allocateLineAmounts=function(snapshot){let paid=snapshot.paymentDeposits;const rows=state.invoiceLines.map(line=>{const amount=lineAmount(line),discount=lineDiscount(line,amount,snapshot),afterDiscount=Math.max(0,amount-discount),lineDeposit=Math.max(0,Number(line.deposit||0)),payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid),pending=Math.max(0,Number(line.pendingCollection||0)),unpaid=Math.max(0,afterDiscount-lineDeposit-payment);paid-=payment;return{line,amount,discount,lineDeposit,payment,pending,deposit:lineDeposit+payment,unpaid,outstanding:unpaid-pending}});if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.unpaid-=paid;last.outstanding-=paid}return rows}
  lineRow=function(line,index){const gross=lineAmount(line),rate=clampRate(line.discountRate),fixed=fixedDiscount(line),snapshot=invoiceSnapshot(),discount=lineDiscount(line,gross,snapshot),net=Math.max(0,gross-discount);return`<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">âˆ’</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡ Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><div class="line-discount-fields"><label class="line-discount-field"><input class="line-discount-rate" data-line-index="${index}" type="number" min="0" max="100" step="0.01" value="${rate}" placeholder="0" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¸­à¸£à¹Œà¹€à¸‹à¹‡à¸™à¸•à¹Œ ${esc(line.name)}"><span>%</span></label><label class="line-discount-field"><input class="line-discount-amount" data-line-index="${index}" type="number" min="0" step="0.01" value="${fixed}" placeholder="0" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¹‡à¸™à¹€à¸‡à¸´à¸™ ${esc(line.name)}"><span>Baht</span></label></div></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">à¸à¹ˆà¸­à¸™à¸«à¸±à¸ ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"><span class="material-symbols-outlined">close</span></button></td></tr>`}
  previewItemRows=function(snapshot){const groups=[{label:'Accommodation & Inclusive Package',type:'accommodation'},{label:'Food and Beverages (add-on) and Other Expenses',type:'addon'}],breakdowns=allocateLineAmounts(snapshot);return groups.map(group=>{const matches=breakdowns.filter(row=>row.line.type===group.type),lines=matches.map(row=>{const rate=clampRate(row.line.discountRate),fixed=fixedDiscount(row.line),discountParts=[];if(rate)discountParts.push(`${rate}%`);if(fixed)discountParts.push(money(fixed));const discountLabel=discountParts.length?`${discountParts.join(' + ')}<small class="invoice-discount-amount">${money(row.discount)}</small>`:'-',totalLabel=row.pending?`<span class="invoice-pending">à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š ${money(row.unpaid)}</span>`:row.unpaid<0?`<span class="invoice-overpaid">${money(row.unpaid)}</span>`:money(row.unpaid);return`<tr><td>${esc(row.line.category)}</td><td class="align-center">${row.line.qty}</td><td>${esc(row.line.name)}</td><td class="align-right">${money(row.amount)}</td><td class="align-right">${row.deposit?money(row.deposit):'-'}</td><td class="align-right invoice-discount-cell">${discountLabel}</td><td class="align-right">${totalLabel}</td></tr>`}).join(''),count=Math.max(matches.length,group.type==='accommodation'?7:14),blanks=Array.from({length:count-matches.length},()=>'<tr class="blank-line"><td></td><td></td><td></td><td></td><td>-</td><td>-</td><td>-</td></tr>').join('');return`<tr class="bill-section-row"><td colspan="7">${group.label}</td></tr>${lines}${blanks}`}).join('')}
  document.addEventListener('input',event=>{if(event.target.matches('.line-discount-rate,.line-discount-amount')){const line=state.invoiceLines[Number(event.target.dataset.lineIndex)];if(line){if(event.target.matches('.line-discount-rate'))line.discountRate=clampRate(event.target.value);else line.discountAmount=Math.max(0,Number(event.target.value||0));calculateInvoice()}}})
  renderFormLines();renderInvoicePreview()
}
document.addEventListener('DOMContentLoaded',()=>enableDualLineDiscount());

function enablePendingOutstandingDisplay(){
  const baseSnapshot=invoiceSnapshot;
  invoiceSnapshot=function(){const snapshot=baseSnapshot();return{...snapshot,outstandingDisplay:snapshot.netTotal-snapshot.deposit}}
  const baseRender=renderInvoicePreview;
  renderInvoicePreview=function(){baseRender();const snapshot=invoiceSnapshot(),value=snapshot.outstandingDisplay;if($('#preview-outstanding'))$('#preview-outstanding').textContent=state.invoiceClosed&&value===0?'':money(value)}
  const baseCalculate=calculateInvoice;
  calculateInvoice=function(){baseCalculate();const snapshot=invoiceSnapshot(),value=snapshot.outstandingDisplay;if($('#summary-outstanding'))$('#summary-outstanding').textContent=state.invoiceClosed&&value===0?'':money(value)}
  renderInvoicePreview();calculateInvoice()
}
document.addEventListener('DOMContentLoaded',()=>enablePendingOutstandingDisplay());

function enableNegativeLineTotals(){
  const discountFor=(line,amount,snapshot)=>{const rate=Math.min(100,Math.max(0,Number(line.discountRate||0))),fixed=Math.max(0,Number(line.discountAmount||0));return snapshot.discountScope==='line'?Math.min(amount,amount*rate/100+fixed):snapshot.discountScope==='all'&&snapshot.subtotal?amount*(snapshot.discount/snapshot.subtotal):0}
  allocateLineAmounts=function(snapshot){let paid=snapshot.paymentDeposits;const rows=state.invoiceLines.map(line=>{const amount=lineAmount(line),discount=discountFor(line,amount,snapshot),afterDiscount=amount-discount,lineDeposit=Math.max(0,Number(line.deposit||0)),payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid),pending=Math.max(0,Number(line.pendingCollection||0)),unpaid=afterDiscount-lineDeposit-payment;paid-=payment;return{line,amount,discount,lineDeposit,payment,pending,deposit:lineDeposit+payment,unpaid,outstanding:unpaid-pending}});if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.unpaid-=paid;last.outstanding-=paid}return rows}
  lineRow=function(line,index){const gross=lineAmount(line),snapshot=invoiceSnapshot(),discount=discountFor(line,gross,snapshot),net=gross-discount-Number(line.deposit||0);return`<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">âˆ’</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡ Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><div class="line-discount-fields"><label class="line-discount-field"><input class="line-discount-rate" data-line-index="${index}" type="number" min="0" max="100" step="0.01" value="${Math.min(100,Math.max(0,Number(line.discountRate||0)))}" placeholder="0" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¸­à¸£à¹Œà¹€à¸‹à¹‡à¸™à¸•à¹Œ ${esc(line.name)}"><span>%</span></label><label class="line-discount-field"><input class="line-discount-amount" data-line-index="${index}" type="number" min="0" step="0.01" value="${Math.max(0,Number(line.discountAmount||0))}" placeholder="0" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¹‡à¸™à¹€à¸‡à¸´à¸™ ${esc(line.name)}"><span>Baht</span></label></div></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">à¸à¹ˆà¸­à¸™à¸«à¸±à¸ ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"><span class="material-symbols-outlined">close</span></button></td></tr>`}
  renderFormLines();renderInvoicePreview();calculateInvoice()
}
document.addEventListener('DOMContentLoaded',()=>enableNegativeLineTotals());

function refreshInvoiceSummaryPanel(){const snapshot=invoiceSnapshot(),displayOutstanding=snapshot.outstandingDisplay??snapshot.outstanding;[['summary-total',snapshot.subtotal],['summary-deposit',snapshot.deposit],['summary-discount',snapshot.discount],['summary-outstanding',displayOutstanding],['preview-total',snapshot.subtotal],['preview-deposit',snapshot.deposit],['preview-discount',snapshot.discount],['preview-outstanding',displayOutstanding]].forEach(([id,value])=>{const element=$(`#${id}`);if(element)element.textContent=money(value)})}
document.addEventListener('DOMContentLoaded',()=>{const refresh=event=>{if(!event||event.target.closest?.('#view-invoice'))refreshInvoiceSummaryPanel()};document.addEventListener('input',refresh);document.addEventListener('change',refresh);document.addEventListener('click',event=>{if(event.target.closest?.('#add-accommodation,#add-addon,[data-line-index][data-qty],.remove-form-line'))setTimeout(refreshInvoiceSummaryPanel,0)});refreshInvoiceSummaryPanel()});

function installEditableLineCategories(){[{type:'accommodation',id:'accommodation-category',values:['Accommodation','Inclusive Package','Package','Extra Bed','Complimentary']},{type:'addon',id:'addon-category',values:['Food & Beverage','BBQ','Minibar','Souvenir','Activities','Miscellaneous','Other Expenses']}].forEach(({type,id,values})=>{const select=$(`#${type}-select`),fields=select?.parentElement;if(!fields||$(`#${id}`))return;const input=document.createElement('input');input.id=id;input.type='text';input.className='invoice-category-input';input.placeholder='à¸«à¸¡à¸§à¸” / à¸žà¸´à¸¡à¸žà¹Œà¸«à¸£à¸·à¸­à¹€à¸¥à¸·à¸­à¸';input.setAttribute('list',`${id}-options`);input.setAttribute('aria-label',`à¸«à¸¡à¸§à¸” ${type}`);const list=document.createElement('datalist');list.id=`${id}-options`;values.forEach(value=>{const option=document.createElement('option');option.value=value;list.appendChild(option)});fields.insertBefore(input,fields.querySelector('.button'));fields.appendChild(list)})}
function enableEditableLineCategories(){
  installEditableLineCategories()
  addLine=function(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),search=$(`#${type==='accommodation'?'accommodation':'addon'}-search`),categoryEl=type==='accommodation'?$('#accommodation-category'):$('#addon-category'),rateEl=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),qtyEl=type==='accommodation'?$('#accommodation-qty'):$('#addon-qty'),items=type==='accommodation'?accommodationItems:addonItems,selected=items[Number(select?.value)],typed=cleanEnglishText(search?.value?.trim()||''),item=selected||(!typed?null:{name:typed,category:type==='accommodation'?'Accommodation':'Miscellaneous',rate:Math.max(0,Number(rateEl?.value||0)),custom:true});if(!item){showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¸«à¸£à¸·à¸­à¸žà¸´à¸¡à¸žà¹Œà¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸«à¸¡à¹ˆà¸à¹ˆà¸­à¸™à¹€à¸žà¸´à¹ˆà¸¡','error');return}const category=cleanEnglishText(categoryEl?.value?.trim()||item.category||(type==='accommodation'?'Accommodation':'Miscellaneous'));state.invoiceLines.push({type,name:item.name,category,sourceIndex:selected?Number(select.value):null,rate:Math.max(0,Number(rateEl?.value||item.rate||0)),deposit:0,depositMethod:'à¹€à¸‡à¸´à¸™à¸ªà¸”',qty:Math.max(1,Number(qtyEl?.value||1)),discountRate:0,discountAmount:0,pendingCollection:0,pendingNote:''});if(select)select.value='';if(rateEl)rateEl.value='';if(qtyEl)qtyEl.value='1';if(search)search.value='';if(categoryEl)categoryEl.value='';renderFormLines();calculateInvoice();showToast(`à¹€à¸žà¸´à¹ˆà¸¡ ${item.name} à¸¥à¸‡à¹ƒà¸™à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸¥à¹‰à¸§`)}
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
    return `<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">âˆ’</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡ Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><input class="line-discount" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.discountAmount||0)}" placeholder="à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™" aria-label="à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¹€à¸›à¹‡à¸™à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™ ${esc(line.name)}"></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">à¸à¹ˆà¸­à¸™à¸«à¸±à¸ ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"><span class="material-symbols-outlined">close</span></button></td></tr>`;
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

  $$('#view-invoice .invoice-line-group th').forEach(th=>{if(th.textContent.includes('à¸ªà¹ˆà¸§à¸™à¸¥à¸”'))th.textContent='à¸ªà¹ˆà¸§à¸™à¸¥à¸” (Baht)'});

  const baseRenderPreview=renderInvoicePreview;
  renderInvoicePreview=function(){
    baseRenderPreview();
    const previewSnapshot=invoiceSnapshot();
    [['preview-reference',previewSnapshot.reference],['preview-reference-meta',previewSnapshot.reference],['preview-customer',previewSnapshot.customer],['preview-check-in',previewSnapshot.checkIn?formatDate(previewSnapshot.checkIn):''],['preview-check-out',previewSnapshot.checkOut?formatDate(previewSnapshot.checkOut):''],['preview-nights',previewSnapshot.nights],['preview-remark',previewSnapshot.remark],['preview-invoice-date',previewSnapshot.docDate?formatDate(previewSnapshot.docDate):'']].forEach(([id,value])=>{if($(`#${id}`))$(`#${id}`).textContent=value||''});
    const noteBox=$('#preview-pending-notes');
    if(!noteBox)return;
    const methods=[...new Set([...state.invoiceLines.filter(line=>Number(line.deposit||0)>0).map(line=>line.depositMethod||'à¹€à¸‡à¸´à¸™à¸ªà¸”'),...state.payments.filter(payment=>Number(payment.amount||0)>0).map(payment=>payment.method)])];
    if($('#preview-payment-method')&&!methods.length)$('#preview-payment-method').textContent='';
    const notes=[];
    if(methods.length)notes.push(`<div><strong>à¸Šà¸³à¸£à¸°à¹à¸¥à¹‰à¸§à¸ˆà¸²à¸à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡</strong><span>${esc(methods.join(', '))}</span></div>`);
    if(pendingTotal())notes.push(`<div><strong>à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸šà¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥ ${money(pendingTotal())}</strong><span>${esc(state.pendingCollectionNote||'à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸šà¸ˆà¸²à¸à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¹€à¸à¸µà¹ˆà¸¢à¸§à¸‚à¹‰à¸­à¸‡')}</span></div>`);
    noteBox.innerHTML=notes.join('');
    noteBox.classList.toggle('long-note',String(state.pendingCollectionNote||'').length>90);
    const footer=noteBox.closest('.preview-footer');
    if(footer)footer.classList.toggle('has-pending-notes',notes.length>0);
  };

  const baseRenderPendingFormRows=renderPendingFormRows;
  renderPendingFormRows=function(){
    const box=$('#pending-form-rows');
    if(!box)return;
    box.innerHTML=`<div class="pending-form-row"><strong>à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸šà¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥</strong><input class="whole-bill-pending-amount" type="number" min="0" step="0.01" value="${pendingTotal()}" placeholder="à¸¢à¸­à¸”à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š"><input class="whole-bill-pending-note" value="${esc(state.pendingCollectionNote||'')}" placeholder="à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸ / à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸£à¸­à¹€à¸à¹‡à¸š"></div>`;
  };

  renderPendingCollectionRows=function(){
    const box=$('#pending-collection-rows');
    if(!box)return;
    box.innerHTML=`<div class="pending-collection-row"><div class="pending-collection-name"><strong>à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸šà¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥</strong><small>à¸£à¸§à¸¡à¸¢à¸­à¸”à¸ˆà¸²à¸à¸—à¸¸à¸à¹à¸œà¸™à¸ / à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¹€à¸à¸µà¹ˆà¸¢à¸§à¸‚à¹‰à¸­à¸‡</small></div><input data-pending-bill-field="amount" type="number" min="0" step="0.01" value="${pendingTotal()}" placeholder="à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸š"><input data-pending-bill-field="note" value="${esc(state.pendingCollectionNote||'')}" placeholder="à¹à¸œà¸™à¸ / à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸£à¸­à¹€à¸à¹‡à¸š"></div>`;
    box.querySelectorAll('[data-pending-bill-field]').forEach(input=>input.addEventListener('input',event=>{const field=event.target.dataset.pendingBillField;if(field==='amount')pendingCollectionRows[0].amount=Math.max(0,Number(event.target.value||0));else pendingCollectionRows[0].note=event.target.value;updateSettlementTotal()}));
  };

  const baseOpenSettlementModal=openSettlementModal;
  openSettlementModal=function(){
    settlementRows=state.payments.length?state.payments.map(payment=>({...payment})):[{method:'à¹€à¸‡à¸´à¸™à¸ªà¸”',amount:0}];
    pendingCollectionRows=[{amount:pendingTotal(),note:state.pendingCollectionNote||''}];
    const root=$('#modal-root');
    if(!root)return;
    root.innerHTML=`<div class="modal-backdrop"><div class="modal settlement-modal" role="dialog" aria-modal="true"><div class="modal-header"><h3>à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™à¹à¸¥à¸°à¸›à¸´à¸”à¸¢à¸­à¸”</h3><button class="icon-button" data-close-modal aria-label="à¸›à¸´à¸”"><span class="material-symbols-outlined">close</span></button></div><div class="modal-body"><p class="muted">à¸šà¸±à¸™à¸—à¸¶à¸à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸Šà¸³à¸£à¸° à¹à¸¥à¸°à¸£à¸§à¸¡à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸šà¸ˆà¸²à¸à¸—à¸¸à¸à¸ˆà¸¸à¸”à¹€à¸›à¹‡à¸™à¸¢à¸­à¸”à¹€à¸”à¸µà¸¢à¸§à¸‚à¸­à¸‡à¸šà¸´à¸¥</p><div id="settlement-rows"></div><button type="button" class="button button-soft full-width" data-settlement-add><span class="material-symbols-outlined">add</span>à¹€à¸žà¸´à¹ˆà¸¡à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸Šà¸³à¸£à¸°</button><section class="pending-collection-section"><div class="pending-collection-heading"><strong>à¸¢à¸­à¸”à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸šà¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥</strong><small>à¹„à¸¡à¹ˆà¹à¸¢à¸à¸•à¸²à¸¡à¸£à¸²à¸¢à¸à¸²à¸£ à¹ƒà¸«à¹‰à¸£à¸°à¸šà¸¸à¸¢à¸­à¸”à¸£à¸§à¸¡à¹à¸¥à¸°à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¸„à¸£à¸±à¹‰à¸‡à¹€à¸”à¸µà¸¢à¸§</small></div><div id="pending-collection-rows"></div></section><label class="settlement-slip">à¸«à¸¥à¸±à¸à¸à¸²à¸™à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™<input id="settlement-slip" type="file" accept="image/*,.pdf"></label><label class="settlement-preparer">à¸œà¸¹à¹‰à¸ˆà¸±à¸”à¸—à¸³ / à¸œà¸¹à¹‰à¸›à¸´à¸”à¸‡à¸²à¸™<input id="settlement-preparer" list="preparer-options" placeholder="à¸žà¸´à¸¡à¸žà¹Œà¸«à¸£à¸·à¸­à¹€à¸¥à¸·à¸­à¸à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸ˆà¸±à¸”à¸—à¸³" required><datalist id="preparer-options"><option value="Now Narit"><option value="Mhew Kusu"><option value="Nattaya Phung"><option value="Nummim"><option value="Ple Theresa"></datalist></label><p id="settlement-total" class="settlement-total"></p></div><div class="modal-footer"><button class="button button-outline" type="button" data-close-modal>à¸¢à¸à¹€à¸¥à¸´à¸</button><button class="button button-primary" type="button" data-settlement-confirm>à¸›à¸´à¸”à¸¢à¸­à¸”à¹à¸¥à¸°à¹€à¸à¹‡à¸šà¸«à¸¥à¸±à¸à¸à¸²à¸™</button></div></div></div>`;
    renderSettlementRows();renderPendingCollectionRows();updateSettlementTotal();
  };

  updateSettlementTotal=function(){
    const el=$('#settlement-total');
    if(el){
      const totals=settlementTotals(),overLimit=totals.excess>0.005;
      el.classList.toggle('over-limit',overLimit);
      el.innerHTML=`à¸£à¸§à¸¡à¸Šà¸³à¸£à¸° ${money(totals.paid)} <span>â€¢ à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸šà¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥ ${money(totals.pending)}</span>${overLimit?`<small class="settlement-limit-warning">à¸¢à¸­à¸”à¸£à¸§à¸¡à¹€à¸à¸´à¸™à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰ ${money(totals.excess)} à¸à¸£à¸¸à¸“à¸²à¸›à¸£à¸±à¸šà¸¢à¸­à¸”à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸šà¸´à¸¥</small>`:''}`;
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
      showToast(`à¸¢à¸­à¸”à¸Šà¸³à¸£à¸°à¹€à¸à¸´à¸™à¸¢à¸­à¸”à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¸‚à¸­à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰ ${money(amount-available)}`,'error');
    }
  },true);

  finalizeInvoice=async function(){
    const preparer=($('#settlement-preparer')?.value||'').trim();
    if(!preparer){showToast('à¸à¸£à¸¸à¸“à¸²à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸ˆà¸±à¸”à¸—à¸³à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸‡à¸²à¸™','error');return}
    const enteredTotals=settlementTotals();
    if(enteredTotals.excess>0.005){
      updateSettlementTotal();
      showToast(`à¸¢à¸­à¸”à¸Šà¸³à¸£à¸°à¸£à¸§à¸¡à¹€à¸à¸´à¸™à¸¢à¸­à¸”à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰ ${money(enteredTotals.excess)}`,'error');
      return;
    }
    const file=$('#settlement-slip')?.files?.[0];
    let proof=null;
    if(file){
      if(file.size>4*1024*1024){showToast('à¹„à¸Ÿà¸¥à¹Œà¸ªà¸¥à¸´à¸›à¸•à¹‰à¸­à¸‡à¸¡à¸µà¸‚à¸™à¸²à¸”à¹„à¸¡à¹ˆà¹€à¸à¸´à¸™ 4 MB','error');return}
      try{proof={name:file.name,size:file.size,type:file.type,data:await fileToDataUrl(file)}}catch{showToast('à¸­à¹ˆà¸²à¸™à¹„à¸Ÿà¸¥à¹Œà¸ªà¸¥à¸´à¸›à¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ','error');return}
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
      showToast(`à¸¢à¸­à¸”à¸Šà¸³à¸£à¸°à¸£à¸§à¸¡à¹€à¸à¸´à¸™à¸¢à¸­à¸”à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰ ${money(settlementSnapshot.deposit+settlementSnapshot.pendingTotal-settlementSnapshot.netTotal)}`,'error');return;
    }
    if(settlementSnapshot.outstanding>0){
      state.payments=previousPayments;state.pendingCollectionTotal=previousTotal;state.pendingCollectionNote=previousNote;renderPayments();calculateInvoice();
      showToast(`à¸¢à¸±à¸‡à¸¡à¸µà¸¢à¸­à¸”à¸—à¸µà¹ˆà¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸Šà¸³à¸£à¸°à¸«à¸£à¸·à¸­à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¸¢à¸­à¸”à¸£à¸­à¹€à¸à¹‡à¸š ${money(settlementSnapshot.outstanding)}`,'error');return;
    }
    state.closedInvoiceSnapshot=displaySnapshot;
    state.invoiceClosed=true;
    const record={reference:settlementSnapshot.reference,customer:settlementSnapshot.customer,villa:settlementSnapshot.villa,checkIn:settlementSnapshot.checkIn,checkOut:settlementSnapshot.checkOut,nights:settlementSnapshot.nights,remark:settlementSnapshot.remark,docDate:settlementSnapshot.docDate,total:settlementSnapshot.subtotal,discount:settlementSnapshot.discount,deposit:settlementSnapshot.deposit,pendingTotal:settlementSnapshot.pendingTotal,pendingCollectionTotal:settlementSnapshot.pendingTotal,pendingCollectionNote:state.pendingCollectionNote,preparer,closedAt:new Date().toLocaleString('th-TH'),proof,lines:state.invoiceLines.map(line=>({...line})),payments:state.payments.map(payment=>({...payment}))};
    state.closedBookings.unshift(record);saveClosedBookings();
    state.invoices.unshift({id:settlementSnapshot.reference,customer:settlementSnapshot.customer,time:'à¹€à¸¡à¸·à¹ˆà¸­à¸ªà¸±à¸à¸„à¸£à¸¹à¹ˆ',total:settlementSnapshot.subtotal,status:'à¸Šà¸³à¸£à¸°à¹à¸¥à¹‰à¸§',statusClass:'status-paid'});
    renderDashboard();renderBookingRecords();$('#modal-root').innerHTML='';calculateInvoice();setInvoicePage('preview');showToast('à¸›à¸´à¸”à¸¢à¸­à¸”à¹à¸¥à¸°à¹€à¸à¹‡à¸šà¸«à¸¥à¸±à¸à¸à¸²à¸™à¸à¸²à¸£à¸ˆà¸­à¸‡à¹à¸¥à¹‰à¸§');
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
  const button=document.createElement('button');button.id='save-draft';button.type='button';button.className='button button-outline full-width';button.innerHTML='<span class="material-symbols-outlined">save</span>à¸šà¸±à¸™à¸—à¸¶à¸à¹à¸šà¸šà¸£à¹ˆà¸²à¸‡';previewButton.insertAdjacentElement('beforebegin',button);button.addEventListener('click',saveInvoiceDraft);
}
document.addEventListener('DOMContentLoaded',installInvoiceDraftActions);

function installInvoiceVillaCodeField(){
  const villa=$('#villa'),villaLabel=villa?.closest('label');
  if(!villaLabel||$('#villa-code'))return;
  const label=document.createElement('label');label.textContent='à¸£à¸«à¸±à¸ª Villa / Room';
  const input=document.createElement('input');input.id='villa-code';input.type='text';input.placeholder='à¹€à¸Šà¹ˆà¸™ A â€” Rainy S';input.setAttribute('list','invoice-villa-code-options');input.autocomplete='off';
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
  document.querySelectorAll('#view-close-round option').forEach(option=>{option.textContent=option.textContent.replace(/\s*Â·\s*Zone A/g,'')});
  document.querySelectorAll('#view-users th').forEach(cell=>{if(cell.textContent.trim()==='à¸ˆà¸¸à¸”à¸‚à¸²à¸¢')cell.textContent='à¸«à¸™à¹ˆà¸§à¸¢à¸‡à¸²à¸™'});
  document.querySelectorAll('#view-users td').forEach(cell=>{if(cell.textContent.trim()==='Zone A')cell.textContent='RECEPTION';if(cell.textContent.trim()==='à¸—à¸¸à¸à¸ˆà¸¸à¸”à¸‚à¸²à¸¢')cell.textContent='à¸—à¸¸à¸à¸«à¸™à¹ˆà¸§à¸¢à¸‡à¸²à¸™'});
  document.querySelectorAll('#view-audit p,#view-audit small').forEach(element=>{element.textContent=element.textContent.replace(/à¸ˆà¸¸à¸”à¸‚à¸²à¸¢/g,'à¸«à¸™à¹ˆà¸§à¸¢à¸‡à¸²à¸™').replace(/Zone A/g,'RECEPTION')});
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
  list.innerHTML=rows.map(entry=>{const when=new Date(entry.createdAt);const time=Number.isNaN(when.getTime())?'-':when.toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'});const detail=entry.entityId?`${entry.entityType} ${entry.entityId}`:entry.entityType;return `<div class="audit-item"><span class="audit-icon brown"><span class="material-symbols-outlined">fact_check</span></span><div><strong>${esc(entry.action)} <b>${esc(detail)}</b></strong><p>${esc(entry.metadata?.reason||'à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¸—à¸³à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™à¸£à¸°à¸šà¸š')}</p><small>${esc(entry.actor||'à¸œà¸¹à¹‰à¹ƒà¸Šà¹‰à¸‡à¸²à¸™')} Â· ${esc(time)}</small></div><span class="status-chip neutral">${esc(entry.action)}</span></div>`}).join('')||'<div class="empty-state"><span class="material-symbols-outlined">fact_check</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸š</p><small>Audit Log à¸ˆà¸°à¹à¸ªà¸”à¸‡à¹€à¸¡à¸·à¹ˆà¸­à¸¡à¸µà¸à¸²à¸£à¸—à¸³à¸£à¸²à¸¢à¸à¸²à¸£à¸ˆà¸£à¸´à¸‡</small></div>';
}
function exportAuditLogCsv(){
  const rows=loadAuditLogs(),headers=['Time','Action','Entity Type','Entity ID','Actor','Reason'];
  const values=rows.map(entry=>[entry.createdAt,entry.action,entry.entityType,entry.entityId,entry.actor,entry.metadata?.reason||'']);
  const csv='\uFEFF'+[headers,...values].map(row=>row.map(csvEscape).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=`audit-log-${historyDateKey()}.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('à¸ªà¹ˆà¸‡à¸­à¸­à¸ Audit Log à¹€à¸›à¹‡à¸™ CSV à¹à¸¥à¹‰à¸§');
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
function saveInvoiceHistory(records){try{localStorage.setItem(INVOICE_HISTORY_KEY,JSON.stringify(records))}catch{showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ','error')}}
function historyPendingTotal(record){
  if(Number(record.pendingTotal||0)>0)return Math.max(0,Number(record.pendingTotal||0));
  return (record.pendingCollections||[]).reduce((sum,row)=>sum+Math.max(0,Number(row.amount||0)),0);
}
function historyStatus(record){
  const pending=historyPendingTotal(record);
  return pending>0?{label:'à¸„à¹‰à¸²à¸‡à¸Šà¸³à¸£à¸°',className:'status-pending'}:{label:'à¸Šà¸³à¸£à¸°à¹à¸¥à¹‰à¸§',className:'status-paid'};
}
function normalizeHistoryRecord(record){
  const total=Math.max(0,Number(record.netTotal??(Number(record.total||0)-Number(record.discount||0)))||0);
  const pendingTotal=historyPendingTotal(record);
  const status=historyStatus({...record,pendingTotal});
  return {...record,id:record.id||record.reference||`INV-${Date.now()}`,reference:record.reference||record.id||'',businessDate:record.businessDate||historyDateKey(),time:record.time||'à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¹€à¸§à¸¥à¸²',total,netTotal:total,pendingTotal,status:status.label,statusClass:status.className};
}
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
  if(dateFilter){dateFilter.innerHTML=`<option value="today">à¸§à¸±à¸™à¸™à¸µà¹‰ Â· ${historyDisplayDate(today)}</option>`;dateFilter.value='today'}
  const rows=historyRowsForToday();
  body.innerHTML=rows.map(record=>{
    const status=historyStatus(record),pending=historyPendingTotal(record);
    return `<tr><td>${esc(record.id)}</td><td><strong>${esc(record.customer||'-')}</strong><small class="table-subtext">${esc(record.villa||'-')} Â· ${esc(record.time)} à¸™.</small></td><td>${esc(historyDisplayDate(record.businessDate))}</td><td class="align-right strong-number">${money(record.total)}</td><td>${pending?`<span class="warning-text">à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š ${money(pending)}</span>`:'<span class="positive-text">à¸„à¸£à¸šà¸–à¹‰à¸§à¸™</span>'}</td><td><span class="status-chip ${status.className}">${status.label}</span></td><td><div class="history-actions"><but…29841 tokens truncated…à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸</button></div>${(shift.cashUses||[]).length?`<div class="drawer-use-list">${shift.cashUses.map((item,index)=>`<div><span>${esc(item.note)}</span><strong>${cashDrawerMoney(item.amount)}</strong><button class="icon-button" data-cash-action="remove-use" data-cash-use-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸™à¸³à¹€à¸‡à¸´à¸™à¸­à¸­à¸"><span class="material-symbols-outlined">delete</span></button></div>`).join('')}</div>`:''}</div>`:'<div class="empty-state"><span class="material-symbols-outlined">point_of_sale</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸­à¸šà¹ƒà¸«à¹‰à¸•à¸£à¸§à¸ˆà¸™à¸±à¸š</p><small>à¹€à¸›à¸´à¸”à¸à¸°à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸ˆà¸¶à¸‡à¸™à¸±à¸šà¹€à¸«à¸£à¸µà¸¢à¸à¹à¸¥à¸°à¸˜à¸™à¸šà¸±à¸•à¸£</small></div>'}</article></div><article class="panel"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">history</span></span><h3>à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸›à¸´à¸”â€“à¸›à¸´à¸”à¸à¸°</h3></div><span class="count-chip">${cashDrawerStore.history.length} à¸£à¸­à¸š</span></div>${cashDrawerStore.history.length?`<div class="table-wrap"><table class="cash-drawer-history"><thead><tr><th>à¸£à¸«à¸±à¸ªà¸à¸°</th><th>à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸° / à¹€à¸§à¸¥à¸²</th><th>à¸œà¸¹à¹‰à¸›à¸´à¸”à¸à¸° / à¹€à¸§à¸¥à¸²</th><th class="align-right">à¸¢à¸­à¸”à¹€à¸£à¸´à¹ˆà¸¡</th><th class="align-right">à¸¢à¸­à¸”à¸›à¸´à¸”à¸ˆà¸£à¸´à¸‡</th><th class="align-right">à¸ªà¹ˆà¸§à¸™à¸•à¹ˆà¸²à¸‡</th></tr></thead><tbody>${cashDrawerStore.history.map(item=>`<tr><td class="mono">${esc(item.code)}</td><td><strong>${esc(item.openedBy)}</strong><small class="table-subtext">${esc(cashDrawerDateTime(item.openedAt))}</small></td><td><strong>${esc(item.closedBy||'-')}</strong><small class="table-subtext">${esc(cashDrawerDateTime(item.closedAt))}</small></td><td class="align-right">${cashDrawerMoney(item.openingCash)}</td><td class="align-right">${cashDrawerMoney(item.countedTotal)}</td><td class="align-right ${Number(item.difference||0)===0?'positive-text':'warning-text'}">${Number(item.difference||0)<0?'-':''}${cashDrawerMoney(Math.abs(Number(item.difference||0)))}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state"><span class="material-symbols-outlined">history</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸›à¸´à¸”â€“à¸›à¸´à¸”à¸à¸°</p><small>à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸ˆà¸°à¸–à¸¹à¸à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸¡à¸·à¹ˆà¸­à¸›à¸´à¸”à¸à¸°à¸ªà¸³à¹€à¸£à¹‡à¸ˆ</small></div>'}</article>`;
}
function cashDrawerReadCounts(){const counts={};$$('[data-cash-denom]').forEach(input=>{counts[input.dataset.cashDenom]=Math.max(0,Math.floor(Number(input.value||0)))});return counts}
function cashDrawerOpen(){
  const name=($('#drawer-open-name')?.value||'').trim(),pin=($('#drawer-open-pin')?.value||'').trim(),opening=Math.max(0,Number($('#drawer-opening-cash')?.value||0));
  if(!name||!pin){showToast('à¸à¸£à¸¸à¸“à¸²à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¹à¸¥à¸°à¸•à¸±à¹‰à¸‡à¸£à¸«à¸±à¸ªà¹€à¸›à¸´à¸”à¸à¸°','error');return}
  if(pin.length<4){showToast('à¸£à¸«à¸±à¸ªà¹€à¸›à¸´à¸”à¸à¸°à¸•à¹‰à¸­à¸‡à¸¡à¸µà¸­à¸¢à¹ˆà¸²à¸‡à¸™à¹‰à¸­à¸¢ 4 à¸«à¸¥à¸±à¸','error');return}
  cashDrawerStore.activeShift={code:cashDrawerShiftCode(),openedBy:name,pin,openedAt:new Date().toISOString(),openingCash:opening,cashUses:[],counts:{}};
  saveCashDrawerStore();renderCashDrawer();showToast(`à¹€à¸›à¸´à¸”à¸à¸° ${cashDrawerStore.activeShift.code} à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`);
}
function cashDrawerSaveCount(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  shift.counts=cashDrawerReadCounts();saveCashDrawerStore();renderCashDrawer();showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¸œà¸¥à¸à¸²à¸£à¸™à¸±à¸šà¹€à¸‡à¸´à¸™à¹à¸¥à¹‰à¸§');
}
function cashDrawerAddUse(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  const note=($('#drawer-use-note')?.value||'').trim(),amount=Math.max(0,Number($('#drawer-use-amount')?.value||0));
  if(!note||amount<=0){showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹à¸¥à¸°à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸','error');return}
  if(amount>cashDrawerExpected(shift)){showToast('à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸à¸¡à¸²à¸à¸à¸§à¹ˆà¸²à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™à¹ƒà¸™à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸','error');return}
  shift.cashUses=[...(shift.cashUses||[]),{note,amount,at:new Date().toISOString()}];saveCashDrawerStore();renderCashDrawer();showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸à¸žà¸£à¹‰à¸­à¸¡à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹à¸¥à¹‰à¸§');
}
function cashDrawerRemoveUse(index){const shift=cashDrawerStore.activeShift;if(!shift)return;shift.cashUses.splice(Number(index),1);saveCashDrawerStore();renderCashDrawer();showToast('à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸à¹à¸¥à¹‰à¸§')}
function cashDrawerClose(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  const name=($('#drawer-close-name')?.value||'').trim(),pin=($('#drawer-close-pin')?.value||'').trim(),counts=shift.counts||{},counted=cashDrawerCountTotal(counts),expected=cashDrawerExpected(shift),difference=counted-expected;
  if(name!==shift.openedBy||pin!==shift.pin){showToast('à¸Šà¸·à¹ˆà¸­à¸«à¸£à¸·à¸­à¸£à¸«à¸±à¸ªà¹„à¸¡à¹ˆà¸•à¸£à¸‡à¸à¸±à¸šà¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°','error');return}
  if(!shift.lastCountAt){showToast('à¸à¸£à¸¸à¸“à¸²à¸šà¸±à¸™à¸—à¸¶à¸à¸œà¸¥à¸à¸²à¸£à¸™à¸±à¸šà¹€à¸‡à¸´à¸™à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸à¸°','error');return}
  if(difference!==0){showToast(`à¸¢à¸­à¸”à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¸£à¸‡à¸à¸±à¸™ ${difference<0?'-':''}${cashDrawerMoney(Math.abs(difference))} à¸à¸£à¸¸à¸“à¸²à¸•à¸£à¸§à¸ˆà¸™à¸±à¸šà¸«à¸£à¸·à¸­à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸`,'error');return}
  const closedAt=new Date().toISOString();cashDrawerStore.history.unshift({...shift,closedBy:name,closedAt,countedTotal:counted,difference});cashDrawerStore.history=cashDrawerStore.history.slice(0,100);cashDrawerStore.activeShift=null;saveCashDrawerStore();renderCashDrawer();showToast(`à¸›à¸´à¸”à¸à¸° ${shift.code} à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`);
}
function installCashDrawer(){
  cashDrawerStore=loadCashDrawerStore();
  const view=$('#view-drawer');if(!view)return;
  renderCashDrawer();
  view.addEventListener('input',event=>{if(event.target.matches('[data-cash-denom]')){const shift=cashDrawerStore.activeShift;if(!shift)return;const counts=cashDrawerReadCounts(),total=cashDrawerCountTotal(counts),difference=total-cashDrawerExpected(shift);if($('#drawer-counted-total'))$('#drawer-counted-total').textContent=cashDrawerMoney(total);if($('#drawer-difference')){$('#drawer-difference').textContent=`${difference<0?'-':''}${cashDrawerMoney(Math.abs(difference))}`;$('#drawer-difference').className=difference===0?'positive-text':'warning-text'}}});
  view.addEventListener('click',event=>{const action=event.target.closest('[data-cash-action]');if(!action)return;event.preventDefault();const type=action.dataset.cashAction;if(type==='open')cashDrawerOpen();if(type==='save-count'){const shift=cashDrawerStore.activeShift;if(shift){shift.counts=cashDrawerReadCounts();shift.lastCountAt=new Date().toISOString();cashDrawerSaveCount()}}if(type==='add-use')cashDrawerAddUse();if(type==='remove-use')cashDrawerRemoveUse(action.dataset.cashUseIndex);if(type==='close')cashDrawerClose()});
}
document.addEventListener('DOMContentLoaded',installCashDrawer);

/* Cash drawer follow-up rules: PINs stay disabled until Supabase auth is connected. */
function cashDrawerV2Expected(shift){
  const used=(shift.cashUses||[]).reduce((sum,item)=>sum+Math.max(0,Number(item.amount||0)),0);
  const returned=(shift.cashReturns||[]).reduce((sum,item)=>sum+Math.max(0,Number(item.amount||0)),0);
  return Math.max(0,Number(shift.openingCash||0)-used+returned);
}
function cashDrawerV2Difference(shift){return cashDrawerCountTotal(shift.counts||{})-cashDrawerV2Expected(shift)}
function cashDrawerV2ReadCounts(){const counts={};$$('[data-cash-drawer-denom]').forEach(input=>{counts[input.dataset.cashDrawerDenom]=Math.max(0,Math.floor(Number(input.value||0)))});return counts}
function cashDrawerV2DenominationInputs(counts={},ready=true){return CASH_DRAWER_DENOMINATIONS.map(denomination=>`<label class="cash-denomination"><span>${denomination.label}</span><input type="number" min="0" step="1" value="${Math.max(0,Number(counts[denomination.value]||0))}" data-cash-drawer-denom="${denomination.value}" aria-label="${denomination.label} à¸à¸µà¹ˆà¸Šà¸´à¹‰à¸™" ${ready?'':'disabled'}></label>`).join('')}
function cashDrawerV2Render(){
  const view=$('#view-drawer');if(!view)return;
  const shift=cashDrawerStore.activeShift,ready=Boolean(shift&&shift.openingCash!==null&&shift.openingCash!==undefined),expected=shift?cashDrawerV2Expected(shift):0,counted=shift?cashDrawerCountTotal(shift.counts||{}):0,difference=counted-expected;
  const navBadge=$('.nav-item[data-view="drawer"] .nav-badge');if(navBadge)navBadge.textContent=shift?'à¸à¸°à¹€à¸›à¸´à¸”':'à¸à¸°à¸›à¸´à¸”';
  const status=shift?'<span class="status-chip success large"><i></i> à¸à¸°à¹€à¸›à¸´à¸”à¸­à¸¢à¸¹à¹ˆ</span>':'<span class="status-chip neutral large">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸›à¸´à¸”à¸à¸°</span>';
  const uses=(shift?.cashUses||[]).reduce((sum,item)=>sum+Number(item.amount||0),0),returns=(shift?.cashReturns||[]).reduce((sum,item)=>sum+Number(item.amount||0),0);
  view.innerHTML=`<div class="page-heading compact"><div><p class="eyebrow">OPERATIONS / CASH DRAWER</p><h2>à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸à¹€à¸à¹‡à¸šà¹€à¸‡à¸´à¸™à¸—à¸­à¸™</h2><p class="muted">à¹€à¸‡à¸´à¸™à¸—à¸­à¸™à¹à¸¢à¸à¸ˆà¸²à¸à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰ Â· à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹ƒà¸Šà¹‰à¸£à¸«à¸±à¸ªà¸ˆà¸™à¸à¸§à¹ˆà¸²à¸ˆà¸°à¹€à¸Šà¸·à¹ˆà¸­à¸¡ Supabase</p></div>${status}</div><div class="drawer-grid"><article class="panel drawer-status"><div class="drawer-hero"><span class="drawer-circle"><span class="material-symbols-outlined">payments</span></span><div><small>${shift?'à¸à¸°à¸—à¸µà¹ˆà¸à¸³à¸¥à¸±à¸‡à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£':'à¸ªà¸–à¸²à¸™à¸°à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸'}</small><h3>${esc(shift?.code||'à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸«à¸±à¸ªà¸à¸°')}</h3><p>${shift?`à¹€à¸›à¸´à¸”à¹‚à¸”à¸¢ ${esc(shift.openedBy)} Â· ${esc(cashDrawerDateTime(shift.openedAt))}`:'à¹€à¸›à¸´à¸”à¸à¸°à¸”à¹‰à¸§à¸¢à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸š'}</p></div></div>${shift?`<div class="drawer-stat-grid"><div><small>à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™</small><strong>${ready?cashDrawerMoney(shift.openingCash):'à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸à¸³à¸«à¸™à¸”'}</strong></div><div><small>à¸™à¸³à¸­à¸­à¸à¹„à¸›à¹ƒà¸Šà¹‰</small><strong>${cashDrawerMoney(uses)}</strong></div><div><small>à¹€à¸‡à¸´à¸™à¸„à¸·à¸™à¸ˆà¸²à¸à¸à¸°à¸­à¸·à¹ˆà¸™</small><strong>${cashDrawerMoney(returns)}</strong></div><div><small>à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸„à¸§à¸£à¹€à¸«à¸¥à¸·à¸­</small><strong class="accent-text">${cashDrawerMoney(expected)}</strong></div></div><div class="drawer-opening-form"><strong>à¸à¸³à¸«à¸™à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸‚à¸­à¸‡à¸à¸°</strong><small>à¸à¸³à¸«à¸™à¸”à¸ˆà¸²à¸à¸«à¸™à¹‰à¸²à¸™à¸µà¹‰à¸«à¸¥à¸±à¸‡à¹€à¸›à¸´à¸”à¸à¸°à¹à¸¥à¹‰à¸§</small><div class="drawer-opening-fields"><input id="drawer-v2-opening-cash" type="number" min="0" step="0.01" value="${ready?Number(shift.openingCash):''}" placeholder="à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™"><button class="button button-soft" data-cash-drawer-v2="set-opening">à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™</button></div></div><div class="drawer-close-auth"><strong>à¸›à¸´à¸”à¸à¸°à¹‚à¸”à¸¢à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™</strong><label>à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸›à¸´à¸”à¸à¸°<input id="drawer-v2-close-name" placeholder="à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°"></label><button class="button button-primary full-width" data-cash-drawer-v2="close"><span class="material-symbols-outlined">lock</span>à¸›à¸´à¸”à¸à¸°</button></div>`:`<div class="drawer-open-auth"><strong>à¹€à¸›à¸´à¸”à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸à¹€à¸à¹‡à¸šà¹€à¸‡à¸´à¸™</strong><label>à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°<input id="drawer-v2-open-name" placeholder="à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸š" autocomplete="off"></label><button class="button button-primary full-width" data-cash-drawer-v2="open"><span class="material-symbols-outlined">lock_open</span>à¹€à¸›à¸´à¸”à¸à¸°à¹à¸¥à¸°à¸ªà¸£à¹‰à¸²à¸‡à¸£à¸«à¸±à¸ªà¸à¸°</button></div>`}</article><article class="panel reconciliation"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">fact_check</span></span><h3>à¸•à¸£à¸§à¸ˆà¸™à¸±à¸šà¹€à¸‡à¸´à¸™à¹ƒà¸™à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸</h3></div><span class="status-chip ${!shift?'neutral':!ready?'warning':difference===0?'success':'warning'}">${!shift?'à¸£à¸­à¹€à¸›à¸´à¸”à¸à¸°':!ready?'à¸£à¸­à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™':difference===0?'à¸¢à¸­à¸”à¸•à¸£à¸‡à¸à¸±à¸™':'à¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸•à¹ˆà¸²à¸‡'}</span></div>${shift?`${!ready?'<div class="drawer-notice">à¸à¸£à¸¸à¸“à¸²à¸à¸³à¸«à¸™à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸”à¹‰à¸²à¸™à¸‹à¹‰à¸²à¸¢à¸à¹ˆà¸­à¸™à¹€à¸£à¸´à¹ˆà¸¡à¸™à¸±à¸šà¹€à¸‡à¸´à¸™</div>':''}<div class="reconcile-row"><span>à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸„à¸§à¸£à¹€à¸«à¸¥à¸·à¸­</span><strong>${cashDrawerMoney(expected)}</strong></div><div class="cash-denomination-grid">${cashDrawerV2DenominationInputs(shift.counts,ready)}</div><div class="reconcile-row"><span>à¸™à¸±à¸šà¹„à¸”à¹‰à¸ˆà¸£à¸´à¸‡</span><strong id="drawer-v2-counted-total">${cashDrawerMoney(counted)}</strong></div><div class="reconcile-row difference"><span>à¸ªà¹ˆà¸§à¸™à¸•à¹ˆà¸²à¸‡</span><strong id="drawer-v2-difference" class="${difference===0?'positive-text':'warning-text'}">${difference<0?'-':''}${cashDrawerMoney(Math.abs(difference))}</strong></div><button class="button button-outline full-width" data-cash-drawer-v2="save-count" ${ready?'':'disabled'}>à¸šà¸±à¸™à¸—à¸¶à¸à¸œà¸¥à¸à¸²à¸£à¸™à¸±à¸š</button><div class="drawer-use-form"><strong>à¸à¸£à¸“à¸µà¸™à¸³à¹€à¸‡à¸´à¸™à¸­à¸­à¸à¹„à¸›à¹ƒà¸Šà¹‰</strong><small>à¸£à¸°à¸šà¸¸à¹€à¸«à¸•à¸¸à¸œà¸¥à¹à¸¥à¸°à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™ à¸£à¸°à¸šà¸šà¸ˆà¸°à¸«à¸±à¸à¸ˆà¸²à¸à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸„à¸§à¸£à¹€à¸«à¸¥à¸·à¸­</small><div class="drawer-use-fields"><textarea id="drawer-v2-use-note" rows="4" placeholder="à¸žà¸´à¸¡à¸žà¹Œà¹€à¸«à¸•à¸¸à¸œà¸¥ à¹€à¸Šà¹ˆà¸™ à¸‹à¸·à¹‰à¸­à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸ªà¸³à¸™à¸±à¸à¸‡à¸²à¸™ à¸«à¸£à¸·à¸­à¸ªà¸³à¸£à¸­à¸‡à¸ˆà¹ˆà¸²à¸¢à¸­à¸°à¹„à¸£"></textarea><input id="drawer-v2-use-amount" type="number" min="0" step="0.01" placeholder="à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™"><button class="button button-soft" data-cash-drawer-v2="add-use" ${ready?'':'disabled'}>à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸</button></div>${(shift.cashUses||[]).length?`<div class="drawer-use-list">${shift.cashUses.map((item,index)=>`<div><span>${esc(item.note)}</span><strong>${cashDrawerMoney(item.amount)}</strong><button class="icon-button" data-cash-drawer-v2="remove-use" data-cash-use-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸™à¸³à¹€à¸‡à¸´à¸™à¸­à¸­à¸"><span class="material-symbols-outlined">delete</span></button></div>`).join('')}</div>`:''}</div><div class="drawer-use-form drawer-return-form"><strong>à¹€à¸‡à¸´à¸™à¸„à¸·à¸™à¸ˆà¸²à¸à¸à¸°à¸­à¸·à¹ˆà¸™</strong><small>à¹€à¸•à¸´à¸¡à¹€à¸‡à¸´à¸™à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸²à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸ à¹‚à¸”à¸¢à¸£à¸°à¸šà¸¸à¸§à¹ˆà¸²à¸„à¸·à¸™à¸¡à¸²à¸ˆà¸²à¸à¸à¸°à¹„à¸«à¸™</small><div class="drawer-return-fields"><input id="drawer-v2-return-shift" placeholder="à¸£à¸«à¸±à¸ªà¸à¸°à¸—à¸µà¹ˆà¸™à¸³à¹€à¸‡à¸´à¸™à¸¡à¸²à¸„à¸·à¸™"><input id="drawer-v2-return-note" placeholder="à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡"><input id="drawer-v2-return-amount" type="number" min="0" step="0.01" placeholder="à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™"><button class="button button-soft" data-cash-drawer-v2="add-return" ${ready?'':'disabled'}>à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸„à¸·à¸™</button></div>${(shift.cashReturns||[]).length?`<div class="drawer-use-list">${shift.cashReturns.map((item,index)=>`<div><span>à¸„à¸·à¸™à¸ˆà¸²à¸ ${esc(item.fromShift)}${item.note?` Â· ${esc(item.note)}`:''}</span><strong>${cashDrawerMoney(item.amount)}</strong><button class="icon-button" data-cash-drawer-v2="remove-return" data-cash-return-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¹€à¸‡à¸´à¸™à¸„à¸·à¸™"><span class="material-symbols-outlined">delete</span></button></div>`).join('')}</div>`:''}</div>`:'<div class="empty-state"><span class="material-symbols-outlined">point_of_sale</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸­à¸šà¹ƒà¸«à¹‰à¸•à¸£à¸§à¸ˆà¸™à¸±à¸š</p><small>à¹€à¸›à¸´à¸”à¸à¸°à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸ˆà¸¶à¸‡à¸™à¸±à¸šà¹€à¸«à¸£à¸µà¸¢à¸à¹à¸¥à¸°à¸˜à¸™à¸šà¸±à¸•à¸£</small></div>'}</article></div><article class="panel"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">history</span></span><h3>à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸›à¸´à¸”â€“à¸›à¸´à¸”à¸à¸°</h3></div><span class="count-chip">${cashDrawerStore.history.length} à¸£à¸­à¸š</span></div>${cashDrawerStore.history.length?`<div class="table-wrap"><table class="cash-drawer-history"><thead><tr><th>à¸£à¸«à¸±à¸ªà¸à¸°</th><th>à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸° / à¹€à¸§à¸¥à¸²</th><th>à¸œà¸¹à¹‰à¸›à¸´à¸”à¸à¸° / à¹€à¸§à¸¥à¸²</th><th class="align-right">à¸¢à¸­à¸”à¹€à¸£à¸´à¹ˆà¸¡</th><th class="align-right">à¸¢à¸­à¸”à¸›à¸´à¸”à¸ˆà¸£à¸´à¸‡</th><th class="align-right">à¸ªà¹ˆà¸§à¸™à¸•à¹ˆà¸²à¸‡</th><th></th></tr></thead><tbody>${cashDrawerStore.history.map((item,index)=>`<tr><td class="mono">${esc(item.code)}</td><td><strong>${esc(item.openedBy)}</strong><small class="table-subtext">${esc(cashDrawerDateTime(item.openedAt))}</small></td><td><strong>${esc(item.closedBy||'-')}</strong><small class="table-subtext">${esc(cashDrawerDateTime(item.closedAt))}</small></td><td class="align-right">${cashDrawerMoney(item.openingCash)}</td><td class="align-right">${cashDrawerMoney(item.countedTotal)}</td><td class="align-right ${Number(item.difference||0)===0?'positive-text':'warning-text'}">${Number(item.difference||0)<0?'-':''}${cashDrawerMoney(Math.abs(Number(item.difference||0)))}</td><td><button class="button button-danger action-small" data-cash-drawer-v2="delete-history" data-cash-history-index="${index}"><span class="material-symbols-outlined">delete</span>à¸¥à¸š</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state"><span class="material-symbols-outlined">history</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸›à¸´à¸”â€“à¸›à¸´à¸”à¸à¸°</p><small>à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸ˆà¸°à¸–à¸¹à¸à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸¡à¸·à¹ˆà¸­à¸›à¸´à¸”à¸à¸°à¸ªà¸³à¹€à¸£à¹‡à¸ˆ</small></div>'}</article>`;
}
function cashDrawerV2Open(){
  const name=($('#drawer-v2-open-name')?.value||'').trim();
  if(!name){showToast('à¸à¸£à¸¸à¸“à¸²à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°','error');return}
  cashDrawerStore.activeShift={code:cashDrawerShiftCode(),openedBy:name,openedAt:new Date().toISOString(),openingCash:null,cashUses:[],cashReturns:[],counts:{},lastCountAt:null};
  saveCashDrawerStore();cashDrawerV2Render();showToast(`à¹€à¸›à¸´à¸”à¸à¸° ${cashDrawerStore.activeShift.code} à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`);
}
function cashDrawerV2SetOpening(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  const amount=Number($('#drawer-v2-opening-cash')?.value);
  if(!Number.isFinite(amount)||amount<0){showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¹ƒà¸«à¹‰à¸–à¸¹à¸à¸•à¹‰à¸­à¸‡','error');return}
  cashDrawerStore.openingCashDefault=amount;shift.openingCash=amount;saveCashDrawerStore();cashDrawerV2Render();showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¹à¸¥à¹‰à¸§ à¹à¸¥à¸°à¸ˆà¸°à¹ƒà¸Šà¹‰à¸¢à¸­à¸”à¸™à¸µà¹‰à¸•à¹ˆà¸­à¸ˆà¸™à¸à¸§à¹ˆà¸²à¸ˆà¸°à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™');
}
function cashDrawerV2SaveCount(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  if(shift.openingCash===null||shift.openingCash===undefined){showToast('à¸à¸£à¸¸à¸“à¸²à¸à¸³à¸«à¸™à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸à¹ˆà¸­à¸™à¸™à¸±à¸šà¹€à¸‡à¸´à¸™','error');return}
  shift.counts=cashDrawerV2ReadCounts();shift.lastCountAt=new Date().toISOString();saveCashDrawerStore();cashDrawerV2Render();showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¸œà¸¥à¸à¸²à¸£à¸™à¸±à¸šà¹€à¸‡à¸´à¸™à¹à¸¥à¹‰à¸§');
}
function cashDrawerV2AddUse(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  const note=($('#drawer-v2-use-note')?.value||'').trim(),amount=Math.max(0,Number($('#drawer-v2-use-amount')?.value||0));
  if(!note||amount<=0){showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¹€à¸«à¸•à¸¸à¸œà¸¥à¹à¸¥à¸°à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸','error');return}
  if(amount>cashDrawerV2Expected(shift)){showToast('à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸à¸¡à¸²à¸à¸à¸§à¹ˆà¸²à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸„à¸§à¸£à¹€à¸«à¸¥à¸·à¸­','error');return}
  shift.cashUses=[...(shift.cashUses||[]),{note,amount,at:new Date().toISOString()}];saveCashDrawerStore();cashDrawerV2Render();showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸à¸žà¸£à¹‰à¸­à¸¡à¹€à¸«à¸•à¸¸à¸œà¸¥à¹à¸¥à¹‰à¸§');
}
function cashDrawerV2AddReturn(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  const fromShift=($('#drawer-v2-return-shift')?.value||'').trim(),note=($('#drawer-v2-return-note')?.value||'').trim(),amount=Math.max(0,Number($('#drawer-v2-return-amount')?.value||0));
  if(!fromShift||amount<=0){showToast('à¸à¸£à¸¸à¸“à¸²à¸£à¸°à¸šà¸¸à¸£à¸«à¸±à¸ªà¸à¸°à¸•à¹‰à¸™à¸—à¸²à¸‡à¹à¸¥à¸°à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸„à¸·à¸™','error');return}
  if(fromShift===shift.code){showToast('à¸à¸°à¸•à¹‰à¸™à¸—à¸²à¸‡à¸•à¹‰à¸­à¸‡à¹€à¸›à¹‡à¸™à¸à¸°à¸­à¸·à¹ˆà¸™','error');return}
  shift.cashReturns=[...(shift.cashReturns||[]),{fromShift,note,amount,at:new Date().toISOString()}];saveCashDrawerStore();cashDrawerV2Render();showToast('à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸„à¸·à¸™à¸ˆà¸²à¸à¸à¸°à¸­à¸·à¹ˆà¸™à¹à¸¥à¹‰à¸§');
}
function cashDrawerV2Close(){
  const shift=cashDrawerStore.activeShift;if(!shift)return;
  const name=($('#drawer-v2-close-name')?.value||'').trim()||shift.openedBy,counted=cashDrawerCountTotal(shift.counts||{}),expected=cashDrawerV2Expected(shift),difference=counted-expected;
  if(name!==shift.openedBy){showToast('à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸›à¸´à¸”à¸à¸°à¸•à¹‰à¸­à¸‡à¸•à¸£à¸‡à¸à¸±à¸šà¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°','error');return}
  if(shift.openingCash===null||shift.openingCash===undefined){showToast('à¸à¸£à¸¸à¸“à¸²à¸à¸³à¸«à¸™à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸à¸°','error');return}
  if(!shift.lastCountAt){showToast('à¸à¸£à¸¸à¸“à¸²à¸šà¸±à¸™à¸—à¸¶à¸à¸œà¸¥à¸à¸²à¸£à¸™à¸±à¸šà¹€à¸‡à¸´à¸™à¸à¹ˆà¸­à¸™à¸›à¸´à¸”à¸à¸°','error');return}
  if(difference!==0){showToast(`à¸¢à¸­à¸”à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¸£à¸‡à¸à¸±à¸™ ${difference<0?'-':''}${cashDrawerMoney(Math.abs(difference))} à¸à¸£à¸¸à¸“à¸²à¸•à¸£à¸§à¸ˆà¸™à¸±à¸šà¸«à¸£à¸·à¸­à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸/à¹€à¸‡à¸´à¸™à¸„à¸·à¸™`,'error');return}
  const closedAt=new Date().toISOString();cashDrawerStore.history.unshift({...shift,closedBy:name,closedAt,countedTotal:counted,difference});cashDrawerStore.history=cashDrawerStore.history.slice(0,100);cashDrawerStore.activeShift=null;saveCashDrawerStore();cashDrawerV2Render();showToast(`à¸›à¸´à¸”à¸à¸° ${shift.code} à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`);
}
function cashDrawerV2DeleteHistory(index){
  const item=cashDrawerStore.history[Number(index)];if(!item)return;
  openModal(`à¸¥à¸šà¸›à¸£à¸°à¸§à¸±à¸•à¸´ ${item.code}`,`<div class="history-edit-form"><p>à¸à¸²à¸£à¸¥à¸šà¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸•à¹‰à¸­à¸‡à¸¢à¸·à¸™à¸¢à¸±à¸™à¸­à¸µà¹€à¸¡à¸¥à¸«à¸±à¸§à¸«à¸™à¹‰à¸²</p><label>à¸­à¸µà¹€à¸¡à¸¥à¸«à¸±à¸§à¸«à¸™à¹‰à¸²<input id="drawer-v2-supervisor-email" type="email" placeholder="à¸«à¸±à¸§à¸«à¸™à¹‰à¸²@example.com" autocomplete="off"></label></div>`,`<button class="button button-outline" data-close-modal>à¸¢à¸à¹€à¸¥à¸´à¸</button><button class="button button-danger" data-cash-drawer-v2="confirm-delete-history" data-cash-history-index="${Number(index)}">à¸¢à¸·à¸™à¸¢à¸±à¸™à¸¥à¸š</button>`);
}
function cashDrawerV2ConfirmDelete(index){
  const email=($('#drawer-v2-supervisor-email')?.value||'').trim();
  if(!email||!email.includes('@')){showToast('à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸­à¸µà¹€à¸¡à¸¥à¸«à¸±à¸§à¸«à¸™à¹‰à¸²à¹ƒà¸«à¹‰à¸–à¸¹à¸à¸•à¹‰à¸­à¸‡','error');return}
  cashDrawerStore.history.splice(Number(index),1);saveCashDrawerStore();$('#modal-root').innerHTML='';cashDrawerV2Render();showToast('à¸¥à¸šà¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸•à¸²à¸¡à¸à¸²à¸£à¸¢à¸·à¸™à¸¢à¸±à¸™à¸‚à¸­à¸‡à¸«à¸±à¸§à¸«à¸™à¹‰à¸²à¹à¸¥à¹‰à¸§');
}
function installCashDrawerV2(){
  const view=$('#view-drawer');if(!view)return;
  cashDrawerV2Render();
  view.addEventListener('input',event=>{if(!event.target.matches('[data-cash-drawer-denom]'))return;const shift=cashDrawerStore.activeShift;if(!shift)return;const total=cashDrawerCountTotal(cashDrawerV2ReadCounts()),difference=total-cashDrawerV2Expected(shift);if($('#drawer-v2-counted-total'))$('#drawer-v2-counted-total').textContent=cashDrawerMoney(total);if($('#drawer-v2-difference')){$('#drawer-v2-difference').textContent=`${difference<0?'-':''}${cashDrawerMoney(Math.abs(difference))}`;$('#drawer-v2-difference').className=difference===0?'positive-text':'warning-text'}});
  view.addEventListener('click',event=>{const action=event.target.closest('[data-cash-drawer-v2]');if(!action)return;event.preventDefault();const type=action.dataset.cashDrawerV2;if(type==='open')cashDrawerV2Open();if(type==='set-opening')cashDrawerV2SetOpening();if(type==='save-count')cashDrawerV2SaveCount();if(type==='add-use')cashDrawerV2AddUse();if(type==='add-return')cashDrawerV2AddReturn();if(type==='remove-use'){cashDrawerStore.activeShift.cashUses.splice(Number(action.dataset.cashUseIndex),1);saveCashDrawerStore();cashDrawerV2Render()}if(type==='remove-return'){cashDrawerStore.activeShift.cashReturns.splice(Number(action.dataset.cashReturnIndex),1);saveCashDrawerStore();cashDrawerV2Render()}if(type==='close')cashDrawerV2Close();if(type==='delete-history')cashDrawerV2DeleteHistory(action.dataset.cashHistoryIndex)});
  document.addEventListener('click',event=>{const action=event.target.closest('[data-cash-drawer-v2="confirm-delete-history"]');if(action){event.preventDefault();cashDrawerV2ConfirmDelete(action.dataset.cashHistoryIndex)}});
}
document.addEventListener('DOMContentLoaded',installCashDrawerV2);

/* Final drawer form layout pass. The existing drawer handlers keep the same data attributes. */
cashDrawerV2Render=function(){
  const view=$('#view-drawer');if(!view)return;
  const shift=cashDrawerStore.activeShift,ready=Boolean(shift&&shift.openingCash!==null&&shift.openingCash!==undefined),expected=shift?cashDrawerV2Expected(shift):0,counted=shift?cashDrawerCountTotal(shift.counts||{}):0,difference=counted-expected;
  const navBadge=$('.nav-item[data-view="drawer"] .nav-badge');if(navBadge)navBadge.textContent=shift?'à¸à¸°à¹€à¸›à¸´à¸”':'à¸à¸°à¸›à¸´à¸”';
  const status=shift?'<span class="status-chip success large"><i></i> à¸à¸°à¹€à¸›à¸´à¸”à¸­à¸¢à¸¹à¹ˆ</span>':'<span class="status-chip neutral large">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸›à¸´à¸”à¸à¸°</span>';
  const uses=(shift?.cashUses||[]).reduce((sum,item)=>sum+Number(item.amount||0),0),returns=(shift?.cashReturns||[]).reduce((sum,item)=>sum+Number(item.amount||0),0);
  view.innerHTML=`<div class="page-heading compact"><div><p class="eyebrow">OPERATIONS / CASH DRAWER</p><h2>à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸à¹€à¸à¹‡à¸šà¹€à¸‡à¸´à¸™à¸—à¸­à¸™</h2><p class="muted">à¹€à¸‡à¸´à¸™à¸—à¸­à¸™à¹à¸¢à¸à¸ˆà¸²à¸à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰ Â· à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹ƒà¸Šà¹‰à¸£à¸«à¸±à¸ªà¸ˆà¸™à¸à¸§à¹ˆà¸²à¸ˆà¸°à¹€à¸Šà¸·à¹ˆà¸­à¸¡ Supabase</p></div>${status}</div><div class="drawer-grid"><article class="panel drawer-status"><div class="drawer-hero"><span class="drawer-circle"><span class="material-symbols-outlined">payments</span></span><div><small>${shift?'à¸à¸°à¸—à¸µà¹ˆà¸à¸³à¸¥à¸±à¸‡à¸”à¸³à¹€à¸™à¸´à¸™à¸à¸²à¸£':'à¸ªà¸–à¸²à¸™à¸°à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸'}</small><h3>${esc(shift?.code||'à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸«à¸±à¸ªà¸à¸°')}</h3><p>${shift?`à¹€à¸›à¸´à¸”à¹‚à¸”à¸¢ ${esc(shift.openedBy)} Â· ${esc(cashDrawerDateTime(shift.openedAt))}`:'à¹€à¸›à¸´à¸”à¸à¸°à¸”à¹‰à¸§à¸¢à¸Šà¸·à¹ˆà¸­à¹à¸¥à¸°à¸£à¸«à¸±à¸ªà¸‚à¸­à¸‡à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸š'}</p></div></div>${shift?`<div class="drawer-stat-grid"><div><small>à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™</small><strong>${ready?cashDrawerMoney(shift.openingCash):'à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸à¸³à¸«à¸™à¸”'}</strong></div><div><small>à¸™à¸³à¸­à¸­à¸à¹„à¸›à¹ƒà¸Šà¹‰</small><strong>${cashDrawerMoney(uses)}</strong></div><div><small>à¹€à¸‡à¸´à¸™à¸„à¸·à¸™à¸ˆà¸²à¸à¸à¸°à¸­à¸·à¹ˆà¸™</small><strong>${cashDrawerMoney(returns)}</strong></div><div><small>à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸„à¸§à¸£à¹€à¸«à¸¥à¸·à¸­</small><strong class="accent-text">${cashDrawerMoney(expected)}</strong></div></div><div class="drawer-opening-form"><strong>à¸à¸³à¸«à¸™à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸‚à¸­à¸‡à¸à¸°</strong><small>à¸à¸³à¸«à¸™à¸”à¸ˆà¸²à¸à¸«à¸™à¹‰à¸²à¸™à¸µà¹‰à¸«à¸¥à¸±à¸‡à¹€à¸›à¸´à¸”à¸à¸°à¹à¸¥à¹‰à¸§</small><label class="drawer-field"><span>à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™ (à¸šà¸²à¸—)</span><div class="drawer-opening-fields"><input id="drawer-v2-opening-cash" type="number" min="0" step="0.01" value="${ready?Number(shift.openingCash):''}" placeholder="à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™"><button class="button button-soft" data-cash-drawer-v2="set-opening">à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™</button></div></label></div><div class="drawer-close-auth"><strong>à¸›à¸´à¸”à¸à¸°à¹‚à¸”à¸¢à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™</strong><label class="drawer-field"><span>à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸›à¸´à¸”à¸à¸°</span><input id="drawer-v2-close-name" placeholder="à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°"></label><label class="drawer-field"><span>à¸£à¸«à¸±à¸ªà¹€à¸›à¸´à¸”à¸à¸° (à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¸£à¸§à¸ˆà¸ªà¸­à¸š)</span><input id="drawer-v2-close-code" type="password" inputmode="numeric" placeholder="à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸šà¸±à¸‡à¸„à¸±à¸šà¹ƒà¸Šà¹‰"></label><button class="button button-primary full-width" data-cash-drawer-v2="close"><span class="material-symbols-outlined">lock</span>à¸›à¸´à¸”à¸à¸°</button></div>`:`<div class="drawer-open-auth drawer-open-gate"><div class="drawer-gate-title"><span class="material-symbols-outlined">lock_open</span><div><strong>à¸à¸£à¸­à¸à¸Šà¸·à¹ˆà¸­à¹à¸¥à¸°à¸£à¸«à¸±à¸ªà¸à¹ˆà¸­à¸™à¹€à¸›à¸´à¸”à¸à¸°</strong><small>à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸šà¸à¹ˆà¸­à¸™à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸à¸° à¸£à¸°à¸šà¸šà¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸šà¸±à¸‡à¸„à¸±à¸šà¸•à¸£à¸§à¸ˆà¸£à¸«à¸±à¸ªà¸ˆà¸™à¸à¸§à¹ˆà¸²à¸ˆà¸°à¹€à¸Šà¸·à¹ˆà¸­à¸¡ Supabase</small></div></div><label class="drawer-field"><span>à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸°</span><input id="drawer-v2-open-name" placeholder="à¸¥à¸‡à¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸š" autocomplete="off"></label><label class="drawer-field"><span>à¸£à¸«à¸±à¸ªà¹€à¸›à¸´à¸”à¸à¸°</span><input id="drawer-v2-open-code" type="password" inputmode="numeric" placeholder="à¸•à¸±à¹‰à¸‡à¸£à¸«à¸±à¸ªà¸ªà¸³à¸«à¸£à¸±à¸šà¸›à¸´à¸”à¸à¸°à¸ à¸²à¸¢à¸«à¸¥à¸±à¸‡" autocomplete="new-password"></label><button class="button button-primary full-width" data-cash-drawer-v2="open"><span class="material-symbols-outlined">lock_open</span>à¹€à¸›à¸´à¸”à¸à¸°à¹à¸¥à¸°à¸ªà¸£à¹‰à¸²à¸‡à¸£à¸«à¸±à¸ªà¸à¸°</button></div>`}</article><article class="panel reconciliation"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">fact_check</span></span><h3>à¸•à¸£à¸§à¸ˆà¸™à¸±à¸šà¹€à¸‡à¸´à¸™à¹ƒà¸™à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸</h3></div><span class="status-chip ${!shift?'neutral':!ready?'warning':difference===0?'success':'warning'}">${!shift?'à¸£à¸­à¹€à¸›à¸´à¸”à¸à¸°':!ready?'à¸£à¸­à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™':difference===0?'à¸¢à¸­à¸”à¸•à¸£à¸‡à¸à¸±à¸™':'à¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸•à¹ˆà¸²à¸‡'}</span></div>${shift?`${!ready?'<div class="drawer-notice">à¸à¸£à¸¸à¸“à¸²à¸à¸³à¸«à¸™à¸”à¹€à¸‡à¸´à¸™à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸”à¹‰à¸²à¸™à¸‹à¹‰à¸²à¸¢à¸à¹ˆà¸­à¸™à¹€à¸£à¸´à¹ˆà¸¡à¸™à¸±à¸šà¹€à¸‡à¸´à¸™</div>':''}<div class="reconcile-row"><span>à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸„à¸§à¸£à¹€à¸«à¸¥à¸·à¸­</span><strong>${cashDrawerMoney(expected)}</strong></div><div class="cash-denomination-grid">${cashDrawerV2DenominationInputs(shift.counts,ready)}</div><div class="reconcile-row"><span>à¸™à¸±à¸šà¹„à¸”à¹‰à¸ˆà¸£à¸´à¸‡</span><strong id="drawer-v2-counted-total">${cashDrawerMoney(counted)}</strong></div><div class="reconcile-row difference"><span>à¸ªà¹ˆà¸§à¸™à¸•à¹ˆà¸²à¸‡</span><strong id="drawer-v2-difference" class="${difference===0?'positive-text':'warning-text'}">${difference<0?'-':''}${cashDrawerMoney(Math.abs(difference))}</strong></div><button class="button button-outline full-width" data-cash-drawer-v2="save-count" ${ready?'':'disabled'}>à¸šà¸±à¸™à¸—à¸¶à¸à¸œà¸¥à¸à¸²à¸£à¸™à¸±à¸š</button><div class="drawer-use-form"><strong>à¸à¸£à¸“à¸µà¸™à¸³à¹€à¸‡à¸´à¸™à¸­à¸­à¸à¹„à¸›à¹ƒà¸Šà¹‰</strong><small>à¸£à¸°à¸šà¸¸à¹€à¸«à¸•à¸¸à¸œà¸¥à¹à¸¥à¸°à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™ à¸£à¸°à¸šà¸šà¸ˆà¸°à¸«à¸±à¸à¸ˆà¸²à¸à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸„à¸§à¸£à¹€à¸«à¸¥à¸·à¸­</small><div class="drawer-use-fields"><label class="drawer-field"><span>à¹€à¸«à¸•à¸¸à¸œà¸¥ / à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸</span><textarea id="drawer-v2-use-note" rows="4" placeholder="à¸žà¸´à¸¡à¸žà¹Œà¹€à¸«à¸•à¸¸à¸œà¸¥ à¹€à¸Šà¹ˆà¸™ à¸‹à¸·à¹‰à¸­à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸ªà¸³à¸™à¸±à¸à¸‡à¸²à¸™ à¸«à¸£à¸·à¸­à¸ªà¸³à¸£à¸­à¸‡à¸ˆà¹ˆà¸²à¸¢à¸­à¸°à¹„à¸£"></textarea></label><label class="drawer-field"><span>à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™ (à¸šà¸²à¸—)</span><input id="drawer-v2-use-amount" type="number" min="0" step="0.01" placeholder="0.00"></label><button class="button button-soft" data-cash-drawer-v2="add-use" ${ready?'':'disabled'}>à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸™à¸³à¸­à¸­à¸</button></div>${(shift.cashUses||[]).length?`<div class="drawer-use-list">${shift.cashUses.map((item,index)=>`<div><span>${esc(item.note)}</span><strong>${cashDrawerMoney(item.amount)}</strong><button class="icon-button" data-cash-drawer-v2="remove-use" data-cash-use-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸™à¸³à¹€à¸‡à¸´à¸™à¸­à¸­à¸"><span class="material-symbols-outlined">delete</span></button></div>`).join('')}</div>`:''}</div><div class="drawer-use-form drawer-return-form"><strong>à¹€à¸‡à¸´à¸™à¸„à¸·à¸™à¸ˆà¸²à¸à¸à¸°à¸­à¸·à¹ˆà¸™</strong><small>à¹€à¸•à¸´à¸¡à¹€à¸‡à¸´à¸™à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸²à¸¥à¸´à¹‰à¸™à¸Šà¸±à¸ à¹‚à¸”à¸¢à¸£à¸°à¸šà¸¸à¸§à¹ˆà¸²à¸„à¸·à¸™à¸¡à¸²à¸ˆà¸²à¸à¸à¸°à¹„à¸«à¸™</small><div class="drawer-return-fields"><label class="drawer-field"><span>à¸£à¸«à¸±à¸ªà¸à¸°à¸•à¹‰à¸™à¸—à¸²à¸‡</span><input id="drawer-v2-return-shift" placeholder="SHIFT-..." /></label><label class="drawer-field"><span>à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡</span><input id="drawer-v2-return-note" placeholder="à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸à¸²à¸£à¸„à¸·à¸™à¹€à¸‡à¸´à¸™" /></label><label class="drawer-field"><span>à¸¢à¸­à¸”à¹€à¸‡à¸´à¸™ (à¸šà¸²à¸—)</span><input id="drawer-v2-return-amount" type="number" min="0" step="0.01" placeholder="0.00"></label><button class="button button-soft" data-cash-drawer-v2="add-return" ${ready?'':'disabled'}>à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸‡à¸´à¸™à¸„à¸·à¸™</button></div>${(shift.cashReturns||[]).length?`<div class="drawer-use-list">${shift.cashReturns.map((item,index)=>`<div><span>à¸„à¸·à¸™à¸ˆà¸²à¸ ${esc(item.fromShift)}${item.note?` Â· ${esc(item.note)}`:''}</span><strong>${cashDrawerMoney(item.amount)}</strong><button class="icon-button" data-cash-drawer-v2="remove-return" data-cash-return-index="${index}" aria-label="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¹€à¸‡à¸´à¸™à¸„à¸·à¸™"><span class="material-symbols-outlined">delete</span></button></div>`).join('')}</div>`:''}</div>`:'<div class="empty-state"><span class="material-symbols-outlined">point_of_sale</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸­à¸šà¹ƒà¸«à¹‰à¸•à¸£à¸§à¸ˆà¸™à¸±à¸š</p><small>à¹€à¸›à¸´à¸”à¸à¸°à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸ˆà¸¶à¸‡à¸™à¸±à¸šà¹€à¸«à¸£à¸µà¸¢à¸à¹à¸¥à¸°à¸˜à¸™à¸šà¸±à¸•à¸£</small></div>'}</article></div><article class="panel"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">history</span></span><h3>à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸›à¸´à¸”â€“à¸›à¸´à¸”à¸à¸°</h3></div><span class="count-chip">${cashDrawerStore.history.length} à¸£à¸­à¸š</span></div>${cashDrawerStore.history.length?`<div class="table-wrap"><table class="cash-drawer-history"><thead><tr><th>à¸£à¸«à¸±à¸ªà¸à¸°</th><th>à¸œà¸¹à¹‰à¹€à¸›à¸´à¸”à¸à¸° / à¹€à¸§à¸¥à¸²</th><th>à¸œà¸¹à¹‰à¸›à¸´à¸”à¸à¸° / à¹€à¸§à¸¥à¸²</th><th class="align-right">à¸¢à¸­à¸”à¹€à¸£à¸´à¹ˆà¸¡</th><th class="align-right">à¸¢à¸­à¸”à¸›à¸´à¸”à¸ˆà¸£à¸´à¸‡</th><th class="align-right">à¸ªà¹ˆà¸§à¸™à¸•à¹ˆà¸²à¸‡</th><th></th></tr></thead><tbody>${cashDrawerStore.history.map((item,index)=>`<tr><td class="mono">${esc(item.code)}</td><td><strong>${esc(item.openedBy)}</strong><small class="table-subtext">${esc(cashDrawerDateTime(item.openedAt))}</small></td><td><strong>${esc(item.closedBy||'-')}</strong><small class="table-subtext">${esc(cashDrawerDateTime(item.closedAt))}</small></td><td class="align-right">${cashDrawerMoney(item.openingCash)}</td><td class="align-right">${cashDrawerMoney(item.countedTotal)}</td><td class="align-right ${Number(item.difference||0)===0?'positive-text':'warning-text'}">${Number(item.difference||0)<0?'-':''}${cashDrawerMoney(Math.abs(Number(item.difference||0)))}</td><td><button class="button button-danger action-small" data-cash-drawer-v2="delete-history" data-cash-history-index="${index}"><span class="material-symbols-outlined">delete</span>à¸¥à¸š</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state"><span class="material-symbols-outlined">history</span><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸à¸²à¸£à¹€à¸›à¸´à¸”â€“à¸›à¸´à¸”à¸à¸°</p><small>à¸›à¸£à¸°à¸§à¸±à¸•à¸´à¸ˆà¸°à¸–à¸¹à¸à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸¡à¸·à¹ˆà¸­à¸›à¸´à¸”à¸à¸°à¸ªà¸³à¹€à¸£à¹‡à¸ˆ</small></div>'}</article>`;
};
const cashDrawerV2RenderBase=cashDrawerV2Render;
cashDrawerV2Render=function(){
  cashDrawerV2RenderBase();
  const note=$('#drawer-v2-use-note');
  if(note&&note.tagName==='TEXTAREA'){
    const input=document.createElement('input');
    input.id=note.id;
    input.type='text';
    input.placeholder=note.placeholder;
    input.autocomplete='off';
    input.className=note.className;
    input.setAttribute('aria-label','à¹€à¸«à¸•à¸¸à¸œà¸¥ / à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸');
    note.replaceWith(input);
  }
  const fields=$('#drawer-v2-use-note')?.closest('.drawer-use-fields');
  const amountField=$('#drawer-v2-use-amount')?.closest('.drawer-field');
  const saveButton=fields?.querySelector('[data-cash-drawer-v2="add-use"]');
  if(fields&&amountField&&saveButton&&!fields.querySelector('.amount-action-row')){
    const row=document.createElement('div');
    row.className='amount-action-row';
    amountField.classList.add('amount-field');
    row.append(amountField,saveButton);
    fields.append(row);
  }
};
cashDrawerV2Open=function(){
  const name=($('#drawer-v2-open-name')?.value||'').trim()||'à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¸Šà¸·à¹ˆà¸­',openCode=($('#drawer-v2-open-code')?.value||'').trim();
  const openingCash=Number.isFinite(Number(cashDrawerStore.openingCashDefault))?Number(cashDrawerStore.openingCashDefault):null;
  cashDrawerStore.activeShift={code:cashDrawerShiftCode(),openedBy:name,openCode,openedAt:new Date().toISOString(),openingCash,cashUses:[],cashReturns:[],counts:{},lastCountAt:null};
  saveCashDrawerStore();cashDrawerV2Render();showToast(`à¹€à¸›à¸´à¸”à¸à¸° ${cashDrawerStore.activeShift.code} à¸ªà¸³à¹€à¸£à¹‡à¸ˆ`);
};

function buildInvoiceWorkspace(){
  const view=$('#view-invoice');
  if(!view)return;
  const villaMarkup=[...new Map(villaOptions.filter(v=>v?.name).map(v=>[v.name,v])).values()].map(v=>`<option value="${esc(v.name)}">${esc(v.name)}</option>`).join('');
  const categoryOptions=items=>[...new Set(items.map(item=>cleanEnglishText(item.category)).filter(Boolean))].map(category=>`<option value="${esc(category)}">${esc(category)}</option>`).join('');
  const aOptions=accommodationItems.map((item,index)=>`<option value="${index}">${esc(item.name)}</option>`).join('');
  const bOptions=addonItems.map((item,index)=>`<option value="${index}">${esc(item.name)}</option>`).join('');
  view.innerHTML=`
    <div class="page-heading compact"><div><p class="eyebrow">TRANSACTION / INFORMATION BILL</p><h2>à¸ªà¸£à¹‰à¸²à¸‡à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</h2><p class="muted">à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹ƒà¸™à¸«à¸™à¹‰à¸²à¹à¸£à¸ à¹à¸¥à¹‰à¸§à¸•à¸£à¸§à¸ˆà¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¸ˆà¸²à¸à¹à¸šà¸šà¸Ÿà¸­à¸£à¹Œà¸¡ INFO BILL à¹ƒà¸™à¸«à¸™à¹‰à¸²à¸—à¸µà¹ˆà¸ªà¸­à¸‡</p></div><div class="heading-actions"><span class="save-state"><span class="material-symbols-outlined">sync</span>à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸à¸±à¸™à¸­à¸±à¸•à¹‚à¸™à¸¡à¸±à¸•à¸´</span><button class="button button-outline" id="reset-invoice" type="button"><span class="material-symbols-outlined">refresh</span>à¹€à¸£à¸´à¹ˆà¸¡à¹ƒà¸«à¸¡à¹ˆ</button></div></div>
    <div class="invoice-page-tabs" role="tablist"><button class="invoice-page-tab active" type="button" data-invoice-page="form"><span>01</span><strong>à¸«à¸™à¹‰à¸²à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥</strong><small>à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸œà¸¹à¹‰à¹€à¸‚à¹‰à¸²à¸žà¸±à¸à¹à¸¥à¸°à¸£à¸²à¸¢à¸à¸²à¸£</small></button><button class="invoice-page-tab" type="button" data-invoice-page="preview"><span>02</span><strong>à¸«à¸™à¹‰à¸²à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</strong><small>à¸žà¸£à¸µà¸§à¸´à¸§à¸•à¸²à¸¡à¹à¸šà¸š INFO BILL</small></button></div>
    <section class="invoice-page active" data-invoice-page="form"><div class="invoice-entry-layout"><form class="invoice-entry-main" id="invoice-entry-form">
      <article class="panel invoice-entry-card"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">badge</span></span><h3>à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸™à¸«à¸±à¸§à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</h3></div><span class="required-note">* à¸ˆà¸³à¹€à¸›à¹‡à¸™</span></div><div class="form-grid three"><label>Reference No. <input id="folio" value="" placeholder="à¸à¸£à¸­à¸à¹€à¸¥à¸‚à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡" required></label><label class="span-two">Guest Name <input id="customer" value="" placeholder="à¸à¸£à¸­à¸à¸Šà¸·à¹ˆà¸­à¸¥à¸¹à¸à¸„à¹‰à¸²" required></label><label>Check-in Date <input id="check-in" type="date"></label><label>Check-out Date <input id="check-out" type="date"></label><label>No. Of Night <input id="no-of-night" type="number" min="0" value="" placeholder="à¸ˆà¸³à¸™à¸§à¸™à¸„à¸·à¸™"></label><label>Remark <input id="remark" value="" placeholder="à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸"></label><label>à¸§à¸±à¸™à¸—à¸µà¹ˆà¸—à¸³à¹€à¸­à¸à¸ªà¸²à¸£ <input id="doc-date" type="date"></label><label class="span-two">Villa / Room <select id="villa"><option value="">à¹€à¸¥à¸·à¸­à¸ Villa / Room</option>${villaMarkup}</select></label></div></article>
      <article class="panel invoice-entry-card invoice-lines-card"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">list_alt</span></span><h3>à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</h3></div><span class="required-note">à¹€à¸¥à¸·à¸­à¸à¸¥à¸³à¸”à¸±à¸š à¸«à¸¡à¸§à¸” â†’ à¸£à¸²à¸¢à¸à¸²à¸£</span></div>
        <div class="invoice-add-grid"><div class="invoice-add-box"><h4>Accommodation &amp; Inclusive Package</h4><div class="invoice-add-fields category-first-fields"><select id="accommodation-category" class="invoice-category-select"><option value="">à¹€à¸¥à¸·à¸­à¸à¸«à¸¡à¸§à¸”</option>${categoryOptions(accommodationItems)}</select><select id="accommodation-select" disabled><option value="">à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™à¸«à¸¡à¸§à¸”</option>${aOptions}</select><input id="accommodation-rate" type="number" min="0" step="0.01" placeholder="Rate"><input id="accommodation-qty" type="number" min="1" value="1" placeholder="à¸ˆà¸³à¸™à¸§à¸™" aria-label="à¸ˆà¸³à¸™à¸§à¸™ Accommodation"><button class="button button-primary" id="add-accommodation" type="button"><span class="material-symbols-outlined">add</span>à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£</button></div></div>
        <div class="invoice-add-box"><h4>Food and Beverages (add-on) and Other Expenses</h4><div class="invoice-add-fields category-first-fields"><select id="addon-category" class="invoice-category-select"><option value="">à¹€à¸¥à¸·à¸­à¸à¸«à¸¡à¸§à¸”</option>${categoryOptions(addonItems)}</select><select id="addon-select" disabled><option value="">à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™à¸«à¸¡à¸§à¸”</option>${bOptions}</select><input id="addon-rate" type="number" min="0" step="0.01" placeholder="Rate"><input id="addon-qty" type="number" min="1" value="1" placeholder="à¸ˆà¸³à¸™à¸§à¸™" aria-label="à¸ˆà¸³à¸™à¸§à¸™à¸„à¹ˆà¸²à¹ƒà¸Šà¹‰à¸ˆà¹ˆà¸²à¸¢à¸—à¸±à¹ˆà¸§à¹„à¸›"><button class="button button-primary" id="add-addon" type="button"><span class="material-symbols-outlined">add</span>à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£</button></div></div></div>
        <section class="invoice-line-group"><div class="line-group-heading"><strong>Accommodation &amp; Inclusive Package</strong><small>à¸£à¸²à¸¢à¸à¸²à¸£à¸„à¹ˆà¸²à¸šà¹‰à¸²à¸™à¹à¸¥à¸° Inclusive à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”</small></div><div class="table-wrap"><table><thead><tr><th>à¸«à¸¡à¸§à¸”</th><th>à¸£à¸²à¸¢à¸à¸²à¸£</th><th class="align-center">à¸ˆà¸³à¸™à¸§à¸™</th><th class="align-right">Rate</th><th>à¸ªà¹ˆà¸§à¸™à¸¥à¸”</th><th class="align-right">à¸¢à¸­à¸”à¸£à¸§à¸¡</th><th></th></tr></thead><tbody id="form-accommodation-lines"></tbody></table><div id="accommodation-empty" class="empty-state"><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£</p></div></div></section>
        <section class="invoice-line-group"><div class="line-group-heading"><strong>Food and Beverages (add-on) and Other Expenses</strong><small>à¸£à¸²à¸¢à¸à¸²à¸£à¸„à¹ˆà¸²à¹ƒà¸Šà¹‰à¸ˆà¹ˆà¸²à¸¢à¸—à¸±à¹ˆà¸§à¹„à¸›à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”</small></div><div class="table-wrap"><table><thead><tr><th>à¸«à¸¡à¸§à¸”</th><th>à¸£à¸²à¸¢à¸à¸²à¸£</th><th class="align-center">à¸ˆà¸³à¸™à¸§à¸™</th><th class="align-right">Rate</th><th>à¸ªà¹ˆà¸§à¸™à¸¥à¸”</th><th class="align-right">à¸¢à¸­à¸”à¸£à¸§à¸¡</th><th></th></tr></thead><tbody id="form-addon-lines"></tbody></table><div id="addon-empty" class="empty-state"><p>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£</p></div></div></section>
        <section class="invoice-adjustments"><div class="line-group-heading"><strong>à¸¢à¸­à¸”à¸›à¸£à¸±à¸šà¹à¸¥à¸°à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™</strong><small>Deposit à¸ˆà¸°à¸£à¸§à¸¡à¸ˆà¸²à¸à¸£à¸²à¸¢à¸à¸²à¸£à¸Šà¸³à¸£à¸°à¸”à¹‰à¸²à¸™à¸¥à¹ˆà¸²à¸‡</small></div><div class="form-grid three compact-grid"><label>à¸£à¸¹à¸›à¹à¸šà¸šà¸ªà¹ˆà¸§à¸™à¸¥à¸” <select id="discount-scope"><option value="line">à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¸•à¸²à¸¡à¸£à¸²à¸¢à¸à¸²à¸£</option><option value="all">à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥</option><option value="none">à¹„à¸¡à¹ˆà¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸¥à¸”</option></select></label><label>à¸ªà¹ˆà¸§à¸™à¸¥à¸”à¸—à¸±à¹‰à¸‡à¸šà¸´à¸¥ <select id="discount-all-rate">${discountRateOptions(0)}</select></label><label>à¸žà¸™à¸±à¸à¸‡à¸²à¸™ <select id="cashier"><option value="">à¹€à¸¥à¸·à¸­à¸à¸žà¸™à¸±à¸à¸‡à¸²à¸™</option><option>Now Narit</option><option>Mhew Kusu</option><option>Nattaya Phung</option><option>Nummim</option><option>Ple Theresa</option></select></label></div><div class="payment-entry"><select id="payment-method"><option value="à¹€à¸‡à¸´à¸™à¸ªà¸”">à¹€à¸‡à¸´à¸™à¸ªà¸”</option><option value="à¸šà¸±à¸•à¸£à¹€à¸„à¸£à¸”à¸´à¸•">à¸šà¸±à¸•à¸£à¹€à¸„à¸£à¸”à¸´à¸•</option><option value="QR Code">QR Code</option><option value="à¹‚à¸­à¸™à¹€à¸‡à¸´à¸™ SC">à¹‚à¸­à¸™à¹€à¸‡à¸´à¸™ SC</option></select><input id="payment-amount" type="number" min="0" placeholder="à¸ˆà¸³à¸™à¸§à¸™à¹€à¸‡à¸´à¸™à¸—à¸µà¹ˆà¸£à¸±à¸š"><button class="button button-outline" id="add-payment" type="button"><span class="material-symbols-outlined">add</span>à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¸Šà¸³à¸£à¸°</button></div><div id="payment-list" class="payment-list"></div></section>
      </article>
    </form><aside class="invoice-entry-side"><article class="panel live-summary"><span class="status-chip draft">DRAFT</span><h3>à¸ªà¸£à¸¸à¸›à¸¢à¸­à¸”à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</h3><p>à¹€à¸¥à¸·à¸­à¸à¸«à¸¡à¸§à¸”à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¹€à¸¥à¸·à¸­à¸à¸ªà¸´à¸™à¸„à¹‰à¸²à¸—à¸µà¹ˆà¸­à¸¢à¸¹à¹ˆà¹ƒà¸™à¸«à¸¡à¸§à¸”à¸™à¸±à¹‰à¸™</p><div class="live-summary-row"><span>Total</span><strong id="summary-total">à¸¿0.00</strong></div><div class="live-summary-row"><span>Deposit</span><strong id="summary-deposit">à¸¿0.00</strong></div><div class="live-summary-row"><span>Discount</span><strong id="summary-discount">à¸¿0.00</strong></div><div class="live-summary-row outstanding"><span>Outstanding</span><strong id="summary-outstanding">à¸¿0.00</strong></div><button class="button button-primary full-width" type="button" data-invoice-page="preview"><span class="material-symbols-outlined">visibility</span>à¸”à¸¹à¸«à¸™à¹‰à¸²à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</button></article></aside></div></section>
    <section class="invoice-page" data-invoice-page="preview"><div class="preview-toolbar"><div><strong>à¸«à¸™à¹‰à¸²à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰</strong><span>à¹à¸šà¸šà¸Ÿà¸­à¸£à¹Œà¸¡à¸­à¸´à¸‡à¸ˆà¸²à¸ INFO BILL.pdf</span></div><div><button class="button button-outline" type="button" data-invoice-page="form"><span class="material-symbols-outlined">edit</span>à¸à¸¥à¸±à¸šà¹„à¸›à¹à¸à¹‰à¹„à¸‚à¸‚à¹‰à¸­à¸¡à¸¹à¸¥</button><button class="button button-outline" type="button" id="export-pdf"><span class="material-symbols-outlined">picture_as_pdf</span>à¸ªà¹ˆà¸‡à¸­à¸­à¸ PDF</button><button class="button button-primary" type="button" id="close-invoice"><span class="material-symbols-outlined">task_alt</span>à¸›à¸´à¸”à¸¢à¸­à¸”à¹à¸¥à¸°à¹€à¸à¹‡à¸šà¸«à¸¥à¸±à¸à¸à¸²à¸™</button></div></div><div class="invoice-preview-stage"><article class="invoice-preview-sheet" id="invoice-preview-sheet"><header class="preview-header"><div class="preview-company"><img src="346973899_1639269593246469_4301917493848559029_n.jpg" alt="The Scenery"><div><p>234 Moo 7, Suan Phueng</p><p>Ratchabuti 70180</p><p>Tel : +66 81 000 7070</p><p>Fax : +66 32 206 370</p><p>www.sceneryvintagefarm.com</p></div></div><div class="preview-title"><h1>INFORMATION<br>BILL</h1><div><span>Invoice No</span><strong id="preview-reference"></strong></div><div><span>Date</span><strong id="preview-invoice-date"></strong></div></div></header><div class="preview-meta"><div><span>Reference No.</span><strong id="preview-reference-meta"></strong></div><div class="guest-meta"><span>Guest Name</span><strong id="preview-customer"></strong></div><div><span>Check-in Date</span><strong id="preview-check-in"></strong></div><div><span>Check-out Date</span><strong id="preview-check-out"></strong></div><div><span>No. Of Night</span><strong id="preview-nights"></strong></div><div><span>Remark</span><strong id="preview-remark"></strong></div></div><div class="preview-table-wrap"><table class="invoice-preview-table"><thead><tr><th>Category</th><th>QTY</th><th>Description</th><th>Rate<br>(per total QTY)</th><th>Deposit</th><th>Discount</th><th>Total THB</th></tr></thead><tbody id="preview-invoice-lines"></tbody></table></div><footer class="preview-footer"><div class="preview-agreement">I agree that my liability for this bill is not waived and agree to be held personally liable in the event that the indicated person, company or association fails to pay for any part of the full amount of these charges.<div class="signature-row"><span>Guest Signature</span><span>Receptionist</span></div></div><div class="preview-totals"><div><span>Total</span><strong id="preview-total">à¸¿0.00</strong></div><div><span>Deposit</span><strong id="preview-deposit">à¸¿0.00</strong></div><div><span>Discount</span><strong id="preview-discount">à¸¿0.00</strong></div><div class="total-outstanding"><span>Outstanding</span><strong id="preview-outstanding">à¸¿0.00</strong></div><small>THAI BAHT</small></div></footer></article></div></section>`;
  setInvoicePage('form');
}

/* Invoice item flow: category first, then only the items in that category. */
function installInvoiceCategoryFirstSelection(){
  const configs=[
    {type:'accommodation',categoryId:'accommodation-category',selectId:'accommodation-select',rateId:'accommodation-rate',qtyId:'accommodation-qty',items:accommodationItems},
    {type:'addon',categoryId:'addon-category',selectId:'addon-select',rateId:'addon-rate',qtyId:'addon-qty',items:addonItems}
  ];
  configs.forEach(config=>{
    const categoryEl=$(`#${config.categoryId}`),select=$(`#${config.selectId}`),rateEl=$(`#${config.rateId}`),qtyEl=$(`#${config.qtyId}`);
    if(!categoryEl||!select||select.dataset.categoryFirstReady)return;
    select.dataset.categoryFirstReady='true';
    document.querySelectorAll(`#${config.type}-search, #${config.type}-options`).forEach(element=>element.remove());
    select.hidden=false;
    const renderItems=()=>{
      const category=categoryEl.value;
      const matches=config.items.map((item,index)=>({item,index})).filter(({item})=>cleanEnglishText(item.category)===category);
      select.innerHTML=`<option value="">${category?'à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™à¸«à¸¡à¸§à¸”à¸™à¸µà¹‰':'à¹€à¸¥à¸·à¸­à¸à¸«à¸¡à¸§à¸”à¸à¹ˆà¸­à¸™'}</option>${matches.map(({item,index})=>`<option value="${index}">${esc(item.name)}</option>`).join('')}`;
      select.disabled=!category||!matches.length;
      if(rateEl)rateEl.value='';
    };
    categoryEl.addEventListener('change',renderItems);
    select.addEventListener('change',()=>fillRate(config.type));
    renderItems();
  });
  addLine=function(type){
    const config=configs.find(item=>item.type===type),categoryEl=$(`#${config.categoryId}`),select=$(`#${config.selectId}`),rateEl=$(`#${config.rateId}`),qtyEl=$(`#${config.qtyId}`),item=select?.value===''?null:config.items[Number(select?.value)];
    if(!categoryEl?.value){showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸«à¸¡à¸§à¸”à¸à¹ˆà¸­à¸™à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£','error');return}
    if(!item){showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™à¸«à¸¡à¸§à¸”à¸à¹ˆà¸­à¸™à¹€à¸žà¸´à¹ˆà¸¡','error');return}
    state.invoiceLines.push({type,name:item.name,category:cleanEnglishText(item.category),sourceIndex:Number(select.value),rate:Math.max(0,Number(rateEl?.value||item.rate||0)),deposit:0,depositMethod:'à¹€à¸‡à¸´à¸™à¸ªà¸”',qty:Math.max(1,Number(qtyEl?.value||1)),discountRate:0,discountAmount:0,pendingCollection:0,pendingNote:''});
    categoryEl.value='';
    select.innerHTML='<option value="">à¹€à¸¥à¸·à¸­à¸à¸«à¸¡à¸§à¸”à¸à¹ˆà¸­à¸™</option>';
    select.value='';
    select.disabled=true;
    if(rateEl)rateEl.value='';
    if(qtyEl)qtyEl.value='1';
    renderFormLines();
    if(typeof calculateInvoice==='function')calculateInvoice();
    showToast(`à¹€à¸žà¸´à¹ˆà¸¡ ${item.name} à¸¥à¸‡à¹ƒà¸™à¹ƒà¸šà¹à¸ˆà¹‰à¸‡à¸«à¸™à¸µà¹‰à¹à¸¥à¹‰à¸§`);
  };
}
document.addEventListener('DOMContentLoaded',installInvoiceCategoryFirstSelection);
document.addEventListener('click',event=>{
  if(!event.target.closest?.('#reset-invoice'))return;
  setTimeout(()=>['accommodation','addon'].forEach(type=>{
    const categoryEl=$(`#${type}-category`);
    if(categoryEl){categoryEl.value='';categoryEl.dispatchEvent(new Event('change',{bubbles:true}))}
  }),0);
});

/* Source workbook dictionary for Close Round and the system/data pages. */
const CLOSE_ROUND_SOURCE_DATE='2026-04-22';
const CLOSE_ROUND_SOURCE_VILLAS=[
  '02 Pangola','03 Hamata','04 Barbados','05 Merino','06 Corriedale','07 Katahdin',
  '08 Mulato','010 Napier','011 Setaria','012 Alfalfa','013 Rapunzel'
];
const CLOSE_ROUND_SOURCE_GROUPS=[
  ['Aâ€“E','à¸Šà¸·à¹ˆà¸­à¸§à¸´à¸¥à¸¥à¹ˆà¸², à¸£à¸«à¸±à¸ª, à¸Šà¸·à¹ˆà¸­à¸¥à¸¹à¸à¸„à¹‰à¸², In, Out','à¸•à¸±à¸§à¸•à¸™à¸‚à¸­à¸‡à¸œà¸¹à¹‰à¹€à¸‚à¹‰à¸²à¸žà¸±à¸à¹à¸¥à¸°à¸Šà¹ˆà¸§à¸‡à¹€à¸‚à¹‰à¸²à¸žà¸±à¸'],
  ['Fâ€“P','à¸„à¹ˆà¸²à¸§à¸´à¸¥à¸¥à¹ˆà¸², à¸—à¸µà¹ˆà¸™à¸­à¸™à¹€à¸ªà¸£à¸´à¸¡, à¸­à¸²à¸«à¸²à¸£, à¸¡à¸´à¸™à¸´à¸šà¸²à¸£à¹Œ, HT/SHT, à¸à¸´à¸ˆà¸à¸£à¸£à¸¡à¸Šà¸¡à¸ªà¸¸à¸™à¸±à¸‚ (92), à¸„à¹ˆà¸²à¸™à¸§à¸” (0), à¸ªà¸´à¸™à¸„à¹‰à¸² (0), ATV (0), à¸Šà¸²à¸£à¹Œà¸ˆ EV (0), à¸­à¸·à¹ˆà¸™ à¹†','à¸«à¸¡à¸§à¸”à¸£à¸²à¸¢à¹„à¸”à¹‰à¸ˆà¸²à¸à¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™ Invoice'],
  ['Qâ€“S','à¸¢à¸­à¸”à¸£à¸§à¸¡, à¸Šà¸³à¸£à¸°à¸¥à¹ˆà¸§à¸‡à¸«à¸™à¹‰à¸² / Deposit, à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­à¸¢à¸­à¸”à¸Šà¸³à¸£à¸°','à¸¢à¸­à¸”à¸£à¸§à¸¡à¹à¸¥à¸°à¸¢à¸­à¸”à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸•à¸´à¸”à¸•à¸²à¸¡'],
  ['Tâ€“AA','à¹€à¸‡à¸´à¸™à¸ªà¸”, à¸šà¸±à¸•à¸£à¹€à¸„à¸£à¸”à¸´à¸•, QR Code, à¹‚à¸­à¸™à¹€à¸‡à¸´à¸™ SC, à¸£à¸±à¸ 50%, à¸¥à¸¹à¸à¸„à¹‰à¸²à¸—à¸—à¸—., à¹„à¸¡à¹ˆà¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š, à¸„à¹‰à¸²à¸‡à¸Šà¸³à¸£à¸°','à¸£à¸²à¸¢à¹„à¸”à¹‰à¸«à¸™à¹‰à¸² Front à¹à¸¥à¸°à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸£à¸±à¸šà¸Šà¸³à¸£à¸°'],
  ['AB','à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸','à¹€à¸«à¸•à¸¸à¸œà¸¥/à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡à¸‚à¸­à¸‡à¸£à¸²à¸¢à¸à¸²à¸£']
];
function closeRoundSourceTemplateRows(){
  return CLOSE_ROUND_SOURCE_VILLAS.map(villa=>`<tr><td><strong>${esc(villa)}</strong></td><td class="mono">-</td><td class="align-right">-</td><td class="align-right">-</td><td class="align-right">-</td><td>-</td></tr>`).join('');
}
function renderCloseRoundSourceTemplate(){
  const view=$('#view-close-round');
  if(!view)return;
  const reportHeading=view.querySelector('.page-heading h2');
  if(reportHeading)reportHeading.textContent='à¸£à¸²à¸¢à¸‡à¸²à¸™à¸›à¸´à¸”à¸£à¸­à¸šà¸›à¸£à¸°à¸ˆà¸³à¸§à¸±à¸™à¸‚à¸­à¸‡à¹€à¸”à¸­à¸°à¸‹à¸µà¸™à¹€à¸™à¸­à¸£à¸µà¹ˆ à¸£à¸µà¸ªà¸­à¸£à¹Œà¸—';
  const reportDate=view.querySelector('#close-round-date')?.value,reportSubtitle=view.querySelector('.page-heading .muted');
  if(reportSubtitle)reportSubtitle.textContent=`à¸§à¸±à¸™à¸—à¸µà¹ˆà¸—à¸³à¹€à¸­à¸à¸ªà¸²à¸£: ${reportDate||'-'} Â· à¸”à¸¶à¸‡à¹€à¸‰à¸žà¸²à¸° Invoice à¸—à¸µà¹ˆ Finalized à¹à¸¥à¹‰à¸§`;
  view.querySelector('#close-round-source-template')?.remove();
  return;
  let panel=$('#close-round-source-template');
  if(!panel){
    panel=document.createElement('article');
    panel.id='close-round-source-template';
    panel.className='panel close-round-source-template';
    const detail=view.querySelector('.close-round-detail-panel');
    (detail||view.lastElementChild)?.before(panel);
  }
  panel.innerHTML=`<div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">dataset</span></span><div><h3>à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸§à¸´à¸¥à¸¥à¹ˆà¸²à¸•à¸²à¸¡à¹„à¸Ÿà¸¥à¹Œà¸•à¹‰à¸™à¸—à¸²à¸‡</h3><small class="muted">à¸Šà¸µà¸• à¸ªà¸³à¹€à¸™à¸²à¸‚à¸­à¸‡ 22 Â· à¹à¸–à¸§à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ 5â€“15 Â· A2 Serial Date 46134.0 = 22 à¹€à¸¡.à¸¢. 2569</small></div></div><span class="count-chip">${CLOSE_ROUND_SOURCE_VILLAS.length} Villa</span></div><p class="close-round-template-note">à¸£à¸²à¸¢à¸à¸²à¸£à¸”à¹‰à¸²à¸™à¸¥à¹ˆà¸²à¸‡à¹€à¸›à¹‡à¸™à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸ˆà¸²à¸ <strong>à¸«à¸™à¹‰à¸²à¸›à¸´à¸”à¸£à¸­à¸š.xlsx</strong> à¸„à¹ˆà¸²à¸—à¸²à¸‡à¸à¸²à¸£à¹€à¸‡à¸´à¸™à¹€à¸›à¹‡à¸™ 0 à¸•à¸²à¸¡à¹„à¸Ÿà¸¥à¹Œà¸•à¹‰à¸™à¸‰à¸šà¸±à¸š à¹à¸¥à¸°à¸ˆà¸°à¸–à¸¹à¸à¹à¸—à¸™à¸”à¹‰à¸§à¸¢à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ Invoice à¸—à¸µà¹ˆ Finalized à¹€à¸¡à¸·à¹ˆà¸­à¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£à¸ˆà¸£à¸´à¸‡</p><div class="table-wrap"><table class="close-round-template-table"><thead><tr><th>à¸Šà¸·à¹ˆà¸­à¸§à¸´à¸¥à¸¥à¹ˆà¸²</th><th>à¸£à¸«à¸±à¸ª</th><th class="align-right">à¸¢à¸­à¸”à¸£à¸§à¸¡ Q</th><th class="align-right">Deposit R</th><th class="align-right">à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­ S</th><th>à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸ AB</th></tr></thead><tbody>${closeRoundSourceTemplateRows()}</tbody></table></div>`;
  const sourceNote=view.querySelector('.close-round-source-note small');
  if(sourceNote)sourceNote.textContent='à¸•à¹‰à¸™à¸—à¸²à¸‡: à¸«à¸™à¹‰à¸²à¸›à¸´à¸”à¸£à¸­à¸š.xlsx Â· à¸Šà¸µà¸• à¸ªà¸³à¹€à¸™à¸²à¸‚à¸­à¸‡ 22 Â· à¸£à¸²à¸¢à¸‡à¸²à¸™à¸§à¸±à¸™à¸—à¸µà¹ˆ 22 à¹€à¸¡.à¸¢. 2569 (Excel Serial 46134.0) Â· à¹à¸ªà¸”à¸‡ Villa/à¸£à¸«à¸±à¸ª/à¸¥à¸¹à¸à¸„à¹‰à¸²/Inâ€“Out, Fâ€“P, Qâ€“S, Tâ€“AA à¹à¸¥à¸° AB';
  const metric=view.querySelector('.round-metrics article:nth-child(4)');
  if(metric){
    const metricValue=selector=>Number(String(view.querySelector(selector)?.textContent||'').replace(/[^0-9.-]/g,'').replace(/,/g,''))||0;
    const outstanding=metricValue('.round-metrics article:nth-child(3) strong');
    const pending=metricValue('.round-metrics article:nth-child(4) strong');
    const difference=Math.max(0,outstanding-pending);
    metric.querySelector('small').textContent='à¸¢à¸­à¸”à¸•à¹ˆà¸²à¸‡ / Payment Difference';
    metric.querySelector('strong').textContent=money(difference);
    metric.querySelector('strong').className=difference?'warning-text':'positive-text';
    metric.querySelector('span').textContent=pending?`à¸„à¹‰à¸²à¸‡à¸Šà¸³à¸£à¸°à¹ƒà¸™à¸Šà¹ˆà¸­à¸‡ AA ${money(pending)}`:'à¸¢à¸­à¸”à¸£à¸±à¸šà¸Šà¸³à¸£à¸°à¸•à¸£à¸‡à¸à¸±à¸šà¸¢à¸­à¸”à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸•à¸´à¸”à¸•à¸²à¸¡';
  }
}
const closeRoundRenderWithSource=renderCloseRound;
renderCloseRound=function(){
  closeRoundRenderWithSource();
  setTimeout(()=>{renderCloseRoundSourceTemplate();installCloseRoundDetailTools()},0);
};

function renderCloseRoundSystemData(){
  const master=$('#view-master');
  if(master&&!$('#close-round-data-dictionary')){
    const panel=document.createElement('article');
    panel.id='close-round-data-dictionary';
    panel.className='panel close-round-data-dictionary';
    panel.innerHTML=`<div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">account_tree</span></span><div><h3>à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸«à¸™à¹‰à¸²à¸›à¸´à¸”à¸£à¸­à¸š</h3><small class="muted">à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡à¸«à¸™à¹‰à¸²à¸›à¸´à¸”à¸£à¸­à¸š.xlsx Â· à¸Šà¸µà¸• à¸ªà¸³à¹€à¸™à¸²à¸‚à¸­à¸‡ 22</small></div></div><span class="status-chip success">à¸žà¸£à¹‰à¸­à¸¡à¹ƒà¸Šà¹‰à¸‡à¸²à¸™</span></div><div class="table-wrap"><table><thead><tr><th>à¸Šà¹ˆà¸§à¸‡à¸„à¸­à¸¥à¸±à¸¡à¸™à¹Œ</th><th>à¸«à¸±à¸§à¸‚à¹‰à¸­à¸ˆà¸²à¸à¹„à¸Ÿà¸¥à¹Œ</th><th>à¸à¸²à¸£à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¹ƒà¸™à¸£à¸°à¸šà¸š</th></tr></thead><tbody>${CLOSE_ROUND_SOURCE_GROUPS.map(group=>`<tr><td class="mono">${group[0]}</td><td>${group[1]}</td><td>${group[2]}</td></tr>`).join('')}</tbody></table></div>`;
    master.append(panel);
  }
  const importView=$('#view-import');
  if(importView){
    const fileName=importView.querySelector('.import-file strong');
    if(fileName)fileName.textContent='à¸«à¸™à¹‰à¸²à¸›à¸´à¸”à¸£à¸­à¸š.xlsx';
    const fileMeta=importView.querySelector('.import-file small');
    if(fileMeta)fileMeta.textContent='à¸Šà¸µà¸•: à¸ªà¸³à¹€à¸™à¸²à¸‚à¸­à¸‡ 22 Â· A2: Excel Serial Date 46134.0 (22 à¹€à¸¡.à¸¢. 2569)';
    const status=importView.querySelector('.import-status .status-chip');
    if(status)status.textContent='à¸­à¹ˆà¸²à¸™à¹‚à¸„à¸£à¸‡à¸ªà¸£à¹‰à¸²à¸‡à¹à¸¥à¹‰à¸§';
    const summary=importView.querySelectorAll('.import-summary > div');
    const summaryData=[['28','à¸„à¸­à¸¥à¸±à¸¡à¸™à¹Œà¸•à¹‰à¸™à¸—à¸²à¸‡'],[String(CLOSE_ROUND_SOURCE_VILLAS.length),'Villa à¹ƒà¸™à¹à¸šà¸šà¸Ÿà¸­à¸£à¹Œà¸¡'],['0','à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸œà¸´à¸”à¸›à¸à¸•à¸´']];
    summaryData.forEach((item,index)=>{const block=summary[index];if(!block)return;const value=block.querySelector('strong');const label=block.querySelector('small');if(value)value.textContent=item[0];if(label)label.textContent=item[1]});
    const issues=importView.querySelectorAll('.issue-list .issue-list > div, .issue-list > div');
    if(issues[0]){const title=issues[0].querySelector('strong'),body=issues[0].querySelector('p');if(title)title.textContent='à¸«à¸±à¸§à¸•à¸²à¸£à¸²à¸‡à¸«à¸¥à¸²à¸¢à¸£à¸°à¸”à¸±à¸šà¸•à¸²à¸¡à¹à¸šà¸šà¸Ÿà¸­à¸£à¹Œà¸¡';if(body)body.textContent='à¹à¸–à¸§ 1â€“4 à¹€à¸›à¹‡à¸™à¸«à¸±à¸§à¸£à¸²à¸¢à¸‡à¸²à¸™à¹à¸¥à¸°à¸«à¸±à¸§à¸„à¸­à¸¥à¸±à¸¡à¸™à¹Œ à¹à¸–à¸§à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸à¹à¸–à¸§ 5 à¸ˆà¸¶à¸‡à¸•à¹‰à¸­à¸‡à¸­à¹ˆà¸²à¸™à¸•à¸²à¸¡à¸Šà¸·à¹ˆà¸­à¸„à¸­à¸¥à¸±à¸¡à¸™à¹Œ'}
    if(issues[1]){const title=issues[1].querySelector('strong'),body=issues[1].querySelector('p');if(title)title.textContent='à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸¢à¸­à¸” Q:AA à¸ˆà¸²à¸ Invoice';if(body)body.textContent='à¸¢à¸­à¸”à¸£à¸§à¸¡, Deposit, à¸„à¸‡à¹€à¸«à¸¥à¸·à¸­ à¹à¸¥à¸°à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™à¸•à¹‰à¸­à¸‡à¸¡à¸²à¸ˆà¸²à¸ Invoice à¸—à¸µà¹ˆà¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸”à¹‰à¸§à¸¢à¸£à¸«à¸±à¸ª à¹„à¸¡à¹ˆà¸à¸£à¸­à¸à¸‹à¹‰à¸³à¹ƒà¸™à¸£à¸°à¸šà¸š'}
  }
}
document.addEventListener('DOMContentLoaded',renderCloseRoundSystemData);

/* Keep legacy accommodation records from falling into the Other bucket. */
const closeRoundCategoryKeyBeforeLegacyFix=closeRoundCategoryKey;
closeRoundCategoryKey=function(line){
  const text=`${line?.category||''} ${line?.name||''}`.toLowerCase();
  if(line?.type==='accommodation'||/accommodation|villa|à¸§à¸´à¸¥à¸¥à¹ˆà¸²|à¸«à¹‰à¸­à¸‡à¸žà¸±à¸|à¸„à¹ˆà¸²à¸§à¸´à¸¥à¸¥à¹ˆà¸²|à¸„à¹ˆà¸²à¸šà¹‰à¸²à¸™|à¸šà¹‰à¸²à¸™à¸žà¸±à¸|à¸„à¹ˆà¸²à¸—à¸µà¹ˆà¸žà¸±à¸|à¸—à¸µà¹ˆà¸žà¸±à¸|jacuzzi|bathtub|bath ?tub|pangola|hamata|barbados|merino|corriedale|corredale|katahdin|mulato|napier|setaria|alfalfa|rapunzel|à¹à¸žà¸‡à¹‚à¸à¸¥à¹ˆà¸²|à¸®à¸²à¸¡à¸²à¸•à¹‰à¸²|à¸šà¸²à¸£à¹Œà¸šà¸²à¹‚à¸”à¸ª|à¹€à¸¡à¸­à¸£à¸´à¹‚à¸™à¹ˆ|à¸„à¸­à¸£à¹Œà¸£à¸´à¹€à¸”à¸¥|à¸„à¸²à¸—à¸²à¸”à¸´à¸™|à¸¡à¸¹à¸¥à¸²à¹‚à¸•à¹‰|à¹€à¸™à¹€à¸›à¸µà¸¢à¸£à¹Œ|à¹€à¸‹à¸—à¸²à¹€à¸£à¸µà¸¢|à¸­à¸±à¸¥à¸Ÿà¸±à¸¥à¸Ÿà¹ˆà¸²|à¸£à¸²à¸žà¸±à¸™à¹€à¸‹à¸¥/.test(text))return /extra.?bed|à¸—à¸µà¹ˆà¸™à¸­à¸™à¹€à¸ªà¸£à¸´à¸¡/.test(text)?'extraBed':'villa';
  return closeRoundCategoryKeyBeforeLegacyFix(line);
};
const closeRoundRecordModelBeforeLegacyFix=closeRoundRecordModel;
closeRoundRecordModel=function(record){
  const model=closeRoundRecordModelBeforeLegacyFix(record),lines=Array.isArray(record?.lines)?record.lines:[],hasVillaLine=lines.some(line=>closeRoundCategoryKey(line)==='villa');
  if(model.total>0&&!lines.length&&(record?.villa||record?.villaCode)){
    model.categories.villa=model.total;
    model.categories.other=0;
  }else if(model.total>0&&(record?.villa||record?.villaCode)&&!hasVillaLine&&lines.length<=1){
    const nonOtherTotal=Object.entries(model.categories).filter(([key])=>key!=='other').reduce((sum,[,value])=>sum+Number(value||0),0),otherTotal=Number(model.categories.other||0);
    if(nonOtherTotal<=0.005&&otherTotal>=model.total-0.005){
      model.categories.villa=model.total;
      model.categories.other=0;
    }
  }else if(model.total>0&&hasVillaLine){
    const categorySum=Object.values(model.categories).reduce((sum,value)=>sum+Number(value||0),0),difference=model.total-categorySum;
    if(Math.abs(difference)>0.005){
      model.categories.villa=Math.max(0,Number(model.categories.villa||0)+difference);
      model.categories.other=0;
    }
  }
  return model;
};

/*
 * LOCKED CLOSE-ROUND ACCOUNTING CONTRACT
 *
 * This is the protected boundary for the Close Round report. Keep these
 * rules independent from invoice editing, payment allocation, and display
 * formatting:
 *   - category columns = each invoice line's GROSS amount (qty x rate)
 *   - "à¹„à¸¡à¹ˆà¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š" = invoice discount only
 *   - total Q = sum of gross category amounts
 *
 * A raw payment amount, pending amount, net total, or outstanding amount must
 * never be used as the No Charge value. Any future Close Round change should
 * call the locked helpers below instead of reimplementing these calculations.
 */
const CLOSE_ROUND_LOCKED_RULES=Object.freeze({
  categoryAmount:'line.gross',
  noChargeAmount:'invoice.discount',
  totalAmount:'sum(category.gross)'
});
function closeRoundDeclaredDiscount(record){
  const payload=record?.payload&&typeof record.payload==='object'?record.payload:null;
  const source=payload&&Object.prototype.hasOwnProperty.call(payload,'discount')?payload:record;
  const value=Number(source?.discount);
  return Number.isFinite(value)?Math.max(0,value):null;
}
function closeRoundLineDiscountTotal(record){
  const lines=Array.isArray(record?.lines)?record.lines:[];
  return lines.reduce((sum,line)=>{
    const gross=Math.max(0,Number(line.qty||0)*Number(line.rate||0));
    return sum+Math.max(0,gross-closeRoundLineNet(line));
  },0);
}
function closeRoundDiscountOnly(record){
  const declared=closeRoundDeclaredDiscount(record);
  if(declared!==null)return declared;
  return closeRoundLineDiscountTotal(record);
}

/* Exact mapping from à¸«à¸™à¹‰à¸²à¸›à¸´à¸”à¸£à¸­à¸š à¹€à¸‡à¸·à¹ˆà¸­à¸™à¹„à¸‚.txt. */
function closeRoundConditionCategoryKey(line){
  const category=String(line?.category||'').toLowerCase().replace(/_/g,' '),name=String(line?.name||'').toLowerCase(),text=`${category} ${name}`;
  const foodComplimentary=/happy birthday waffle \(22\)|happy anniversary waffle \(22\)|muesli \(22\)|yogurt \(22\)|croissant \(22\)|milk \(22\)/i.test(name);
  const foodPackage=/e-?voucher(?: dinner)?\s*(?:600|800|900|1,?200)\s*ba(?:ht|th)(?:\s*\(22\))?/i.test(name);
  const foodBbq=/german sausage|buffalo wings set|vegetable set|service charge 10%|chocolate fondue set|marshmallow set/i.test(name);
  if(/extra.?bed|à¸—à¸µà¹ˆà¸™à¸­à¸™à¹€à¸ªà¸£à¸´à¸¡/.test(text))return 'extraBed';
  if(category==='minibar'||/minibar|à¸¡à¸´à¸™à¸´à¸šà¸²à¸£à¹Œ/.test(text))return 'minibar';
  if(/à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡à¹à¸¥à¸°à¹€à¸šà¹€à¸à¸­à¸£à¸µà¹ˆ/.test(name))return 'other';
  if(/afternoon tea|afternoon_tea/.test(text))return 'htSht';
  if(/à¸à¸´à¸ˆà¸à¸£à¸£à¸¡à¸Šà¸¡à¸ªà¸¸à¸™à¸±à¸‚à¸—à¸µà¹ˆ?123à¹„à¸£à¹ˆ|dog|à¸ªà¸¸à¸™à¸±à¸‚|à¸Šà¸¡à¹‚à¸Šà¸§à¹Œ/.test(text))return 'dogActivity';
  if(/souvenir|souvinir|à¸ªà¸´à¸™à¸„à¹‰à¸²|à¸‚à¸­à¸‡à¸—à¸µà¹ˆà¸£à¸°à¸¥à¸¶à¸/.test(text))return 'product';
  if(/miscellaneous/.test(category)&&/ev|à¸Šà¸²à¸£à¹Œà¸ˆ/.test(text))return 'ev';
  if(/atv/.test(text))return 'atv';
  if(/activity|activities|à¸à¸´à¸ˆà¸à¸£à¸£à¸¡/.test(category)&&/massage|à¸™à¸§à¸”/.test(text))return 'massage';
  if(foodComplimentary||foodPackage||foodBbq||/food ?&? ?beverage|food beverage|à¸­à¸²à¸«à¸²à¸£|à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡/.test(category))return 'food';
  if(/package/.test(category)&&foodPackage)return 'food';
  if(/à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡à¹à¸¥à¸°à¹€à¸šà¹€à¸à¸­à¸£à¸µà¹ˆ|complimentary|à¸Šà¸”à¹€à¸Šà¸¢|happy birthday|happy anniversary|hbd|anniversary/.test(text))return 'other';
  if(foodComplimentary||foodPackage||foodBbq||/food ?&? ?beverage|food beverage|à¸­à¸²à¸«à¸²à¸£/.test(category))return 'food';
  if(/package/.test(category)&&foodPackage)return 'food';
  if(/complimentary|à¸Šà¸”à¹€à¸Šà¸¢|happy birthday|happy anniversary|hbd|anniversary/.test(text))return 'other';
  if(/accommodation|villa|à¸§à¸´à¸¥à¸¥à¹ˆà¸²|à¸«à¹‰à¸­à¸‡à¸žà¸±à¸|à¸„à¹ˆà¸²à¸§à¸´à¸¥à¸¥à¹ˆà¸²|à¸„à¹ˆà¸²à¸šà¹‰à¸²à¸™|à¸šà¹‰à¸²à¸™à¸žà¸±à¸|à¸„à¹ˆà¸²à¸—à¸µà¹ˆà¸žà¸±à¸|à¸—à¸µà¹ˆà¸žà¸±à¸|pangola|hamata|barbados|merino|corriedale|corredale|katahdin|mulato|napier|setaria|alfalfa|rapunzel|à¹à¸žà¸‡à¹‚à¸à¸¥à¹ˆà¸²|à¸®à¸²à¸¡à¸²à¸•à¹‰à¸²|à¸šà¸²à¸£à¹Œà¸šà¸²à¹‚à¸”à¸ª|à¹€à¸¡à¸­à¸£à¸´à¹‚à¸™à¹ˆ|à¸„à¸­à¸£à¹Œà¸£à¸´à¹€à¸”à¸¥|à¸„à¸²à¸—à¸²à¸”à¸´à¸™|à¸¡à¸¹à¸¥à¸²à¹‚à¸•à¹‰|à¹€à¸™à¹€à¸›à¸µà¸¢à¸£à¹Œ|à¹€à¸‹à¸—à¸²à¹€à¸£à¸µà¸¢|à¸­à¸±à¸¥à¸Ÿà¸±à¸¥à¸Ÿà¹ˆà¸²|à¸£à¸²à¸žà¸±à¸™à¹€à¸‹à¸¥/.test(text)||/jacuzzi|bathtub|bath ?tub/.test(category))return 'villa';
  if(/à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸”à¸·à¹ˆà¸¡à¹à¸¥à¸°à¹€à¸šà¹€à¸à¸­à¸£à¸µà¹ˆ/.test(text))return 'other';
  return 'other';
}
const closeRoundRecordModelBeforeExactConditions=closeRoundRecordModel;
closeRoundRecordModel=function(record){
  const model=closeRoundRecordModelBeforeExactConditions(record),lines=Array.isArray(record?.lines)?record.lines:[],categories=Object.fromEntries(CLOSE_ROUND_CATEGORIES.map(item=>[item.key,0])),grossBy=Object.fromEntries(CLOSE_ROUND_CATEGORIES.map(item=>[item.key,0]));
  lines.forEach(line=>{const gross=Math.max(0,Number(line.qty||0)*Number(line.rate||0)),key=closeRoundConditionCategoryKey(line);categories[key]+=gross;grossBy[key]+=gross});
  const grossTotal=Object.values(grossBy).reduce((sum,value)=>sum+value,0),discount=Math.max(0,closeRoundDeclaredDiscount(record)??0),total=grossTotal||Math.max(0,Number(record?.total||0)+discount),deposit=Math.max(0,Number(record?.deposit||0)),pending=Math.max(0,Number(record?.pendingTotal||0)),payments=Object.fromEntries(CLOSE_ROUND_PAYMENTS.map(item=>[item.key,0]));
  (record?.payments||[]).forEach(payment=>{payments[closeRoundPaymentKey(payment.method)]+=Math.max(0,Number(payment.amount||0))});
  payments.noCharge=discount;
  payments.pending=pending;
  return {...model,categories,payments,total,deposit,outstanding:Math.max(0,total-discount-deposit),pending,villaCode:record?.villaCode||'',villa:record?.villa||model.villa||''};
};

/* Final category model: each line stays in its own category at gross value.
   Discounts are reported separately in the No Charge column. Q remains the
   invoice gross total and is never inflated by the discount. */
const closeRoundRecordModelWithCategorySemantics=closeRoundRecordModel;
closeRoundRecordModel=function(record){
  const model=closeRoundRecordModelWithCategorySemantics(record),lines=Array.isArray(record?.lines)?record.lines:[],categories=Object.fromEntries(CLOSE_ROUND_CATEGORIES.map(item=>[item.key,0]));
  const grossBy=Object.fromEntries(CLOSE_ROUND_CATEGORIES.map(item=>[item.key,0]));
  let lineDiscountTotal=0;
  lines.forEach(line=>{
    const key=closeRoundConditionCategoryKey(line);
    const gross=Math.max(0,Number(line.qty||0)*Number(line.rate||0)),net=closeRoundLineNet(line);
    grossBy[key]+=gross;categories[key]+=gross;lineDiscountTotal+=Math.max(0,gross-net);
  });
  const declaredDiscount=Math.max(0,closeRoundDeclaredDiscount(record)??0);
  // A payment row named "No Charge" can contain the invoice total in older
  // records.  It is not a discount source, so never copy that raw payment
  // amount into the Close Round No Charge column.  Use only the discount
  // recorded on the invoice, plus discounts calculable from its lines.
  // Locked rule: No Charge is the declared invoice discount. Line discounts
  // are only a fallback for legacy records that have no invoice discount.
  const totalDiscount=closeRoundDeclaredDiscount(record)===null?lineDiscountTotal:declaredDiscount;
  if(!lines.length&&model.categories.villa){categories.villa=Math.max(0,Number(model.categories.villa||0));}
  model.categories=categories;
  if(model.payments)model.payments.noCharge=totalDiscount;
  return model;
};

/* Final display guard: keep the Villa template even when no Invoice is finalized. */
closeRoundRows=function(records){
  const locked=closeRoundIsLocked(closeRoundSelectedDate());
  return closeRoundTemplateEntries(records).map(entry=>entry.record?closeRoundEditableRowsFromInvoice([entry.record]):closeRoundEmptyVillaRow(entry.villa,locked,entry.villaCode)).join('')+closeRoundAddVillaRow(locked);
};
closeRoundPaymentRows=function(records){
  const totals=Object.fromEntries(CLOSE_ROUND_PAYMENTS.map(item=>[item.key,0]));
  records.forEach(record=>{const row=closeRoundRecordModel(record);CLOSE_ROUND_PAYMENTS.forEach(item=>{totals[item.key]+=item.key==='noCharge'?closeRoundDiscountOnly(record):row.payments[item.key]})});
  const grand=Object.values(totals).reduce((sum,value)=>sum+value,0);
  return CLOSE_ROUND_PAYMENTS.map(item=>{const value=totals[item.key],width=grand?Math.round(value/grand*100):0;return `<div class="payment-bar-row"><div><span><i class="payment-dot ${item.className}"></i>${item.label}</span><strong>${closeRoundMoneyCell(value)}</strong></div><div class="bar"><i style="width:${width}%"></i></div></div>`}).join('')+`<div class="payment-foot"><span>à¸£à¸§à¸¡à¸£à¸±à¸šà¸Šà¸³à¸£à¸° / à¸£à¸­à¹€à¸£à¸µà¸¢à¸à¹€à¸à¹‡à¸š</span><strong>${money(grand)}</strong></div>`;
};
const renderCloseRoundWithDiscountOnlyGuard=renderCloseRound;
renderCloseRound=function(){
  renderCloseRoundWithDiscountOnlyGuard();
  const records=closeRoundRecords(closeRoundSelectedDate()),table=document.querySelector('.close-round-detail-table'),noChargeIndex=5+CLOSE_ROUND_CATEGORIES.length+3+CLOSE_ROUND_PAYMENTS.findIndex(item=>item.key==='noCharge');
  [...table?.tBodies?.[0]?.rows||[]].forEach((row,index)=>{const record=records[index],cell=row.cells[noChargeIndex];if(record&&cell)cell.textContent=closeRoundMoneyCell(closeRoundDiscountOnly(record))});
};
const renderCloseRoundWithEnglishVillaHeader=renderCloseRound;
renderCloseRound=function(){
  renderCloseRoundWithEnglishVillaHeader();
  const header=document.querySelector('#view-close-round .close-round-detail-table thead th');
  if(header)header.textContent='Villa Name';
};

/* Master Data: render the real loaded catalog instead of the starter mockup. */
function masterDataCatalogRows(tab,query=''){
  const needle=String(query||'').trim().toLowerCase();
  const villas=[...new Map(villaOptions.filter(item=>item?.name).map(item=>[item.name,item])).values()];
  const products=[...accommodationItems.map(item=>({...item,source:'Accommodation'})),...addonItems.map(item=>({...item,source:'Add-on'}))];
  const packages=products.filter(item=>/package|voucher|set/i.test(`${item.category||''} ${item.name||''}`));
  const payments=(Array.isArray(CLOSE_ROUND_PAYMENTS)?CLOSE_ROUND_PAYMENTS:paymentMethods.map(label=>({label}))).map(item=>({name:item.label||item.name,category:'Payment Channel',rate:null,reference:item.key||''}));
  const source=tab==='villas'?villas:tab==='packages'?packages:tab==='payments'?payments:products;
  const matches=source.filter(item=>!needle||`${item.name||''} ${item.category||''} ${item.reference||''} ${item.description||''}`.toLowerCase().includes(needle));
  if(!matches.length)return '<tr><td colspan="6"><div class="empty-state"><p>à¹„à¸¡à¹ˆà¸žà¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ˆà¸£à¸´à¸‡à¸•à¸²à¸¡à¸—à¸µà¹ˆà¸„à¹‰à¸™à¸«à¸²</p></div></td></tr>';
  return matches.map((item,index)=>{
    const isVilla=tab==='villas',isPayment=tab==='payments';
    const code=isVilla?String(item.name||'').match(/^\d{2,3}/)?.[0]||`V-${index+1}`:isPayment?item.reference||'-':`${item.source==='Accommodation'?'ACC':'ADD'}-${String(index+1).padStart(3,'0')}`;
    const category=isVilla?item.description||'Villa':item.category||'-';
    const detail=isVilla?item.reference||'-':item.source||'';
    const price=item.rate===null||item.rate===undefined?'â€”':money(item.rate);
    return `<tr><td class="mono">${esc(code)}</td><td><strong>${esc(item.name||'-')}</strong><small class="table-subtext">${esc(detail)}</small></td><td>${esc(category)}</td><td class="align-right strong-number">${esc(price)}</td><td><span class="status-chip success">à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ˆà¸£à¸´à¸‡</span></td><td>${isPayment?'à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸£à¸±à¸šà¸Šà¸³à¸£à¸°':isVilla?'Villa / Room':'à¸£à¸²à¸¢à¸à¸²à¸£à¸ˆà¸²à¸à¸à¸²à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥'}</td></tr>`;
  }).join('');
}
function renderMasterDataActual(tab='products',query=''){
  const view=$('#view-master');if(!view)return;
  const villas=[...new Map(villaOptions.filter(item=>item?.name).map(item=>[item.name,item])).values()];
  const products=[...accommodationItems,...addonItems];
  const packages=products.filter(item=>/package|voucher|set/i.test(`${item.category||''} ${item.name||''}`));
  const payments=Array.isArray(CLOSE_ROUND_PAYMENTS)?CLOSE_ROUND_PAYMENTS:paymentMethods.map(label=>({label}));
  const tabs=[['products','à¸ªà¸´à¸™à¸„à¹‰à¸²à¹à¸¥à¸°à¸šà¸£à¸´à¸à¸²à¸£',products.length],['villas','Villa / à¸«à¹‰à¸­à¸‡à¸žà¸±à¸',villas.length],['packages','à¹à¸žà¹‡à¸à¹€à¸à¸ˆ',packages.length],['payments','à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™',payments.length]];
  view.innerHTML=`<div class="page-heading compact"><div><p class="eyebrow">MASTER DATA / LIVE CATALOG</p><h2>à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸«à¸¥à¸±à¸</h2><p class="muted">à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ˆà¸£à¸´à¸‡à¸ˆà¸²à¸à¸£à¸²à¸¢à¸à¸²à¸£ Villa à¸ªà¸´à¸™à¸„à¹‰à¸² à¹à¸žà¹‡à¸à¹€à¸à¸ˆ à¹à¸¥à¸°à¸Šà¹ˆà¸­à¸‡à¸—à¸²à¸‡à¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™à¸‚à¸­à¸‡à¸£à¸°à¸šà¸š</p></div><span class="status-chip success">à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ˆà¸£à¸´à¸‡à¹à¸¥à¹‰à¸§</span></div><article class="panel"><div class="master-tabs">${tabs.map(([key,label,count])=>`<button class="${key===tab?'active':''}" type="button" data-master-tab="${key}">${label} <b>${count}</b></button>`).join('')}</div><div class="filter-bar"><div class="search-field"><span class="material-symbols-outlined">search</span><input data-master-search placeholder="à¸„à¹‰à¸™à¸«à¸²à¸Šà¸·à¹ˆà¸­ à¸£à¸«à¸±à¸ª à¸«à¸£à¸·à¸­à¸«à¸¡à¸§à¸”..." value="${esc(query)}"></div><span class="data-quality"><span class="material-symbols-outlined">verified</span>à¹à¸ªà¸”à¸‡à¸ˆà¸²à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ˆà¸£à¸´à¸‡ ${masterDataCatalogRows(tab,query).match(/<tr>/g)?.length||0} à¸£à¸²à¸¢à¸à¸²à¸£</span></div><div class="table-wrap"><table><thead><tr><th>à¸£à¸«à¸±à¸ª</th><th>à¸£à¸²à¸¢à¸à¸²à¸£</th><th>à¸«à¸¡à¸§à¸”</th><th class="align-right">à¸£à¸²à¸„à¸²</th><th>à¸ªà¸–à¸²à¸™à¸°</th><th>à¹à¸«à¸¥à¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥</th></tr></thead><tbody>${masterDataCatalogRows(tab,query)}</tbody></table></div></article>`;
  const search=view.querySelector('[data-master-search]');
  search?.addEventListener('input',event=>renderMasterDataActual(tab,event.target.value));
  view.querySelectorAll('[data-master-tab]').forEach(button=>button.addEventListener('click',()=>renderMasterDataActual(button.dataset.masterTab,'')));
}
document.addEventListener('DOMContentLoaded',()=>renderMasterDataActual());

/* Accounting output: A4 landscape, fit to width, readable type, and allow
 * additional A4 pages instead of shrinking the table into unreadable text. */
const closeRoundA4PrintCss=`
  @page{size:A4 landscape;margin:0}
  *{box-sizing:border-box}
  html,body{width:297mm;min-height:210mm;margin:0;padding:0;overflow:visible;background:#fff;color:#211a15;font-family:Arial,Tahoma,sans-serif}
  .sheet{width:297mm;min-height:210mm;padding:8mm;background:#fff}
  .close-round-print-layout{width:281mm;min-height:194mm;overflow:visible}
  .close-round-print-layout-heading{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1.5px solid #6e442d;padding:0 0 2mm;margin:0 0 3mm;font-size:12px;line-height:1.2}
  .close-round-print-layout-heading span{font-size:10px;color:#66584e}
  .close-round-detail-table{width:281mm;border-collapse:collapse;table-layout:fixed;font-size:9px;line-height:1.2}
  .close-round-detail-table th,.close-round-detail-table td{border:1px solid #29231e;padding:2.5px 1.8px;vertical-align:middle;overflow-wrap:anywhere;word-break:break-word}
  .close-round-detail-table th{background:#eee3d8;font-weight:700;text-align:center}
  .close-round-detail-table td{text-align:left}
  .close-round-detail-table .align-right{text-align:right}
  .close-round-detail-table thead{display:table-header-group}
  .close-round-detail-table tr{break-inside:avoid;page-break-inside:avoid}
  .close-round-detail-table th:nth-child(1),.close-round-detail-table td:nth-child(1){width:7%}
  .close-round-detail-table th:nth-child(2),.close-round-detail-table td:nth-child(2){width:6%}
  .close-round-detail-table th:nth-child(3),.close-round-detail-table td:nth-child(3){width:13%}
  .close-round-detail-table th:nth-child(4),.close-round-detail-table td:nth-child(4),.close-round-detail-table th:nth-child(5),.close-round-detail-table td:nth-child(5){width:4%}
  .close-round-detail-table th:nth-child(n+6):nth-child(-n+16),.close-round-detail-table td:nth-child(n+6):nth-child(-n+16){width:2.8%}
  .close-round-detail-table th:nth-child(n+17):nth-child(-n+19),.close-round-detail-table td:nth-child(n+17):nth-child(-n+19){width:4.2%}
  .close-round-detail-table th:nth-child(20),.close-round-detail-table td:nth-child(20){width:9.6%}
  .close-round-detail-table th:nth-child(21),.close-round-detail-table td:nth-child(21){width:13%}
  .close-round-print-density-compact{font-size:8.6px}
  .close-round-print-density-dense{font-size:8.2px;line-height:1.15}
  .close-round-print-summary{display:flex;flex-wrap:wrap;gap:2mm;margin-top:3mm;padding-top:2mm;border-top:1.5px solid #6e442d;font-size:8px;line-height:1.2}
  .close-round-print-summary>div{flex:1 1 30mm;min-width:30mm;border:1px solid #b9a99d;padding:1.5mm;text-align:center}
  .close-round-print-summary>div.close-round-print-summary-heading{flex:0 0 100%;border:0;padding:0;text-align:left;font-weight:700;font-size:8px;color:#6e442d}
  .close-round-print-summary span,.close-round-print-summary strong{display:block}
  .close-round-print-summary span{font-size:7.5px;color:#66584e}
  .close-round-print-summary strong{font-size:9px;margin-top:.5mm}
  .close-round-print-summary p{margin:0;font-size:8px;line-height:1.2}
`;
printCloseRoundDetailOnePage=function(){
  const date=closeRoundSelectedDate();persistCloseRoundDetailEdits();installCloseRoundDetailTools();prepareCloseRoundDetailPrint(date);
  const layout=document.querySelector('#view-close-round .close-round-print-layout');
  if(!layout){showToast('à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸ªà¸³à¸«à¸£à¸±à¸šà¸žà¸´à¸¡à¸žà¹Œ','error');return}
  document.querySelector('#close-round-print-frame')?.remove();
  const frame=document.createElement('iframe');frame.id='close-round-print-frame';frame.setAttribute('aria-hidden','true');frame.style.cssText='position:fixed;left:0;top:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
  frame.srcdoc=`<!doctype html><html><head><meta charset="utf-8"><title>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸›à¸´à¸”à¸£à¸­à¸š ${esc(date)}</title><style>${closeRoundA4PrintCss}</style></head><body><div class="sheet">${layout.outerHTML}</div></body></html>`;
  document.body.append(frame);
  const cleanup=()=>{frame.remove();window.removeEventListener('afterprint',cleanup)};window.addEventListener('afterprint',cleanup,{once:true});
  frame.addEventListener('load',()=>{const printWindow=frame.contentWindow;if(!printWindow)return;printWindow.focus();setTimeout(()=>printWindow.print(),150);setTimeout(cleanup,15000)},{once:true});
};

/* Final print override: keep the original single accounting table layout. */
prepareCloseRoundDetailPrint=function(date){
  const selectedDate=date||closeRoundSelectedDate();
  const panel=$('#view-close-round .close-round-detail-panel');
  const source=panel?.querySelector('.close-round-detail-wrap .close-round-detail-table')||panel?.querySelector('.close-round-detail-table');
  if(!panel||!source)return;
  panel.querySelector('.close-round-print-layout')?.remove();
  const layout=document.createElement('div');layout.className='close-round-print-layout';
  const heading=document.createElement('div');heading.className='close-round-print-layout-heading';
  heading.innerHTML='<strong>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸´à¸”à¸£à¸­à¸š</strong><span>Business Date: '+esc(selectedDate)+'</span>';
  const records=closeRoundRecords(selectedDate),table=closeRoundCompactPrintTable(source,records),summary=document.createElement('div');
  summary.innerHTML=closeRoundPrintSummaryMarkup(records);
  if(table)layout.append(heading,table,summary.firstElementChild);
  panel.append(layout);
};
printCloseRoundDetailOnePage=function(){
  const date=closeRoundSelectedDate();persistCloseRoundDetailEdits();installCloseRoundDetailTools();prepareCloseRoundDetailPrint(date);
  const layout=document.querySelector('#view-close-round .close-round-print-layout');if(!layout){showToast('à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸ªà¸³à¸«à¸£à¸±à¸šà¸žà¸´à¸¡à¸žà¹Œ','error');return}
  document.querySelector('#close-round-print-frame')?.remove();
  const frame=document.createElement('iframe');frame.id='close-round-print-frame';frame.setAttribute('aria-hidden','true');frame.style.cssText='position:fixed;left:0;top:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
  frame.srcdoc='<!doctype html><html><head><meta charset="utf-8"><title>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸´à¸”à¸£à¸­à¸š '+esc(date)+'</title><style>'+closeRoundA4PrintCss+'</style></head><body><div class="sheet">'+layout.outerHTML+'</div></body></html>';
  document.body.append(frame);const cleanup=()=>{frame.remove();window.removeEventListener('afterprint',cleanup)};window.addEventListener('afterprint',cleanup,{once:true});
  frame.addEventListener('load',()=>{const printWindow=frame.contentWindow;if(!printWindow)return;printWindow.focus();setTimeout(()=>printWindow.print(),150);setTimeout(cleanup,15000)},{once:true});
};

/* Keep the original accounting table layout for printing, with A4 landscape
 * width and readable type. */
prepareCloseRoundDetailPrint=function(date){
  const selectedDate=date||closeRoundSelectedDate(),panel=$('#view-close-round .close-round-detail-panel'),source=panel?.querySelector('.close-round-detail-wrap .close-round-detail-table')||panel?.querySelector('.close-round-detail-table');
  if(!panel||!source)return;
  panel.querySelector('.close-round-print-layout')?.remove();
  const layout=document.createElement('div');layout.className='close-round-print-layout';
  const heading=document.createElement('div');heading.className='close-round-print-layout-heading';heading.innerHTML='<strong>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸´à¸”à¸£à¸­à¸š</strong><span>Business Date: '+esc(selectedDate)+'</span>';
  const records=closeRoundRecords(selectedDate),table=closeRoundCompactPrintTable(source,records),summary=document.createElement('div');summary.innerHTML=closeRoundPrintSummaryMarkup(records);
  if(table)layout.append(heading,table,summary.firstElementChild);panel.append(layout);
};
printCloseRoundDetailOnePage=function(){
  const date=closeRoundSelectedDate();persistCloseRoundDetailEdits();installCloseRoundDetailTools();prepareCloseRoundDetailPrint(date);
  const layout=document.querySelector('#view-close-round .close-round-print-layout');if(!layout){showToast('à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸ªà¸³à¸«à¸£à¸±à¸šà¸žà¸´à¸¡à¸žà¹Œ','error');return}
  document.querySelector('#close-round-print-frame')?.remove();
  const frame=document.createElement('iframe');frame.id='close-round-print-frame';frame.setAttribute('aria-hidden','true');frame.style.cssText='position:fixed;left:0;top:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
  frame.srcdoc=`<!doctype html><html><head><meta charset="utf-8"><title>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸´à¸”à¸£à¸­à¸š ${esc(date)}</title><style>${closeRoundA4PrintCss}</style></head><body><div class="sheet">${layout.outerHTML}</div></body></html>`;
  document.body.append(frame);const cleanup=()=>{frame.remove();window.removeEventListener('afterprint',cleanup)};window.addEventListener('afterprint',cleanup,{once:true});
  frame.addEventListener('load',()=>{const printWindow=frame.contentWindow;if(!printWindow)return;printWindow.focus();setTimeout(()=>printWindow.print(),150);setTimeout(cleanup,15000)},{once:true});
};
closeRoundSinglePageExcel=function(records,date){
  const source=document.querySelector('#view-close-round .close-round-detail-table'),table=closeRoundCompactPrintTable(source,records);
  if(!table){showToast('à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸•à¸²à¸£à¸²à¸‡à¸›à¸´à¸”à¸£à¸­à¸šà¸ªà¸³à¸«à¸£à¸±à¸šà¸ªà¹ˆà¸‡à¸­à¸­à¸','error');return}
  const heading=`<div class="report-heading"><strong>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸£à¸²à¸¢à¸à¸²à¸£à¸›à¸´à¸”à¸£à¸­à¸š</strong><span>Business Date: ${esc(date)}</span></div>`,summary=closeRoundPrintSummaryMarkup(records);
  const html=`<!doctype html><html><head><meta charset="utf-8"><style>${closeRoundA4PrintCss}.report-heading{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:4mm;padding-bottom:2mm;border-bottom:2px solid #6e442d;font-size:14px}.report-heading span{font-size:11px;color:#66584e}.sheet{mso-page-orientation:landscape}.close-round-print-summary{font-size:8px}.close-round-print-summary p{font-size:8px}</style></head><body><div class="sheet">${heading}${table.outerHTML}${summary}</div></body></html>`;
  const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`close-round-${date}-A4-landscape.xls`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(`à¸ªà¹ˆà¸‡à¸­à¸­à¸à¸›à¸´à¸”à¸£à¸­à¸š ${date} à¹€à¸›à¹‡à¸™ Excel A4 à¹à¸™à¸§à¸™à¸­à¸™à¹à¸¥à¹‰à¸§`);
};

/* Full-detail accounting printout: use the whole A4 landscape page for each
 * Villa detail block instead of squeezing every accounting column into a tiny grid. */
const closeRoundFullA4PrintCss=`
  @page{size:A4 landscape;margin:0}
  *{box-sizing:border-box}
  html,body{width:297mm;min-height:210mm;margin:0;padding:0;overflow:visible;background:#fff;color:#211a15;font-family:Arial,Tahoma,sans-serif}
  .sheet{width:297mm;min-height:210mm;padding:8mm;background:#fff}
  .close-round-print-layout{width:281mm;min-height:194mm}
  .close-round-print-layout-heading{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:2px solid #6e442d;padding:0 0 2.5mm;margin:0 0 4mm;font-size:15px;line-height:1.2}
  .close-round-print-layout-heading span{font-size:11px;color:#66584e}
  .close-round-print-card{border:1.5px solid #6e442d;border-radius:1mm;padding:3mm;margin:0 0 4mm;break-inside:avoid;page-break-inside:avoid}
  .close-round-print-identity{display:grid;grid-template-columns:1.35fr 1fr 2fr .8fr .8fr;gap:2mm}
  .close-round-print-field{min-height:11mm;border:1px solid #c4b2a4;border-radius:.7mm;padding:1.5mm;background:#fff}
  .close-round-print-label{display:block;color:#66584e;font-size:7.5px;line-height:1.1;margin-bottom:1mm;font-weight:700}
  .close-round-print-cell-content{font-size:10px;line-height:1.2;overflow-wrap:anywhere;word-break:break-word}
  .close-round-print-cell-content .close-round-print-value{font-size:10px}
  .close-round-print-block{margin-top:3mm}
  .close-round-print-block h5{margin:0 0 1.5mm;color:#6e442d;font-size:10px;line-height:1.2}
  .close-round-print-grid{display:grid;gap:1.5mm}
  .close-round-print-grid.categories{grid-template-columns:repeat(6,minmax(0,1fr))}
  .close-round-print-grid.payments{grid-template-columns:repeat(4,minmax(0,1fr))}
  .close-round-print-totals{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5mm;margin-top:3mm}
  .close-round-print-totals .close-round-print-field{background:#f5eee8}
  .close-round-print-note{margin-top:3mm}
  .close-round-print-note .close-round-print-field{min-height:13mm}
  .close-round-print-empty{font-size:11px;padding:15mm 0;text-align:center}
  .close-round-print-summary{display:flex;flex-wrap:wrap;gap:2mm;margin-top:3mm;padding-top:2mm;border-top:2px solid #6e442d;font-size:9px;line-height:1.2}
  .close-round-print-summary p{margin:0;font-size:9px}
`;
prepareCloseRoundDetailPrintFull=function(date){
  const selectedDate=date||closeRoundSelectedDate(),panel=$('#view-close-round .close-round-detail-panel'),source=panel?.querySelector('.close-round-detail-wrap .close-round-detail-table')||panel?.querySelector('.close-round-detail-table');
  if(!panel||!source)return;
  panel.querySelector('.close-round-print-layout')?.remove();
  const layout=document.createElement('div');layout.className='close-round-print-layout';
  const heading=document.createElement('div');heading.className='close-round-print-layout-heading';heading.innerHTML='<strong>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸£à¸²à¸¢à¸à¸²à¸£à¸ªà¹ˆà¸‡à¸šà¸±à¸à¸Šà¸µ</strong><span>Business Date: '+esc(selectedDate)+'</span>';layout.append(heading);
  const top=[...(source.tHead?.rows?.[0]?.cells||[])],second=[...(source.tHead?.rows?.[1]?.cells||[])],labels=[...top.slice(0,19).map(cell=>cell.textContent.trim()),...second.map(cell=>cell.textContent.trim()),top[20]?.textContent.trim()||'à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸'];
  const rows=[...(source.tBodies[0]?.rows||[])].filter(row=>row.cells.length>=28);
  rows.forEach(row=>layout.append(closeRoundPrintCard(row,labels)));
  if(!rows.length){const empty=document.createElement('p');empty.className='close-round-print-empty';empty.textContent='à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µ Invoice à¸—à¸µà¹ˆ Finalized à¹ƒà¸™à¸§à¸±à¸™à¸—à¸µà¹ˆà¹€à¸¥à¸·à¸­à¸';layout.append(empty)}
  panel.append(layout);
};
printCloseRoundDetailOnePageFull=function(){
  const date=closeRoundSelectedDate();persistCloseRoundDetailEdits();installCloseRoundDetailTools();prepareCloseRoundDetailPrint(date);
  const layout=document.querySelector('#view-close-round .close-round-print-layout');if(!layout){showToast('à¹„à¸¡à¹ˆà¸žà¸šà¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸ªà¸³à¸«à¸£à¸±à¸šà¸žà¸´à¸¡à¸žà¹Œ','error');return}
  document.querySelector('#close-round-print-frame')?.remove();
  const frame=document.createElement('iframe');frame.id='close-round-print-frame';frame.setAttribute('aria-hidden','true');frame.style.cssText='position:fixed;left:0;top:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
  frame.srcdoc=`<!doctype html><html><head><meta charset="utf-8"><title>à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”à¸ªà¹ˆà¸‡à¸šà¸±à¸à¸Šà¸µ ${esc(date)}</title><style>${closeRoundFullA4PrintCss}</style></head><body><div class="sheet">${layout.outerHTML}</div></body></html>`;
  document.body.append(frame);const cleanup=()=>{frame.remove();window.removeEventListener('afterprint',cleanup)};window.addEventListener('afterprint',cleanup,{once:true});
  frame.addEventListener('load',()=>{const printWindow=frame.contentWindow;if(!printWindow)return;printWindow.focus();setTimeout(()=>printWindow.print(),150);setTimeout(cleanup,15000)},{once:true});
};

