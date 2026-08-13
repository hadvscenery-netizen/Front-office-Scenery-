function openInvoiceHistoryDetail(id){
  const record=loadInvoiceHistory().find(item=>String(item.id)===String(id)||String(item.reference)===String(id));
  if(!record)return;
  openModal('INFORMATION BILL · '+(record.id||record.reference||''),historyInformationBillBody(record),'<button class="button button-primary" data-close-modal>ปิด</button>');
}

/* History must use the exact live Information Bill DOM, including its A4 sizing and later layout fixes. */
function historyInformationBillBody(record){
  const source=document.querySelector('#invoice-preview-sheet');
  if(!source)return historyInvoiceDetailBody(record);
  const lines=Array.isArray(record.lines)?record.lines.map(line=>({...line,qty:Math.max(1,Number(line.qty||1)),rate:Math.max(0,Number(line.rate||0)),deposit:Math.max(0,Number(line.deposit||0)),discountAmount:Math.max(0,Number(line.discountAmount||0)),discountRate:Math.max(0,Number(line.discountRate||0))})):[],payments=Array.isArray(record.payments)?record.payments.map(payment=>({...payment,amount:Math.max(0,Number(payment.amount||0))})):[];
  const subtotal=lines.reduce((sum,line)=>sum+lineAmount(line),0),discount=Math.max(0,Number(record.discount||0)),deposit=lines.reduce((sum,line)=>sum+line.deposit,0)+payments.reduce((sum,payment)=>sum+payment.amount,0),hasLineDiscount=lines.some(line=>line.discountAmount>0||line.discountRate>0),discountScope=hasLineDiscount?'line':discount>0?'all':'none',snapshot={subtotal,discount,discountScope,netTotal:Math.max(0,subtotal-discount),allAmount:discount,paymentDeposits:payments.reduce((sum,payment)=>sum+payment.amount,0)};
  const previousLines=state.invoiceLines,previousPayments=state.payments;
  let rows='';
  try{state.invoiceLines=lines;state.payments=payments;rows=previewItemRows(snapshot)}finally{state.invoiceLines=previousLines;state.payments=previousPayments}
  const sheet=source.cloneNode(true);sheet.removeAttribute('id');sheet.classList.add('history-information-bill');
  const set=(id,value)=>{const element=sheet.querySelector('#'+id);if(element)element.textContent=value==null?'':String(value)};
  const total=subtotal||Math.max(0,Number(record.total||0)+discount),netTotal=Math.max(0,total-discount),outstanding=Math.max(0,netTotal-deposit),methods=[...new Set(payments.filter(payment=>payment.amount>0).map(payment=>payment.method||'-'))].join(', ')||'';
  set('preview-reference',record.id||record.reference||'-');set('preview-reference-meta',record.reference||record.id||'-');set('preview-customer',record.customer||'-');set('preview-check-in',formatDate(record.checkIn||''));set('preview-check-out',formatDate(record.checkOut||''));set('preview-nights',record.nights||'-');set('preview-remark',record.remark||'-');set('preview-invoice-date',formatDate(record.docDate||record.businessDate||''));set('preview-payment-method',methods);set('preview-total',money(total));set('preview-deposit',money(deposit));set('preview-discount',money(discount));set('preview-outstanding',outstanding===0?'':money(outstanding));
  const linesBox=sheet.querySelector('#preview-invoice-lines');if(linesBox)linesBox.innerHTML=rows;
  const noteBox=sheet.querySelector('#preview-pending-notes');if(noteBox){const pending=historyPendingTotal(record),noteParts=[];if(methods)noteParts.push('<div><strong>ชำระแล้วจากช่องทาง</strong><span>'+esc(methods)+'</span></div>');if(pending)noteParts.push('<div><strong>รอเรียกเก็บ '+money(pending)+'</strong><span>'+esc(record.pendingCollectionNote||'รอเรียกเก็บจากจุดที่เกี่ยวข้อง')+'</span></div>');noteBox.innerHTML=noteParts.join('');noteBox.classList.toggle('long-note',String(record.pendingCollectionNote||'').length>90);}
  const view=document.createElement('div');view.id='view-invoice';view.className='history-information-bill-wrap';const stage=document.createElement('div');stage.className='invoice-preview-stage';stage.appendChild(sheet);view.appendChild(stage);return view.outerHTML;
}

