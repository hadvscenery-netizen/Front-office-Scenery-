function closeRoundSinglePageExcel(records,date){
  const source=document.querySelector('#view-close-round .close-round-detail-table'),table=closeRoundPrintTable(source);
  if(!table){showToast('ยังไม่มีตารางปิดรอบสำหรับส่งออก','error');return}
  const heading=`<div class="report-heading"><strong>รายละเอียดรายการปิดรอบ</strong><span>Business Date: ${esc(date)}</span></div>`,summary=closeRoundPrintSummaryMarkup(records);
  const html=`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4 landscape;margin:6mm}html,body{margin:0;padding:0;background:#fff;color:#211a15;font-family:Arial,"Tahoma",sans-serif}.sheet{width:100%;mso-page-orientation:landscape;mso-fit-to-page:yes}.report-heading{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:4mm;padding-bottom:2mm;border-bottom:2px solid #6e442d;font-size:12px}.report-heading span{font-size:9px;color:#66584e}.close-round-detail-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:5px}.close-round-detail-table th,.close-round-detail-table td{border:1px solid #1f1b18;padding:2px 1px;line-height:1.15;vertical-align:middle;overflow-wrap:anywhere;word-break:break-word}.close-round-detail-table th{background:#eee3d8;font-weight:700;text-align:center}.close-round-detail-table td{text-align:left}.close-round-detail-table .align-right{text-align:right}.close-round-detail-table th:nth-child(1),.close-round-detail-table td:nth-child(1){width:5.5%}.close-round-detail-table th:nth-child(2),.close-round-detail-table td:nth-child(2){width:6%}.close-round-detail-table th:nth-child(3),.close-round-detail-table td:nth-child(3){width:9%}.close-round-detail-table th:nth-child(4),.close-round-detail-table td:nth-child(4),.close-round-detail-table th:nth-child(5),.close-round-detail-table td:nth-child(5){width:3.5%}.close-round-detail-table th:nth-child(n+6):nth-child(-n+16),.close-round-detail-table td:nth-child(n+6):nth-child(-n+16){width:2.8%}.close-round-detail-table th:nth-child(n+17):nth-child(-n+19),.close-round-detail-table td:nth-child(n+17):nth-child(-n+19){width:3.8%}.close-round-detail-table th:nth-child(n+20):nth-child(-n+27),.close-round-detail-table td:nth-child(n+20):nth-child(-n+27){width:2.8%}.close-round-detail-table th:nth-child(28),.close-round-detail-table td:nth-child(28){width:7%}.close-round-print-summary{display:flex;gap:3mm;margin-top:4mm;border-top:2px solid #6e442d;padding-top:3mm}.close-round-print-summary>div{flex:1;border:1px solid #cbb9aa;padding:2mm;text-align:center}.close-round-print-summary span,.close-round-print-summary strong{display:block}.close-round-print-summary span{font-size:8px;color:#66584e}.close-round-print-summary strong{font-size:11px;margin-top:1mm}.close-round-detail-table{font-size:6px}.close-round-print-summary{font-size:5.5px}.close-round-print-summary span{font-size:5.2px}.close-round-print-summary strong{font-size:7px}.close-round-print-summary p{margin:0;font-size:6px;line-height:1.2}</style></head><body><div class="sheet">${heading}${table.outerHTML}${summary}</div></body></html>`;
  const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`close-round-${date}-single-page.xls`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(`ส่งออกปิดรอบ ${date} เป็น Excel หน้าเดียวแล้ว`);
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-close-round-export]');if(!button||!button.textContent.includes('Excel'))return;event.preventDefault();event.stopImmediatePropagation();closeRoundSinglePageExcel(closeRoundRecords(closeRoundSelectedDate()),closeRoundSelectedDate())},true);
function renderCloseRound(){
  const view=$('#view-close-round');if(!view)return;
  const oldOptions=$('#close-round-villa-code-options');
  if(oldOptions)oldOptions.remove();
  const options=document.createElement('datalist');
  options.id='close-round-villa-code-options';
  options.innerHTML=CLOSE_ROUND_VILLA_CODES.map(item=>`<option value="${esc(item.value)}">${esc(item.label)}</option>`).join('');
  view.append(options);
  const date=closeRoundSelectedDate(),records=closeRoundRecords(date),models=records.map(closeRoundRecordModel),sales=models.reduce((sum,row)=>sum+row.total,0),deposit=models.reduce((sum,row)=>sum+row.deposit,0),outstanding=models.reduce((sum,row)=>sum+row.outstanding,0),pending=models.reduce((sum,row)=>sum+row.pending,0),closed=loadClosedRounds().some(row=>row.businessDate===date&&row.status==='Submitted');
  view.innerHTML=`<div class="page-heading compact"><div><p class="eyebrow">ACCOUNTING / CLOSE ROUND</p><h2>รายงานปิดรอบประจำวันของเดอะ ซีนเนอรี่ รีสอร์ท</h2><p class="muted">ดึงเฉพาะ Invoice ที่ Finalized แล้วตาม Business Date ที่เลือก</p></div><div class="heading-actions"><span class="status-chip ${closed?'success':'warning'}">${closed?'ปิดรอบแล้ว':'รอตรวจสอบ'}</span><button class="button button-primary" id="submit-round" ${closed?'disabled':''}><span class="material-symbols-outlined">${closed?'lock':'lock_clock'}</span>${closed?'รอบถูกล็อกแล้ว':'Submit และ Lock รอบ'}</button></div></div><div class="round-toolbar panel"><label>Business Date<input id="close-round-date" type="date" value="${esc(date)}"></label><label>รอบการปิด<select id="close-round-shift"><option value="daily">รอบประจำวัน · RECEPTION</option><option value="shift">รอบกะที่เลือกจากลิ้นชัก</option></select></label><div class="round-health"><span class="online-dot"></span><div><strong>${records.length?'ข้อมูลพร้อมตรวจสอบ':'รอข้อมูล Finalized'}</strong><small>${records.length?`${records.length} Invoice · อัปเดตตามวันที่เลือก`:'ยังไม่มีรายการของวันนี้'}</small></div></div></div><div class="round-metrics"><article><small>ยอดรวม (Q)</small><strong>${money(sales)}</strong><span>${records.length} Invoice Finalized</span></article><article><small>ชำระล่วงหน้า / Deposit (R)</small><strong>${money(deposit)}</strong><span>${models.filter(row=>row.deposit>0).length} รายการ</span></article><article><small>คงเหลือยอดชำระ (S)</small><strong>${money(outstanding)}</strong><span class="${outstanding?'critical-text':'positive-text'}">${outstanding?`${models.filter(row=>row.outstanding>0).length} รายการต้องติดตาม`:'ยอดคงเหลือเป็นศูนย์'}</span></article><article><small>ค้างชำระ / ตรวจสอบ</small><strong class="${pending?'warning-text':'positive-text'}">${money(pending)}</strong><span>${pending?'ตรวจสอบก่อน Submit':'ไม่พบยอดค้างชำระ'}</span></article></div><div class="close-round-source-note"><span class="material-symbols-outlined">info</span><div><strong>โครงสร้างตามไฟล์หน้าปิดรอบ.xlsx</strong><small>แสดง Villa, รหัส, ลูกค้า, In/Out, หมวดรายได้ F–P, ยอดรวม Q, Deposit R, คงเหลือ S, รายได้หน้า Front และช่องทางชำระเงิน T–AA</small></div></div><div class="close-round-grid"><article class="panel"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">table_view</span></span><h3>สรุปตามหมวดรายได้</h3></div><button class="button button-outline" type="button" data-close-round-export><span class="material-symbols-outlined">download</span>Excel</button></div><div class="table-wrap"><table><thead><tr><th>หมวดรายได้</th><th class="align-right">จำนวนรายการ</th><th class="align-right">ยอดรวม</th><th class="align-right">Deposit</th><th class="align-right">คงเหลือ</th></tr></thead><tbody>${closeRoundSummaryRows(records)}<tr class="total-row"><td>รวมทั้งหมด</td><td class="align-right">${records.length}</td><td class="align-right">${money(sales)}</td><td class="align-right">${money(deposit)}</td><td class="align-right">${money(outstanding)}</td></tr></tbody></table></div></article><article class="panel payment-summary"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">account_balance</span></span><h3>รายได้หน้า Front / ช่องทางชำระเงิน</h3></div></div><div class="close-round-footer-summary"><div><span>รวม</span><strong>${money(sales)}</strong></div><div><span>หักค่าบ้านพักชำระล่วงหน้า</span><strong>${money(deposit)}</strong></div><div><span>รวมรายได้หน้า Front วันนี้</span><strong>${money(Math.max(0,sales-deposit))}</strong></div><div><span>ผู้จัดทำ</span><strong>-</strong></div></div>${closeRoundPaymentRows(records)}</article></div><article class="panel close-round-detail-panel"><div class="panel-heading"><div><span class="title-icon"><span class="material-symbols-outlined">receipt_long</span></span><h3>รายละเอียดรายการตาม Villa และ Invoice</h3></div><span class="count-chip">${records.length} รายการ</span></div><div class="table-wrap close-round-detail-wrap"><table class="close-round-detail-table"><thead><tr><th rowspan="2">ชื่อวิลล่า</th><th rowspan="2">รหัส</th><th rowspan="2">ชื่อลูกค้า</th><th rowspan="2">In</th><th rowspan="2">Out</th>${CLOSE_ROUND_CATEGORIES.map(item=>`<th rowspan="2">${item.label}</th>`).join('')}<th rowspan="2">ยอดรวม (Q)</th><th rowspan="2">Deposit (R)</th><th rowspan="2">คงเหลือ (S)</th><th colspan="${CLOSE_ROUND_PAYMENTS.length}">รายได้หน้า Front (T–AA)</th><th rowspan="2">หมายเหตุ (AB)</th></tr><tr>${CLOSE_ROUND_PAYMENTS.map(item=>`<th>${item.label}</th>`).join('')}</tr></thead><tbody>${closeRoundRows(records)}</tbody></table></div></article><article class="panel anomalies"><div class="panel-heading"><div><span class="title-icon alert-icon"><span class="material-symbols-outlined">error</span></span><h3>รายการที่ต้องตรวจสอบ</h3></div><span class="status-chip ${pending||outstanding?'warning':'success'}">${pending||outstanding?`${models.filter(row=>row.pending||row.outstanding).length} รายการ`:'เรียบร้อย'}</span></div><div class="anomaly-list">${closeRoundAnomalies(records)}</div></article>`;
   $('#close-round-date')?.addEventListener('change',event=>{event.target.dataset.userSelected='true';renderCloseRound()});
  $('#submit-round')?.addEventListener('click',()=>openModal('ยืนยัน Submit และ Lock รอบ','<p>เมื่อยืนยันแล้ว รอบนี้จะถูกล็อกและไม่ควรแก้ไขรายการย้อนหลังโดยตรง</p><p class="muted">กรุณาตรวจสอบยอดค้างชำระและรายการผิดปกติก่อนส่งฝ่ายบัญชี</p>','<button class="button button-outline" data-close-modal>ยกเลิก</button><button class="button button-primary" data-submit-round>ยืนยัน Submit และ Lock</button>'));
  const exportButton=$('[data-close-round-export]');
  if(exportButton){exportButton.dataset.closeRoundExport='pdf';exportButton.innerHTML='<span class="material-symbols-outlined">picture_as_pdf</span>PDF';exportButton.addEventListener('click',()=>printCloseRoundDetailOnePage());const excelButton=exportButton.cloneNode(true);excelButton.dataset.closeRoundExport='excel';excelButton.innerHTML='<span class="material-symbols-outlined">download</span>Excel';excelButton.addEventListener('click',()=>closeRoundSinglePageExcel(records,date));exportButton.insertAdjacentElement('afterend',excelButton)}
}
function installCloseRound(){
  renderCloseRound();
  const view=$('#view-close-round');
  if(!view||view.dataset.detailEditsReady)return;
  view.dataset.detailEditsReady='true';
  const saveField=event=>{
    const field=event.target.closest('[data-close-round-edit]');
    if(!field)return;
    saveCloseRoundDetailEdit(field.dataset.recordId,field.dataset.closeRoundEdit,field.value);
  };
  const addVilla=event=>{
    const button=event.target.closest('[data-close-round-add-villa]');
    if(!button)return;
    const row=button.closest('tr'),name=row?.querySelector('[data-close-round-new-villa="name"]')?.value,code=row?.querySelector('[data-close-round-new-villa="code"]')?.value;
    if(!String(name||'').trim()){showToast('กรุณาระบุชื่อ Villa ใหม่','error');return}
    if(!saveCloseRoundExtraVilla(name,code)){showToast('ชื่อ Villa นี้มีอยู่แล้ว หรือบันทึกไม่สำเร็จ','error');return}
    showToast(`เพิ่ม Villa ${String(name).trim()} แล้ว`);
    renderCloseRound();
  };
  view.addEventListener('input',saveField);
  view.addEventListener('change',saveField);
  view.addEventListener('click',addVilla);
}
document.addEventListener('DOMContentLoaded',installCloseRound);
function persistCloseRoundDetailEdits(){
  document.querySelectorAll('#view-close-round [data-close-round-edit]').forEach(field=>saveCloseRoundDetailEdit(field.dataset.recordId,field.dataset.closeRoundEdit,field.value));
}
function resizeCloseRoundNote(field){if(!field)return;field.style.height='auto';field.style.height=`${Math.max(36,field.scrollHeight)}px`}
function closeRoundPrintCell(cell){
  const copy=cell.cloneNode(true);
  copy.querySelectorAll('input,textarea,select').forEach(field=>{
    const value=field.tagName==='SELECT'?(field.options[field.selectedIndex]?.textContent||''):field.value;
    const text=document.createElement('span');
    text.className='close-round-print-value';
    text.textContent=String(value||'-');
    field.replaceWith(text);
  });
  const value=document.createElement('div');
  value.className=`close-round-print-cell-content${cell.classList.contains('align-right')?' align-right':''}`;
  value.innerHTML=copy.innerHTML;
  return value;
}
function closeRoundPrintField(row,index,labels,wide=false){
  const field=document.createElement('div');
  field.className=`close-round-print-field${wide?' wide':''}`;
  const label=document.createElement('span');
  label.className='close-round-print-label';
  label.textContent=labels[index]||'';
  field.append(label,closeRoundPrintCell(row.cells[index]));
  return field;
}
function closeRoundPrintCard(row,labels){
  const card=document.createElement('article');
  card.className='close-round-print-card';
  const identity=document.createElement('div');
  identity.className='close-round-print-identity';
  [0,1,2,3,4].forEach(index=>identity.append(closeRoundPrintField(row,index,labels)));
  card.append(identity);
  const categories=document.createElement('div');
  categories.className='close-round-print-block';
  categories.innerHTML='<h5>รายการและหมวดรายได้</h5>';
  const categoryGrid=document.createElement('div');
  categoryGrid.className='close-round-print-grid categories';
  for(let index=5;index<=15;index++)categoryGrid.append(closeRoundPrintField(row,index,labels));
  categories.append(categoryGrid);card.append(categories);
  const totals=document.createElement('div');
  totals.className='close-round-print-totals';
  [16,17,18].forEach(index=>totals.append(closeRoundPrintField(row,index,labels)));
  card.append(totals);
  const payments=document.createElement('div');
  payments.className='close-round-print-block';
  payments.innerHTML='<h5>รายได้หน้า Front และช่องทางชำระเงิน</h5>';
  const paymentGrid=document.createElement('div');
  paymentGrid.className='close-round-print-grid payments';
  for(let index=19;index<=26;index++)paymentGrid.append(closeRoundPrintField(row,index,labels));
  payments.append(paymentGrid);card.append(payments);
  const note=document.createElement('div');
  note.className='close-round-print-note';
  note.append(closeRoundPrintField(row,27,labels,true));
  card.append(note);
  return card;
}
function prepareCloseRoundDetailPrint(){
  const panel=$('#view-close-round .close-round-detail-panel'),source=panel?.querySelector('.close-round-detail-table');
  if(!panel||!source)return;
  panel.querySelector('.close-round-print-layout')?.remove();
  const layout=document.createElement('div');
  layout.className='close-round-print-layout';
  const top=[...(source.tHead?.rows?.[0]?.cells||[])],second=[...(source.tHead?.rows?.[1]?.cells||[])];
  const labels=[...top.slice(0,19).map(cell=>cell.textContent.trim()),...second.map(cell=>cell.textContent.trim()),top[20]?.textContent.trim()||'หมายเหตุ'];
  const heading=document.createElement('div');
  heading.className='close-round-print-layout-heading';
  heading.innerHTML='<strong>รายละเอียดรายการส่งบัญชี</strong><span>Business Date: '+esc(closeRoundSelectedDate())+'</span>';
  layout.append(heading);
  const rows=[...(source.tBodies[0]?.rows||[])].filter(row=>row.cells.length>=28);
  rows.forEach(row=>layout.append(closeRoundPrintCard(row,labels)));
  if(!rows.length){const empty=document.createElement('p');empty.className='close-round-print-empty';empty.textContent='ยังไม่มี Invoice ที่ Finalized ในวันที่เลือก';layout.append(empty)}
  panel.append(layout);
}
/* Accounting print: replace the wide Front-income columns with one payment-channel column. */
function closeRoundPrintPaymentChannel(record){
  const row=closeRoundRecordModel(record);
  const channels=CLOSE_ROUND_PAYMENTS.filter(item=>Number(row.payments[item.key]||0)>0).map(item=>item.label);
  return channels.join(', ')||'-';
}
function closeRoundPrintTextCell(value,alignRight=false){
  const cell=document.createElement('td');
  if(alignRight)cell.className='align-right';
  const content=document.createElement('span');
  content.textContent=String(value??'').trim()||'';
  cell.append(content);
  return cell;
}
function closeRoundCompactPrintTable(source,records){
  const top=[...(source?.tHead?.rows?.[0]?.cells||[])];
  const headers=[...top.slice(0,19).map(cell=>cell.textContent.trim()),'ช่องทางชำระเงิน',top[20]?.textContent.trim()||'หมายเหตุ'];
  const table=document.createElement('table');
  const entries=closeRoundTemplateEntries(records),density=entries.length>40?'dense':entries.length>24?'compact':'regular';
  table.className=`close-round-detail-table close-round-print-compact-table close-round-print-density-${density}`;
  table.dataset.printRowCount=String(entries.length);
  const thead=document.createElement('thead');
  const headerRow=document.createElement('tr');
  headers.forEach(label=>{const th=document.createElement('th');th.textContent=label;headerRow.append(th)});
  thead.append(headerRow);table.append(thead);
  const tbody=document.createElement('tbody');
  entries.forEach(({record,villa})=>{
    if(!record){
      const values=[villa,'','','','',...Array(CLOSE_ROUND_CATEGORIES.length+3).fill(''),'', ''];
      const row=document.createElement('tr');
      values.forEach((value,index)=>row.append(closeRoundPrintTextCell(value,index>=5&&index<=18)));
      tbody.append(row);
      return;
    }
    const model=closeRoundRecordModel(record),edit=closeRoundDetailEditFor(record);
    const villaCode=Object.prototype.hasOwnProperty.call(edit,'villaCode')?edit.villaCode:model.villaCode;
    const remark=Object.prototype.hasOwnProperty.call(edit,'remark')?edit.remark:(model.remark||model.pendingCollectionNote||'');
    const values=[
      closeRoundVillaLabel(model.villa),villaCode,model.customer,model.checkIn,model.checkOut,
      ...CLOSE_ROUND_CATEGORIES.map(item=>closeRoundMoneyCell(model.categories[item.key])),
      closeRoundMoneyCell(model.total),closeRoundMoneyCell(model.deposit),closeRoundMoneyCell(model.outstanding),
      closeRoundPrintPaymentChannel(record),remark
    ];
    const row=document.createElement('tr');
    values.forEach((value,index)=>row.append(closeRoundPrintTextCell(value,index>=5&&index<=18)));
    tbody.append(row);
  });
  table.append(tbody);
  return table;
}
function prepareCloseRoundDetailPrint(){
  const date=arguments[0]||closeRoundSelectedDate();
  const panel=$('#view-close-round .close-round-detail-panel'),source=panel?.querySelector('.close-round-detail-wrap .close-round-detail-table')||panel?.querySelector('.close-round-detail-table');
  if(!panel||!source)return;
  panel.querySelector('.close-round-print-layout')?.remove();
  const layout=document.createElement('div');
  layout.className='close-round-print-layout';
  const heading=document.createElement('div');
  heading.className='close-round-print-layout-heading';
  heading.innerHTML='<strong>รายละเอียดรายการปิดรอบ</strong><span>Business Date: '+esc(date)+'</span>';
  const records=closeRoundRecords(date),table=closeRoundCompactPrintTable(source,records),summary=document.createElement('div');
  summary.innerHTML=closeRoundPrintSummaryMarkup(records);
  if(table)layout.append(heading,table,summary.firstElementChild);
  panel.append(layout);
}
function printCloseRoundDetailOnePage(){
  const date=closeRoundSelectedDate();
  persistCloseRoundDetailEdits();
  installCloseRoundDetailTools();
  prepareCloseRoundDetailPrint(date);
  const layout=document.querySelector('#view-close-round .close-round-print-layout');
  if(!layout){showToast('ไม่พบรายละเอียดสำหรับพิมพ์','error');return}
  document.querySelector('#close-round-print-frame')?.remove();
  const frame=document.createElement('iframe');
  frame.id='close-round-print-frame';
  frame.setAttribute('aria-hidden','true');
  frame.style.cssText='position:fixed;left:0;top:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
  const printCss=`
    @page{size:A4 landscape;margin:0}
    *{box-sizing:border-box}
    html,body{width:297mm;height:210mm;margin:0;padding:0;overflow:hidden;background:#fff;color:#211a15;font-family:Arial,Tahoma,sans-serif}
    .sheet{width:297mm;height:210mm;padding:5mm;overflow:hidden;background:#fff}
    .close-round-print-layout{width:287mm;height:200mm;overflow:hidden}
    .close-round-print-layout-heading{height:8mm;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1.5px solid #6e442d;padding:0 0 1.5mm;margin:0 0 2mm;font-size:10px;line-height:1.2}
    .close-round-print-layout-heading span{font-size:8px;color:#66584e}
    .close-round-detail-table{width:287mm;border-collapse:collapse;table-layout:fixed;font-size:5px;line-height:1.08}
    .close-round-detail-table th,.close-round-detail-table td{border:1px solid #29231e;padding:1px .7px;vertical-align:middle;overflow-wrap:anywhere;word-break:break-word}
    .close-round-detail-table th{background:#eee3d8;font-weight:700;text-align:center}
    .close-round-detail-table td{text-align:left}
    .close-round-detail-table .align-right{text-align:right}
    .close-round-detail-table th:nth-child(1),.close-round-detail-table td:nth-child(1){width:7%}
    .close-round-detail-table th:nth-child(2),.close-round-detail-table td:nth-child(2){width:6%}
    .close-round-detail-table th:nth-child(3),.close-round-detail-table td:nth-child(3){width:13%}
    .close-round-detail-table th:nth-child(4),.close-round-detail-table td:nth-child(4),.close-round-detail-table th:nth-child(5),.close-round-detail-table td:nth-child(5){width:4%}
    .close-round-detail-table th:nth-child(n+6):nth-child(-n+16),.close-round-detail-table td:nth-child(n+6):nth-child(-n+16){width:2.8%}
    .close-round-detail-table th:nth-child(n+17):nth-child(-n+19),.close-round-detail-table td:nth-child(n+17):nth-child(-n+19){width:4.2%}
    .close-round-detail-table th:nth-child(20),.close-round-detail-table td:nth-child(20){width:9.6%}
    .close-round-detail-table th:nth-child(21),.close-round-detail-table td:nth-child(21){width:13%}
    .close-round-print-density-compact{font-size:4.7px}
    .close-round-print-density-dense{font-size:4.35px;line-height:1.02}
    .close-round-print-density-dense th,.close-round-print-density-dense td{padding:.5px .6px}
    .close-round-print-summary{display:flex;flex-wrap:wrap;gap:1.2mm;margin-top:2.2mm;padding-top:1.2mm;border-top:1.5px solid #6e442d;font-size:6px;line-height:1.1}
    .close-round-print-summary>div{flex:1 1 24mm;min-width:24mm;border:1px solid #b9a99d;padding:1mm;text-align:center}
    .close-round-print-summary>div.close-round-print-summary-heading{flex:0 0 100%;border:0;padding:0;text-align:left;font-weight:700;font-size:7px;color:#6e442d}
    .close-round-print-summary span,.close-round-print-summary strong{display:block}
    .close-round-print-summary span{font-size:5.5px;color:#66584e}
    .close-round-print-summary strong{font-size:7px;margin-top:.5mm}
    .close-round-detail-table{font-size:5.7px}
    .close-round-print-density-compact{font-size:5.7px}
    .close-round-print-density-dense{font-size:5.4px;line-height:1.02}
    .close-round-print-summary{font-size:5.2px}
    .close-round-print-summary span{font-size:4.8px}
    .close-round-print-summary strong{font-size:6px}
    .close-round-print-summary>div.close-round-print-summary-heading{font-size:5.8px}
    .close-round-print-summary p{margin:0;font-size:5.8px;line-height:1.2}
  `;
  frame.srcdoc=`<!doctype html><html><head><meta charset="utf-8"><title>รายละเอียดปิดรอบ ${esc(date)}</title><style>${printCss}</style></head><body><div class="sheet">${layout.outerHTML}</div></body></html>`;
  document.body.append(frame);
  const cleanup=()=>{frame.remove();window.removeEventListener('afterprint',cleanup)};
  window.addEventListener('afterprint',cleanup,{once:true});
  frame.addEventListener('load',()=>{
    const printWindow=frame.contentWindow;
    if(!printWindow)return;
    printWindow.focus();
    setTimeout(()=>printWindow.print(),150);
    setTimeout(cleanup,15000);
  },{once:true});
}
function installCloseRoundDetailTools(){
  const panel=$('#view-close-round .close-round-detail-panel');if(!panel)return;
  panel.querySelectorAll('.close-round-note-input').forEach(field=>{if(field.dataset.autoResizeReady)return;field.dataset.autoResizeReady='true';field.addEventListener('input',()=>resizeCloseRoundNote(field));resizeCloseRoundNote(field)});
  const heading=panel.querySelector('.panel-heading');if(!heading||heading.querySelector('[data-close-round-detail-print]'))return;
  const button=document.createElement('button');button.type='button';button.className='button button-outline';button.dataset.closeRoundDetailPrint='true';button.innerHTML='<span class="material-symbols-outlined">print</span>พิมพ์รายละเอียดส่งบัญชี';
  const count=heading.querySelector('.count-chip');if(count)count.before(button);else heading.append(button);
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-close-round-detail-print]');if(!button)return;event.preventDefault();printCloseRoundDetailOnePage()});
window.addEventListener('afterprint',()=>{document.body.classList.remove('close-round-printing');document.body.classList.remove('close-round-detail-printing')});

