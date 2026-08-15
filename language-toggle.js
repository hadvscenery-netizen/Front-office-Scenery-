(function(){
  const STORAGE_KEY='scenery-language';
  const dictionary={
    'ชื่อผู้ใช้งาน':'Username','อีเมลผู้ใช้งาน':'User email','รหัสผ่าน':'Password','ลืมรหัสผ่าน?':'Forgot password?',
    'แสดงรหัสผ่าน':'Show password','ซ่อนรหัสผ่าน':'Hide password','เข้าสู่ระบบ':'Log in','ภาษาไทย':'English','ช่วยเหลือ':'Help',
    'เชื่อมต่อระบบแล้ว':'System connected','หน่วยงานปัจจุบัน':'Current workspace','เมนูหลัก':'Main menu','แดชบอร์ด':'Dashboard',
    'ภาพรวมประจำวัน':'Daily Overview','สร้างใบแจ้งหนี้':'Create Invoice','ประวัติใบแจ้งหนี้':'Invoice History','ลิ้นชักเก็บเงิน':'Cash Drawer',
    'กะเปิด':'Shift Open','ปิดรอบ':'Close Round','ข้อมูลหลัก':'Master Data','ผู้ใช้งาน':'Users','นำเข้าข้อมูล':'Data Import',
    'บันทึกการตรวจสอบ':'Audit Log','ต้องการความช่วยเหลือ?':'Need help?','ติดต่อฝ่ายไอที 24/7':'Contact IT 24/7',
    'เปิดเมนู':'Open menu','ปิดเมนู':'Close menu','ค้นหาบิล หรือ สินค้า...':'Search bills or products...','การแจ้งเตือน':'Notifications','ตั้งค่า':'Settings',
    'วันนี้':'Today','เมื่อวาน':'Yesterday','สัปดาห์นี้':'This week','เดือนนี้':'This month','ค้นหา':'Search','เลือก':'Select',
    'เพิ่มรายการ':'Add item','แก้ไข':'Edit','ลบ':'Delete','บันทึก':'Save','ยกเลิก':'Cancel','ยืนยัน':'Confirm','ปิด':'Close',
    'รีเฟรช':'Refresh','เริ่มใหม่':'Start over','ดูรายละเอียด':'View details','ดูทั้งหมด':'View all','ส่งออก':'Export','ดาวน์โหลด':'Download',
    'อัปโหลด':'Upload','นำเข้าไฟล์':'Import file','เลือกไฟล์จากเครื่อง':'Choose file','สำเร็จ':'Success','เสร็จสมบูรณ์':'Completed',
    'กำลังโหลด':'Loading','ข้อมูลพร้อมใช้':'Data ready','รอข้อมูล':'Waiting for data','ไม่พบข้อมูล':'No data found','ไม่พบรายการ':'No items found',
    'รายการ':'Items','จำนวนรายการ':'Item count','ยอดรวม':'Total','รวมทั้งหมด':'Grand total','สถานะ':'Status','หมายเหตุ':'Note',
    'ผู้ใช้งานออนไลน์':'Users online','ใช้งาน':'Active','ไม่ใช้งาน':'Inactive','รอตรวจสอบ':'Pending review','เรียบร้อย':'Ready',
    'รายละเอียดรายการ':'Item details','รายละเอียดรายการตาม Villa และ Invoice':'Villa and Invoice details','รหัส':'Code','ชื่อลูกค้า':'Customer',
    'ชื่อวิลล่า':'Villa name','รหัส Villa / Room':'Villa / Room code','ลูกค้า':'Customer','ยอดรวม (Q)':'Total (Q)','Deposit (R)':'Deposit (R)',
    'คงเหลือ (S)':'Balance (S)','รายได้หน้า Front':'Front Desk Revenue','ช่องทางชำระเงิน':'Payment method','หมายเหตุ (AB)':'Note (AB)',
    'Business Date':'Business Date','รอบการปิด':'Closing cycle','รอบประจำวัน':'Daily round','ข้อมูลหลัก':'Master Data',
    'ระบบจะตรวจรายการซ้ำ':'The system will check duplicates','รองรับ':'Supports','รายการต้องตรวจสอบ':'Items requiring review',
    'ผู้ใช้งานและสิทธิ์':'Users and permissions','สิทธิ์':'Permissions','ค้นหาชื่อหรืออีเมล...':'Search name or email...',
    'ทุก Role':'All roles','จุดขาย':'Sales point','เข้าใช้ล่าสุด':'Last login','กำลังใช้งาน':'Currently active','ทุกจุดขาย':'All sales points',
    'นำเข้าข้อมูลและตรวจคุณภาพ':'Import and data quality','ลากไฟล์ Excel มาวางที่นี่':'Drop an Excel file here','ดูรายงานคุณภาพข้อมูล':'View data quality report',
    'บันทึกการตรวจสอบ':'Audit Log','ค้นหาการทำรายการ หรือเลขอ้างอิง...':'Search transaction or reference...',
    'ทุกประเภท':'All types','7 วันที่ผ่านมา':'Last 7 days','รหัส Villa':'Villa code','เลือกหมวดก่อน':'Select a category first',
    'เลือกรายการในหมวดนี้':'Select an item in this category','กรุณาเลือก':'Please select','กรุณากรอก':'Please enter',
    'รหัสผ่านไม่ถูกต้อง':'Incorrect password','อีเมลหรือรหัสผ่านไม่ถูกต้อง':'Incorrect email or password','เข้าสู่ระบบแล้ว':'Signed in',
    'ออกจากระบบ':'Log out','เปลี่ยนภาษา':'Change language','ภาษา':'Language','ไทย':'Thai','อังกฤษ':'English',
    'รอข้อมูล Finalized':'Waiting for finalized data','ข้อมูลพร้อมตรวจสอบ':'Data ready for review','ปิดรอบแล้ว':'Round closed',
    'Submit และ Lock รอบ':'Submit and lock round','รอบถูกล็อกแล้ว':'Round is locked','ยังไม่มีรายการของวันนี้':'No items for today',
    'สรุปตามหมวดรายได้':'Revenue category summary','รายได้หน้า Front / ช่องทางชำระเงิน':'Front Desk revenue / payment methods',
    'ตรวจสอบก่อน Submit':'Review before submitting','ไม่พบยอดค้างชำระ':'No outstanding balance','ยอดคงเหลือเป็นศูนย์':'Balance is zero',
    'รายการที่ต้องตรวจสอบ':'Items to review','ส่งออกปิดรอบ':'Export close round','เริ่มกะ':'Open shift','ปิดกะ':'Close shift',
    'เงินสด':'Cash','โอน':'Transfer','บัตรเครดิต':'Credit card','คิวอาโค้ต':'QR Code','ไม่เรียกเก็บ':'No charge','ค้างชำระ':'Pending payment',
    'พิมพ์หมายเหตุ':'Enter a note','เลือกภาษา':'Choose language'
  };
  const entries=Object.entries(dictionary).sort((a,b)=>b[0].length-a[0].length);
  let language=localStorage.getItem(STORAGE_KEY)==='en'?'en':'th';
  let scanning=false;
  const originalText=new WeakMap(),originalAttrs=new WeakMap();
  const skip=node=>{const parent=node.parentElement;return !parent||parent.closest('script,style,textarea,[data-no-translate]')||parent.classList.contains('material-symbols-outlined')};
  const translate=value=>entries.reduce((text,[from,to])=>text.split(from).join(to),String(value));
  function scan(root){
    if(!root||scanning)return;
    scanning=true;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];let node;
    while((node=walker.nextNode()))if(!skip(node))nodes.push(node);
    nodes.forEach(textNode=>{
      if(!originalText.has(textNode))originalText.set(textNode,textNode.nodeValue);
      textNode.nodeValue=language==='en'?translate(originalText.get(textNode)):originalText.get(textNode);
    });
    const elements=root.querySelectorAll?root.querySelectorAll('input,select,button,[aria-label],[title],[placeholder],[data-title],option'):[];
    elements.forEach(element=>{
      if(!originalAttrs.has(element))originalAttrs.set(element,{});
      const saved=originalAttrs.get(element);
      ['placeholder','aria-label','title','data-title'].forEach(name=>{
        if(element.hasAttribute(name)&&saved[name]===undefined)saved[name]=element.getAttribute(name);
        if(saved[name]!==undefined)element.setAttribute(name,language==='en'?translate(saved[name]):saved[name]);
      });
    });
    scanning=false;
  }
  function updateButtons(){
    document.querySelectorAll('[data-language-toggle],.language-toggle').forEach(button=>{
      const label=button.querySelector('.language-toggle-label')||button.lastChild;
      if(label&&label.nodeType===3)label.nodeValue=language==='en'?'ภาษาไทย':'English';
      else if(label)label.textContent=language==='en'?'ภาษาไทย':'English';
      button.setAttribute('aria-label',language==='en'?'เปลี่ยนเป็นภาษาไทย':'Switch to English');
    });
    document.documentElement.lang=language==='en'?'en':'th';
  }
  function apply(next){language=next==='en'?'en':'th';localStorage.setItem(STORAGE_KEY,language);scan(document.body);updateButtons();}
  function toggle(event){const button=event.target.closest?.('[data-language-toggle],.language-toggle');if(!button)return;event.preventDefault();apply(language==='en'?'th':'en')}
  function start(){
    document.addEventListener('click',toggle);
    apply(language);
    new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node)}))).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