function installInvoiceHistoryDetailView(){
  const addViewButtons=()=>{
    document.querySelectorAll('#history-body [data-history-edit]').forEach(editButton=>{
      const actions=editButton.parentElement;
      if(!actions||actions.querySelector('[data-history-view]'))return;
      const button=document.createElement('button');
      button.type='button';
      button.className='button button-outline action-small';
      button.dataset.historyView=editButton.dataset.historyEdit;
      button.innerHTML='<span class="material-symbols-outlined">receipt_long</span>ดู INFORMATION BILL';
      actions.insertBefore(button,actions.firstChild);
    });
  };
  const baseRenderHistory=renderHistory;
  renderHistory=function(){baseRenderHistory();addViewButtons()};
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-history-view]');
    if(!button)return;
    event.preventDefault();
    openInvoiceHistoryDetail(button.dataset.historyView);
  });
  renderHistory();
}
document.addEventListener('DOMContentLoaded',installInvoiceHistoryDetailView);

function installCloseRoundCategoryClarification(){
  const otherCategory=CLOSE_ROUND_CATEGORIES.find(item=>item.key==='other');
  if(otherCategory)otherCategory.label='\u0e2d\u0e37\u0e48\u0e19\u0e46 (Miscellaneous / Activities \u0e17\u0e35\u0e48\u0e44\u0e21\u0e48\u0e21\u0e35\u0e0a\u0e48\u0e2d\u0e07\u0e40\u0e09\u0e1e\u0e32\u0e30)';
  const previousCategoryKey=closeRoundCategoryKey;
  closeRoundCategoryKey=function(line){
    const value=(String(line?.category||'')+' '+String(line?.name||'')).toLowerCase();
    if(/complimentary|waffle|cake|muesli|yogurt|croissant|milk|e-voucher/.test(value))return 'food';
    if(/\bev\b|charge\s*ev|ev\s*charger/.test(value)&&!/e-voucher/.test(value))return 'ev';
    return previousCategoryKey(line);
  };
}
document.addEventListener('DOMContentLoaded',installCloseRoundCategoryClarification);

