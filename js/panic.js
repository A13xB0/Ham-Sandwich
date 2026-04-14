(function (H) {
  'use strict';

  function openModal(els, st) {
    const backdrop = H.utils.$('panicModal');
    if (!backdrop) return;
    const ctx = H.flows.createContext(els, st);
    const list = H.utils.$('panicPhrases');
    if (!list) return;
    list.innerHTML = '';
    const phrases = [];
    if (H.flows.isNetFlow(ctx.flowType)) {
      phrases.push('Back to net, ' + ctx.my);
      phrases.push('Nothing further from ' + ctx.my + ', back to net.');
      phrases.push(ctx.my + ' going clear, 73, ' + ctx.my);
    } else {
      const other = ctx.other === 'OTHERCALL' ? 'G4BBB' : ctx.other;
      phrases.push('Back to you, ' + ctx.my);
      phrases.push('Stand by one moment, ' + other + ', ' + ctx.my);
      phrases.push('Thanks for the contact, 73, ' + ctx.my + ' clear.');
    }
    phrases.forEach((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'secondary';
      b.style.width = '100%';
      b.textContent = p;
      b.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(p);
          H.toasts.showToast('Copied to clipboard', 'success');
        } catch (e) {
          H.toasts.showToast('Copy failed', 'error');
        }
        backdrop.classList.add('hidden');
      });
      list.appendChild(b);
    });
    backdrop.classList.remove('hidden');
  }

  function closeModal() {
    const backdrop = H.utils.$('panicModal');
    if (backdrop) backdrop.classList.add('hidden');
  }

  H.panic = { openModal, closeModal };
})(window.HamApp = window.HamApp || {});
