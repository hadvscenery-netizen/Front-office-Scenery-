/* Supabase Auth fallback for browsers that cannot load the optional CDN bundle. */
(() => {
  const config = window.SCENERY_SUPABASE_CONFIG || {};
  const form = document.querySelector('#login-form');
  if (!form || !config.url || !config.anonKey || window.supabase?.createClient) return;

  const notify = (message, type = 'info') => {
    if (typeof window.showToast === 'function') window.showToast(message, type);
    else {
      let notice = document.querySelector('#auth-fallback-notice');
      if (!notice) {
        notice = document.createElement('div');
        notice.id = 'auth-fallback-notice';
        notice.setAttribute('role', 'alert');
        notice.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,520px);padding:13px 18px;border-radius:12px;background:#fff1f0;color:#9b2c2c;border:1px solid #e8a4a0;box-shadow:0 10px 28px rgba(68,43,24,.18);font:600 15px/1.5 system-ui,sans-serif;text-align:center;';
        document.body.appendChild(notice);
      }
      notice.textContent = message;
      notice.style.background = type === 'error' ? '#fff1f0' : '#f1f8ef';
      notice.style.color = type === 'error' ? '#9b2c2c' : '#356b43';
      clearTimeout(notice._timer);
      notice._timer = setTimeout(() => notice.remove(), 6000);
    }
  };
  const messageFor = (body, status) => {
    const raw = String(body?.error_description || body?.msg || body?.message || body?.error || '').toLowerCase();
    if (status === 400 && /invalid login credentials|invalid email or password/.test(raw)) return 'à¸­à¸µà¹€à¸¡à¸¥à¸«à¸£à¸·à¸­à¸£à¸«à¸±à¸ªà¸œà¹ˆà¸²à¸™à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡';
    if (/email not confirmed|confirm/.test(raw)) return 'à¸­à¸µà¹€à¸¡à¸¥à¸™à¸µà¹‰à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸¢à¸·à¸™à¸¢à¸±à¸™à¹ƒà¸™ Supabase';
    if (/rate limit|too many/.test(raw)) return 'à¸¥à¸­à¸‡à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸£à¸°à¸šà¸šà¹ƒà¸«à¸¡à¹ˆà¸­à¸µà¸à¸„à¸£à¸±à¹‰à¸‡à¸ à¸²à¸¢à¸«à¸¥à¸±à¸‡';
    return 'à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸£à¸°à¸šà¸šà¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ à¸à¸£à¸¸à¸“à¸²à¸•à¸£à¸§à¸ˆà¸­à¸µà¹€à¸¡à¸¥à¹à¸¥à¸°à¸£à¸«à¸±à¸ªà¸œà¹ˆà¸²à¸™à¹ƒà¸™ Supabase';
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const username = String(document.querySelector('#username')?.value || '').trim();
    const passwordInput = document.querySelector('#password');
    const password = String(passwordInput?.value || '');
    const email = username.includes('@') ? username : (config.emailDomain ? `${username}@${config.emailDomain}` : '');
    if (!email) {
      notify('à¸à¸£à¸¸à¸“à¸²à¹ƒà¸ªà¹ˆà¸Šà¸·à¹ˆà¸­à¸œà¸¹à¹‰à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¹€à¸›à¹‡à¸™à¸­à¸µà¹€à¸¡à¸¥ à¹€à¸Šà¹ˆà¸™ name@example.com', 'error');
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    if (button) { button.disabled = true; button.dataset.originalText = button.textContent; button.textContent = 'à¸à¸³à¸¥à¸±à¸‡à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸š...'; }
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
      try { localStorage.setItem('scenery-supabase-session', JSON.stringify(body)); } catch {}
      window.scenerySupabase = window.scenerySupabase || {};
      window.scenerySupabase.enabled = true;
      window.scenerySupabase.mode = 'supabase-auth-rest';
      window.scenerySupabase.session = body;
      window.scenerySupabase.user = body.user || null;
      if (passwordInput) passwordInput.value = '';
      document.querySelector('#login-screen')?.classList.add('is-hidden');
      document.querySelector('#app-screen')?.classList.remove('is-hidden');
      notify('à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸£à¸°à¸šà¸š Supabase à¸ªà¸³à¹€à¸£à¹‡à¸ˆ');
    } catch (error) {
      notify('à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­ Supabase à¹„à¸¡à¹ˆà¹„à¸”à¹‰ à¸à¸£à¸¸à¸“à¸²à¸•à¸£à¸§à¸ˆà¸­à¸´à¸™à¹€à¸—à¸­à¸£à¹Œà¹€à¸™à¹‡à¸•à¹à¸¥à¹‰à¸§à¸¥à¸­à¸‡à¹ƒà¸«à¸¡à¹ˆ', 'error');
    } finally {
      if (button) { button.disabled = false; button.textContent = button.dataset.originalText || 'à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸£à¸°à¸šà¸š'; }
    }
  }, true);
})();