/* Invoice check-in/check-out date picker with a themed calendar popover. */
const invoiceCalendarMonths=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const invoiceCalendarWeekdays=['อา','จ','อ','พ','พฤ','ศ','ส'];
const invoiceCalendarState={inputId:null,year:new Date().getFullYear(),month:new Date().getMonth()};
function invoiceDateIso(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
function invoiceDateObject(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return null;const [year,month,day]=String(value).split('-').map(Number),date=new Date(year,month-1,day);return date.getFullYear()===year&&date.getMonth()===month-1&&date.getDate()===day?date:null}
function invoiceDateLabel(value){const date=invoiceDateObject(value);return date?date.toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'}):''}
function invoiceCalendarMinDate(inputId){return inputId==='check-out'?$('#check-in')?.dataset.dateValue||'':''}
function positionInvoiceCalendar(){const popover=$('#invoice-calendar-popover'),input=$(`#${invoiceCalendarState.inputId}`);if(!popover||!input)return;const rect=input.getBoundingClientRect(),width=popover.offsetWidth||310,height=popover.offsetHeight||360;let left=Math.min(Math.max(12,rect.left),window.innerWidth-width-12),top=rect.bottom+8;if(top+height>window.innerHeight-12)top=Math.max(12,rect.top-height-8);popover.style.left=`${left}px`;popover.style.top=`${top}px`}
function closeInvoiceCalendar(){invoiceCalendarState.inputId=null;$('#invoice-calendar-popover')?.remove()}
function renderInvoiceCalendar(){
  const input=$(`#${invoiceCalendarState.inputId}`);if(!input)return;
  let popover=$('#invoice-calendar-popover');if(!popover){popover=document.createElement('div');popover.id='invoice-calendar-popover';popover.className='invoice-calendar-popover';popover.setAttribute('role','dialog');popover.setAttribute('aria-label','เลือกวันที่');document.body.appendChild(popover)}
  const {year,month}=invoiceCalendarState,selected=input.dataset.dateValue||'',today=invoiceDateIso(new Date()),minDate=invoiceCalendarMinDate(input.id),firstDay=new Date(year,month,1).getDay(),daysInMonth=new Date(year,month+1,0).getDate();
  const cells=Array.from({length:firstDay},()=>'<span class="invoice-calendar-empty" aria-hidden="true"></span>');
  for(let day=1;day<=daysInMonth;day++){const iso=invoiceDateIso(new Date(year,month,day)),disabled=minDate&&iso<minDate,classes=['invoice-calendar-day'];if(iso===selected)classes.push('selected');if(iso===today)classes.push('today');cells.push(`<button type="button" class="${classes.join(' ')}" data-invoice-calendar-action="select" data-date="${iso}" ${disabled?'disabled':''}>${day}</button>`)}
  popover.innerHTML=`<div class="invoice-calendar-head"><button type="button" class="invoice-calendar-nav" data-invoice-calendar-action="prev" aria-label="เดือนก่อนหน้า"><span class="material-symbols-outlined">chevron_left</span></button><div><strong>${invoiceCalendarMonths[month]}</strong><small>${year+543}</small></div><button type="button" class="invoice-calendar-nav" data-invoice-calendar-action="next" aria-label="เดือนถัดไป"><span class="material-symbols-outlined">chevron_right</span></button></div><div class="invoice-calendar-weekdays">${invoiceCalendarWeekdays.map(day=>`<span>${day}</span>`).join('')}</div><div class="invoice-calendar-grid">${cells.join('')}</div><div class="invoice-calendar-footer"><button type="button" class="invoice-calendar-today" data-invoice-calendar-action="today">วันนี้</button><button type="button" class="invoice-calendar-clear" data-invoice-calendar-action="clear">ล้างวันที่</button></div>`;
  requestAnimationFrame(positionInvoiceCalendar);
}
function openInvoiceCalendar(inputId){const input=$(`#${inputId}`);if(!input)return;const current=invoiceDateObject(input.dataset.dateValue),base=current||new Date();invoiceCalendarState.inputId=inputId;invoiceCalendarState.year=base.getFullYear();invoiceCalendarState.month=base.getMonth();renderInvoiceCalendar()}
function setInvoiceDate(inputId,value){const input=$(`#${inputId}`);if(!input)return;if(value){input.dataset.dateValue=value;input.value=invoiceDateLabel(value);input.classList.add('has-value');if(inputId==='check-in'){const checkout=$('#check-out');if(checkout?.dataset.dateValue&&checkout.dataset.dateValue<value){delete checkout.dataset.dateValue;checkout.value='';checkout.classList.remove('has-value')}}}else{delete input.dataset.dateValue;input.value='';input.classList.remove('has-value')}input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));closeInvoiceCalendar()}
function installInvoiceDatePickers(){
  ['check-in','check-out','doc-date'].forEach(id=>{const input=$(`#${id}`);if(!input||input.dataset.calendarReady)return;input.dataset.calendarReady='true';input.type='text';input.readOnly=true;input.placeholder='เลือกวันที่';input.classList.add('invoice-date-input');input.setAttribute('aria-haspopup','dialog');input.setAttribute('aria-readonly','true');const wrap=document.createElement('div');wrap.className='invoice-date-input-wrap';input.parentNode.insertBefore(wrap,input);wrap.append(input);const icon=document.createElement('span');icon.className='material-symbols-outlined invoice-date-icon';icon.textContent='calendar_month';wrap.append(icon)});
  document.addEventListener('click',event=>{const input=event.target.closest('.invoice-date-input');if(input){event.preventDefault();openInvoiceCalendar(input.id);return}const action=event.target.closest('[data-invoice-calendar-action]');if(action&&invoiceCalendarState.inputId){event.preventDefault();const type=action.dataset.invoiceCalendarAction;if(type==='prev'||type==='next'){invoiceCalendarState.month+=type==='next'?1:-1;if(invoiceCalendarState.month<0){invoiceCalendarState.month=11;invoiceCalendarState.year--}if(invoiceCalendarState.month>11){invoiceCalendarState.month=0;invoiceCalendarState.year++}renderInvoiceCalendar()}else if(type==='select'){setInvoiceDate(invoiceCalendarState.inputId,action.dataset.date)}else if(type==='today'){const today=invoiceDateIso(new Date()),min=invoiceCalendarMinDate(invoiceCalendarState.inputId);if(!min||today>=min)setInvoiceDate(invoiceCalendarState.inputId,today)}else if(type==='clear'){setInvoiceDate(invoiceCalendarState.inputId,'')}return}if(invoiceCalendarState.inputId&&!event.target.closest('#invoice-calendar-popover'))closeInvoiceCalendar()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeInvoiceCalendar()});
  document.addEventListener('click',event=>{if(event.target.closest('#reset-invoice'))setTimeout(()=>['check-in','check-out','doc-date'].forEach(id=>{const input=$(`#${id}`);if(input){delete input.dataset.dateValue;input.classList.remove('has-value')}}),0)});
  window.addEventListener('resize',positionInvoiceCalendar);window.addEventListener('scroll',positionInvoiceCalendar,true);
}
document.addEventListener('DOMContentLoaded',installInvoiceDatePickers);

