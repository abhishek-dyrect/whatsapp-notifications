
const { useState, useRef } = React;

/* ── helpers ──────────────────────────────── */
function renderPreview(body, variables) {
  let t = body || '';
  variables.forEach((v, i) => { t = t.split(`{{${i+1}}}`).join(v.example || `{{${i+1}}}`); });
  return t.split('\n').map((line, li, arr) => {
    const parts = [];
    line.split(/\*([^*]+)\*/g).forEach((seg, si) => {
      if (si % 2 === 1) parts.push(<strong key={si}>{seg}</strong>);
      else seg.split(/_([^_]+)_/g).forEach((s, ii) => {
        if (ii % 2 === 1) parts.push(<em key={`i${ii}`}>{s}</em>);
        else parts.push(s);
      });
    });
    return <React.Fragment key={li}>{parts}{li < arr.length-1 && <br/>}</React.Fragment>;
  });
}

const EVENT_OPTIONS = [
  { id:'warranty.registered',  label:'Warranty registered',  desc:'Customer successfully registers a product warranty.',      icon:'🛡️', vars:[{token:'{{1}}',label:'customer_name',example:'Aarav'},{token:'{{2}}',label:'product_name',example:'boAt Rockerz 480'},{token:'{{3}}',label:'warranty_id',example:'WR-84921'},{token:'{{4}}',label:'expiry_date',example:'Apr 15, 2027'}] },
  { id:'claim.created',        label:'Claim created',        desc:'A warranty claim is raised by or for a customer.',         icon:'📋', vars:[{token:'{{1}}',label:'customer_name',example:'Priya'},{token:'{{2}}',label:'claim_id',example:'CL-22047'},{token:'{{3}}',label:'product_name',example:'Sony WH-1000XM5'},{token:'{{4}}',label:'issue_type',example:'Physical damage'}] },
  { id:'claim.status_changed', label:'Claim status update',  desc:'A claim transitions to a new status (e.g. In Review).',   icon:'🔄', vars:[{token:'{{1}}',label:'claim_id',example:'CL-22047'},{token:'{{2}}',label:'new_status',example:'Under review'},{token:'{{3}}',label:'status_message',example:'Our team is reviewing your documents.'}] },
  { id:'ticket.updated',       label:'Ticket update',        desc:'A support ticket is updated or resolved.',                icon:'🎫', vars:[{token:'{{1}}',label:'ticket_id',example:'TK-5521'},{token:'{{2}}',label:'new_status',example:'resolved'},{token:'{{3}}',label:'resolution_note',example:'Your issue has been fixed.'}] },
];

const STEPS = ['Event', 'Details', 'Build', 'Review'];

