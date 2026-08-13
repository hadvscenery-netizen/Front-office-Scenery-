function renderCloseRoundSystemData(){
  const master=$('#view-master');
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