/* Cash drawer: independent change-float control, never sourced from invoices. */
const CASH_DRAWER_DENOMINATIONS=[
  {value:1,label:'เหรียญ 1 บาท'},
  {value:2,label:'เหรียญ 2 บาท'},
  {value:5,label:'เหรียญ 5 บาท'},
  {value:10,label:'เหรียญ 10 บาท'},
  {value:20,label:'ธนบัตร 20 บาท'},
  {value:50,label:'ธนบัตร 50 บาท'},
  {value:100,label:'ธนบัตร 100 บาท'},
  {value:500,label:'ธนบัตร 500 บาท'},
  {value:1000,label:'ธนบัตร 1,000 บาท'}
];
const CASH_DRAWER_KEY='scenery-cash-drawer';
let cashDrawerStore={activeShift:null,history:[],openingCashDefault:null};
function loadCashDrawerStore(){
  try{
    const value=JSON.parse(localStorage.getItem(CASH_DRAWER_KEY)||'{}');
    // Drop legacy/demo shifts that cannot participate in the current open-gate flow.
    const shift=value.activeShift;
    const isEmptyPendingShift=shift&&shift.openCode===''&&shift.openingCash===null&&!(shift.cashUses||[]).length&&!(shift.cashReturns||[]).length&&!shift.lastCountAt;
    const isLegacyUnnamedShift=shift&&(!String(shift.openedBy||'').trim()||String(shift.openedBy).trim()==='ยังไม่ระบุชื่อ')&&!(shift.cashUses||[]).length&&!(shift.cashReturns||[]).length&&!shift.lastCountAt;
    const activeShift=shift&&(shift.pin||!Object.prototype.hasOwnProperty.call(shift,'openCode')||isEmptyPendingShift||isLegacyUnnamedShift)?null:(shift||null);
    const storedOpening=Number(value.openingCashDefault);
    const shiftOpening=Number(shift?.openingCash);
    const openingCashDefault=Number.isFinite(storedOpening)&&storedOpening>=0?storedOpening:Number.isFinite(shiftOpening)&&shift?.openingCash!==null?shiftOpening:null;
    return {activeShift,history:Array.isArray(value.history)?value.history:[],openingCashDefault};
  }catch{return {activeShift:null,history:[],openingCashDefault:null}}
}
function saveCashDrawerStore(){try{localStorage.setItem(CASH_DRAWER_KEY,JSON.stringify(cashDrawerStore))}catch{showToast('บันทึกข้อมูลลิ้นชักไม่สำเร็จ','error')}}
function cashDrawerMoney(value){return money(Math.max(0,Number(value||0)))}
function cashDrawerDateTime(value){return value?new Date(value).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'}):'-'}
function cashDrawerExpected(shift){return Math.max(0,Number(shift.openingCash||0)-(shift.cashUses||[]).reduce((sum,item)=>sum+Math.max(0,Number(item.amount||0)),0))}
function cashDrawerCountTotal(counts={}){return CASH_DRAWER_DENOMINATIONS.reduce((sum,denomination)=>sum+denomination.value*Math.max(0,Number(counts[denomination.value]||0)),0)}
function cashDrawerDifference(shift){return cashDrawerCountTotal(shift.counts||{})-cashDrawerExpected(shift)}
function cashDrawerShiftCode(){return `SHIFT-${historyDateKey().replaceAll('-','')}-${String(Date.now()).slice(-4)}`}
function cashDrawerDenominationInputs(counts={}){return CASH_DRAWER_DENOMINATIONS.map(denomination=>`<label class="cash-denomination"><span>${denomination.label}</span><input type="number" min="0" step="1" value="${Math.max(0,Number(counts[denomination.value]||0))}" data-cash-denom="${denomination.value}" aria-label="${denomination.label} กี่ชิ้น"></label>`).join('')}