/* Close round: mirror the source workbook columns while reading finalized invoices for the selected business date. */
const CLOSE_ROUND_CATEGORIES=[
  {key:'villa',label:'ค่าวิลล่า',className:'brown'},
  {key:'extraBed',label:'ที่นอนเสริม',className:'taupe'},
  {key:'food',label:'อาหาร',className:'green'},
  {key:'minibar',label:'มินิบาร์',className:'ochre'},
  {key:'htSht',label:'HT/SHT',className:'taupe'},
  {key:'dogActivity',label:'กิจกรรมชมสุนัข (92)',className:'ochre'},
  {key:'massage',label:'ค่านวด (0)',className:'brown'},
  {key:'product',label:'สินค้า (0)',className:'green'},
  {key:'atv',label:'ATV (0)',className:'ochre'},
  {key:'ev',label:'ชาร์จ EV (0)',className:'taupe'},
  {key:'other',label:'อื่น ๆ',className:'brown'}
];
const CLOSE_ROUND_PAYMENTS=[
  {key:'cash',label:'เงินสด',className:'cash'},
  {key:'card',label:'บัตรเครดิต',className:'card'},
  {key:'qr',label:'QR Code',className:'qr'},
  {key:'transfer',label:'โอนเงิน SC',className:'deposit'},
  {key:'government',label:'รัฐ 50%',className:'deposit'},
  {key:'tat',label:'ลูกค้าททท.',className:'deposit'},
  {key:'noCharge',label:'ไม่เรียกเก็บ',className:'deposit'},
  {key:'pending',label:'ค้างชำระ',className:'pending'}
];
const CLOSE_ROUND_VILLA_CODES=[
  {value:'A — Rainy S',label:'A — Rainy S'},
  {value:'B — Rainy S',label:'B — Rainy S'},
  {value:'E1 — [โชว์]',label:'E1 — [โชว์]'},
  {value:'E2 — [โชว์+สปาคกิ้งไวน์]',label:'E2 — [โชว์+สปาคกิ้งไวน์]'},
  {value:'G1 — [Defender]',label:'G1 — [Defender]'},
  {value:'G2 จอง — [Range Rover]',label:'G2 จอง — [Range Rover]'},
  {value:'G3 เจ้าของ — [Range Rover]',label:'G3 เจ้าของ — [Range Rover]'},
  {value:'G5 — [08+Test Drive]',label:'G5 — [08+Test Drive]'},
  {value:'G6 — [08+Test Drive]',label:'G6 — [08+Test Drive]'}
];
const CLOSE_ROUND_DETAIL_EDITS_KEY='scenery-close-round-detail-edits';
function loadCloseRoundDetailEdits(){try{const value=JSON.parse(localStorage.getItem(CLOSE_ROUND_DETAIL_EDITS_KEY)||'{}');return value&&typeof value==='object'?value:{}}catch{return{}}}
function closeRoundDetailEditFor(record){const key=String(record?.id||record?.reference||'');return loadCloseRoundDetailEdits()[key]||{}}
function saveCloseRoundDetailEdit(recordId,field,value){const key=String(recordId||'');if(!key)return;const date=closeRoundSelectedDate();if(closeRoundIsLocked(date)){showToast(`แก้ไขไม่ได้: รอบ ${date} ถูก Submit และ Lock แล้ว`,'error');renderCloseRound();return}const edits=loadCloseRoundDetailEdits();const before=edits[key]||{};edits[key]={...before,[field]:String(value||'').trim()};try{localStorage.setItem(CLOSE_ROUND_DETAIL_EDITS_KEY,JSON.stringify(edits));recordAudit('แก้ไขรายละเอียดปิดรอบ','Close Round',key,before,edits[key],{field,reason:'แก้ไขหมายเหตุหรือรหัส Villa'})}catch{showToast('บันทึกการแก้ไขรายละเอียดปิดรอบไม่สำเร็จ','error')}}
function closeRoundInvoiceDate(record){
  return String(record?.docDate||record?.businessDate||'').slice(0,10);
}
function closeRoundDefaultDate(){
  return historyDateKey();
}
function closeRoundSelectedDate(){
  const input=$('#close-round-date');
  if(!input)return closeRoundDefaultDate();
  return input.value||closeRoundDefaultDate();
}
function closeRoundCategoryKey(line){
  const text=`${line?.category||''} ${line?.name||''}`.toLowerCase();
  if(line?.type==='accommodation'||/villa|วิลล่า|ห้องพัก|accommodation/.test(text))return text.includes('bed')||text.includes('ที่นอน')?'extraBed':'villa';
  if(/extra.?bed|ที่นอนเสริม/.test(text))return 'extraBed';
  if(/minibar|มินิบาร์/.test(text))return 'minibar';
  if(/ht\s*\/?\s*sht|ht\d|ht\s/.test(text))return 'htSht';
  if(/dog|สุนัข|ชมโชว์/.test(text))return 'dogActivity';
  if(/massage|นวด/.test(text))return 'massage';
  if(/atv/.test(text))return 'atv';
  if(/ev|ชาร์จ/.test(text))return 'ev';
  if(/souvenir|สินค้า|ของที่ระลึก|product/.test(text))return 'product';
  if(/food|อาหาร|beverage|เครื่องดื่ม|bbq|package|afternoon/.test(text))return 'food';
  return 'other';
}
function closeRoundLineNet(line){
  const gross=Math.max(0,Number(line?.qty||0)*Number(line?.rate||0));
  const rate=Math.min(100,Math.max(0,Number(line?.discountRate||0)));
  const fixed=Math.max(0,Number(line?.discountAmount||0));
  return Math.max(0,gross-Math.min(gross,gross*rate/100+fixed));
}
function closeRoundPaymentKey(method){
  const value=String(method||'').toLowerCase();
  if(value.includes('สด'))return 'cash';
  if(value.includes('บัตร')||value.includes('card'))return 'card';
  if(value.includes('qr')||value.includes('คิว')||value.includes('code'))return 'qr';
  if(value.includes('โอน')||value.includes('transfer')||value.includes('2c2p'))return 'transfer';
  if(value.includes('รัฐ'))return 'government';
  if(value.includes('ททท'))return 'tat';
  if(value.includes('ไม่เรียกเก็บ'))return 'noCharge';
  return 'cash';
}
function closeRoundRecords(date){
  const target=String(date||'').slice(0,10);
  return loadInvoiceHistory().filter(record=>closeRoundInvoiceDate(record)===target);
}
function closeRoundRecordModel(record){
  const categories=Object.fromEntries(CLOSE_ROUND_CATEGORIES.map(item=>[item.key,0]));
  (record.lines||[]).forEach(line=>{categories[closeRoundCategoryKey(line)]+=closeRoundLineNet(line)});
  const total=Math.max(0,Number(record.netTotal??(record.total||0)-Number(record.discount||0))||Object.values(categories).reduce((sum,value)=>sum+value,0));
  const payments=Object.fromEntries(CLOSE_ROUND_PAYMENTS.map(item=>[item.key,0]));
  (record.payments||[]).forEach(payment=>{payments[closeRoundPaymentKey(payment.method)]+=Math.max(0,Number(payment.amount||0))});
  const pending=Math.max(0,Number(record.pendingTotal||0));
  payments.pending+=pending;
  const deposit=Math.max(0,Number(record.deposit||0));
  return {...record,categories,payments,total,deposit,outstanding:Math.max(0,total-deposit),pending};
}
const baseCloseRoundCategoryKey=closeRoundCategoryKey;
closeRoundCategoryKey=function(line){const text=`${line?.category||''} ${line?.name||''}`.toLowerCase();if(line?.type!=='accommodation'&&/food|beverage|bbq|package|afternoon/.test(text))return 'food';return baseCloseRoundCategoryKey(line)}
const baseCloseRoundRecordModel=closeRoundRecordModel;
closeRoundRecordModel=function(record){
  const base=baseCloseRoundRecordModel(record),grossBy=Object.fromEntries(CLOSE_ROUND_CATEGORIES.map(item=>[item.key,0]));
  let lineDiscountTotal=0;
  (record.lines||[]).forEach(line=>{const gross=Math.max(0,Number(line.qty||0)*Number(line.rate||0)),net=closeRoundLineNet(line),key=closeRoundCategoryKey(line);grossBy[key]+=gross;lineDiscountTotal+=Math.max(0,gross-net)});
  const billDiscount=Math.max(0,Number(record.discount||0)),remainingDiscount=Math.max(0,billDiscount-lineDiscountTotal),grossTotal=Object.values(grossBy).reduce((sum,value)=>sum+value,0),categories={...base.categories};
  if(remainingDiscount&&grossTotal){CLOSE_ROUND_CATEGORIES.forEach(item=>{categories[item.key]=Math.max(0,categories[item.key]-remainingDiscount*grossBy[item.key]/grossTotal)})}
  const total=Math.max(0,Number(record.netTotal??(Number(record.total||0)-billDiscount))||Object.values(categories).reduce((sum,value)=>sum+value,0)),categorySum=Object.values(categories).reduce((sum,value)=>sum+value,0),categoryCorrection=total-categorySum;
  if(Math.abs(categoryCorrection)>0.005)categories.other=Math.max(0,categories.other+categoryCorrection);
  const payments={...base.payments};
  (record.lines||[]).forEach(line=>{const amount=Math.max(0,Number(line.deposit||0));if(amount)payments[closeRoundPaymentKey(line.depositMethod||'เงินสด')]+=amount});
  payments.pending=Math.max(0,Number(record.pendingTotal||0));
  const villaMatch=DATA.villas.find(v=>v.name===record.villa||v.reference===record.villa);
  return {...base,villa:villaMatch?.name||record.villa||'',categories,payments,total,deposit:Math.max(0,Number(record.deposit||0)),outstanding:Math.max(0,total-Math.max(0,Number(record.deposit||0))),pending:payments.pending,villaCode:record.villaCode||''};
}
function closeRoundMoneyCell(value){return Number(value||0)?money(value):'-'}
function closeRoundVillaLabel(value){return String(value||'-').replace(/\s+Villa$/i,'')}
function closeRoundRows(records){
  return records.map(record=>{const row=closeRoundRecordModel(record),payments=CLOSE_ROUND_PAYMENTS.map(item=>`<td class="align-right">${closeRoundMoneyCell(row.payments[item.key])}</td>`).join('');return `<tr><td><strong>${esc(closeRoundVillaLabel(row.villa))}</strong></td><td class="mono">${esc(row.id||row.reference||'-')}</td><td>${esc(row.customer||'-')}</td><td>${esc(row.checkIn||'-')}</td><td>${esc(row.checkOut||'-')}</td>${CLOSE_ROUND_CATEGORIES.map(item=>`<td class="align-right">${closeRoundMoneyCell(row.categories[item.key])}</td>`).join('')}<td class="align-right strong-number">${money(row.total)}</td><td class="align-right">${closeRoundMoneyCell(row.deposit)}</td><td class="align-right ${row.outstanding?'warning-text':'positive-text'}">${closeRoundMoneyCell(row.outstanding)}</td>${payments}<td>${esc(row.remark||row.pendingCollectionNote||'-')}</td></tr>`}).join('')||`<tr><td colspan="${5+CLOSE_ROUND_CATEGORIES.length+3+CLOSE_ROUND_PAYMENTS.length+1}"><div class="empty-state"><span class="material-symbols-outlined">receipt_long</span><p>ยังไม่มี Invoice ที่ Finalized ในวันที่เลือก</p><small>เมื่อยืนยันใบแจ้งหนี้แล้ว รายการจะปรากฏในรอบนี้</small></div></td></tr>`;
}
function closeRoundEditableRows(records){
  const locked=closeRoundIsLocked(closeRoundSelectedDate());
  return records.map(record=>{
    const row=closeRoundRecordModel(record);
    const recordId=esc(row.id||row.reference||'');
    const payments=CLOSE_ROUND_PAYMENTS.map(item=>`<td class="align-right">${closeRoundMoneyCell(row.payments[item.key])}</td>`).join('');
    const lockAttribute=locked?' disabled title="รอบถูก Submit และ Lock แล้ว"':'';
    const code=`<input class="close-round-code-input" list="close-round-villa-code-options" value="${esc(row.villaCode||'')}" data-close-round-edit="villaCode" data-record-id="${recordId}" aria-label="รหัส Villa" autocomplete="off"${lockAttribute}>`;
    const note=`<textarea class="close-round-note-input" rows="1" data-close-round-edit="remark" data-record-id="${recordId}" aria-label="หมายเหตุ" placeholder="พิมพ์หมายเหตุ" autocomplete="off"${lockAttribute}>${esc(row.remark||row.pendingCollectionNote||'')}</textarea>`;
    return `<tr><td><strong>${esc(closeRoundVillaLabel(row.villa))}</strong></td><td>${code}</td><td>${esc(row.customer||'-')}</td><td>${esc(row.checkIn||'-')}</td><td>${esc(row.checkOut||'-')}</td>${CLOSE_ROUND_CATEGORIES.map(item=>`<td class="align-right">${closeRoundMoneyCell(row.categories[item.key])}</td>`).join('')}<td class="align-right strong-number">${money(row.total)}</td><td class="align-right">${closeRoundMoneyCell(row.deposit)}</td><td class="align-right ${row.outstanding?'warning-text':'positive-text'}">${closeRoundMoneyCell(row.outstanding)}</td>${payments}<td>${note}</td></tr>`;
  }).join('')||`<tr><td colspan="${5+CLOSE_ROUND_CATEGORIES.length+3+CLOSE_ROUND_PAYMENTS.length+1}"><div class="empty-state"><span class="material-symbols-outlined">receipt_long</span><p>ยังไม่มี Invoice ที่ Finalized ในวันที่เลือก</p><small>เมื่อยืนยันใบแจ้งหนี้แล้ว รายการจะปรากฏในรอบนี้</small></div></td></tr>`;
}
closeRoundRows=closeRoundEditableRows;
/* Keep the accounting detail grid stable: one row for every Villa in the
 * source form, then fill that row when a Finalized Invoice exists. */