/* ── Step indicator ───────────────────────── */
function Steps({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'16px 28px', borderBottom:'1px solid var(--border-default)', flexShrink:0 }}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:26, height:26, borderRadius:'50%', display:'grid', placeItems:'center',
                fontSize:12, fontWeight:600, flexShrink:0,
                background: done ? 'var(--success)' : active ? 'var(--brand-blue)' : 'var(--bg-muted)',
                color: done || active ? '#fff' : 'var(--fg-3)',
                border: !done && !active ? '1px solid var(--border-default)' : 'none',
              }}>
                {done ? <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5"><path d="m4 8 3 3 5-6"/></svg> : i+1}
              </div>
              <span style={{ fontSize:13, fontWeight: active ? 600 : 400, color: active ? 'var(--fg-1)' : done ? 'var(--success)' : 'var(--fg-3)' }}>{label}</span>
            </div>
            {i < STEPS.length-1 && (
              <div style={{ flex:1, height:1, background: done ? 'var(--success)' : 'var(--border-default)', margin:'0 10px', transition:'background .2s' }}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Mini phone preview ───────────────────── */
function MiniPreview({ header, body, footer, buttons, variables }) {
  const bodyRendered = renderPreview(body, variables);
  return (
    <div style={{ border:'1px solid var(--border-default)', borderRadius:10, overflow:'hidden', boxShadow:'var(--shadow-md)', width:'100%', maxWidth:260 }}>
      <div style={{ background:'#075E54', padding:'8px 12px', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:28, height:28, borderRadius:'50%', background:'#25D366', color:'#fff', display:'grid', placeItems:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>D</div>
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>Dyrect</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.65)' }}>Business account</div>
        </div>
      </div>
      <div style={{ background:'#ECE5DD', padding:'10px 8px', minHeight:120 }}>
        <div style={{ fontSize:10, color:'#667781', background:'rgba(255,255,255,0.8)', padding:'2px 8px', borderRadius:999, margin:'0 auto 8px', width:'fit-content' }}>Today</div>
        <div style={{ maxWidth:210 }}>
          <div style={{ background:'#fff', borderRadius:'0 6px 6px 6px', padding:'7px 9px 5px', boxShadow:'0 1px 1px rgba(0,0,0,0.08)', marginBottom:1 }}>
            {header.type === 'TEXT' && header.text && <div style={{ fontWeight:700, fontSize:12, color:'#111B21', marginBottom:4 }}>{header.text}</div>}
            {header.type === 'IMAGE' && <div style={{ height:70, background:'#D0D0D0', borderRadius:4, marginBottom:6, display:'grid', placeItems:'center', fontSize:10, color:'#888' }}>📷 Image</div>}
            {header.type === 'VIDEO' && <div style={{ height:60, background:'#111', borderRadius:4, marginBottom:6, display:'grid', placeItems:'center', fontSize:10, color:'#aaa' }}>▶ Video</div>}
            {header.type === 'DOCUMENT' && <div style={{ background:'#F0F0F0', borderRadius:4, padding:'5px 7px', marginBottom:6, fontSize:10, color:'#333', display:'flex', gap:5 }}>📄 document.pdf</div>}
            <div style={{ fontSize:12, color:'#111B21', lineHeight:1.5, wordBreak:'break-word' }}>{bodyRendered || <span style={{ color:'#aaa' }}>Your message here…</span>}</div>
            {footer && <div style={{ fontSize:10, color:'#8696A0', marginTop:4 }}>{footer}</div>}
            <div style={{ display:'flex', justifyContent:'flex-end', gap:3, marginTop:3, fontSize:9, color:'#667781' }}>
              <span>9:41 AM</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="2"><path d="m4 12 5 5 11-11M7 12l5 5 11-11"/></svg>
            </div>
          </div>
          {buttons.length > 0 && (
            <div style={{ background:'#fff', borderRadius:'0 0 6px 6px', overflow:'hidden', boxShadow:'0 1px 1px rgba(0,0,0,0.08)' }}>
              {buttons.map((btn, i) => (
                <div key={i} style={{ borderTop: i>0 ? '1px solid #E9ECEF':'none', padding:'6px 9px', textAlign:'center', fontSize:11, fontWeight:500, color: btn.type==='QUICK_REPLY'?'#00A884':'#0070BA' }}>
                  {btn.label || `Button ${i+1}`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main wizard ──────────────────────────── */
function WANewTemplate({ onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // step 2 — details
  const [details, setDetails] = useState({ name:'', language:'en_US', category:'Utility' });

  // step 3 — build
  const [header, setHeader]   = useState({ type:'NONE', text:'' });
  const [body, setBody]       = useState('');
  const [footer, setFooter]   = useState('');
  const [buttons, setButtons] = useState([]);
  const [openSections, setOpenSections] = useState(new Set(['body']));
  const [copiedToken, setCopiedToken]   = useState(null);
  const bodyRef = useRef(null);

  const eventDef = EVENT_OPTIONS.find(e => e.id === selectedEvent);
  const variables = eventDef?.vars || [];

  const toggleSection = (id) => setOpenSections(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const insertToken = (token) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const nb = body.slice(0,s) + token + body.slice(e);
    setBody(nb);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s+token.length, s+token.length); }, 0);
  };

  const copyToken = (token) => {
    navigator.clipboard?.writeText(token).catch(()=>{});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1400);
  };

  const addButton = () => {
    if (buttons.length >= 3) return;
    setButtons(prev => [...prev, { type:'QUICK_REPLY', label:'' }]);
  };
  const updateButton = (i, val) => setButtons(prev => prev.map((b,idx) => idx===i ? val : b));
  const removeButton = (i) => setButtons(prev => prev.filter((_,idx) => idx!==i));

  // auto-suggest name from event
  const handleEventSelect = (id) => {
    setSelectedEvent(id);
    const ev = EVENT_OPTIONS.find(e => e.id === id);
    if (ev && !details.name) {
      setDetails(d => ({ ...d, name: ev.id.replace('.','_').replace('_changed','_update') + '_v1' }));
    }
  };

  const canContinue = () => {
    if (step === 0) return !!selectedEvent;
    if (step === 1) return details.name.trim().length > 0;
    if (step === 2) return body.trim().length > 0;
    return true;
  };

  const handleSubmit = () => {
    const newTemplate = {
      id: details.name,
      name: details.name,
      isDefault: false,
      event: selectedEvent,
      eventLabel: eventDef?.label || '',
      category: details.category,
      language: details.language,
      header,
      body,
      footer,
      buttons,
      variables,
      status: 'pending',
      qualityRating: null,
      deliveryRate: null,
      readRate: null,
      rejectionReason: null,
    };
    onSave(newTemplate);
    onClose();
  };

  return (
    <div style={nts.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={nts.modal}>

        {/* Header */}
        <div style={nts.header}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'var(--brand-blue-100,#EEF4FF)', color:'var(--brand-blue)', display:'grid', placeItems:'center', flexShrink:0 }}>
              <Icon name="plus" size={16}/>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--fg-1)', letterSpacing:'-0.01em' }}>New template</div>
              <div style={{ fontSize:12, color:'var(--fg-2)', marginTop:1 }}>Templates are reviewed by Meta before going live.</div>
            </div>
          </div>
          <button style={nts.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 4 4 12M4 4l8 8"/></svg>
          </button>
        </div>

        {/* Steps */}
        <Steps current={step} />

        {/* Body */}
        <div style={nts.body}>

          {/* ── STEP 0: Choose event ── */}
          {step === 0 && (
            <div style={nts.stepWrap}>
              <div style={nts.stepTitle}>Which event triggers this template?</div>
              <div style={nts.stepDesc}>Each notification maps to exactly one Dyrect event. You can create multiple templates per event.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:20 }}>
                {EVENT_OPTIONS.map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => handleEventSelect(ev.id)}
                    style={{
                      display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
                      borderRadius:'var(--radius-sm)', cursor:'pointer',
                      border: selectedEvent===ev.id ? '2px solid var(--brand-blue)' : '1px solid var(--border-default)',
                      background: selectedEvent===ev.id ? 'var(--brand-blue-50,#EEF4FF)' : 'var(--bg-surface)',
                      transition:'border .1s, background .1s',
                    }}
                  >
                    <div style={{ fontSize:24 }}>{ev.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:'var(--fg-1)' }}>{ev.label}</div>
                      <div style={{ fontSize:13, color:'var(--fg-2)', marginTop:2 }}>{ev.desc}</div>
                    </div>
                    <div style={{ flexShrink:0 }}>
                      <div style={{
                        width:18, height:18, borderRadius:'50%',
                        border: selectedEvent===ev.id ? 'none' : '1.5px solid var(--border-strong)',
                        background: selectedEvent===ev.id ? 'var(--brand-blue)' : 'transparent',
                        display:'grid', placeItems:'center',
                      }}>
                        {selectedEvent===ev.id && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: Details ── */}
          {step === 1 && (
            <div style={nts.stepWrap}>
              <div style={nts.stepTitle}>Name your template</div>
              <div style={nts.stepDesc}>Template names are permanent after submission to Meta. Use lowercase letters, numbers, and underscores only.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:20 }}>

                {/* Event chip */}
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)' }}>
                  <span style={{ fontSize:18 }}>{eventDef?.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)' }}>{eventDef?.label}</div>
                    <div style={{ fontSize:12, color:'var(--fg-2)' }}>Event · {variables.length} available variables</div>
                  </div>
                  <button onClick={() => setStep(0)} style={{ marginLeft:'auto', fontSize:12, color:'var(--brand-blue)', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>Change →</button>
                </div>

                <div style={nts.field}>
                  <label style={nts.label}>Template name <span style={{ color:'var(--danger)' }}>*</span></label>
                  <input
                    value={details.name}
                    onChange={e => setDetails(d => ({ ...d, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'') }))}
                    style={{ ...nts.input, fontFamily:'var(--font-mono)' }}
                    placeholder="e.g. warranty_registered_v2"
                    maxLength={512}
                    autoFocus
                  />
                  <div style={{ fontSize:11, color:'var(--fg-3)' }}>Lowercase, numbers, underscores only. Cannot be changed after approval.</div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div style={nts.field}>
                    <label style={nts.label}>Language</label>
                    <select value={details.language} onChange={e => setDetails(d => ({...d, language:e.target.value}))} style={nts.select}>
                      <option value="en_US">English (US)</option>
                      <option value="en_GB">English (UK)</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                  <div style={nts.field}>
                    <label style={nts.label}>Category</label>
                    <select value={details.category} onChange={e => setDetails(d => ({...d, category:e.target.value}))} style={nts.select}>
                      <option value="Utility">Utility</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Authentication">Authentication</option>
                    </select>
                    <div style={{ fontSize:11, color:'var(--fg-3)' }}>Utility messages have lower Meta fees.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Build ── */}
          {step === 2 && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', height:'100%', overflow:'hidden' }}>

              {/* Left: form */}
              <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:10, overflowY:'auto', borderRight:'1px solid var(--border-default)' }}>

                {/* HEADER */}
                <BuildSection title="Header" badge="Optional" open={openSections.has('header')} onToggle={() => toggleSection('header')}>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {['NONE','TEXT','IMAGE','VIDEO','DOCUMENT'].map(t => (
                        <button key={t} onClick={() => setHeader({ type:t, text:'' })} style={{
                          padding:'5px 10px', borderRadius:5, fontSize:12, fontWeight:500, cursor:'pointer',
                          border: header.type===t ? 'none':'1px solid var(--border-default)',
                          background: header.type===t ? 'var(--brand-blue)':'var(--bg-surface)',
                          color: header.type===t ? '#fff':'var(--fg-2)',
                        }}>{t.charAt(0)+t.slice(1).toLowerCase()}</button>
                      ))}
                    </div>
                    {header.type==='TEXT' && (
                      <input
                        value={header.text}
                        onChange={e => setHeader(h => ({...h, text:e.target.value}))}
                        style={{ ...nts.input, height:36 }}
                        maxLength={60}
                        placeholder="Header text (max 60 chars)"
                      />
                    )}
                    {(header.type==='IMAGE'||header.type==='VIDEO'||header.type==='DOCUMENT') && (
                      <div style={{ padding:'14px', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)', border:'2px dashed var(--border-default)', textAlign:'center', color:'var(--fg-3)', fontSize:12 }}>
                        {header.type==='IMAGE' && '📷 Upload sample image for Meta review'}
                        {header.type==='VIDEO' && '🎬 Upload sample video for Meta review'}
                        {header.type==='DOCUMENT' && '📄 Upload sample document for Meta review'}
                      </div>
                    )}
                  </div>
                </BuildSection>

                {/* BODY */}
                <BuildSection title="Body" required open={openSections.has('body')} onToggle={() => toggleSection('body')}>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    <textarea
                      ref={bodyRef}
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      style={{ width:'100%', padding:'9px 11px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontFamily:'var(--font-sans)', fontSize:13, color:'var(--fg-1)', resize:'vertical', lineHeight:1.55, outline:'none', boxSizing:'border-box' }}
                      rows={6}
                      maxLength={1024}
                      placeholder={`Hi {{1}}, your ${eventDef?.label?.toLowerCase() || 'notification'}…`}
                    />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--fg-3)' }}>
                      <span>Use <code style={{ fontFamily:'var(--font-mono)', background:'var(--bg-muted)', padding:'1px 3px', borderRadius:3 }}>*bold*</code>, <code style={{ fontFamily:'var(--font-mono)', background:'var(--bg-muted)', padding:'1px 3px', borderRadius:3 }}>_italic_</code></span>
                      <span>{body.length}/1024</span>
                    </div>

                    {/* Variables */}
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--fg-2)', marginTop:4 }}>Available variables</div>
                    {variables.map((v, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 9px', borderRadius:'var(--radius-sm)', background:'var(--bg-muted)', border:'1px solid var(--border-default)' }}>
                        <code style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, color:'var(--brand-blue)', background:'var(--brand-blue-100,#EEF4FF)', padding:'2px 5px', borderRadius:3, flexShrink:0 }}>{v.token}</code>
                        <span style={{ fontSize:12, color:'var(--fg-2)', flex:1 }}>{v.label}</span>
                        <span style={{ fontSize:11, color:'var(--fg-3)', fontStyle:'italic' }}>{v.example}</span>
                        <button style={{ width:20, height:20, borderRadius:3, border:'1px solid var(--border-default)', background:'var(--bg-surface)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)' }} onClick={() => insertToken(v.token)} title="Insert">
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                        </button>
                        <button style={{ width:20, height:20, borderRadius:3, border:'1px solid var(--border-default)', background:'var(--bg-surface)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)' }} onClick={() => copyToken(v.token)}>
                          {copiedToken===v.token
                            ? <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="var(--success)" strokeWidth="2"><path d="m4 8 3 3 5-6"/></svg>
                            : <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="7" width="7" height="7" rx="1"/><path d="M4 10H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/></svg>
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </BuildSection>

                {/* FOOTER */}
                <BuildSection title="Footer" badge="Optional" open={openSections.has('footer')} onToggle={() => toggleSection('footer')}>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <input value={footer} onChange={e => setFooter(e.target.value)} style={{ ...nts.input, height:36 }} maxLength={60} placeholder="e.g. Dyrect Warranty Services" />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--fg-3)' }}>
                      <span>Static text only — no variables</span>
                      <span>{footer.length}/60</span>
                    </div>
                  </div>
                </BuildSection>

                {/* BUTTONS */}
                <BuildSection title="Buttons" badge={buttons.length > 0 ? `${buttons.length} added` : 'Optional'} open={openSections.has('buttons')} onToggle={() => toggleSection('buttons')}>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {buttons.map((btn, i) => (
                      <div key={i} style={{ display:'flex', gap:7, alignItems:'flex-start', padding:'10px', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)' }}>
                        <div style={{ flex:1, display:'grid', gridTemplateColumns:'130px 1fr', gap:7 }}>
                          <div>
                            <div style={{ fontSize:10, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>Type</div>
                            <select value={btn.type} onChange={e => updateButton(i, {...btn, type:e.target.value})} style={{ ...nts.select, height:32, fontSize:12 }}>
                              <option value="QUICK_REPLY">Quick Reply</option>
                              <option value="URL">Visit URL</option>
                              <option value="PHONE">Call Phone</option>
                            </select>
                          </div>
                          <div>
                            <div style={{ fontSize:10, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>Label</div>
                            <input value={btn.label} onChange={e => updateButton(i, {...btn, label:e.target.value})} style={{ ...nts.input, height:32, fontSize:12 }} maxLength={25} placeholder="Button text" />
                          </div>
                          {btn.type==='URL' && (
                            <div style={{ gridColumn:'1/-1' }}>
                              <div style={{ fontSize:10, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>URL</div>
                              <input value={btn.url||''} onChange={e => updateButton(i, {...btn, url:e.target.value})} style={{ ...nts.input, height:32, fontSize:12 }} placeholder="https://dyrect.co/w/{{1}}" />
                            </div>
                          )}
                          {btn.type==='PHONE' && (
                            <div style={{ gridColumn:'1/-1' }}>
                              <div style={{ fontSize:10, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>Phone</div>
                              <input value={btn.phone||''} onChange={e => updateButton(i, {...btn, phone:e.target.value})} style={{ ...nts.input, height:32, fontSize:12 }} placeholder="+91 9876543210" />
                            </div>
                          )}
                        </div>
                        <button onClick={() => removeButton(i)} style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--border-default)', background:'var(--bg-surface)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-3)', flexShrink:0, marginTop:18 }}>
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 4 4 12M4 4l8 8"/></svg>
                        </button>
                      </div>
                    ))}
                    {buttons.length < 3 && (
                      <button onClick={addButton} style={{ height:32, borderRadius:'var(--radius-sm)', border:'1px dashed var(--border-strong)', background:'var(--bg-muted)', fontSize:12, color:'var(--fg-2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, fontWeight:500 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10"/></svg>
                        Add button ({buttons.length}/3)
                      </button>
                    )}
                    <div style={{ fontSize:11, color:'var(--fg-3)' }}>Quick Reply · Visit URL · Call Phone · Max 3 total</div>
                  </div>
                </BuildSection>

              </div>

              {/* Right: preview */}
              <div style={{ padding:'16px', background:'var(--bg-muted)', display:'flex', flexDirection:'column', alignItems:'center', gap:10, overflowY:'auto' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--fg-1)', width:'100%', marginBottom:2 }}>Live preview</div>
                <MiniPreview header={header} body={body} footer={footer} buttons={buttons} variables={variables} />
                <div style={{ fontSize:11, color:'var(--fg-3)', textAlign:'center' }}>Variables shown with sample values</div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Review ── */}
          {step === 3 && (
            <div style={nts.stepWrap}>
              <div style={nts.stepTitle}>Review before submitting</div>
              <div style={nts.stepDesc}>Once submitted, Meta typically reviews templates within <strong>1–2 minutes</strong> for standard Utility templates. You'll see the status update in the Templates table.</div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', gap:20, marginTop:20, alignItems:'start' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {/* Summary */}
                  {[
                    ['Template name', <code style={{ fontFamily:'var(--font-mono)', fontSize:13 }}>{details.name}</code>],
                    ['Event trigger', eventDef?.label],
                    ['Language', details.language],
                    ['Category', details.category],
                    ['Header', header.type === 'NONE' ? 'None' : header.type === 'TEXT' ? `Text: "${header.text}"` : header.type],
                    ['Footer', footer || 'None'],
                    ['Buttons', buttons.length > 0 ? buttons.map(b => b.label || b.type).join(', ') : 'None'],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display:'flex', gap:12, padding:'8px 12px', borderRadius:'var(--radius-sm)', background:'var(--bg-surface)', border:'1px solid var(--border-default)' }}>
                      <span style={{ fontSize:12, color:'var(--fg-3)', width:120, flexShrink:0 }}>{label}</span>
                      <span style={{ fontSize:13, color:'var(--fg-1)', fontWeight:500 }}>{val}</span>
                    </div>
                  ))}

                  {/* Body preview */}
                  <div style={{ padding:'10px 12px', borderRadius:'var(--radius-sm)', background:'var(--bg-surface)', border:'1px solid var(--border-default)' }}>
                    <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6 }}>Body</div>
                    <div style={{ fontSize:13, color:'var(--fg-1)', whiteSpace:'pre-wrap', lineHeight:1.6 }}>{body}</div>
                  </div>

                  {/* Meta guidelines note */}
                  <div style={{ display:'flex', gap:9, padding:'10px 12px', borderRadius:'var(--radius-sm)', border:'1px solid #C5D5FB', background:'var(--info-bg)', fontSize:12, color:'#1E40AF', lineHeight:1.5 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink:0, marginTop:1 }}><circle cx="8" cy="8" r="6"/><path d="M8 5v.01M8 8v4"/></svg>
                    <div>Templates are reviewed by Meta. Avoid promotional language, URLs in the body, and vague variable placeholders to prevent rejection.</div>
                  </div>
                </div>

                {/* Phone preview */}
                <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--fg-1)', width:'100%' }}>Preview</div>
                  <MiniPreview header={header} body={body} footer={footer} buttons={buttons} variables={variables} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer nav */}
        <div style={nts.footer}>
          {step > 0 && (
            <button style={nts.btnBack} onClick={() => setStep(s => s-1)}>← Back</button>
          )}
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <button style={nts.btnCancel} onClick={onClose}>Cancel</button>
            {step < 3
              ? (
                <button
                  style={{ ...nts.btnPrimary, opacity: canContinue() ? 1 : 0.45, cursor: canContinue() ? 'pointer':'not-allowed' }}
                  disabled={!canContinue()}
                  onClick={() => setStep(s => s+1)}
                >
                  Continue →
                </button>
              )
              : (
                <button style={nts.btnPrimary} onClick={handleSubmit}>
                  Submit to Meta →
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable section block ───────────────── */
function BuildSection({ title, badge, required, open, onToggle, children }) {
  return (
    <div style={{ border:'1px solid var(--border-default)', borderRadius:'var(--radius-sm)', overflow:'hidden' }}>
      <div onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 13px', cursor:'pointer', background: open ? 'var(--bg-surface)' : 'var(--bg-muted)', userSelect:'none' }}>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)', flex:1, display:'flex', alignItems:'center', gap:7 }}>
          {title}
          {required && <span style={{ fontSize:11, color:'var(--danger)', fontWeight:500 }}>Required</span>}
          {badge && <span style={{ fontSize:11, padding:'1px 6px', borderRadius:3, background:'var(--info-bg)', color:'var(--info)', fontWeight:500 }}>{badge}</span>}
        </span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--fg-3)" strokeWidth="1.5" style={{ transform: open?'rotate(180deg)':'none', transition:'transform .15s' }}><path d="m4 6 4 4 4-4"/></svg>
      </div>
      {open && <div style={{ padding:'12px 13px', borderTop:'1px solid var(--border-default)' }}>{children}</div>}
    </div>
  );
}

const nts = {
  overlay: { position:'fixed', inset:0, background:'rgba(15,23,42,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1500 },
  modal: { width:780, maxHeight:'90vh', background:'var(--bg-surface)', borderRadius:'var(--radius-lg,12px)', boxShadow:'-4px 0 40px rgba(0,0,0,0.16)', display:'flex', flexDirection:'column', overflow:'hidden' },
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px 14px', borderBottom:'1px solid var(--border-default)', flexShrink:0 },
  closeBtn: { width:30, height:30, borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-muted)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)', flexShrink:0 },
  body: { flex:1, overflowY:'auto', minHeight:0 },
  stepWrap: { padding:'20px 28px' },
  stepTitle: { fontSize:17, fontWeight:700, color:'var(--fg-1)', marginBottom:6, letterSpacing:'-0.02em' },
  stepDesc: { fontSize:14, color:'var(--fg-2)', lineHeight:1.6 },
  field: { display:'flex', flexDirection:'column', gap:5 },
  label: { fontSize:11, fontWeight:600, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'0.04em' },
  input: { height:38, padding:'0 11px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontSize:13, color:'var(--fg-1)', outline:'none', width:'100%', boxSizing:'border-box' },
  select: { height:38, padding:'0 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontSize:13, color:'var(--fg-1)', outline:'none', width:'100%' },
  footer: { display:'flex', alignItems:'center', padding:'14px 24px', borderTop:'1px solid var(--border-default)', flexShrink:0 },
  btnBack: { height:34, padding:'0 13px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-surface)', fontSize:13, fontWeight:500, color:'var(--fg-2)', cursor:'pointer' },
  btnCancel: { height:34, padding:'0 13px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-surface)', fontSize:13, fontWeight:500, color:'var(--fg-2)', cursor:'pointer' },
  btnPrimary: { height:34, padding:'0 18px', borderRadius:'var(--radius-sm)', border:'none', background:'var(--brand-blue)', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer' },
};

Object.assign(window, { WANewTemplate });
