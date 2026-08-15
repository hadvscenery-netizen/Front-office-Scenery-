/* Final accounting print override. Load after the split legacy bundle. */
(function(){
  'use strict';
  if(window.__sceneryCloseRoundTablePrintFix)return;
  window.__sceneryCloseRoundTablePrintFix=true;

  function esc(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function valueOf(cell){
    var control=cell&&cell.querySelector('input,select,textarea');
    return String(control?control.value:(cell&&cell.textContent)||'').trim();
  }
  function buildTable(source){
    var first=source.tHead&&source.tHead.rows[0]&&Array.from(source.tHead.rows[0].cells);
    if(!first||first.length<21)return '';
    var headers=first.slice(0,19).map(function(cell,index){var label=cell.textContent.trim();return index===15||/อื่น/.test(label)?'อื่นๆ':label;});
    headers.push(first[19].textContent.trim()||'Payment Channel',first[20].textContent.trim()||'Remark');
    var head='<thead><tr>'+headers.map(function(label){return '<th>'+esc(label)+'</th>';}).join('')+'</tr></thead>';
    var rows=Array.from((source.tBodies[0]&&source.tBodies[0].rows)||[]).filter(function(row){
      return row.cells.length>=28&&!row.classList.contains('close-round-villa-add-row');
    });
    var body=rows.map(function(row){
      var values=Array.from(row.cells).slice(0,19).map(valueOf);
      values.push(Array.from(row.cells).slice(19,27).map(valueOf).filter(Boolean).join(', '),valueOf(row.cells[27]));
      return '<tr>'+values.map(function(value,index){
        return '<td class="'+(index>=5&&index<=18?'number':'')+'">'+esc(value)+'</td>';
      }).join('')+'</tr>';
    }).join('');
    if(!body)body='<tr><td colspan="21">No finalized invoices for the selected date</td></tr>';
    return '<table class="close-round-print-table">'+head+'<tbody>'+body+'</tbody></table>';
  }
  function printTable(){
    var source=document.querySelector('#view-close-round .close-round-detail-table');
    var table=source&&buildTable(source);
    if(!table){if(window.showToast)window.showToast('No detail table found','error');return;}
    var date=(document.querySelector('#close-round-date')||{}).value||new Date().toISOString().slice(0,10);
    var old=document.querySelector('#close-round-print-frame');if(old)old.remove();
    var frame=document.createElement('iframe');
    frame.id='close-round-print-frame';
    frame.setAttribute('aria-hidden','true');
    frame.style.cssText='position:fixed;left:0;top:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
    var css='@page{size:A4 landscape;margin:0}*{box-sizing:border-box}html,body{width:297mm;min-height:210mm;margin:0;padding:0;background:#fff;color:#211a15;font-family:Arial,Tahoma,sans-serif}.sheet{width:297mm;min-height:210mm;padding:5mm;background:#fff}.heading{display:flex;justify-content:space-between;border-bottom:1.5px solid #6e442d;padding:0 0 1.5mm;margin:0 0 2mm;font-size:14px}.heading span{font-size:10px;color:#66584e}.close-round-print-table{width:287mm;border-collapse:collapse;table-layout:fixed;font-size:9px;line-height:1.1}.close-round-print-table th,.close-round-print-table td{border:1px solid #29231e;padding:1px .7px;vertical-align:middle;overflow-wrap:anywhere;word-break:break-word}.close-round-print-table th{background:#eee3d8;text-align:center;font-weight:700}.close-round-print-table td.number{text-align:right}.close-round-print-table th:nth-child(1),.close-round-print-table td:nth-child(1){width:10%}.close-round-print-table th:nth-child(2),.close-round-print-table td:nth-child(2){width:6%}.close-round-print-table th:nth-child(3),.close-round-print-table td:nth-child(3){width:13%}.close-round-print-table th:nth-child(4),.close-round-print-table td:nth-child(4),.close-round-print-table th:nth-child(5),.close-round-print-table td:nth-child(5){width:4%}.close-round-print-table th:nth-child(n+6):nth-child(-n+16),.close-round-print-table td:nth-child(n+6):nth-child(-n+16){width:2.8%}.close-round-print-table th:nth-child(n+17):nth-child(-n+19),.close-round-print-table td:nth-child(n+17):nth-child(-n+19){width:4.2%}.close-round-print-table th:nth-child(20),.close-round-print-table td:nth-child(20){width:9.6%}.close-round-print-table th:nth-child(21),.close-round-print-table td:nth-child(21){width:10%}.close-round-print-table thead{display:table-header-group}.close-round-print-table tbody tr{break-inside:avoid;page-break-inside:avoid}';
    frame.srcdoc='<!doctype html><html><head><meta charset="utf-8"><title>Close Round '+esc(date)+'</title><style>'+css+'</style></head><body><div class="sheet"><div class="heading"><strong>Close Round Details for Accounting</strong><span>Business Date: '+esc(date)+'</span></div>'+table+'</div></body></html>';
    document.body.append(frame);
    var cleanup=function(){frame.remove();window.removeEventListener('afterprint',cleanup);};
    window.addEventListener('afterprint',cleanup,{once:true});
    frame.addEventListener('load',function(){var win=frame.contentWindow;if(!win)return;win.focus();setTimeout(function(){win.print();},150);setTimeout(cleanup,15000);},{once:true});
  }
  window.printCloseRoundDetailOnePage=printTable;
  document.addEventListener('click',function(event){
    var button=event.target.closest&&event.target.closest('[data-close-round-detail-print]');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    printTable();
  },true);
}());