const closeRoundRowsFromInvoice=closeRoundRows;
const closeRoundEditableRowsFromInvoice=closeRoundEditableRows;
function closeRoundVillaTemplateKey(value){const match=String(value||'').trim().match(/^(\d{2,3})/);return match?String(Number(match[1])):''}
function closeRoundEmptyVillaRow(villa,locked,villaCode=''){
  const lockAttribute=locked?' disabled title="รอบถูก Submit และ Lock แล้ว"':'';
  const code=locked?'':`<input class="close-round-code-input" value="${esc(villaCode)}" data-close-round-edit="villaCode" data-record-id="" aria-label="รหัส Villa ${esc(villa)}" autocomplete="off">`;
  const note=locked?'':`<textarea class="close-round-note-input" rows="1" data-close-round-edit="remark" data-record-id="" aria-label="หมายเหตุ ${esc(villa)}" placeholder="" autocomplete="off"></textarea>`;
  const emptyCells=Array(CLOSE_ROUND_CATEGORIES.length+3+CLOSE_ROUND_PAYMENTS.length).fill('<td></td>').join('');
  return `<tr class="close-round-villa-placeholder"><td><strong>${esc(villa)}</strong></td><td>${code}</td><td></td><td></td><td></td>${emptyCells}<td>${note}</td></tr>`;
}
const CLOSE_ROUND_EXTRA_VILLAS_KEY='scenery-close-round-extra-villas';
function loadCloseRoundExtraVillas(){try{const value=JSON.parse(localStorage.getItem(CLOSE_ROUND_EXTRA_VILLAS_KEY)||'[]');return Array.isArray(value)?value.filter(item=>item&&String(item.name||'').trim()):[]}catch{return[]}}
function saveCloseRoundExtraVilla(name,code){const cleanName=String(name||'').trim(),cleanCode=String(code||'').trim();if(!cleanName)return false;const items=loadCloseRoundExtraVillas();if(items.some(item=>String(item.name).toLowerCase()===cleanName.toLowerCase()))return false;items.push({name:cleanName,code:cleanCode});try{localStorage.setItem(CLOSE_ROUND_EXTRA_VILLAS_KEY,JSON.stringify(items));return true}catch{return false}}
function closeRoundAddVillaRow(locked){
  const totalColumns=5+CLOSE_ROUND_CATEGORIES.length+3+CLOSE_ROUND_PAYMENTS.length+1;
  const controls=locked?'<span class="muted">รอบถูกล็อกแล้ว</span>':`<input class="close-round-new-villa-name" data-close-round-new-villa="name" placeholder="เช่น 014 New Villa" aria-label="ชื่อ Villa ใหม่" autocomplete="off"><input class="close-round-new-villa-code" data-close-round-new-villa="code" placeholder="รหัส Villa" aria-label="รหัส Villa ใหม่" autocomplete="off"><button class="button button-outline" type="button" data-close-round-add-villa>เพิ่ม Villa</button>`;
  return `<tr class="close-round-villa-add-row"><td colspan="${totalColumns}">${controls}</td></tr>`;
}
function closeRoundTemplateEntries(records){
  const byVilla=new Map(),known=new Set(CLOSE_ROUND_SOURCE_VILLAS.map(closeRoundVillaTemplateKey));
  records.forEach(record=>{const row=closeRoundRecordModel(record),key=closeRoundVillaTemplateKey(row.villa);if(!byVilla.has(key))byVilla.set(key,[]);byVilla.get(key).push(record)});
  const entries=[];
  CLOSE_ROUND_SOURCE_VILLAS.forEach(villa=>{const key=closeRoundVillaTemplateKey(villa),matches=byVilla.get(key)||[];if(matches.length){matches.forEach(record=>entries.push({record,villa}))}else entries.push({record:null,villa})});
  loadCloseRoundExtraVillas().forEach(item=>entries.push({record:null,villa:item.name,villaCode:item.code,extra:true}));
  records.filter(record=>{const row=closeRoundRecordModel(record);return !known.has(closeRoundVillaTemplateKey(row.villa))}).forEach(record=>entries.push({record,villa:''}));
  return entries;
}
function closeRoundTemplateRows(records){
  const locked=closeRoundIsLocked(closeRoundSelectedDate());
  return closeRoundTemplateEntries(records).map(entry=>entry.record?closeRoundEditableRowsFromInvoice([entry.record]):closeRoundEmptyVillaRow(entry.villa,locked,entry.villaCode)).join('')+closeRoundAddVillaRow(locked);
}
closeRoundRows=function(records){return closeRoundTemplateRows(records)};
closeRoundEditableRows=closeRoundRows;
function closeRoundSummaryRows(records){
  const totals=Object.fromEntries(CLOSE_ROUND_CATEGORIES.map(item=>[item.key,{count:0,total:0,deposit:0,outstanding:0}]));
  records.map(closeRoundRecordModel).forEach(row=>CLOSE_ROUND_CATEGORIES.forEach(item=>{const value=row.categories[item.key];if(value){const share=row.total?value/row.total:0;totals[item.key].count+=1;totals[item.key].total+=value;totals[item.key].deposit+=row.deposit*share;totals[item.key].outstanding+=row.outstanding*share}}));
  return CLOSE_ROUND_CATEGORIES.map(item=>{const total=totals[item.key];return `<tr><td><span class="category-dot ${item.className}"></span>${item.label}</td><td class="align-right">${total.count}</td><td class="align-right">${closeRoundMoneyCell(total.total)}</td><td class="align-right">${closeRoundMoneyCell(total.deposit)}</td><td class="align-right">${closeRoundMoneyCell(total.outstanding)}</td></tr>`}).join('');
}
function closeRoundPaymentRows(records){
  const totals=Object.fromEntries(CLOSE_ROUND_PAYMENTS.map(item=>[item.key,0]));
  records.map(closeRoundRecordModel).forEach(row=>CLOSE_ROUND_PAYMENTS.forEach(item=>{totals[item.key]+=row.payments[item.key]}));
  const grand=Object.values(totals).reduce((sum,value)=>sum+value,0);
  return CLOSE_ROUND_PAYMENTS.map(item=>{const value=totals[item.key],width=grand?Math.round(value/grand*100):0;return `<div class="payment-bar-row"><div><span><i class="payment-dot ${item.className}"></i>${item.label}</span><strong>${closeRoundMoneyCell(value)}</strong></div><div class="bar"><i style="width:${width}%"></i></div></div>`}).join('')+`<div class="payment-foot"><span>รวมรับชำระ / รอเรียกเก็บ</span><strong>${money(grand)}</strong></div>`;
}
function closeRoundAnomalies(records){
  const rows=records.map(closeRoundRecordModel).filter(row=>row.pending>0||row.outstanding>0);
  return rows.map(row=>`<div><span class="material-symbols-outlined">warning</span><p><strong>${esc(row.id||row.reference||'-')}</strong> ${row.pending?`มียอดค้างชำระ ${money(row.pending)}`:`ยังมียอดคงเหลือ ${money(row.outstanding)}`}<small>ลูกค้า: ${esc(row.customer||'-')} · Villa: ${esc(closeRoundVillaLabel(row.villa))}</small></p><button class="text-button" data-view="history">ดูประวัติ</button></div>`).join('')||'<div class="close-round-empty"><span class="material-symbols-outlined">task_alt</span><p>ไม่พบรายการผิดปกติในวันที่เลือก</p></div>';
}
function csvEscape(value){return `"${String(value??'').replace(/"/g,'""')}"`}
function exportCloseRoundCsv(records,date){
  const headers=['Business Date','Villa','Villa Code','Invoice','Guest','Check-in','Check-out',...CLOSE_ROUND_CATEGORIES.map(item=>item.label),'Total Q','Deposit R','Outstanding S',...CLOSE_ROUND_PAYMENTS.map(item=>item.label),'Remark'];
  const rows=records.map(record=>{const row=closeRoundRecordModel(record);return [date,row.villa,row.villaCode,row.id||row.reference,row.customer,row.checkIn,row.checkOut,...CLOSE_ROUND_CATEGORIES.map(item=>row.categories[item.key]),row.total,row.deposit,row.outstanding,...CLOSE_ROUND_PAYMENTS.map(item=>row.payments[item.key]),row.remark||row.pendingCollectionNote||'']});
  const csv='\uFEFF'+[headers,...rows].map(row=>row.map(csvEscape).join(',')).join('\r\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`close-round-${date}.csv`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(`ส่งออกข้อมูลปิดรอบ ${date} เป็น CSV แล้ว`);
}
function closeRoundPrintTable(source){
  const table=source?.cloneNode(true);
  if(!table)return null;
  table.querySelectorAll('input,textarea,select').forEach(field=>{
    const value=field.tagName==='SELECT'?(field.options[field.selectedIndex]?.textContent||''):field.value;
    const text=document.createElement('span');
    text.textContent=String(value||'');
    field.replaceWith(text);
  });
  table.querySelectorAll('button').forEach(button=>button.remove());
  table.querySelectorAll('.empty-state').forEach(empty=>empty.textContent='ยังไม่มีรายการ');
  return table;
}
function closeRoundPrintSummaryMarkup(records){
  const rows=records.map(closeRoundRecordModel),sales=rows.reduce((sum,row)=>sum+Number(row.total||0),0),deposit=rows.reduce((sum,row)=>sum+Number(row.deposit||0),0),outstanding=rows.reduce((sum,row)=>sum+Number(row.outstanding||0),0),pending=rows.reduce((sum,row)=>sum+Number(row.pending||0),0),difference=Math.max(0,outstanding-pending);
  return `<div class="close-round-print-summary"><p>สรุปรวม: ยอดรวม Q ${money(sales)} · Deposit R ${money(deposit)} · คงเหลือ S ${money(outstanding)} · ค้างชำระ ${money(pending)} · ยอดต่าง ${money(difference)}</p></div>`;
}
