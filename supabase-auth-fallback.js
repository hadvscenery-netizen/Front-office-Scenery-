/* Supabase Auth fallback for browsers that cannot load the optional CDN bundle. */
(() => {
  const config = window.SCENERY_SUPABASE_CONFIG || {};
  const form = document.querySelector('#login-form');
  if (!form || !config.url || !config.anonKey || window.supabase?.createClient) return;

  const notify = (message, type = 'info') => {
    if (typeof window.showToast === 'function') window.showToast(message, type);
    else window.alert(message);
  };
  const messageFor = (body, status) => {
    const raw = String(body?.error_description || body?.msg || body?.message || body?.error || '').toLowerCase();
    if (status === 400 && /invalid login credentials|invalid email or password/.test(raw)) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    if (/email not confirmed|confirm/.test(raw)) return 'อีเมลนี้ยังไม่ได้ยืนยันใน Supabase';
    if (/rate limit|too many/.test(raw)) return 'ลองเข้าสู่ระบบใหม่อีกครั้งภายหลัง';
    return 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจอีเมลและรหัสผ่านใน Supabase';
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const username = String(document.querySelector('#username')?.value || '').trim();
    const passwordInput = document.querySelector('#password');
    const password = String(passwordInput?.value || '');
    const email = username.includes('@') ? username : (config.emailDomain ? `${username}@${config.emailDomain}` : '');
    if (!email) {
      notify('กรุณาใส่ชื่อผู้ใช้งานเป็นอีเมล เช่น name@example.com', 'error');
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    if (button) { button.disabled = true; button.dataset.originalText = button.textContent; button.textContent = 'กำลังตรวจสอบ...'; }
    try {
      const response = await fetch(`${String(config.url).replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: config.anonKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.access_token) {
        notify(messageFor(body, response.status), 'error');
        return;
      }
      try { localStorage.setItem('scenery-last-login-email', email); } catch {}
      window.scenerySupabase = window.scenerySupabase || {};
      window.scenerySupabase.enabled = true;
      window.scenerySupabase.mode = 'supabase-auth-rest';
      window.scenerySupabase.session = body;
      window.scenerySupabase.user = body.user || null;
      if (passwordInput) passwordInput.value = '';
      document.querySelector('#login-screen')?.classList.add('is-hidden');
      document.querySelector('#app-screen')?.classList.remove('is-hidden');
      notify('เข้าสู่ระบบ Supabase สำเร็จ');
    } catch (error) {
      notify('เชื่อมต่อ Supabase ไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่', 'error');
    } finally {
      if (button) { button.disabled = false; button.textContent = button.dataset.originalText || 'เข้าสู่ระบบ'; }
    }
  }, true);
})();
