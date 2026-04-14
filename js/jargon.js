(function (H) {
  'use strict';

  /** @type {{term:string, meaning:string, aliases?:string[]}[]} */
  const ENTRIES = [
    { term: 'QTH', meaning: 'My location / where I am', aliases: ['location', 'where are you'] },
    { term: 'QSY', meaning: 'Change frequency', aliases: ['change frequency', 'move frequency'] },
    { term: 'QSL', meaning: 'Acknowledged / I copied that correctly', aliases: ['acknowledge', 'copied'] },
    { term: 'QRM', meaning: 'Interference from other stations', aliases: ['interference'] },
    { term: 'QRN', meaning: 'Natural or electrical noise', aliases: ['noise'] },
    { term: 'QRT', meaning: 'Closing station / going off air', aliases: ['going clear', 'off air'] },
    { term: 'QRZ', meaning: 'Who is calling me?', aliases: ['who called'] },
    { term: 'QSO', meaning: 'A contact / conversation', aliases: ['contact', 'chat'] },
    { term: '73', meaning: 'Best regards (closing)', aliases: ['goodbye', 'seventy three'] },
    { term: '88', meaning: 'Hugs and kisses (often to YLs)', aliases: [] },
    { term: 'YL', meaning: 'Young lady (any licensed woman operator)', aliases: ['woman operator'] },
    { term: 'OM', meaning: 'Old man (any male operator, not age-specific)', aliases: ['male operator'] },
    { term: 'XYL', meaning: 'Spouse (often non-ham partner)', aliases: ['wife', 'husband'] },
    { term: 'DX', meaning: 'Distant station / long distance', aliases: ['distance'] },
    { term: 'Rag chew', meaning: 'Long relaxed conversation', aliases: ['ragchew', 'rag chew'] },
    { term: 'Net', meaning: 'Structured round-table on a frequency', aliases: ['roundtable'] },
    { term: 'Net control', meaning: 'Station coordinating the net', aliases: ['nc', 'control'] },
    { term: 'Over', meaning: 'I have finished speaking and hand back to you', aliases: [] },
    { term: 'Break', meaning: 'I need to interrupt (priority or emergency)', aliases: ['break break'] },
    { term: 'Roger', meaning: 'Received and understood', aliases: ['copy', 'roger that'] },
    { term: 'Wilco', meaning: 'Will comply', aliases: [] },
    { term: 'Stand by', meaning: 'Wait a moment', aliases: ['standby'] },
    { term: 'Go ahead', meaning: 'You may transmit now', aliases: ['go ahead please'] },
    { term: 'Listening', meaning: 'Monitoring the frequency', aliases: ['monitor'] },
    { term: 'Clear', meaning: 'I am leaving the frequency', aliases: ['going clear'] },
    { term: 'Traffic', meaning: 'A formal message or something to pass to net control', aliases: ['with traffic'] },
    { term: 'Late', meaning: 'Joining the net after it started', aliases: ['late check-in'] },
    { term: 'Kerchunk', meaning: 'Keying up briefly without speaking (discouraged on repeaters)', aliases: [] },
    { term: 'CTCSS', meaning: 'Sub-audible tone to access some repeaters', aliases: ['tone', 'pl tone'] },
    { term: 'Simplex', meaning: 'Direct radio-to-radio on one frequency', aliases: [] },
    { term: 'Duplex', meaning: 'Different transmit and receive frequencies (repeater)', aliases: [] },
    { term: 'CQ', meaning: 'Calling any station who can hear me', aliases: ['seek you'] },
    { term: 'RST', meaning: 'Readability, Strength, Tone report', aliases: ['signal report'] },
    { term: 'QRP', meaning: 'Low power operating', aliases: [] },
    { term: 'QRO', meaning: 'High power operating', aliases: [] },
    { term: 'SK', meaning: 'End of contact (CW)', aliases: [] },
    { term: 'DE', meaning: 'From / this is (CW)', aliases: [] },
    { term: 'PSE', meaning: 'Please (CW)', aliases: ['please'] },
    { term: 'FB', meaning: 'Fine business / great (CW slang)', aliases: ['fine business'] },
    { term: 'HI HI', meaning: 'Laughter on CW', aliases: [] },
    { term: 'Lid', meaning: 'Operator with poor on-air etiquette (avoid being one)', aliases: [] },
    { term: 'Elmer', meaning: 'Mentor who helps new hams', aliases: ['mentor'] },
    { term: 'Eyeball QSO', meaning: 'Meeting another ham in person', aliases: ['eyeball'] },
    { term: 'Fox hunt', meaning: 'Direction finding game', aliases: ['hidden transmitter'] },
  ];

  function search(query) {
    const q = String(query || '')
      .toLowerCase()
      .trim();
    if (!q) return [];
    return ENTRIES.filter((e) => {
      if (e.term.toLowerCase().indexOf(q) >= 0) return true;
      if (e.meaning.toLowerCase().indexOf(q) >= 0) return true;
      if (e.aliases && e.aliases.some((a) => a.toLowerCase().indexOf(q) >= 0)) return true;
      return false;
    });
  }

  function decodePhrase(text) {
    let out = String(text || '');
    const lower = out.toLowerCase();
    ENTRIES.forEach((e) => {
      const re = new RegExp('\\b' + e.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      if (re.test(out)) {
        out = out.replace(re, e.term + ' (' + e.meaning + ')');
      }
    });
    out = out.replace(/\b(\d{3}\.\d{3})\s*MHz\b/gi, '$1 MHz (example frequency format)');
    return out;
  }

  H.jargon = { ENTRIES, search, decodePhrase };
})(window.HamApp = window.HamApp || {});
