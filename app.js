const DATA=window.DATA_MASTER||{villas:[],accommodationItems:[],addonItems:[]};
const villaOptions=DATA.villas;
const villaBathTypes={'02 Pangola':'Jacuzzi','03 Hamata':'Jacuzzi','04 Barbados':'Jacuzzi_Deluxe','05 Merino':'BathTub','06 Corriedale':'BathTub','06 Corredale':'BathTub','07 Katahdin':'BathTub_Deluxe','08 Mulato':'Jacuzzi','010 Napier':'Jacuzzi','011 Setaria':'Jacuzzi','012 Alfalfa':'Jacuzzi','013 Rapunzel':'Villa'};
function cleanEnglishText(value){return String(value??'').replace(/\bBath\b/g,'Baht').replace(/\bFlaver\b/g,'Flavor').replace(/\bGrand ma\b/g,'Grandma').replace(/Food_Beverage/g,'Food & Beverage').replace(/Afternoon_Tea/g,'Afternoon Tea').replace(/Extra_Bed/g,'Extra Bed').replace(/BathTub_Deluxe/g,'Bathtub Deluxe').replace(/BathTub/g,'Bathtub').replace(/Jacuzzi_Deluxe/g,'Jacuzzi Deluxe').replace(/\s*\?\s*/g,' - ')}
const accommodationItems=[...DATA.accommodationItems.map(item=>{const villaName=Object.keys(villaBathTypes).find(name=>item.name.startsWith(`${name} `)||String(item.villa||'').startsWith(`${name} `));const normalized={...item,name:cleanEnglishText(item.name),category:cleanEnglishText(item.category)};return villaName?{...normalized,label:`${villaName} ${cleanEnglishText(villaBathTypes[villaName])}`,name:`${villaName} ${cleanEnglishText(villaBathTypes[villaName])}`,category:cleanEnglishText(villaBathTypes[villaName]),villa:villaName}:normalized}),{name:'E-Voucher Dinner 800 Baht (22)',category:'Package',rate:800},{name:'E-Voucher Dinner 1200 Baht (22)',category:'Package',rate:1200}].filter((item,index,items)=>items.findIndex(other=>other.name===item.name)===index);
const addonItems=[...DATA.addonItems.map(item=>({...item,name:cleanEnglishText(item.name),category:cleanEnglishText(item.category)})),{name:'E-Voucher Dinner 800 Baht (22)',category:'Food & Beverage',rate:800},{name:'E-Voucher Dinner 1200 Baht (22)',category:'Food & Beverage',rate:1200}].filter((item,index,items)=>items.findIndex(other=>other.name===item.name)===index);
const paymentMethods=['เงินสด','โอน','บัตรเครดิต','คิวอาโค้ต','2C2P'];
const state={invoiceLines:[],payments:[],currentView:'dashboard',invoicePage:'form',invoiceNumber:85,invoices:[],drafts:[{id:'DF-260717-A',label:'บัตรกิจกรรมแกะ + หญ้า 4 ชุด',total:1200,time:'5 นาทีที่แล้ว'},{id:'DF-260717-B',label:'ของที่ระลึก: กระเป๋าสาน 2 ใบ',total:640,time:'12 นาทีที่แล้ว'},{id:'DF-260716-Z',label:'เหมาจ่าย: คณะทัศนศึกษา 45 ท่าน',total:12500,time:'เมื่อวาน'}],closedBookings:loadClosedBookings()};
window.sceneryAppState=state;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],money=v=>{const n=Number(v||0),magnitude=n<0?-n:n,formatted=magnitude.toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});return n<0?`-฿${formatted}`:`฿${formatted}`},esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function loadClosedBookings(){try{return JSON.parse(localStorage.getItem('scenery-closed-bookings')||'[]')}catch{return[]}}
function saveClosedBookings(){try{localStorage.setItem('scenery-closed-bookings',JSON.stringify(state.closedBookings))}catch{}}
function showToast(message,type='success'){const region=$('#toast-region');if(!region)return;const toast=document.createElement('div');toast.className=`toast ${type}`;toast.innerHTML=`<span class="material-symbols-outlined">${type==='error'?'error':'check_circle'}</span><span>${esc(message)}</span>`;region.appendChild(toast);setTimeout(()=>toast.classList.add('show'),10);setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),250)},3200)}
function setView(view){state.currentView=view;$$('.view').forEach(s=>s.classList.toggle('active',s.id===`view-${view}`));$$('.nav-item').forEach(i=>i.classList.toggle('active',i.dataset.view===view));$('#sidebar')?.classList.remove('open');if(view==='master')renderBookingRecords();if(view==='close-round'&&typeof renderCloseRound==='function')renderCloseRound();if(view==='drawer'&&typeof cashDrawerV2Render==='function')cashDrawerV2Render()}
function setInvoicePage(page){state.invoicePage=page;$$('.invoice-page').forEach(s=>s.classList.toggle('active',s.dataset.invoicePage===page));$$('.invoice-page-tab').forEach(b=>b.classList.toggle('active',b.dataset.invoicePage===page));if(page==='preview')renderInvoicePreview()}
function renderDashboard(){const d=$('#dashboard-invoices');if(d)d.innerHTML=state.invoices.slice(0,4).map(i=>`<tr><td>${esc(i.id)}</td><td>${esc(i.customer)}</td><td class="muted">${esc(i.time)}</td><td class="align-right"><strong>${money(i.total)}</strong></td><td><span class="status-chip ${i.statusClass}">${esc(i.status)}</span></td><td class="align-right"><button class="icon-button" aria-label="เมนู ${esc(i.id)}"><span class="material-symbols-outlined">more_vert</span></button></td></tr>`).join('');const drafts=$('#draft-list');if(drafts)drafts.innerHTML=state.drafts.map(d=>`<div class="draft-item"><div class="draft-top"><strong>${esc(d.id)}</strong><small>${esc(d.time)}</small></div><p>${esc(d.label)}</p><div class="draft-bottom"><span class="amount">${money(d.total)}</span><button class="text-button" data-view="invoice">แก้ไข</button></div></div>`).join('')}
function renderHistory(){const b=$('#history-body');if(!b)return;const q=($('#history-search')?.value||'').trim().toLowerCase(),rows=state.invoices.filter(i=>`${i.id} ${i.customer}`.toLowerCase().includes(q));b.innerHTML=rows.map(i=>`<tr><td>${esc(i.id)}</td><td><strong>${esc(i.customer)}</strong><small class="table-subtext">${esc(i.time)} น.</small></td><td>17 ก.ค. 2026</td><td class="align-right strong-number">${money(i.total)}</td><td>${i.status==='ชำระแล้ว'?'<span class="positive-text">ครบถ้วน</span>':'<span class="warning-text">ค้างชำระ</span>'}</td><td><span class="status-chip ${i.statusClass}">${esc(i.status)}</span></td><td><button class="button button-outline action-small" data-action="detail" data-id="${esc(i.id)}">เปิดบิล</button></td></tr>`).join('')||'<tr><td colspan="7"><div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>ไม่พบรายการ</p></div></td></tr>'}
function renderBookingRecords(){const view=$('#view-master');if(!view)return;let panel=$('#booking-records-panel');if(!panel){panel=document.createElement('article');panel.id='booking-records-panel';panel.className='panel booking-records-panel';view.appendChild(panel)}panel.innerHTML=`<div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">folder_shared</span></span><h3>หลักฐานการจองที่ปิดยอดแล้ว</h3></div><span class="count-chip">${state.closedBookings.length} รายการ</span></div>${state.closedBookings.length?`<div class="table-wrap"><table><thead><tr><th>Invoice</th><th>Guest / Villa</th><th>วันที่ปิดยอด</th><th class="align-right">ยอดรวม</th><th>สถานะ</th></tr></thead><tbody>${state.closedBookings.map(r=>`<tr><td class="mono">${esc(r.reference)}</td><td><strong>${esc(r.customer)}</strong><small class="table-subtext">${esc(r.villa||'-')}</small></td><td>${esc(r.closedAt)}</td><td class="align-right strong-number">${money(r.total)}</td><td><span class="status-chip success">ชำระครบแล้ว</span></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state"><span class="material-symbols-outlined">folder_open</span><p>ยังไม่มีการปิดยอด</p><small>เมื่อกดปิดยอด ใบแจ้งหนี้จะถูกเก็บหลักฐานไว้ที่นี่</small></div>'}`}
function formValue(id,fallback=''){const element=$(`#${id}`);return element?.dataset.dateValue??element?.value??fallback}function formatDate(value){if(!value)return'-';const date=new Date(`${value}T00:00:00`);return Number.isNaN(date.getTime())?'-':date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}function lineAmount(line){return Math.max(0,Number(line.qty||0)*Number(line.rate||0))}
function discountRateOptions(selected=0){return[0,5,10,15,20,25,30,50].map(n=>`<option value="${n}" ${Number(selected)===n?'selected':''}>ลด ${n}%</option>`).join('')}
function paymentMethodOptions(selected='เงินสด'){return paymentMethods.map(method=>`<option value="${esc(method)}" ${method===selected?'selected':''}>${esc(method)}</option>`).join('')}
function invoiceSnapshot(){const subtotal=state.invoiceLines.reduce((s,l)=>s+lineAmount(l),0),scope=formValue('discount-scope','line'),allRate=Math.max(0,Number(formValue('discount-all-rate',0))||0),lineDiscount=scope==='line'?state.invoiceLines.reduce((s,l)=>s+lineAmount(l)*(Number(l.discountRate||0)/100),0):0,discount=scope==='all'?subtotal*allRate/100:lineDiscount,lineDeposits=state.invoiceLines.reduce((s,l)=>s+Math.max(0,Number(l.deposit||0)),0),paymentDeposits=state.payments.reduce((s,p)=>s+Math.max(0,Number(p.amount||0)),0),pendingTotal=state.invoiceLines.reduce((s,l)=>s+Math.max(0,Number(l.pendingCollection||0)),0),deposit=lineDeposits+paymentDeposits,netTotal=Math.max(0,subtotal-discount);return{reference:formValue('folio','INV-260717-085'),customer:formValue('customer','-'),checkIn:formValue('check-in'),checkOut:formValue('check-out'),nights:formValue('no-of-night','1'),remark:formValue('remark','-'),docDate:formValue('doc-date'),villa:formValue('villa',''),subtotal,discount,lineDeposits,paymentDeposits,pendingTotal,deposit,netTotal,outstanding:netTotal-deposit-pendingTotal,discountScope:scope,allRate}}
function allocateLineAmounts(snapshot){let paid=snapshot.paymentDeposits;const rows=state.invoiceLines.map(line=>{const amount=lineAmount(line),discount=snapshot.discountScope==='line'?amount*Number(line.discountRate||0)/100:amount*(snapshot.allRate/100),afterDiscount=Math.max(0,amount-discount),lineDeposit=Math.max(0,Number(line.deposit||0)),payment=Math.min(Math.max(0,afterDiscount-lineDeposit),paid),pending=Math.max(0,Number(line.pendingCollection||0));paid-=payment;return{line,amount,discount,lineDeposit,payment,pending,deposit:lineDeposit+payment,outstanding:afterDiscount-lineDeposit-payment-pending}});if(paid>0&&rows.length){const last=rows[rows.length-1];last.payment+=paid;last.deposit+=paid;last.outstanding-=paid}return rows}
function lineRow(line,index){const gross=lineAmount(line),snapshot=invoiceSnapshot(),discount=snapshot.discountScope==='line'?gross*Number(line.discountRate||0)/100:snapshot.discountScope==='all'?gross*snapshot.allRate/100:0,net=Math.max(0,gross-discount);return`<tr><td>${esc(line.category)}</td><td>${esc(line.name)}</td><td class="align-center"><div class="qty-control"><button type="button" data-line-index="${index}" data-qty="-1">−</button><strong>${line.qty}</strong><button type="button" data-line-index="${index}" data-qty="1">+</button></div></td><td class="align-right"><input class="line-rate" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.rate||0)}" aria-label="Rate ${esc(line.name)}"></td><td class="align-right"><div class="line-deposit-fields"><input class="line-deposit" data-line-index="${index}" type="number" min="0" step="0.01" value="${Number(line.deposit||0)}" aria-label="Deposit ${esc(line.name)}"><select class="line-deposit-method" data-line-index="${index}" aria-label="ช่องทาง Deposit ${esc(line.name)}">${paymentMethodOptions(line.depositMethod)}</select></div></td><td><select class="line-discount" data-line-index="${index}" aria-label="ส่วนลด ${esc(line.name)}">${discountRateOptions(line.discountRate)}</select></td><td class="align-right strong-number"><span>${money(net)}</span>${discount?`<small class="line-gross">เต็ม ${money(gross)}</small>`:''}</td><td class="align-right"><button class="icon-button remove-form-line" type="button" data-line-index="${index}" aria-label="ลบรายการ"><span class="material-symbols-outlined">delete</span></button></td></tr>`}
function renderFormLines(){const a=$('#form-accommodation-lines'),b=$('#form-addon-lines');if(!a||!b)return;const indexed=state.invoiceLines.map((line,index)=>({line,index}));a.innerHTML=indexed.filter(x=>x.line.type==='accommodation').map(x=>lineRow(x.line,x.index)).join('');b.innerHTML=indexed.filter(x=>x.line.type==='addon').map(x=>lineRow(x.line,x.index)).join('');if($('#accommodation-empty'))$('#accommodation-empty').style.display=state.invoiceLines.some(l=>l.type==='accommodation')?'none':'block';if($('#addon-empty'))$('#addon-empty').style.display=state.invoiceLines.some(l=>l.type==='addon')?'none':'block';renderInvoicePreview()}
function renderPayments(){const list=$('#payment-list');if(!list)return;list.innerHTML=state.payments.map((p,i)=>`<div class="payment-pill"><span class="material-symbols-outlined">${p.method==='เงินสด'?'payments':p.method==='บัตรเครดิต'?'credit_card':'qr_code_2'}</span><span>${esc(p.method)}</span><strong>${money(p.amount)}</strong><button type="button" data-payment-index="${i}" aria-label="ลบการชำระ"><span class="material-symbols-outlined">close</span></button></div>`).join('');calculateInvoice()}
function calculateInvoice(){const s=invoiceSnapshot();[['summary-total',s.subtotal],['summary-deposit',s.deposit],['summary-discount',s.discount]].forEach(([id,v])=>{if($(`#${id}`))$(`#${id}`).textContent=money(v)});if($('#summary-outstanding'))$('#summary-outstanding').textContent=state.invoiceClosed&&s.outstanding===0?'':money(s.outstanding);renderInvoicePreview()}
function previewItemRows(snapshot){const groups=[{label:'Accommodation & Inclusive Package',type:'accommodation'},{label:'Food and Beverages (add-on) and Other Expenses',type:'addon'}],breakdowns=allocateLineAmounts(snapshot);return groups.map(g=>{const matches=breakdowns.filter(x=>x.line.type===g.type),lines=matches.map(x=>{const rate=snapshot.discountScope==='line'?Number(x.line.discountRate||0):snapshot.discountScope==='all'?Number(snapshot.allRate||0):0,discountLabel=rate?`<span class="invoice-discount-rate">${rate}%</span><small class="invoice-discount-amount">${money(x.discount)}</small>`:'-',totalLabel=x.pending?`<span class="invoice-pending">รอเก็บ ${money(x.pending)}</span>`:x.outstanding<0?`<span class="invoice-overpaid">${money(x.outstanding)}</span>`:state.invoiceClosed&&x.outstanding===0?'':money(x.outstanding);return`<tr><td>${esc(x.line.category)}</td><td class="align-center">${x.line.qty}</td><td>${esc(x.line.name)}</td><td class="align-right">${money(x.amount)}</td><td class="align-right">${x.deposit?money(x.deposit):'-'}</td><td class="align-right invoice-discount-cell">${discountLabel}</td><td class="align-right">${totalLabel}</td></tr>`}).join(''),count=Math.max(matches.length,g.type==='accommodation'?7:14),blanks=Array.from({length:count-matches.length},()=>'<tr class="blank-line"><td></td><td></td><td></td><td></td><td>-</td><td>-</td><td>-</td></tr>').join('');return`<tr class="bill-section-row"><td colspan="7">${g.label}</td></tr>${lines}${blanks}`}).join('')}
function renderInvoicePreview(){if(!$('#invoice-preview-sheet'))return;const s=invoiceSnapshot(),set=(id,v)=>{if($(`#${id}`))$(`#${id}`).textContent=v},methods=[...new Set([...state.invoiceLines.filter(l=>Number(l.deposit||0)>0).map(l=>l.depositMethod||'เงินสด'),...state.payments.filter(p=>Number(p.amount||0)>0).map(p=>p.method)])].join(', ')||'-';set('preview-reference',s.reference);set('preview-reference-meta',s.reference);set('preview-customer',s.customer);set('preview-check-in',formatDate(s.checkIn));set('preview-check-out',formatDate(s.checkOut));set('preview-nights',s.nights);set('preview-remark',s.remark||'-');set('preview-invoice-date',formatDate(s.docDate));set('preview-payment-method',methods);set('preview-total',money(s.subtotal));set('preview-deposit',money(s.deposit));set('preview-discount',money(s.discount));set('preview-outstanding',state.invoiceClosed&&s.outstanding===0?'':money(s.outstanding));if($('#preview-invoice-lines'))$('#preview-invoice-lines').innerHTML=previewItemRows(s)}
function fillRate(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),input=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),items=type==='accommodation'?accommodationItems:addonItems,item=items[Number(select?.value)];if(input)input.value=item?.rate||0}
function addLine(type){const select=type==='accommodation'?$('#accommodation-select'):$('#addon-select'),rateEl=type==='accommodation'?$('#accommodation-rate'):$('#addon-rate'),qtyEl=type==='accommodation'?$('#accommodation-qty'):$('#addon-qty'),items=type==='accommodation'?accommodationItems:addonItems,item=items[Number(select?.value)];if(!item){showToast('กรุณาเลือกรายการก่อนเพิ่ม','error');return}state.invoiceLines.push({type,name:type==='accommodation'&&item.villa?item.villa:item.name,category:item.category,sourceIndex:Number(select.value),rate:Math.max(0,Number(rateEl?.value||0)),deposit:0,depositMethod:'เงินสด',qty:Math.max(1,Number(qtyEl?.value||1)),discountRate:0});select.value='';rateEl.value='';qtyEl.value='1';const search=$(`#${type==='accommodation'?'accommodation':'addon'}-search`);if(search)search.value='';renderFormLines();showToast(`เพิ่ม ${item.name} ลงในใบแจ้งหนี้แล้ว`)}
function closeInvoice(){const form=$('#invoice-entry-form');if(form&&!form.reportValidity()){setInvoicePage('form');showToast('กรุณากรอกข้อมูลที่จำเป็นก่อนปิดยอด','error');return}if(!state.invoiceLines.length){showToast('เพิ่มรายการก่อนปิดยอด','error');return}openSettlementModal()}
function exportPdf(){setInvoicePage('preview');setTimeout(()=>window.print(),80)}
function resetInvoice(){state.invoiceLines=[];state.payments=[];state.invoiceClosed=false;state.itemSearch={};const defaults={folio:'',customer:'','check-in':'','check-out':'','no-of-night':'',remark:'','doc-date':'','villa':'','discount-scope':'line','discount-all-rate':'0','cashier':''};Object.entries(defaults).forEach(([id,v])=>{if($(`#${id}`))$(`#${id}`).value=v});['accommodation-rate','accommodation-qty','addon-rate','addon-qty','payment-amount'].forEach(id=>{if($(`#${id}`))$(`#${id}`).value=''});$$('.invoice-search-input').forEach(input=>input.value='');$$('.invoice-search-clear').forEach(button=>button.hidden=true);renderFormLines();renderPayments();setInvoicePage('form');showToast('เริ่มใบแจ้งหนี้ใหม่แล้ว')}
function openModal(title,body,actions='<button class="button button-primary" data-close-modal>ปิดหน้าต่าง</button>'){const root=$('#modal-root');if(!root)return;root.innerHTML=`<div class="modal-backdrop" data-close-modal><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-header"><h3>${esc(title)}</h3><button class="icon-button" data-close-modal aria-label="ปิด"><span class="material-symbols-outlined">close</span></button></div><div class="modal-body">${body}</div><div class="modal-footer">${actions}</div></div></div>`}
function wireEvents(){document.addEventListener('click',event=>{const viewTrigger=event.target.closest('[data-view]');if(viewTrigger){event.preventDefault();setView(viewTrigger.dataset.view);return}const pageTrigger=event.target.closest('[data-invoice-page]');if(pageTrigger){event.preventDefault();setInvoicePage(pageTrigger.dataset.invoicePage);ret…63510 tokens truncated…st master=$('#view-master');
  if(master&&!$('#close-round-data-dictionary')){
    const panel=document.createElement('article');
    panel.id='close-round-data-dictionary';
    panel.className='panel close-round-data-dictionary';
    panel.innerHTML=`<div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">account_tree</span></span><div><h3>โครงสร้างข้อมูลหน้าปิดรอบ</h3><small class="muted">อ้างอิงหน้าปิดรอบ.xlsx · ชีต สำเนาของ 22</small></div></div><span class="status-chip success">พร้อมใช้งาน</span></div><div class="table-wrap"><table><thead><tr><th>ช่วงคอลัมน์</th><th>หัวข้อจากไฟล์</th><th>การใช้งานในระบบ</th></tr></thead><tbody>${CLOSE_ROUND_SOURCE_GROUPS.map(group=>`<tr><td class="mono">${group[0]}</td><td>${group[1]}</td><td>${group[2]}</td></tr>`).join('')}</tbody></table></div>`;
    master.append(panel);
  }
  const importView=$('#view-import');
  if(importView){
    const fileName=importView.querySelector('.import-file strong');
    if(fileName)fileName.textContent='หน้าปิดรอบ.xlsx';
    const fileMeta=importView.querySelector('.import-file small');
    if(fileMeta)fileMeta.textContent='ชีต: สำเนาของ 22 · A2: Excel Serial Date 46134.0 (22 เม.ย. 2569)';
    const status=importView.querySelector('.import-status .status-chip');
    if(status)status.textContent='อ่านโครงสร้างแล้ว';
    const summary=importView.querySelectorAll('.import-summary > div');
    const summaryData=[['28','คอลัมน์ต้นทาง'],[String(CLOSE_ROUND_SOURCE_VILLAS.length),'Villa ในแบบฟอร์ม'],['0','ข้อมูลผิดปกติ']];
    summaryData.forEach((item,index)=>{const block=summary[index];if(!block)return;const value=block.querySelector('strong');const label=block.querySelector('small');if(value)value.textContent=item[0];if(label)label.textContent=item[1]});
    const issues=importView.querySelectorAll('.issue-list .issue-list > div, .issue-list > div');
    if(issues[0]){const title=issues[0].querySelector('strong'),body=issues[0].querySelector('p');if(title)title.textContent='หัวตารางหลายระดับตามแบบฟอร์ม';if(body)body.textContent='แถว 1–4 เป็นหัวรายงานและหัวคอลัมน์ แถวข้อมูลเริ่มจากแถว 5 จึงต้องอ่านตามชื่อคอลัมน์'}
    if(issues[1]){const title=issues[1].querySelector('strong'),body=issues[1].querySelector('p');if(title)title.textContent='เชื่อมยอด Q:AA จาก Invoice';if(body)body.textContent='ยอดรวม, Deposit, คงเหลือ และช่องทางชำระเงินต้องมาจาก Invoice ที่เชื่อมด้วยรหัส ไม่กรอกซ้ำในระบบ'}
  }
}
document.addEventListener('DOMContentLoaded',renderCloseRoundSystemData);

/* Keep legacy accommodation records from falling into the Other bucket. */
const closeRoundCategoryKeyBeforeLegacyFix=closeRoundCategoryKey;
closeRoundCategoryKey=function(line){
  const text=`${line?.category||''} ${line?.name||''}`.toLowerCase();
  if(line?.type==='accommodation'||/accommodation|villa|วิลล่า|ห้องพัก|ค่าวิลล่า|ค่าบ้าน|บ้านพัก|ค่าที่พัก|ที่พัก|jacuzzi|bathtub|bath ?tub|pangola|hamata|barbados|merino|corriedale|corredale|katahdin|mulato|napier|setaria|alfalfa|rapunzel|แพงโกล่า|ฮามาต้า|บาร์บาโดส|เมอริโน่|คอร์ริเดล|คาทาดิน|มูลาโต้|เนเปียร์|เซทาเรีย|อัลฟัลฟ่า|ราพันเซล/.test(text))return /extra.?bed|ที่นอนเสริม/.test(text)?'extraBed':'villa';
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
 *   - "ไม่เรียกเก็บ" = invoice discount only
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

/* Exact mapping from หน้าปิดรอบ เงื่อนไข.txt. */
function closeRoundConditionCategoryKey(line){
  const category=String(line?.category||'').toLowerCase().replace(/_/g,' '),name=String(line?.name||'').toLowerCase(),text=`${category} ${name}`;
  const foodComplimentary=/happy birthday waffle \(22\)|happy anniversary waffle \(22\)|muesli \(22\)|yogurt \(22\)|croissant \(22\)|milk \(22\)/i.test(name);
  const foodPackage=/e-?voucher(?: dinner)?\s*(?:600|800|900|1,?200)\s*ba(?:ht|th)(?:\s*\(22\))?/i.test(name);
  const foodBbq=/german sausage|buffalo wings set|vegetable set|service charge 10%|chocolate fondue set|marshmallow set/i.test(name);
  if(/extra.?bed|ที่นอนเสริม/.test(text))return 'extraBed';
  if(category==='minibar'||/minibar|มินิบาร์/.test(text))return 'minibar';
  if(/เครื่องดื่มและเบเกอรี่/.test(name))return 'other';
  if(/afternoon tea|afternoon_tea/.test(text))return 'htSht';
  if(/กิจกรรมชมสุนัขที่?123ไร่|dog|สุนัข|ชมโชว์/.test(text))return 'dogActivity';
  if(/souvenir|souvinir|สินค้า|ของที่ระลึก/.test(text))return 'product';
  if(/miscellaneous/.test(category)&&/ev|ชาร์จ/.test(text))return 'ev';
  if(/atv/.test(text))return 'atv';
  if(/activity|activities|กิจกรรม/.test(category)&&/massage|นวด/.test(text))return 'massage';
  if(foodComplimentary||foodPackage||foodBbq||/food ?&? ?beverage|food beverage|อาหาร|เครื่องดื่ม/.test(category))return 'food';
  if(/package/.test(category)&&foodPackage)return 'food';
  if(/เครื่องดื่มและเบเกอรี่|complimentary|ชดเชย|happy birthday|happy anniversary|hbd|anniversary/.test(text))return 'other';
  if(foodComplimentary||foodPackage||foodBbq||/food ?&? ?beverage|food beverage|อาหาร/.test(category))return 'food';
  if(/package/.test(category)&&foodPackage)return 'food';
  if(/complimentary|ชดเชย|happy birthday|happy anniversary|hbd|anniversary/.test(text))return 'other';
  if(/accommodation|villa|วิลล่า|ห้องพัก|ค่าวิลล่า|ค่าบ้าน|บ้านพัก|ค่าที่พัก|ที่พัก|pangola|hamata|barbados|merino|corriedale|corredale|katahdin|mulato|napier|setaria|alfalfa|rapunzel|แพงโกล่า|ฮามาต้า|บาร์บาโดส|เมอริโน่|คอร์ริเดล|คาทาดิน|มูลาโต้|เนเปียร์|เซทาเรีย|อัลฟัลฟ่า|ราพันเซล/.test(text)||/jacuzzi|bathtub|bath ?tub/.test(category))return 'villa';
  if(/เครื่องดื่มและเบเกอรี่/.test(text))return 'other';
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
  return CLOSE_ROUND_PAYMENTS.map(item=>{const value=totals[item.key],width=grand?Math.round(value/grand*100):0;return `<div class="payment-bar-row"><div><span><i class="payment-dot ${item.className}"></i>${item.label}</span><strong>${closeRoundMoneyCell(value)}</strong></div><div class="bar"><i style="width:${width}%"></i></div></div>`}).join('')+`<div class="payment-foot"><span>รวมรับชำระ / รอเรียกเก็บ</span><strong>${money(grand)}</strong></div>`;
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
  if(!matches.length)return '<tr><td colspan="6"><div class="empty-state"><p>ไม่พบข้อมูลจริงตามที่ค้นหา</p></div></td></tr>';
  return matches.map((item,index)=>{
    const isVilla=tab==='villas',isPayment=tab==='payments';
    const code=isVilla?String(item.name||'').match(/^\d{2,3}/)?.[0]||`V-${index+1}`:isPayment?item.reference||'-':`${item.source==='Accommodation'?'ACC':'ADD'}-${String(index+1).padStart(3,'0')}`;
    const category=isVilla?item.description||'Villa':item.category||'-';
    const detail=isVilla?item.reference||'-':item.source||'';
    const price=item.rate===null||item.rate===undefined?'—':money(item.rate);
    return `<tr><td class="mono">${esc(code)}</td><td><strong>${esc(item.name||'-')}</strong><small class="table-subtext">${esc(detail)}</small></td><td>${esc(category)}</td><td class="align-right strong-number">${esc(price)}</td><td><span class="status-chip success">ข้อมูลจริง</span></td><td>${isPayment?'ช่องทางรับชำระ':isVilla?'Villa / Room':'รายการจากฐานข้อมูล'}</td></tr>`;
  }).join('');
}
function renderMasterDataActual(tab='products',query=''){
  const view=$('#view-master');if(!view)return;
  const villas=[...new Map(villaOptions.filter(item=>item?.name).map(item=>[item.name,item])).values()];
  const products=[...accommodationItems,...addonItems];
  const packages=products.filter(item=>/package|voucher|set/i.test(`${item.category||''} ${item.name||''}`));
  const payments=Array.isArray(CLOSE_ROUND_PAYMENTS)?CLOSE_ROUND_PAYMENTS:paymentMethods.map(label=>({label}));
  const tabs=[['products','สินค้าและบริการ',products.length],['villas','Villa / ห้องพัก',villas.length],['packages','แพ็กเกจ',packages.length],['payments','ช่องทางชำระเงิน',payments.length]];
  view.innerHTML=`<div class="page-heading compact"><div><p class="eyebrow">MASTER DATA / LIVE CATALOG</p><h2>ข้อมูลหลัก</h2><p class="muted">ข้อมูลจริงจากรายการ Villa สินค้า แพ็กเกจ และช่องทางชำระเงินของระบบ</p></div><span class="status-chip success">เชื่อมข้อมูลจริงแล้ว</span></div><article class="panel"><div class="master-tabs">${tabs.map(([key,label,count])=>`<button class="${key===tab?'active':''}" type="button" data-master-tab="${key}">${label} <b>${count}</b></button>`).join('')}</div><div class="filter-bar"><div class="search-field"><span class="material-symbols-outlined">search</span><input data-master-search placeholder="ค้นหาชื่อ รหัส หรือหมวด..." value="${esc(query)}"></div><span class="data-quality"><span class="material-symbols-outlined">verified</span>แสดงจากข้อมูลจริง ${masterDataCatalogRows(tab,query).match(/<tr>/g)?.length||0} รายการ</span></div><div class="table-wrap"><table><thead><tr><th>รหัส</th><th>รายการ</th><th>หมวด</th><th class="align-right">ราคา</th><th>สถานะ</th><th>แหล่งข้อมูล</th></tr></thead><tbody>${masterDataCatalogRows(tab,query)}</tbody></table></div></article>`;
  const search=view.querySelector('[data-master-search]');
  search?.addEventListener('input',event=>renderMasterDataActual(tab,event.target.value));
  view.querySelectorAll('[data-master-tab]').forEach(button=>button.addEventListener('click',()=>renderMasterDataActual(button.dataset.masterTab,'')));
}
document.addEventListener('DOMContentLoaded',()=>renderMasterDataActual());