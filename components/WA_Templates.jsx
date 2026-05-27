
const { useState, useRef, useEffect } = React;

/* ── helpers ─────────────────────────────────────── */
function renderWAText(body, variables) {
  let t = body || '';
  variables.forEach((v, i) => {
    t = t.split(`{{${i + 1}}}`).join(v.example || `{{${i + 1}}}`);
  });
  return t.split('\n').map((line, li, arr) => {
    const parts = [];
    const bold = line.split(/\*([^*]+)\*/g);
    bold.forEach((seg, si) => {
      if (si % 2 === 1) parts.push(<strong key={si}>{seg}</strong>);
      else {
        const ital = seg.split(/_([^_]+)_/g);
        ital.forEach((s, ii) => {
          if (ii % 2 === 1) parts.push(<em key={`i${ii}`}>{s}</em>);
          else parts.push(s);
        });
      }
    });
    return <React.Fragment key={li}>{parts}{li < arr.length - 1 && <br />}</React.Fragment>;
  });
}

/* ── Phone Preview ────────────────────────────────── */
function WAPhonePreview({ header, body, footer, buttons, variables, senderName }) {
  const bodyRendered = renderWAText(body, variables);

  return (
    <div style={edStyles.previewWrap}>
      <div style={edStyles.phoneChromeOuter}>
        <div style={edStyles.chatHeader}>
          <div style={edStyles.chatAvatar}>{(senderName || 'D')[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#111B21', lineHeight:1.2 }}>{senderName || 'Dyrect'}</div>
            <div style={{ fontSize:11, color:'#667781' }}>Business account</div>
          </div>
          <div style={{ display:'flex', gap:14, color:'#667781' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></svg>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
          </div>
        </div>

        <div style={edStyles.chatBg}>
          <div style={{ fontSize:11, color:'#667781', background:'rgba(255,255,255,0.8)', padding:'3px 10px', borderRadius:999, margin:'0 auto 10px', width:'fit-content' }}>Today</div>

          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{ maxWidth:240 }}>
              {/* Bubble */}
              <div style={edStyles.msgBubble}>
                {/* Header */}
                {header.type === 'TEXT' && header.text && (
                  <div style={{ fontWeight:700, fontSize:13, color:'#111B21', marginBottom:6, lineHeight:1.3 }}>
                    {header.text}
                  </div>
                )}
                {header.type === 'IMAGE' && (
                  <div style={{ height:120, background:'#D0D0D0', borderRadius:6, marginBottom:8, display:'grid', placeItems:'center', color:'#888', fontSize:11 }}>
                    📷 Image
                  </div>
                )}
                {header.type === 'VIDEO' && (
                  <div style={{ height:100, background:'#1A1A1A', borderRadius:6, marginBottom:8, display:'grid', placeItems:'center', color:'#aaa', fontSize:11 }}>
                    ▶ Video
                  </div>
                )}
                {header.type === 'DOCUMENT' && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F0F0F0', borderRadius:6, padding:'8px 10px', marginBottom:8 }}>
                    <div style={{ fontSize:20 }}>📄</div>
                    <div style={{ fontSize:11, color:'#333', fontWeight:500 }}>warranty_card.pdf</div>
                  </div>
                )}

                {/* Body */}
                <div style={edStyles.msgText}>{bodyRendered}</div>

                {/* Footer */}
                {footer && (
                  <div style={{ fontSize:11, color:'#8696A0', marginTop:6, lineHeight:1.3 }}>{footer}</div>
                )}

                {/* Timestamp */}
                <div style={edStyles.msgMeta}>
                  <span>9:41 AM</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="2"><path d="m4 12 5 5 11-11M7 12l5 5 11-11"/></svg>
                </div>
              </div>

              {/* Buttons */}
              {buttons.length > 0 && (
                <div style={{ background:'#fff', borderRadius:'0 0 8px 8px', marginTop:1, overflow:'hidden', boxShadow:'0 1px 1px rgba(0,0,0,0.1)' }}>
                  {buttons.map((btn, i) => (
                    <div key={i} style={{
                      borderTop: i > 0 ? '1px solid #E9ECEF' : 'none',
                      padding:'9px 10px', textAlign:'center',
                      fontSize:13, fontWeight:500,
                      color: btn.type === 'QUICK_REPLY' ? '#00A884' : '#0070BA',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                    }}>
                      {btn.type === 'URL' && <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"/><path d="M9 1h6v6M15 1 8 8"/></svg>}
                      {btn.type === 'PHONE' && <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 2h4l1.5 3.5L5.5 7A9 9 0 0 0 9 10.5l1.5-2L14 10v4c-6.627 0-12-5.373-12-12Z"/></svg>}
                      {btn.label || `Button ${i+1}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── StatusBadge ─────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    approved: { bg:'var(--success-bg)', color:'var(--success)', label:'Approved' },
    pending:  { bg:'var(--warning-bg)', color:'var(--warning)', label:'Pending approval' },
    rejected: { bg:'var(--danger-bg)',  color:'var(--danger)',  label:'Rejected' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:4, background:s.bg, color:s.color, fontSize:12, fontWeight:500 }}>
      {s.label}
    </span>
  );
}

/* ── Section Accordion ───────────────────────────── */
function SectionBlock({ title, badge, required, open, onToggle, children }) {
  return (
    <div style={{ border:'1px solid var(--border-default)', borderRadius:'var(--radius-sm)', overflow:'hidden' }}>
      <div
        onClick={onToggle}
        style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', cursor:'pointer', background: open ? 'var(--bg-surface)' : 'var(--bg-muted)', userSelect:'none' }}
      >
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)' }}>{title}</span>
          {required && <span style={{ fontSize:11, color:'var(--danger)', fontWeight:500 }}>Required</span>}
          {badge && <span style={{ fontSize:11, padding:'1px 6px', borderRadius:3, background:'var(--info-bg)', color:'var(--info)', fontWeight:500 }}>{badge}</span>}
        </div>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--fg-3)" strokeWidth="1.5" style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform .15s' }}>
          <path d="m4 6 4 4 4-4"/>
        </svg>
      </div>
      {open && <div style={{ padding:'14px', borderTop:'1px solid var(--border-default)' }}>{children}</div>}
    </div>
  );
}

/* ── Button Editor Row ───────────────────────────── */
function ButtonRow({ btn, index, onChange, onRemove, isDefault }) {
  return (
    <div style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'10px', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)' }}>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'140px 1fr', gap:8 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>Type</div>
          {isDefault
            ? <div style={edStyles.inputDisplay}>{btn.type}</div>
            : (
              <select
                value={btn.type}
                onChange={e => onChange(index, { ...btn, type: e.target.value })}
                style={edStyles.select}
              >
                <option value="QUICK_REPLY">Quick Reply</option>
                <option value="URL">Visit URL</option>
                <option value="PHONE">Call Phone</option>
              </select>
            )
          }
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>Button label</div>
          {isDefault
            ? <div style={edStyles.inputDisplay}>{btn.label}</div>
            : (
              <input
                value={btn.label}
                onChange={e => onChange(index, { ...btn, label: e.target.value })}
                style={{ ...edStyles.inputBase, height:32 }}
                maxLength={25}
                placeholder="e.g. View warranty"
              />
            )
          }
        </div>
        {(btn.type === 'URL') && (
          <div style={{ gridColumn:'1/-1' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>URL</div>
            {isDefault
              ? <div style={edStyles.inputDisplay}>{btn.url || '—'}</div>
              : (
                <input
                  value={btn.url || ''}
                  onChange={e => onChange(index, { ...btn, url: e.target.value })}
                  style={{ ...edStyles.inputBase, height:32 }}
                  placeholder="https://dyrect.co/warranty/{{1}}"
                />
              )
            }
          </div>
        )}
        {(btn.type === 'PHONE') && (
          <div style={{ gridColumn:'1/-1' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4 }}>Phone number</div>
            {isDefault
              ? <div style={edStyles.inputDisplay}>{btn.phone || '—'}</div>
              : (
                <input
                  value={btn.phone || ''}
                  onChange={e => onChange(index, { ...btn, phone: e.target.value })}
                  style={{ ...edStyles.inputBase, height:32 }}
                  placeholder="+91 9876543210"
                />
              )
            }
          </div>
        )}
      </div>
      {!isDefault && (
        <button onClick={() => onRemove(index)} style={{ width:28, height:28, borderRadius:5, border:'1px solid var(--border-default)', background:'var(--bg-surface)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-3)', flexShrink:0, marginTop:18 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4 4 12M4 4l8 8"/></svg>
        </button>
      )}
    </div>
  );
}

/* ── Main Editor ─────────────────────────────────── */
function WAEditor({ template, onClose, onSave }) {
  const isDefault = template.isDefault;

  // header state
  const [header, setHeader] = useState(template.header || { type:'NONE', text:'' });
  // body state
  const [body, setBody] = useState(template.body || '');
  // footer state
  const [footer, setFooter] = useState(template.footer || '');
  // buttons state
  const [buttons, setButtons] = useState(template.buttons || []);

  const [openSections, setOpenSections] = useState({ header:false, body:true, footer:false, buttons:false });
  const [copiedToken, setCopiedToken] = useState(null);
  const [testSent, setTestSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const bodyRef = useRef(null);

  const toggleSection = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const insertToken = (token) => {
    if (isDefault) return;
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const newBody = body.slice(0, start) + token + body.slice(end);
    setBody(newBody);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + token.length, start + token.length); }, 0);
  };

  const copyToken = (token) => {
    navigator.clipboard?.writeText(token).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  const addButton = () => {
    if (buttons.length >= 3) return;
    setButtons(prev => [...prev, { type:'QUICK_REPLY', label:'' }]);
  };

  const updateButton = (i, val) => setButtons(prev => prev.map((b, idx) => idx === i ? val : b));
  const removeButton = (i) => setButtons(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSave({ ...template, header, body, footer, buttons, status: isDefault ? template.status : 'pending' });
      onClose();
    }, 900);
  };

  return (
    <div style={edStyles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={edStyles.panel}>

        {/* Header */}
        <div style={edStyles.panelHeader}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--fg-1)', letterSpacing:'-0.01em' }}>
              {isDefault ? 'View template' : 'Edit template'}
            </div>
            <div style={{ fontSize:13, color:'var(--fg-2)', marginTop:2, display:'flex', alignItems:'center', gap:8 }}>
              <code style={edStyles.inlineCode}>{template.name}</code>
              {isDefault && <span style={edStyles.chipNeutral}>Dyrect default · Read-only</span>}
            </div>
          </div>
          <button style={edStyles.closeBtn} onClick={onClose}><Icon name="close" size={16} /></button>
        </div>

        {/* Body */}
        <div style={edStyles.panelBody}>

          {/* Left form */}
          <div style={edStyles.formCol}>

            {/* Meta row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                ['Event type', template.event],
                ['Category', template.category],
              ].map(([label, val]) => (
                <div key={label} style={edStyles.field}>
                  <label style={edStyles.fieldLabel}>{label}</label>
                  <div style={edStyles.inputDisplay}>{val}</div>
                </div>
              ))}
              <div style={edStyles.field}>
                <label style={edStyles.fieldLabel}>Language</label>
                {isDefault
                  ? <div style={edStyles.inputDisplay}>{template.language}</div>
                  : (
                    <select style={edStyles.select} defaultValue={template.language}>
                      <option value="en_US">English (US)</option>
                      <option value="en_GB">English (UK)</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  )
                }
              </div>
              <div style={edStyles.field}>
                <label style={edStyles.fieldLabel}>Status</label>
                <div style={{ marginTop:3 }}><StatusBadge status={template.status} /></div>
              </div>
            </div>

            {template.rejectionReason && (
              <div style={edStyles.alertDanger}>
                <Icon name="warning" size={16} />
                <div><strong>Meta rejected this template:</strong> {template.rejectionReason}</div>
              </div>
            )}

            {/* ── HEADER SECTION ── */}
            <SectionBlock
              title="Header"
              badge="Optional"
              open={openSections.header}
              onToggle={() => toggleSection('header')}
            >
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={edStyles.field}>
                  <label style={edStyles.fieldLabel}>Header type</label>
                  {isDefault
                    ? <div style={edStyles.inputDisplay}>{header.type}</div>
                    : (
                      <div style={{ display:'flex', gap:6 }}>
                        {['NONE','TEXT','IMAGE','VIDEO','DOCUMENT'].map(t => (
                          <button
                            key={t}
                            onClick={() => setHeader({ type:t, text:'' })}
                            style={{
                              padding:'5px 11px', borderRadius:5, fontSize:12, fontWeight:500, cursor:'pointer',
                              border: header.type === t ? 'none' : '1px solid var(--border-default)',
                              background: header.type === t ? 'var(--brand-blue)' : 'var(--bg-surface)',
                              color: header.type === t ? '#fff' : 'var(--fg-2)',
                            }}
                          >{t.charAt(0) + t.slice(1).toLowerCase()}</button>
                        ))}
                      </div>
                    )
                  }
                </div>
                {header.type === 'TEXT' && (
                  <div style={edStyles.field}>
                    <label style={edStyles.fieldLabel}>Header text</label>
                    {isDefault
                      ? <div style={edStyles.inputDisplay}>{header.text}</div>
                      : (
                        <input
                          value={header.text}
                          onChange={e => setHeader(h => ({ ...h, text: e.target.value }))}
                          style={{ ...edStyles.inputBase, height:36 }}
                          maxLength={60}
                          placeholder="e.g. Warranty confirmed ✓"
                        />
                      )
                    }
                    <div style={{ fontSize:11, color:'var(--fg-3)' }}>{header.text.length}/60 characters</div>
                  </div>
                )}
                {(header.type === 'IMAGE' || header.type === 'VIDEO' || header.type === 'DOCUMENT') && (
                  <div style={{ padding:'12px', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)', border:'2px dashed var(--border-default)', textAlign:'center', color:'var(--fg-3)', fontSize:13 }}>
                    {header.type === 'IMAGE' && '📷 Upload a sample image (JPG/PNG, max 5 MB)'}
                    {header.type === 'VIDEO' && '🎬 Upload a sample video (MP4, max 16 MB)'}
                    {header.type === 'DOCUMENT' && '📄 Upload a sample document (PDF/DOCX, max 100 MB)'}
                    <div style={{ marginTop:6, fontSize:11, color:'var(--fg-3)' }}>Media provided at send-time; only a sample is needed for Meta review.</div>
                  </div>
                )}
              </div>
            </SectionBlock>

            {/* ── BODY SECTION ── */}
            <SectionBlock
              title="Body"
              required
              open={openSections.body}
              onToggle={() => toggleSection('body')}
            >
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {isDefault
                  ? <div style={edStyles.bodyDisplay}>{body}</div>
                  : (
                    <textarea
                      ref={bodyRef}
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      style={edStyles.textarea}
                      rows={7}
                      placeholder="Type your message body…"
                      maxLength={1024}
                    />
                  )
                }
                <div style={{ fontSize:11, color:'var(--fg-3)', display:'flex', justifyContent:'space-between' }}>
                  <span>Use <code style={edStyles.inlineCode}>*bold*</code>, <code style={edStyles.inlineCode}>_italic_</code></span>
                  <span>{body.length}/1024</span>
                </div>

                {/* Variable tokens */}
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--fg-2)' }}>Variables</div>
                  {template.variables.map((v, i) => (
                    <div key={i} style={edStyles.tokenRow}>
                      <code style={edStyles.tokenCode}>{v.token}</code>
                      <span style={{ fontSize:13, color:'var(--fg-2)', flex:1 }}>{v.label}</span>
                      <span style={{ fontSize:12, color:'var(--fg-3)', fontStyle:'italic' }}>e.g. {v.example}</span>
                      {!isDefault && (
                        <button style={edStyles.iconBtn} onClick={() => insertToken(v.token)} title="Insert at cursor">
                          <Icon name="arrowRight" size={12} />
                        </button>
                      )}
                      <button style={edStyles.iconBtn} onClick={() => copyToken(v.token)}>
                        {copiedToken === v.token ? <Icon name="check" size={12} /> : <Icon name="copy" size={12} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBlock>

            {/* ── FOOTER SECTION ── */}
            <SectionBlock
              title="Footer"
              badge="Optional"
              open={openSections.footer}
              onToggle={() => toggleSection('footer')}
            >
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {isDefault
                  ? <div style={edStyles.inputDisplay}>{footer || '—'}</div>
                  : (
                    <input
                      value={footer}
                      onChange={e => setFooter(e.target.value)}
                      style={{ ...edStyles.inputBase, height:36 }}
                      maxLength={60}
                      placeholder="e.g. Dyrect Warranty Services"
                    />
                  )
                }
                <div style={{ fontSize:11, color:'var(--fg-3)', display:'flex', justifyContent:'space-between' }}>
                  <span>Static text only. No variables allowed.</span>
                  <span>{footer.length}/60</span>
                </div>
              </div>
            </SectionBlock>

            {/* ── BUTTONS SECTION ── */}
            <SectionBlock
              title="Buttons"
              badge={buttons.length > 0 ? `${buttons.length} added` : 'Optional'}
              open={openSections.buttons}
              onToggle={() => toggleSection('buttons')}
            >
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {buttons.map((btn, i) => (
                  <ButtonRow key={i} btn={btn} index={i} onChange={updateButton} onRemove={removeButton} isDefault={isDefault} />
                ))}
                {!isDefault && buttons.length < 3 && (
                  <button onClick={addButton} style={{ height:34, borderRadius:'var(--radius-sm)', border:'1px dashed var(--border-strong)', background:'var(--bg-muted)', fontSize:13, color:'var(--fg-2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontWeight:500 }}>
                    <Icon name="plus" size={13} /> Add button ({buttons.length}/3)
                  </button>
                )}
                <div style={{ fontSize:11, color:'var(--fg-3)' }}>
                  Quick Reply (up to 10) · Visit URL (up to 2) · Call Phone (1) · Max 3 buttons total.
                </div>
              </div>
            </SectionBlock>

            {isDefault && (
              <div style={edStyles.alertInfo}>
                <Icon name="info" size={16} />
                <div>This is a Dyrect default template. <strong>Clone it</strong> to create an editable version with your own header, footer, and buttons.</div>
              </div>
            )}

          </div>

          {/* Right: live preview */}
          <div style={edStyles.previewCol}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)', marginBottom:12 }}>Live preview</div>
            <WAPhonePreview
              header={header}
              body={body}
              footer={footer}
              buttons={buttons}
              variables={template.variables}
              senderName="Dyrect"
            />
            <div style={{ fontSize:12, color:'var(--fg-3)', marginTop:10, textAlign:'center' }}>
              Variables filled with sample values
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={edStyles.panelFooter}>
          <button style={edStyles.btnOutline} onClick={onClose}>Close</button>
          <div style={{ display:'flex', gap:8 }}>
            {isDefault && (
              <button style={edStyles.btnOutline} onClick={() => {
                onSave({ ...template, id:template.id+'_copy', name:template.name+'_copy', isDefault:false, status:'pending', qualityRating:null, deliveryRate:null, readRate:null });
                onClose();
              }}>
                <Icon name="clone" size={13}/> Clone &amp; edit
              </button>
            )}
            {!isDefault && (
              <>
                <button style={edStyles.btnOutline} onClick={() => { setTestSent(true); setTimeout(() => setTestSent(false), 2200); }}>
                  {testSent ? <><Icon name="check" size={13}/> Sent!</> : <><Icon name="send" size={13}/> Test send</>}
                </button>
                <button style={edStyles.btnPrimary} onClick={handleSave} disabled={submitted}>
                  {submitted ? <><Icon name="refresh" size={13}/> Submitting…</> : 'Submit for approval'}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Templates table ─────────────────────────────── */
function WATemplates({ templates, onEdit, onClone, onNewTemplate }) {
  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderBottom:'1px solid var(--border-default)' }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--fg-1)', flex:1 }}>Templates</div>
        <span style={{ fontSize:12, color:'var(--fg-3)' }}>{templates.length}/250 · <a href="#" style={{ color:'var(--brand-blue)', textDecoration:'none' }}>verified business: 6000</a></span>
        <button
          onClick={onNewTemplate}
          style={{ height:32, padding:'0 12px', borderRadius:'var(--radius-sm)', border:'none', background:'var(--brand-blue)', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <Icon name="plus" size={13}/> New template
        </button>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
        <thead>
          <tr>
            {['Template','Event','Owner','Status','Quality','7d Delivery','7d Read',''].map((h,i) => (
              <th key={i} style={{ textAlign:'left', padding:'11px 16px', fontWeight:500, color:'var(--slate-700)', background:'var(--bg-muted)', fontSize:12, borderBottom:'1px solid var(--border-default)', whiteSpace:'nowrap', ...(i===7?{width:80}:{}) }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {templates.map((t, i) => (
            <tr key={t.id} style={{ borderTop: i===0 ? 'none':'1px solid var(--border-default)' }}>
              <td style={{ padding:'12px 16px', verticalAlign:'middle' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:500, color:'var(--fg-1)' }}>{t.name}</div>
                {t.buttons?.length > 0 && <div style={{ fontSize:11, color:'var(--fg-3)', marginTop:2 }}>{t.buttons.length} button{t.buttons.length>1?'s':''}</div>}
              </td>
              <td style={{ padding:'12px 16px', verticalAlign:'middle' }}>
                <span style={{ fontSize:12, color:'var(--fg-2)', background:'var(--bg-muted)', padding:'2px 7px', borderRadius:4, fontWeight:500 }}>{t.eventLabel}</span>
              </td>
              <td style={{ padding:'12px 16px', verticalAlign:'middle' }}>
                <span style={{ fontSize:12, color: t.isDefault ? 'var(--brand-blue)':'var(--fg-2)', fontWeight:500 }}>{t.isDefault ? 'Dyrect':'Brand'}</span>
              </td>
              <td style={{ padding:'12px 16px', verticalAlign:'middle' }}><StatusBadge status={t.status} /></td>
              <td style={{ padding:'12px 16px', verticalAlign:'middle' }}><QualityPip rating={t.qualityRating} /></td>
              <td style={{ padding:'12px 16px', verticalAlign:'middle', fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, letterSpacing:'-0.02em', color: t.deliveryRate ? 'var(--success)':'var(--fg-3)' }}>{t.deliveryRate!=null?`${t.deliveryRate}%`:'—'}</td>
              <td style={{ padding:'12px 16px', verticalAlign:'middle', fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, letterSpacing:'-0.02em', color: t.readRate ? 'var(--brand-blue)':'var(--fg-3)' }}>{t.readRate!=null?`${t.readRate}%`:'—'}</td>
              <td style={{ padding:'12px 16px', verticalAlign:'middle' }}>
                <div style={{ display:'flex', gap:4 }}>
                  <button style={tblStyles.actionBtn} onClick={() => onEdit(t)} title="Edit">
                    <Icon name="edit" size={13}/>
                  </button>
                  <button style={tblStyles.actionBtn} onClick={() => onClone(t)} title="Clone">
                    <Icon name="clone" size={13}/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tblStyles = {
  actionBtn: {
    width:28, height:28, borderRadius:'var(--radius-xs)',
    border:'1px solid var(--border-default)', background:'var(--bg-surface)',
    display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)',
  },
};

const edStyles = {
  overlay: { position:'fixed', inset:0, background:'rgba(15,23,42,0.4)', display:'flex', justifyContent:'flex-end', zIndex:1000 },
  panel: { width:900, background:'var(--bg-surface)', display:'flex', flexDirection:'column', height:'100vh', boxShadow:'-4px 0 32px rgba(0,0,0,0.12)' },
  panelHeader: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'20px 24px 16px', borderBottom:'1px solid var(--border-default)', flexShrink:0 },
  panelBody: { flex:1, minHeight:0, display:'grid', gridTemplateColumns:'1fr 320px', gap:0, overflow:'hidden' },
  panelFooter: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderTop:'1px solid var(--border-default)', flexShrink:0 },
  formCol: { padding:'16px 20px', display:'flex', flexDirection:'column', gap:10, borderRight:'1px solid var(--border-default)', overflowY:'auto', minHeight:0 },
  previewCol: { padding:'16px 16px', background:'var(--bg-muted)', display:'flex', flexDirection:'column', alignItems:'center', overflowY:'auto', minHeight:0 },
  field: { display:'flex', flexDirection:'column', gap:5 },
  fieldLabel: { fontSize:11, fontWeight:600, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'0.04em' },
  inputDisplay: { height:34, padding:'0 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-muted)', fontSize:13, color:'var(--fg-2)', display:'flex', alignItems:'center', fontFamily:'var(--font-mono)' },
  inputBase: { padding:'0 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontSize:13, color:'var(--fg-1)', outline:'none', width:'100%' },
  select: { height:34, padding:'0 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontSize:13, color:'var(--fg-1)', outline:'none', cursor:'pointer', width:'100%' },
  textarea: { width:'100%', padding:'9px 11px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontFamily:'var(--font-sans)', fontSize:13, color:'var(--fg-1)', resize:'vertical', lineHeight:1.55, outline:'none', boxSizing:'border-box' },
  bodyDisplay: { padding:'9px 11px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-muted)', fontFamily:'var(--font-sans)', fontSize:13, color:'var(--fg-1)', lineHeight:1.6, whiteSpace:'pre-wrap' },
  tokenRow: { display:'flex', alignItems:'center', gap:7, padding:'6px 10px', borderRadius:'var(--radius-sm)', background:'var(--bg-muted)', border:'1px solid var(--border-default)' },
  tokenCode: { fontFamily:'var(--font-mono)', fontSize:12, fontWeight:600, color:'var(--brand-blue)', background:'var(--brand-blue-100)', padding:'2px 5px', borderRadius:3, flexShrink:0 },
  iconBtn: { width:22, height:22, borderRadius:4, border:'1px solid var(--border-default)', background:'var(--bg-surface)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)', flexShrink:0 },
  alertInfo: { display:'flex', gap:10, padding:'10px 12px', borderRadius:'var(--radius-sm)', border:'1px solid #C5D5FB', background:'var(--info-bg)', color:'#1E40AF', fontSize:13, lineHeight:1.4 },
  alertDanger: { display:'flex', gap:10, padding:'10px 12px', borderRadius:'var(--radius-sm)', border:'1px solid #F9C5C5', background:'var(--danger-bg)', color:'#991B1B', fontSize:13, lineHeight:1.4 },
  inlineCode: { fontFamily:'var(--font-mono)', fontSize:12, background:'var(--bg-muted)', padding:'1px 4px', borderRadius:3, color:'var(--fg-1)' },
  chipNeutral: { display:'inline-flex', alignItems:'center', padding:'2px 6px', borderRadius:4, background:'var(--bg-muted)', color:'var(--fg-2)', fontSize:11, fontWeight:500 },
  closeBtn: { width:32, height:32, borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-surface)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)' },
  btnPrimary: { height:34, padding:'0 14px', borderRadius:'var(--radius-sm)', border:'none', background:'var(--brand-blue)', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 },
  btnOutline: { height:34, padding:'0 13px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontSize:13, fontWeight:500, color:'var(--fg-1)', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 },
  /* phone preview */
  previewWrap: { width:'100%', maxWidth:280 },
  phoneChromeOuter: { border:'1px solid var(--border-default)', borderRadius:12, overflow:'hidden', boxShadow:'var(--shadow-md)' },
  chatHeader: { background:'#075E54', padding:'10px 12px', display:'flex', alignItems:'center', gap:10 },
  chatAvatar: { width:32, height:32, borderRadius:'50%', background:'#25D366', color:'#fff', display:'grid', placeItems:'center', fontSize:13, fontWeight:700, flexShrink:0 },
  chatBg: { background:'#ECE5DD', padding:'12px 10px', minHeight:180 },
  msgBubble: { background:'#fff', borderRadius:'0 8px 8px 8px', padding:'8px 10px 5px', boxShadow:'0 1px 1px rgba(0,0,0,0.08)', marginBottom:1 },
  msgText: { fontSize:13, color:'#111B21', lineHeight:1.5, wordBreak:'break-word' },
  msgMeta: { display:'flex', alignItems:'center', justifyContent:'flex-end', gap:4, marginTop:4, fontSize:10, color:'#667781' },
};

Object.assign(window, { WATemplates, WAEditor, StatusBadge, tblStyles, edStyles });
