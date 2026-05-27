
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

/* ── Filter chip ──────────────────────────────────── */
function FilterChip({ icon, label, value, onClear }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:5,
      height:30, padding:'0 10px', borderRadius:'var(--radius-sm)',
      border:'1px solid var(--border-default)', background:'var(--bg-surface)',
      fontSize:12, fontWeight:500, color:'var(--fg-2)', cursor:'pointer',
      userSelect:'none',
    }}>
      {icon}
      <span style={{ color:'var(--fg-3)', fontWeight:400 }}>{label}:</span>
      <span style={{ color:'var(--fg-1)', fontWeight:500 }}>{value}</span>
      <span onClick={onClear} style={{ marginLeft:2, color:'var(--fg-3)', display:'flex', alignItems:'center', cursor:'pointer' }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 5 5 11M5 5l6 6"/></svg>
      </span>
    </div>
  );
}

/* ── Templates table ─────────────────────────────── */
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

function WATemplates({ templates, onEdit, onClone, onNewTemplate }) {
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus]   = useState('');
  const [filterEvent, setFilterEvent]     = useState('');
  const [filterOwner, setFilterOwner]     = useState('');
  const [selected, setSelected]       = useState(new Set());
  const [hovRow, setHovRow]           = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage]               = useState(1);
  const [showStatusDrop, setShowStatusDrop]   = useState(false);
  const [showEventDrop, setShowEventDrop]     = useState(false);
  const [showOwnerDrop, setShowOwnerDrop]     = useState(false);
  const [showAddFilter, setShowAddFilter]     = useState(false);
  const [activeFilters, setActiveFilters] = useState(['status','event']);

  // Derived filter values
  const allEvents  = [...new Set(templates.map(t => t.eventLabel))];
  const allOwners  = ['Dyrect', 'Brand'];
  const allStatuses = ['approved','pending','rejected'];

  // Filter + search
  const filtered = templates.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.eventLabel.toLowerCase().includes(q);
    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchEvent  = !filterEvent  || t.eventLabel === filterEvent;
    const matchOwner  = !filterOwner  || (filterOwner === 'Dyrect' ? t.isDefault : !t.isDefault);
    return matchSearch && matchStatus && matchEvent && matchOwner;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  // Selection
  const allSelected = pageSlice.length > 0 && pageSlice.every(t => selected.has(t.id));
  const toggleAll   = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) pageSlice.forEach(t => next.delete(t.id));
      else             pageSlice.forEach(t => next.add(t.id));
      return next;
    });
  };
  const toggleRow = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const removeFilter = (key) => {
    if (key === 'status') { setFilterStatus(''); }
    if (key === 'event')  { setFilterEvent('');  }
    if (key === 'owner')  { setFilterOwner('');  }
    setActiveFilters(prev => prev.filter(f => f !== key));
  };

  const addFilter = (key) => {
    if (!activeFilters.includes(key)) setActiveFilters(prev => [...prev, key]);
    setShowAddFilter(false);
  };

  const FILTER_ICON = {
    status: <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="5.5"/><path d="M5.5 8h5M6.5 5.5h3M7 10.5h2"/></svg>,
    event:  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 1.5v3M11 1.5v3M2 7h12"/></svg>,
    owner:  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="5.5" r="2.5"/><path d="M3 13c.5-2.5 2.5-4 5-4s4.5 1.5 5 4"/></svg>,
  };

  // Dropdown helper
  function Dropdown({ options, value, onChange, onClose }) {
    return (
      <div style={{ position:'absolute', top:'100%', left:0, marginTop:4, background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-sm)', boxShadow:'var(--shadow-md)', zIndex:200, minWidth:160, overflow:'hidden' }}>
        {options.map(opt => (
          <div key={opt} onClick={() => { onChange(opt === value ? '' : opt); onClose(); }} style={{
            padding:'8px 12px', fontSize:13, cursor:'pointer',
            color: opt === value ? 'var(--brand-blue)' : 'var(--fg-1)',
            background: opt === value ? 'var(--brand-blue-100)' : 'transparent',
            fontWeight: opt === value ? 600 : 400,
          }}
          onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'var(--bg-muted)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = opt === value ? 'var(--brand-blue-100)' : 'transparent'; }}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', overflow:'hidden', display:'flex', flexDirection:'column' }}>

      {/* ── Top toolbar ── */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderBottom:'1px solid var(--border-default)' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:1, maxWidth:280 }}>
          <svg style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', color:'var(--fg-3)', pointerEvents:'none' }} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4"/><path d="m12 12-2.5-2.5"/></svg>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search templates…"
            style={{ width:'100%', height:32, padding:'0 10px 0 30px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-muted)', fontSize:13, color:'var(--fg-1)', outline:'none', boxSizing:'border-box' }}
          />
        </div>

        <div style={{ flex:1 }} />

        {/* Count */}
        <span style={{ fontSize:12, color:'var(--fg-3)', whiteSpace:'nowrap' }}>
          {selected.size > 0
            ? <><strong style={{ color:'var(--brand-blue)' }}>{selected.size}</strong> selected · </>
            : null}
          <strong style={{ color:'var(--fg-2)' }}>{filtered.length}</strong> of {templates.length}
          <span style={{ color:'var(--border-strong)' }}> · </span>
          <a href="#" style={{ color:'var(--brand-blue)', textDecoration:'none', fontSize:12 }}>{templates.length}/250 templates</a>
        </span>

        {/* New template */}
        <button onClick={onNewTemplate} style={{ height:32, padding:'0 12px', borderRadius:'var(--radius-sm)', border:'none', background:'var(--brand-blue)', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:5, flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
          New template
        </button>
      </div>

      {/* ── Filter chips row ── */}
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderBottom:'1px solid var(--border-default)', background:'var(--bg-surface)', flexWrap:'wrap' }}>
        {activeFilters.includes('status') && (
          <div style={{ position:'relative' }}>
            <div
              onClick={() => { setShowStatusDrop(v => !v); setShowEventDrop(false); setShowOwnerDrop(false); setShowAddFilter(false); }}
              style={{ display:'inline-flex', alignItems:'center', gap:5, height:30, padding:'0 10px', borderRadius:'var(--radius-sm)', border:`1px solid ${filterStatus ? 'var(--brand-blue)' : 'var(--border-default)'}`, background: filterStatus ? 'var(--brand-blue-100)' : 'var(--bg-surface)', fontSize:12, fontWeight:500, color: filterStatus ? 'var(--brand-blue)' : 'var(--fg-2)', cursor:'pointer', userSelect:'none' }}>
              {FILTER_ICON.status}
              <span style={{ color: filterStatus ? 'var(--fg-3)' : 'var(--fg-3)', fontWeight:400 }}>Status</span>
              {filterStatus && <><span style={{ color:'var(--border-strong)', margin:'0 2px' }}>·</span><span style={{ fontWeight:600, color:'var(--brand-blue)' }}>{filterStatus.charAt(0).toUpperCase()+filterStatus.slice(1)}</span></>}
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 6 4 4 4-4"/></svg>
            </div>
            {showStatusDrop && <Dropdown options={allStatuses} value={filterStatus} onChange={v => { setFilterStatus(v); setPage(1); }} onClose={() => setShowStatusDrop(false)} />}
          </div>
        )}

        {activeFilters.includes('event') && (
          <div style={{ position:'relative' }}>
            <div
              onClick={() => { setShowEventDrop(v => !v); setShowStatusDrop(false); setShowOwnerDrop(false); setShowAddFilter(false); }}
              style={{ display:'inline-flex', alignItems:'center', gap:5, height:30, padding:'0 10px', borderRadius:'var(--radius-sm)', border:`1px solid ${filterEvent ? 'var(--brand-blue)' : 'var(--border-default)'}`, background: filterEvent ? 'var(--brand-blue-100)' : 'var(--bg-surface)', fontSize:12, fontWeight:500, color: filterEvent ? 'var(--brand-blue)' : 'var(--fg-2)', cursor:'pointer', userSelect:'none' }}>
              {FILTER_ICON.event}
              <span style={{ fontWeight:400, color:'var(--fg-3)' }}>Event</span>
              {filterEvent && <><span style={{ color:'var(--border-strong)', margin:'0 2px' }}>·</span><span style={{ fontWeight:600, color:'var(--brand-blue)' }}>{filterEvent}</span></>}
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 6 4 4 4-4"/></svg>
            </div>
            {showEventDrop && <Dropdown options={allEvents} value={filterEvent} onChange={v => { setFilterEvent(v); setPage(1); }} onClose={() => setShowEventDrop(false)} />}
          </div>
        )}

        {activeFilters.includes('owner') && (
          <div style={{ position:'relative' }}>
            <div
              onClick={() => { setShowOwnerDrop(v => !v); setShowStatusDrop(false); setShowEventDrop(false); setShowAddFilter(false); }}
              style={{ display:'inline-flex', alignItems:'center', gap:5, height:30, padding:'0 10px', borderRadius:'var(--radius-sm)', border:`1px solid ${filterOwner ? 'var(--brand-blue)' : 'var(--border-default)'}`, background: filterOwner ? 'var(--brand-blue-100)' : 'var(--bg-surface)', fontSize:12, fontWeight:500, color: filterOwner ? 'var(--brand-blue)' : 'var(--fg-2)', cursor:'pointer', userSelect:'none' }}>
              {FILTER_ICON.owner}
              <span style={{ fontWeight:400, color:'var(--fg-3)' }}>Owner</span>
              {filterOwner && <><span style={{ color:'var(--border-strong)', margin:'0 2px' }}>·</span><span style={{ fontWeight:600, color:'var(--brand-blue)' }}>{filterOwner}</span></>}
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 6 4 4 4-4"/></svg>
            </div>
            {showOwnerDrop && <Dropdown options={allOwners} value={filterOwner} onChange={v => { setFilterOwner(v); setPage(1); }} onClose={() => setShowOwnerDrop(false)} />}
          </div>
        )}

        {/* Active filter chips with value */}
        {(filterStatus||filterEvent||filterOwner) && (
          <button onClick={() => { setFilterStatus(''); setFilterEvent(''); setFilterOwner(''); setPage(1); }} style={{ height:28, padding:'0 8px', borderRadius:'var(--radius-sm)', border:'none', background:'none', fontSize:12, color:'var(--danger)', cursor:'pointer', fontWeight:500 }}>
            Clear all
          </button>
        )}

        {/* + Add filter */}
        <div style={{ position:'relative' }}>
          <button
            onClick={() => { setShowAddFilter(v => !v); setShowStatusDrop(false); setShowEventDrop(false); setShowOwnerDrop(false); }}
            style={{ height:30, padding:'0 10px', borderRadius:'var(--radius-sm)', border:'1px dashed var(--border-default)', background:'none', fontSize:12, color:'var(--fg-3)', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4 }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
            Add filter
          </button>
          {showAddFilter && (
            <div style={{ position:'absolute', top:'100%', left:0, marginTop:4, background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-sm)', boxShadow:'var(--shadow-md)', zIndex:200, minWidth:150, overflow:'hidden' }}>
              {[
                { key:'status', label:'Status' },
                { key:'event',  label:'Event' },
                { key:'owner',  label:'Owner' },
              ].filter(f => !activeFilters.includes(f.key)).map(f => (
                <div key={f.key} onClick={() => addFilter(f.key)} style={{ padding:'8px 12px', fontSize:13, cursor:'pointer', color:'var(--fg-1)', display:'flex', alignItems:'center', gap:7 }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg-muted)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  {FILTER_ICON[f.key]}{f.label}
                </div>
              ))}
              {['status','event','owner'].every(k => activeFilters.includes(k)) && (
                <div style={{ padding:'8px 12px', fontSize:12, color:'var(--fg-3)' }}>No more filters</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX:'auto', flex:1 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'var(--bg-muted)' }}>
              {/* Checkbox */}
              <th style={{ width:40, padding:'10px 0 10px 16px', borderBottom:'1px solid var(--border-default)' }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll}
                  style={{ width:14, height:14, accentColor:'var(--brand-blue)', cursor:'pointer' }} />
              </th>
              {[
                { label:'Template name',  w:'auto' },
                { label:'Event',          w:120 },
                { label:'Category',       w:110 },
                { label:'Language',       w:110 },
                { label:'Owner',          w:90  },
                { label:'Status',         w:140 },
                { label:'Quality',        w:100 },
                { label:'7d Delivery',    w:100 },
                { label:'7d Read',        w:90  },
                { label:'',               w:76  },
              ].map((col, i) => (
                <th key={i} style={{ textAlign:'left', padding:'10px 14px', fontWeight:500, color:'var(--slate-600)', fontSize:12, borderBottom:'1px solid var(--border-default)', whiteSpace:'nowrap', width: col.w !== 'auto' ? col.w : undefined }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageSlice.length === 0 && (
              <tr>
                <td colSpan={11} style={{ padding:'40px 16px', textAlign:'center', color:'var(--fg-3)', fontSize:13 }}>
                  No templates match your filters.
                </td>
              </tr>
            )}
            {pageSlice.map((t) => {
              const isHov = hovRow === t.id;
              const isSel = selected.has(t.id);
              return (
                <tr key={t.id}
                  style={{ borderTop:'1px solid var(--border-default)', background: isSel ? 'var(--brand-blue-100)' : isHov ? 'var(--bg-muted)' : 'transparent', transition:'background .1s' }}
                  onMouseEnter={() => setHovRow(t.id)}
                  onMouseLeave={() => setHovRow(null)}
                >
                  {/* Checkbox */}
                  <td style={{ padding:'11px 0 11px 16px', verticalAlign:'middle', width:40 }}>
                    <input type="checkbox" checked={isSel} onChange={() => toggleRow(t.id)}
                      style={{ width:14, height:14, accentColor:'var(--brand-blue)', cursor:'pointer' }} />
                  </td>

                  {/* Template name */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle' }}>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:500, color:'var(--brand-blue)', cursor:'pointer' }} onClick={() => onEdit(t)}>
                      {t.name}
                    </div>
                    {t.buttons?.length > 0 && (
                      <div style={{ fontSize:11, color:'var(--fg-3)', marginTop:2 }}>
                        {t.buttons.length} button{t.buttons.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </td>

                  {/* Event */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle' }}>
                    <span style={{ fontSize:12, color:'var(--fg-1)', background:'var(--bg-muted)', padding:'3px 8px', borderRadius:'var(--radius-pill)', fontWeight:500, border:'1px solid var(--border-default)', whiteSpace:'nowrap' }}>
                      {t.eventLabel}
                    </span>
                  </td>

                  {/* Category */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle', fontSize:13, color:'var(--fg-2)' }}>
                    {t.category}
                  </td>

                  {/* Language */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle', fontSize:13, color:'var(--fg-2)' }}>
                    {t.language === 'en_US' ? 'English (US)' : t.language === 'hi' ? 'Hindi' : t.language}
                  </td>

                  {/* Owner */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <div style={{ width:20, height:20, borderRadius:5, background: t.isDefault ? 'var(--brand-blue-100)' : 'var(--bg-muted)', color: t.isDefault ? 'var(--brand-blue)' : 'var(--fg-2)', display:'grid', placeItems:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>
                        {t.isDefault ? 'D' : 'B'}
                      </div>
                      <span style={{ fontSize:12, color: t.isDefault ? 'var(--brand-blue)' : 'var(--fg-2)', fontWeight:500 }}>
                        {t.isDefault ? 'Dyrect' : 'Brand'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle' }}>
                    <StatusBadge status={t.status} />
                    {t.rejectionReason && (
                      <div style={{ fontSize:11, color:'var(--danger)', marginTop:3, maxWidth:140, lineHeight:1.3, whiteSpace:'normal' }} title={t.rejectionReason}>
                        {t.rejectionReason.length > 40 ? t.rejectionReason.slice(0,40)+'…' : t.rejectionReason}
                      </div>
                    )}
                  </td>

                  {/* Quality */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle' }}>
                    <QualityPip rating={t.qualityRating} />
                  </td>

                  {/* 7d Delivery */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle', fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, letterSpacing:'-0.02em', color: t.deliveryRate ? 'var(--success)' : 'var(--fg-3)' }}>
                    {t.deliveryRate != null ? `${t.deliveryRate}%` : '—'}
                  </td>

                  {/* 7d Read */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle', fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, letterSpacing:'-0.02em', color: t.readRate ? 'var(--brand-blue)' : 'var(--fg-3)' }}>
                    {t.readRate != null ? `${t.readRate}%` : '—'}
                  </td>

                  {/* Actions */}
                  <td style={{ padding:'11px 14px', verticalAlign:'middle' }}>
                    <div style={{ display:'flex', gap:4, opacity: isHov || isSel ? 1 : 0, transition:'opacity .1s' }}>
                      <button style={tblStyles.actionBtn} onClick={() => onEdit(t)} title="Edit / View">
                        <Icon name="edit" size={12}/>
                      </button>
                      <button style={tblStyles.actionBtn} onClick={() => onClone(t)} title="Clone">
                        <Icon name="clone" size={12}/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderTop:'1px solid var(--border-default)', background:'var(--bg-surface)', flexShrink:0 }}>
        {/* Rows per page */}
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--fg-2)' }}>
          Rows per page
          <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            style={{ height:26, padding:'0 6px', borderRadius:'var(--radius-xs)', border:'1px solid var(--border-default)', background:'var(--bg-surface)', fontSize:12, color:'var(--fg-1)', cursor:'pointer', outline:'none' }}>
            {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Page info + nav */}
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--fg-2)' }}>
          <span>Page <strong style={{ color:'var(--fg-1)' }}>{safePage}</strong> of {totalPages}</span>
          {/* First */}
          <button onClick={() => setPage(1)} disabled={safePage===1} style={tblStyles.pageBtn(safePage===1)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 4 4 8l4 4M12 4l-4 4 4 4"/></svg>
          </button>
          {/* Prev */}
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={safePage===1} style={tblStyles.pageBtn(safePage===1)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 4 6 8l4 4"/></svg>
          </button>
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i+1).filter(p => Math.abs(p - safePage) <= 1 || p === 1 || p === totalPages).reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx-1] > 1) acc.push('…');
            acc.push(p);
            return acc;
          }, []).map((p, i) => (
            typeof p === 'string'
              ? <span key={`ellipsis-${i}`} style={{ padding:'0 4px', color:'var(--fg-3)', fontSize:12 }}>…</span>
              : <button key={p} onClick={() => setPage(p)} style={{ width:26, height:26, borderRadius:'var(--radius-xs)', border:'1px solid var(--border-default)', background: p === safePage ? 'var(--brand-blue)' : 'var(--bg-surface)', color: p === safePage ? '#fff' : 'var(--fg-1)', fontSize:12, cursor:'pointer', fontWeight: p === safePage ? 600 : 400 }}>{p}</button>
          ))}
          {/* Next */}
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={safePage===totalPages} style={tblStyles.pageBtn(safePage===totalPages)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 4l4 4-4 4"/></svg>
          </button>
          {/* Last */}
          <button onClick={() => setPage(totalPages)} disabled={safePage===totalPages} style={tblStyles.pageBtn(safePage===totalPages)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4l4 4-4 4M8 4l4 4-4 4"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const tblStyles = {
  actionBtn: {
    width:26, height:26, borderRadius:'var(--radius-xs)',
    border:'1px solid var(--border-default)', background:'var(--bg-surface)',
    display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)',
  },
  pageBtn: (disabled) => ({
    width:26, height:26, borderRadius:'var(--radius-xs)',
    border:'1px solid var(--border-default)',
    background: disabled ? 'var(--bg-muted)' : 'var(--bg-surface)',
    color: disabled ? 'var(--fg-3)' : 'var(--fg-1)',
    display:'grid', placeItems:'center', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }),
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
