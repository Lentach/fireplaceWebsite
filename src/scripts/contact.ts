// Contact form: POST /contact on the Fireplace backend (same origin — the
// message never touches a third party). Honeypot field + server-side 5/15min
// per-IP throttle; the backend stores the row and pings the owner's devices.
export function initContact(root: HTMLElement) {
  const msg = root.querySelector<HTMLTextAreaElement>('#contact-msg')!;
  const reply = root.querySelector<HTMLInputElement>('#contact-reply')!;
  const hp = root.querySelector<HTMLInputElement>('.c-hp')!;
  const send = root.querySelector<HTMLButtonElement>('.c-send')!;
  const status = root.querySelector<HTMLElement>('.c-status b')!;
  const dotWrap = root.querySelector<HTMLElement>('.c-status')!;

  let busy = false;
  let revert = 0;
  const setStatus = (text: string, cls: '' | 'ok' | 'err') => {
    status.textContent = text;
    dotWrap.classList.toggle('ok', cls === 'ok');
    dotWrap.classList.toggle('err', cls === 'err');
  };

  send.addEventListener('click', async () => {
    if (busy) return;
    const message = msg.value.trim();
    if (!message) {
      msg.focus();
      return;
    }
    busy = true;
    clearTimeout(revert);
    setStatus('Sending…', '');
    // blur inside the tap gesture — the soft keyboard drops while we send
    msg.blur();
    reply.blur();
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          replyTo: reply.value.trim() || undefined,
          website: hp.value || undefined,
        }),
      });
      if (res.status === 429) {
        setStatus('Too many — try later', 'err');
      } else if (!res.ok) {
        throw new Error(String(res.status));
      } else {
        msg.value = '';
        reply.value = '';
        setStatus('Sent · sealed away ✓', 'ok');
      }
    } catch {
      setStatus('Failed — try again later', 'err');
    } finally {
      busy = false;
      revert = window.setTimeout(() => setStatus('Ready', ''), 6000);
    }
  });
}
