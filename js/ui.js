(function (H) {
  'use strict';

  /** @type {Record<string, HTMLElement|null>} */
  let els = {};
  /** @type {() => void} */
  let persist = function () {};

  function init(options) {
    els = options.els;
    persist = options.persist || function () {};
  }

  function $(id) {
    return H.utils.$(id);
  }

  function syncNetRibbon() {
    const ribbon = $('netRibbon');
    if (!ribbon || !els.flowType) return;
    const show = H.flows.isNetFlow(els.flowType.value);
    ribbon.classList.toggle('hidden', !show);
  }

  function syncNetRosterSection() {
    const section = $('netRosterSection');
    if (!section || !els.flowType) return;
    const show = H.flows.isNetFlow(els.flowType.value) && !!H.state.state.netRosterMode;
    section.classList.toggle('hidden', !show);
  }

  function renderNetRosterGrid() {
    const grid = $('netRosterGrid');
    if (!grid || !els.flowType) return;
    if (!H.flows.isNetFlow(els.flowType.value) || !H.state.state.netRosterMode) {
      grid.innerHTML = '';
      return;
    }
    const st = H.state.state;
    const U = H.utils;
    const members = st.netMembers;
    const nextCall = H.flows.getNextSpeakerAfter(members, st.currentSpeaker);
    grid.innerHTML = '';
    if (!members.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'No check-ins yet. Use Manage net to add callsigns and names.';
      grid.appendChild(empty);
      return;
    }
    members.forEach((member, idx) => {
      const call = U.netMemberCall(member);
      const name = U.netMemberName(member);
      const card = document.createElement('div');
      card.className = 'net-roster-card net-roster-card--clickable';
      card.setAttribute('role', 'button');
      card.tabIndex = 0;
      card.setAttribute(
        'aria-label',
        st.currentSpeaker === call ? call + ' is speaking (click to keep)' : 'Set ' + call + ' as speaking'
      );
      if (st.currentSpeaker === call) card.classList.add('net-roster-card--speaking');
      if (st.controlHolder === call) card.classList.add('net-roster-card--control');
      if (nextCall === call && call !== st.currentSpeaker) card.classList.add('net-roster-card--next');

      const order = document.createElement('span');
      order.className = 'net-roster-card__order';
      order.textContent = String(idx + 1);

      const body = document.createElement('div');
      body.className = 'net-roster-card__body';
      const callEl = document.createElement('div');
      callEl.className = 'net-roster-card__call';
      callEl.textContent = call;
      const nameEl = document.createElement('div');
      nameEl.className = 'net-roster-card__name muted';
      nameEl.textContent = name || '—';
      body.appendChild(callEl);
      body.appendChild(nameEl);

      const tags = document.createElement('div');
      tags.className = 'net-roster-card__tags';
      if (st.currentSpeaker === call) {
        const t = document.createElement('span');
        t.className = 'net-roster-tag';
        t.textContent = 'Speaking';
        tags.appendChild(t);
      }
      if (nextCall === call && call !== st.currentSpeaker) {
        const t = document.createElement('span');
        t.className = 'net-roster-tag net-roster-tag--next';
        t.textContent = 'Next';
        tags.appendChild(t);
      }
      if (st.controlHolder === call) {
        const t = document.createElement('span');
        t.className = 'net-roster-tag';
        t.textContent = 'Control';
        tags.appendChild(t);
      }

      card.appendChild(order);
      card.appendChild(body);
      card.appendChild(tags);

      function activateCard() {
        setCurrentSpeaker(call);
      }
      card.addEventListener('click', activateCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateCard();
        }
      });

      grid.appendChild(card);
    });
  }

  function updateReturnWidgets(context) {
    const st = H.state.state;
    if (els.returnSnippet) {
      els.returnSnippet.textContent = H.flows.wrappedMessage(els, context, st.netMembers, st.currentSpeaker);
    }
    if (els.returnCueDisplay) {
      els.returnCueDisplay.textContent = H.flows.getReturnSnippet(context, st.netMembers, st.currentSpeaker);
    }
  }

  function renderStepDots() {
    const mount = $('stepDots');
    if (!mount) return;
    const st = H.state.state;
    mount.innerHTML = '';
    if (!st.flow.length) return;
    st.flow.forEach((step, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'step-dot';
      b.setAttribute('aria-label', 'Step ' + (idx + 1) + ': ' + step.title);
      if (idx < st.currentIndex) b.classList.add('step-dot--done');
      if (idx === st.currentIndex) b.classList.add('step-dot--active');
      b.addEventListener('click', () => {
        st.currentIndex = idx;
        if (els.customScript) els.customScript.value = '';
        updateView();
        persist();
      });
      mount.appendChild(b);
    });
  }

  function addNetMember(callsign, name) {
    const st = H.state.state;
    const U = H.utils;
    const normalised = U.normaliseCallsign(callsign);
    if (!normalised) return;
    const label = U.clean(name, '');
    const existing = st.netMembers.find((m) => U.netMemberCall(m) === normalised);
    if (existing) {
      if (label) existing.name = label;
    } else {
      st.netMembers.push({ call: normalised, name: label });
    }
    if (!st.currentSpeaker) st.currentSpeaker = normalised;
    if (!st.controlHolder) st.controlHolder = normalised;
    updateView();
    persist();
  }

  function removeNetMember(callsign) {
    const st = H.state.state;
    const U = H.utils;
    st.netMembers = st.netMembers.filter((m) => U.netMemberCall(m) !== callsign);
    if (st.currentSpeaker === callsign) st.currentSpeaker = U.firstNetMemberCall(st.netMembers);
    if (st.controlHolder === callsign) st.controlHolder = U.firstNetMemberCall(st.netMembers);
    updateView();
    persist();
  }

  function setCurrentSpeaker(callsign) {
    H.state.state.currentSpeaker = callsign;
    updateView();
    persist();
  }

  function setControlHolder(callsign) {
    H.state.state.controlHolder = callsign;
    updateView();
    persist();
  }

  function rotateSpeaker() {
    const st = H.state.state;
    st.currentSpeaker = H.flows.getNextSpeakerAfter(st.netMembers, st.currentSpeaker);
    updateView();
    persist();
  }

  function renderMembers() {
    const st = H.state.state;
    if (!els.membersList) return;
    els.membersList.innerHTML = '';
    if (!st.netMembers.length) {
      const empty = document.createElement('div');
      empty.className = 'muted';
      empty.textContent = 'No net members yet.';
      els.membersList.appendChild(empty);
      return;
    }
    st.netMembers.forEach((member) => {
      const call = H.utils.netMemberCall(member);
      const row = document.createElement('div');
      row.className = 'member-row';
      if (st.currentSpeaker === call) row.classList.add('is-speaking');
      if (st.controlHolder === call) row.classList.add('has-control');

      const main = document.createElement('div');
      main.className = 'member-main';
      const top = document.createElement('div');
      top.className = 'member-top';
      const callStrong = document.createElement('strong');
      callStrong.textContent = call;
      top.appendChild(callStrong);
      const tags = document.createElement('div');
      tags.className = 'member-actions';
      if (st.currentSpeaker === call) {
        const speakingTag = document.createElement('span');
        speakingTag.className = 'member-tag';
        speakingTag.textContent = 'Speaking';
        tags.appendChild(speakingTag);
      }
      if (st.controlHolder === call) {
        const controlTag = document.createElement('span');
        controlTag.className = 'member-tag';
        controlTag.textContent = 'Control';
        tags.appendChild(controlTag);
      }
      top.appendChild(tags);

      const nameRow = document.createElement('div');
      nameRow.className = 'member-name-row';
      const nameLab = document.createElement('label');
      nameLab.className = 'muted';
      nameLab.setAttribute('for', 'nm-' + call);
      nameLab.textContent = 'Name';
      const nameInput = document.createElement('input');
      nameInput.id = 'nm-' + call;
      nameInput.type = 'text';
      nameInput.className = 'member-name-input';
      nameInput.setAttribute('data-net-call', call);
      nameInput.placeholder = 'Name';
      nameInput.value = H.utils.netMemberName(member);
      nameInput.addEventListener('change', () => {
        const targetCall = nameInput.getAttribute('data-net-call');
        const rec = st.netMembers.find((m) => H.utils.netMemberCall(m) === targetCall);
        if (rec) rec.name = H.utils.clean(nameInput.value, '');
        persist();
        updateReturnWidgets(H.flows.createContext(els, st));
        renderNetRosterGrid();
        if (els.currentSpeakerDisplay) {
          els.currentSpeakerDisplay.textContent = H.utils.formatNetParticipant(st.netMembers, st.currentSpeaker);
        }
        if (els.controlHolderDisplay) {
          els.controlHolderDisplay.textContent = H.utils.formatNetParticipant(st.netMembers, st.controlHolder);
        }
        if (els.nextSpeakerDisplay) {
          const ctx = H.flows.createContext(els, st);
          els.nextSpeakerDisplay.textContent = H.utils.formatNetParticipant(
            st.netMembers,
            H.flows.nextStation(ctx, st.netMembers, st.currentSpeaker)
          );
        }
      });

      nameRow.appendChild(nameLab);
      nameRow.appendChild(nameInput);

      const actions = document.createElement('div');
      actions.className = 'member-actions';
      const speakBtn = document.createElement('button');
      speakBtn.type = 'button';
      speakBtn.className = 'small';
      speakBtn.textContent = 'Speaking';
      speakBtn.addEventListener('click', () => setCurrentSpeaker(call));
      const controlBtn = document.createElement('button');
      controlBtn.type = 'button';
      controlBtn.className = 'small secondary';
      controlBtn.textContent = 'Control';
      controlBtn.addEventListener('click', () => setControlHolder(call));
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'small danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => removeNetMember(call));
      actions.appendChild(speakBtn);
      actions.appendChild(controlBtn);
      actions.appendChild(deleteBtn);
      main.appendChild(top);
      main.appendChild(nameRow);
      main.appendChild(actions);
      row.appendChild(main);
      els.membersList.appendChild(row);
    });
  }

  function updateDetails(context) {
    const st = H.state.state;
    if (!els.flowDetails) return;
    els.flowDetails.innerHTML = '';
    const grid = $('gridSquareDisplay');
    const gridText = grid ? grid.textContent : '—';
    const rows = [
      ['Callsign', context.my],
      ['Other', context.other],
      ['QTH', context.qth],
      ['Access', context.access + (context.repeater ? ' via ' + context.repeater : '')],
      ['Equipment', H.flows.equipmentSummary(context)],
      ['Traffic', context.traffic],
      ['Grid (approx.)', gridText || '—'],
    ];
    rows.forEach(([k, v]) => {
      const left = document.createElement('div');
      left.textContent = k;
      const right = document.createElement('div');
      right.textContent = v;
      els.flowDetails.appendChild(left);
      els.flowDetails.appendChild(right);
    });
  }

  function updateStickyBar(st) {
    const bar = $('stickyBar');
    if (!bar) return;
    const hasFlow = st.flow.length > 0;
    bar.classList.toggle('hidden', !hasFlow);
  }

  function updateView() {
    const st = H.state.state;
    syncNetRibbon();
    syncNetRosterSection();
    renderMembers();
    renderNetRosterGrid();

    const teleEmpty = $('teleEmpty');
    const teleActive = $('teleActive');
    const context = H.flows.createContext(els, st);
    const stageLabel = els.conversationStage && els.conversationStage.options[els.conversationStage.selectedIndex]
      ? els.conversationStage.options[els.conversationStage.selectedIndex].text
      : '';

    updateReturnWidgets(context);
    H.topics.show(els, st);
    H.progressive.renderBanner(els);

    if (!st.flow.length) {
      if (teleEmpty) teleEmpty.classList.remove('hidden');
      if (teleActive) teleActive.classList.add('hidden');
      if (els.currentScript) els.currentScript.textContent = '';
      const sd = $('stepDots');
      if (sd) sd.innerHTML = '';
      if (els.currentSpeakerDisplay) {
        els.currentSpeakerDisplay.textContent = H.utils.formatNetParticipant(st.netMembers, st.currentSpeaker);
      }
      if (els.controlHolderDisplay) {
        els.controlHolderDisplay.textContent = H.utils.formatNetParticipant(st.netMembers, st.controlHolder);
      }
      if (els.nextSpeakerDisplay) {
        els.nextSpeakerDisplay.textContent = H.utils.formatNetParticipant(
          st.netMembers,
          H.flows.nextStation(context, st.netMembers, st.currentSpeaker)
        );
      }
      updateDetails(context);
      updateStickyBar(st);
      return;
    }

    if (teleEmpty) teleEmpty.classList.add('hidden');
    if (teleActive) teleActive.classList.remove('hidden');

    if (st.currentIndex >= st.flow.length) st.currentIndex = st.flow.length - 1;
    const step = st.flow[st.currentIndex];
    const custom = els.customScript && els.customScript.value.trim();
    const scriptText = custom || step.script;
    if (els.currentScript) els.currentScript.textContent = scriptText;

    const flowTitle = $('teleFlowTitle');
    if (flowTitle && els.flowType) {
      flowTitle.textContent = els.flowType.options[els.flowType.selectedIndex].text;
    }

    const stepLabel = $('teleStepLabel');
    if (stepLabel) {
      stepLabel.textContent =
        'Step ' + (st.currentIndex + 1) + ' of ' + st.flow.length + ' — ' + step.title + ' · ' + stageLabel;
    }

    H.timer.tickDisplay();

    if (els.currentSpeakerDisplay) {
      els.currentSpeakerDisplay.textContent = H.utils.formatNetParticipant(st.netMembers, st.currentSpeaker);
    }
    if (els.controlHolderDisplay) {
      els.controlHolderDisplay.textContent = H.utils.formatNetParticipant(st.netMembers, st.controlHolder);
    }
    if (els.nextSpeakerDisplay) {
      const nextRaw = step.next || H.flows.nextStation(context, st.netMembers, st.currentSpeaker);
      els.nextSpeakerDisplay.textContent =
        nextRaw === '—' ? '—' : H.utils.formatNetParticipant(st.netMembers, nextRaw);
    }

    updateDetails(context);
    renderStepDots();
    updateStickyBar(st);
  }

  function rebuild() {
    const st = H.state.state;
    const context = H.flows.createContext(els, st);
    st.flow = H.flows.buildFlow(context, st);
    st.currentIndex = 0;
    if (els.customScript) els.customScript.value = '';
    if (els.timerAutoStart && els.timerAutoStart.checked) {
      H.timer.reset();
      H.timer.start();
    }
    updateView();
    persist();
    if (els.currentScript) {
      els.currentScript.focus();
    }
  }

  function setReferenceTab(tab) {
    const st = H.state.state;
    const valid = { phrases: 1, spell: 1, jargon: 1, etiquette: 1, practice: 1 };
    if (!valid[tab]) tab = 'phrases';
    st.referenceTab = tab;
    document.querySelectorAll('.ref-tab-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });
    document.querySelectorAll('.ref-tab-panel').forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-tab') === tab);
    });
    persist();
  }

  function openNetManage() {
    const m = $('netManageModal');
    if (m) m.classList.remove('hidden');
  }

  function closeNetManage() {
    const m = $('netManageModal');
    if (m) m.classList.add('hidden');
  }

  async function copyCurrentScript() {
    try {
      const t = els.currentScript ? els.currentScript.textContent : '';
      await navigator.clipboard.writeText(t || '');
      H.toasts.showToast('Script copied', 'success');
    } catch (e) {
      H.toasts.showToast('Copy failed — select text manually', 'error');
    }
  }

  function runTests() {
    const tests = [];
    function assert(name, cond) {
      tests.push({ name, passed: !!cond });
    }
    assert('clean', H.utils.clean('  ', 'x') === 'x');
    assert('joinLines', H.utils.joinLines(['a', '', 'b']) === 'a\nb');
    assert('F 0C', H.utils.fahrenheitFromCelsius(0) === 32);
    const st = H.state.state;
    const saved = st.netMembers.slice();
    const savedSp = st.currentSpeaker;
    const savedCh = st.controlHolder;
    st.netMembers = [
      { call: 'M0AAA', name: '' },
      { call: 'G4BBB', name: '' },
      { call: '2E0CCC', name: '' },
    ];
    st.currentSpeaker = 'M0AAA';
    st.controlHolder = 'M0AAA';
    assert('rotate', H.flows.getNextSpeakerAfter(st.netMembers, 'M0AAA') === 'G4BBB');
    st.netMembers = saved;
    st.currentSpeaker = savedSp;
    st.controlHolder = savedCh;
    const sample = {
      my: 'M0AAA',
      other: 'G4BBB',
      name: 'Alex',
      qth: 'Anytown',
      postcode: 'AB1 2CD',
      equipment: 'Example HT',
      antenna: 'Vertical',
      report: '5 and 9',
      access: 'Hotspot',
      repeater: 'TG91',
      extra: 'short QSO',
      traffic: 'No traffic',
      weather: '10C example',
      flowType: 'dmr_qso',
      stage: 'mid',
    };
    const flow = H.flows.buildFlow(sample, st);
    assert('flow len', flow.length === 4);
    assert('hotspot', flow[1].script.indexOf('hotspot') >= 0);
    const tr = $('testResults');
    if (tr) {
      tr.innerHTML = '';
      tests.forEach((t) => {
        const item = document.createElement('div');
        item.className = 'ref-card';
        const h = document.createElement('h4');
        h.className = t.passed ? 'ok' : 'bad';
        h.textContent = (t.passed ? 'PASS' : 'FAIL') + ' — ' + t.name;
        item.appendChild(h);
        tr.appendChild(item);
      });
    } else {
      console.table(tests);
    }
  }

  H.ui = {
    init,
    updateView,
    rebuild,
    setReferenceTab,
    copyCurrentScript,
    runTests,
    addNetMember,
    removeNetMember,
    rotateSpeaker,
    setCurrentSpeaker,
    setControlHolder,
    openNetManage,
    closeNetManage,
  };
})(window.HamApp = window.HamApp || {});
