
const { useState, useEffect } = React;

const STEPS = [
  { id: 'intro',    title: 'Connect your WABA' },
  { id: 'meta',     title: 'Meta Business Portfolio' },
  { id: 'waba',     title: 'WABA details' },
  { id: 'number',   title: 'Phone number' },
  { id: 'otp',      title: 'Verify number' },
  { id: 'perms',    title: 'Grant permissions' },
  { id: 'done',     title: 'You\'re live' },
];

function StepDot({ step, current }) {
  const idx = STEPS.findIndex(s => s.id === step);
  const curIdx = STEPS.findIndex(s => s.id === current);
  const done = idx < curIdx;
  const active = idx === curIdx;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0 }}>
      <div style={{
        width:28, height:28, borderRadius:'50%', flexShrink:0,
        display:'grid', placeItems:'center', fontSize:12, fontWeight:600,
        background: done ? 'var(--success)' : active ? 'var(--brand-blue)' : 'var(--bg-muted)',
        color: done || active ? '#fff' : 'var(--fg-3)',
        border: active ? 'none' : done ? 'none' : '1px solid var(--border-default)',
        transition: 'background .2s',
      }}>
        {done
          ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2"><path d="m4 8 3 3 5-6"/></svg>
          : idx + 1
        }
      </div>
    </div>
  );
}

function StepConnector({ filled }) {
  return (
    <div style={{ flex:1, height:2, background: filled ? 'var(--success)' : 'var(--border-default)', transition:'background .3s', margin:'0 4px' }}></div>
  );
}

function WABAWizard({ onClose, onComplete }) {
  const [step, setStep] = useState('intro');
  const [numberType, setNumberType] = useState('new');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaDone, setMetaDone] = useState(false);
  const [form, setForm] = useState({ wabaName:'', displayName:'', category:'', timezone:'Asia/Kolkata' });
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const curIdx = STEPS.findIndex(s => s.id === step);

  const next = () => {
    const nextStep = STEPS[curIdx + 1];
    if (nextStep) setStep(nextStep.id);
  };
  const back = () => {
    const prevStep = STEPS[curIdx - 1];
    if (prevStep) setStep(prevStep.id);
  };

  const handleMetaConnect = () => {
    setMetaLoading(true);
    setTimeout(() => { setMetaLoading(false); setMetaDone(true); }, 2200);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 1400);
  };

  const handleComplete = () => {
    onComplete({ phone, form });
    onClose();
  };

  return (
    <div style={wiz.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={wiz.modal}>

        {/* Header */}
        <div style={wiz.header}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#E7F8EE', color:'#25D366', display:'grid', placeItems:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.5 3.5A12 12 0 0 0 2 10.7L1 23l12.3-3.2A12 12 0 1 0 20.5 3.5Z"/>
                <path d="M8.8 7.2c-.3-.6-.6-.6-.9-.6H7.4c-.3 0-.8.1-1.2.6C5.8 7.6 4.6 8.7 4.6 11s1.6 4.3 1.8 4.6c.2.3 3.1 4.9 7.6 6.7 3.8 1.5 4.5 1.2 5.3 1.1.8-.1 2.4-.9 2.7-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5-.4-.2-2.3-1.1-2.6-1.3-.3-.2-.6-.2-.9.2-.3.3-1.1 1.3-1.3 1.5-.2.3-.5.3-.8.1-.6-.3-2.4-.9-4.5-2.8-1.8-1.7-2.4-3-2.6-3.3-.2-.3 0-.6.2-.8l.6-.7c.2-.2.3-.5.4-.7.1-.3 0-.6-.1-.8-.2-.3-.9-2.2-1.3-3Z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--fg-1)', letterSpacing:'-0.01em' }}>
                Set up your own WABA
              </div>
              <div style={{ fontSize:13, color:'var(--fg-2)', marginTop:1 }}>
                {STEPS[curIdx]?.title}
              </div>
            </div>
          </div>
          <button style={wiz.closeBtn} onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4 4 12M4 4l8 8"/></svg>
          </button>
        </div>

        {/* Step indicators */}
        <div style={wiz.stepper}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <StepDot step={s.id} current={step} />
              {i < STEPS.length - 1 && <StepConnector filled={curIdx > i} />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div style={wiz.body}>

          {/* ── 1: INTRO ── */}
          {step === 'intro' && (
            <div style={wiz.stepContent}>
              <div style={wiz.stepTitle}>Why upgrade to your own WABA?</div>
              <div style={wiz.stepDesc}>
                Currently you're using Dyrect's shared WhatsApp Business Account. Bringing your own WABA lets you fully own the number, tier, and quality rating under your brand.
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, margin:'20px 0' }}>
                {[
                  { icon:'🏢', title:'Your brand name', desc:'Customers see your business name in WhatsApp, not "Dyrect".' },
                  { icon:'📈', title:'Higher tiers', desc:'Scale from 1K/day to 100K+/day after business verification.' },
                  { icon:'⭐', title:'Green tick eligible', desc:'Request Official Business Account status once verified.' },
                  { icon:'🔒', title:'Full data ownership', desc:'WABA, phone number, and templates stay with you if you switch.' },
                ].map(item => (
                  <div key={item.title} style={wiz.featureCard}>
                    <div style={{ fontSize:22, marginBottom:6 }}>{item.icon}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)', marginBottom:3 }}>{item.title}</div>
                    <div style={{ fontSize:12, color:'var(--fg-2)', lineHeight:1.4 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div style={wiz.infoBox}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--info)" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v.01M8 8v4"/></svg>
                <div style={{ fontSize:13, color:'var(--info)', lineHeight:1.4 }}>
                  <strong>What you'll need:</strong> A Meta/Facebook account, your business details, and a phone number that can receive an OTP via SMS or voice call.
                </div>
              </div>
            </div>
          )}

          {/* ── 2: META CONNECT ── */}
          {step === 'meta' && (
            <div style={wiz.stepContent}>
              <div style={wiz.stepTitle}>Connect your Meta Business Portfolio</div>
              <div style={wiz.stepDesc}>
                We use Meta's official Embedded Signup — a secure OAuth popup hosted by Meta. Your Facebook credentials never touch Dyrect. Permissions are revocable at any time from Meta Business Suite.
              </div>

              <div style={{ margin:'24px 0', display:'flex', flexDirection:'column', gap:16, alignItems:'center' }}>
                {!metaDone
                  ? (
                    <button
                      onClick={handleMetaConnect}
                      disabled={metaLoading}
                      style={{
                        height:48, padding:'0 28px', borderRadius:10, border:'none', cursor: metaLoading ? 'default':'pointer',
                        background: metaLoading ? '#7090D0' : '#1877F2', color:'#fff',
                        fontSize:15, fontWeight:600, display:'flex', alignItems:'center', gap:10,
                        boxShadow:'0 2px 6px rgba(24,119,242,0.35)', opacity: metaLoading ? 0.8 : 1,
                      }}
                    >
                      {metaLoading ? (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ animation:'spin 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-4.5-7.8"/>
                          </svg>
                          Connecting to Meta…
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          Continue with Meta
                        </>
                      )}
                    </button>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                      <div style={{ width:52, height:52, borderRadius:'50%', background:'var(--success-bg)', display:'grid', placeItems:'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2"><path d="m5 12 5 5 9-10"/></svg>
                      </div>
                      <div style={{ fontSize:15, fontWeight:600, color:'var(--success)' }}>Meta portfolio connected</div>
                      <div style={{ fontSize:13, color:'var(--fg-2)' }}>
                        <strong>Abhishek Bindal</strong> · Business Portfolio: <strong>Dyrect Technologies</strong>
                      </div>
                    </div>
                  )
                }

                <div style={{ width:'100%', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)', padding:'12px 14px', fontSize:12, color:'var(--fg-3)', lineHeight:1.6 }}>
                  <strong style={{ color:'var(--fg-2)' }}>Permissions requested:</strong><br/>
                  <span>✓ <strong>whatsapp_business_management</strong> — manage your WABA, templates &amp; numbers</span><br/>
                  <span>✓ <strong>whatsapp_business_messaging</strong> — send messages on your behalf</span><br/>
                  <span>✓ <strong>business_management</strong> — read your business portfolio for billing</span>
                </div>
              </div>
            </div>
          )}

          {/* ── 3: WABA DETAILS ── */}
          {step === 'waba' && (
            <div style={wiz.stepContent}>
              <div style={wiz.stepTitle}>Name your WhatsApp Business Account</div>
              <div style={wiz.stepDesc}>
                The WABA name is internal and not shown to customers. The display name is what appears in WhatsApp chats — it must match your registered business name.
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:20 }}>
                <div style={wiz.field}>
                  <label style={wiz.label}>WABA name <span style={{ color:'var(--danger)' }}>*</span></label>
                  <input value={form.wabaName} onChange={e => setForm(f => ({...f, wabaName: e.target.value}))} style={wiz.input} placeholder="e.g. Dyrect Technologies WABA" />
                  <div style={wiz.hint}>Internal name, not customer-facing.</div>
                </div>
                <div style={wiz.field}>
                  <label style={wiz.label}>Display name (shown to customers) <span style={{ color:'var(--danger)' }}>*</span></label>
                  <input value={form.displayName} onChange={e => setForm(f => ({...f, displayName: e.target.value}))} style={wiz.input} placeholder="e.g. Dyrect" maxLength={128} />
                  <div style={wiz.hint}>Must match your registered business name. Meta reviews this separately.</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div style={wiz.field}>
                    <label style={wiz.label}>Business category</label>
                    <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} style={wiz.select}>
                      <option value="">— Select —</option>
                      <option>Retail</option>
                      <option>Technology</option>
                      <option>E-commerce</option>
                      <option>Consumer Electronics</option>
                      <option>Services</option>
                    </select>
                  </div>
                  <div style={wiz.field}>
                    <label style={wiz.label}>Timezone</label>
                    <select value={form.timezone} onChange={e => setForm(f => ({...f, timezone: e.target.value}))} style={wiz.select}>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      <option value="America/New_York">America/New_York (ET)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                    <div style={wiz.hint}>Cannot be changed after a credit line is attached.</div>
                  </div>
                </div>
                <div style={wiz.field}>
                  <label style={wiz.label}>Business website (optional)</label>
                  <input style={wiz.input} placeholder="https://dyrect.co" />
                </div>
              </div>
            </div>
          )}

          {/* ── 4: PHONE NUMBER ── */}
          {step === 'number' && (
            <div style={wiz.stepContent}>
              <div style={wiz.stepTitle}>Add a phone number</div>
              <div style={wiz.stepDesc}>
                Choose how you want to connect a phone number to your WABA. The number cannot be actively registered on the WhatsApp consumer or Business app.
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10, margin:'20px 0' }}>
                {[
                  { id:'new',     icon:'✨', title:'Get a new number', desc:'Dyrect provides a pre-verified number. Fastest — no OTP needed.' },
                  { id:'own',     icon:'📱', title:'Use my existing number', desc:'Bring a SIM-capable number. You\'ll receive an OTP to verify.' },
                  { id:'migrate', icon:'🔄', title:'Migrate from another BSP', desc:'Transfer your current WhatsApp API number, quality rating, and templates intact.' },
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setNumberType(opt.id)}
                    style={{
                      display:'flex', gap:12, padding:'14px 16px', borderRadius:'var(--radius-sm)', cursor:'pointer',
                      border: numberType === opt.id ? '2px solid var(--brand-blue)' : '1px solid var(--border-default)',
                      background: numberType === opt.id ? 'var(--brand-blue-50,#EEF4FF)' : 'var(--bg-surface)',
                    }}
                  >
                    <div style={{ fontSize:22, marginTop:1 }}>{opt.icon}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:'var(--fg-1)' }}>{opt.title}</div>
                      <div style={{ fontSize:13, color:'var(--fg-2)', marginTop:2, lineHeight:1.4 }}>{opt.desc}</div>
                    </div>
                    <div style={{ marginLeft:'auto', alignSelf:'center', flexShrink:0 }}>
                      <div style={{
                        width:18, height:18, borderRadius:'50%',
                        border: numberType === opt.id ? 'none' : '1.5px solid var(--border-strong)',
                        background: numberType === opt.id ? 'var(--brand-blue)' : 'transparent',
                        display:'grid', placeItems:'center',
                      }}>
                        {numberType === opt.id && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {numberType === 'own' && (
                <div style={wiz.field}>
                  <label style={wiz.label}>Your phone number <span style={{ color:'var(--danger)' }}>*</span></label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={wiz.input}
                    placeholder="+91 9876543210"
                    type="tel"
                  />
                  <div style={wiz.hint}>Must be able to receive an SMS or voice call for OTP verification.</div>
                </div>
              )}
              {numberType === 'migrate' && (
                <div style={wiz.infoBox}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--info)" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v.01M8 8v4"/></svg>
                  <div style={{ fontSize:12, color:'var(--info)', lineHeight:1.5 }}>
                    Before migrating: ask your current BSP to release the number and disable 2FA. Quality rating, approved templates, and tier level are preserved during migration.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── 5: OTP ── */}
          {step === 'otp' && (
            <div style={wiz.stepContent}>
              <div style={wiz.stepTitle}>Verify your phone number</div>
              <div style={wiz.stepDesc}>
                Meta will send a 6-digit OTP to <strong>{phone || '+91 9876543210'}</strong> to confirm ownership. Choose your delivery method.
              </div>

              <div style={{ margin:'20px 0', display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'flex', gap:8 }}>
                  {['SMS', 'Voice call'].map(method => (
                    <button key={method} style={{
                      flex:1, height:40, borderRadius:'var(--radius-sm)', border:'1.5px solid var(--brand-blue)',
                      background:'var(--bg-surface)', color:'var(--brand-blue)', fontSize:13, fontWeight:600, cursor:'pointer',
                    }}
                      onClick={handleSendOtp}
                    >
                      {method === 'SMS' ? '💬' : '📞'} Send via {method}
                    </button>
                  ))}
                </div>

                {otpSent && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8, animation:'fadeIn .3s' }}>
                    <div style={wiz.field}>
                      <label style={wiz.label}>Enter 6-digit OTP</label>
                      <input
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                        style={{ ...wiz.input, fontFamily:'var(--font-mono)', fontSize:20, letterSpacing:'0.2em', textAlign:'center', height:50 }}
                        placeholder="_ _ _ _ _ _"
                        maxLength={6}
                      />
                    </div>
                    {!verified && (
                      <button
                        onClick={handleVerifyOtp}
                        disabled={otp.length < 6 || verifying}
                        style={{ height:40, borderRadius:'var(--radius-sm)', border:'none', background: otp.length===6 ? 'var(--brand-blue)':'var(--bg-muted)', color: otp.length===6?'#fff':'var(--fg-3)', fontSize:13, fontWeight:600, cursor: otp.length===6?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                      >
                        {verifying ? 'Verifying…' : 'Verify OTP'}
                      </button>
                    )}
                    {verified && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--success)', fontSize:14, fontWeight:600 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m5 12 5 5 9-10"/></svg>
                        Number verified successfully
                      </div>
                    )}
                    <div style={wiz.hint}>
                      Didn't receive it? <a href="#" style={{ color:'var(--brand-blue)', textDecoration:'none' }}>Resend in 60s</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 6: PERMISSIONS ── */}
          {step === 'perms' && (
            <div style={wiz.stepContent}>
              <div style={wiz.stepTitle}>Grant Dyrect access</div>
              <div style={wiz.stepDesc}>
                Every WABA must be managed by a WhatsApp Business Solution Provider (BSP). Granting Dyrect access lets us send messages, manage templates, and handle billing with Meta on your behalf.
              </div>

              <div style={{ margin:'20px 0', display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { title:'Send messages', desc:'Dyrect can trigger notifications on your WABA using your approved templates.', icon:'✉️' },
                  { title:'Manage templates', desc:'Submit, edit, and track templates to Meta for approval on your behalf.', icon:'📋' },
                  { title:'Billing management', desc:'Meta charges per conversation — Dyrect handles this as your BSP.', icon:'💳' },
                  { title:'Webhook delivery', desc:'Receive delivery receipts, read receipts, and status callbacks in Dyrect.', icon:'🔔' },
                ].map(item => (
                  <div key={item.title} style={{ display:'flex', gap:12, padding:'12px 14px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-surface)' }}>
                    <div style={{ fontSize:20 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)' }}>{item.title}</div>
                      <div style={{ fontSize:12, color:'var(--fg-2)', marginTop:2, lineHeight:1.4 }}>{item.desc}</div>
                    </div>
                    <div style={{ marginLeft:'auto', flexShrink:0, alignSelf:'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><path d="m5 12 5 5 9-10"/></svg>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ ...wiz.infoBox, background:'var(--bg-muted)', borderColor:'var(--border-default)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--fg-2)" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v.01M8 8v4"/></svg>
                <div style={{ fontSize:12, color:'var(--fg-2)', lineHeight:1.5 }}>
                  You can revoke Dyrect's access at any time from <strong>Meta Business Suite → Settings → Accounts → WhatsApp accounts → Partners</strong>.
                </div>
              </div>
            </div>
          )}

          {/* ── 7: DONE ── */}
          {step === 'done' && (
            <div style={{ ...wiz.stepContent, alignItems:'center', textAlign:'center', paddingTop:32 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#E7F8EE', display:'grid', placeItems:'center', margin:'0 auto 20px' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.2"><path d="m5 12 5 5 9-10"/></svg>
              </div>
              <div style={{ fontSize:20, fontWeight:700, color:'var(--fg-1)', marginBottom:8, letterSpacing:'-0.02em' }}>
                Your WABA is live 🎉
              </div>
              <div style={{ fontSize:14, color:'var(--fg-2)', lineHeight:1.6, maxWidth:380, margin:'0 auto 28px' }}>
                <strong>{form.displayName || 'Your brand'}</strong>'s WhatsApp Business Account is connected and ready to send notifications. You're on <strong>Tier 1 (1,000 msgs/day)</strong> by default.
              </div>

              <div style={{ width:'100%', background:'var(--bg-muted)', borderRadius:'var(--radius-md)', padding:'16px 20px', textAlign:'left', marginBottom:20 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)', marginBottom:12 }}>Next steps to unlock more</div>
                {[
                  { title:'Complete Business Verification', desc:'Submit documents to Meta to unlock Tier 2 (10K/day), more phone numbers, and Green Tick eligibility.', cta:'Start verification →', done:false },
                  { title:'Approve your display name', desc:'Meta automatically reviews it after business verification is approved.', cta:null, done:false },
                  { title:'Create your first template', desc:'Your existing Dyrect default templates are ready. Clone them to add your brand voice.', cta:null, done:true },
                ].map(item => (
                  <div key={item.title} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', border: item.done ? 'none' : '1.5px solid var(--border-strong)', background: item.done ? 'var(--success)' : 'transparent', display:'grid', placeItems:'center', flexShrink:0, marginTop:1 }}>
                      {item.done && <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5"><path d="m4 8 3 3 5-6"/></svg>}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)' }}>{item.title}</div>
                      <div style={{ fontSize:12, color:'var(--fg-2)', marginTop:2 }}>{item.desc}</div>
                      {item.cta && <a href="#" style={{ fontSize:12, color:'var(--brand-blue)', textDecoration:'none', fontWeight:500 }}>{item.cta}</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer nav */}
        <div style={wiz.footer}>
          {curIdx > 0 && step !== 'done' && (
            <button style={wiz.btnBack} onClick={back}>← Back</button>
          )}
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            {step === 'done'
              ? <button style={wiz.btnPrimary} onClick={handleComplete}>Go to WhatsApp settings</button>
              : (
                <button
                  style={{
                    ...wiz.btnPrimary,
                    opacity: (step === 'meta' && !metaDone) || (step === 'otp' && !verified && numberType === 'own') ? 0.5 : 1,
                    cursor: (step === 'meta' && !metaDone) ? 'not-allowed' : 'pointer',
                  }}
                  disabled={(step === 'meta' && !metaDone) || (step === 'otp' && !verified && numberType === 'own')}
                  onClick={next}
                >
                  {step === 'perms' ? 'Grant access & go live →' : 'Continue →'}
                </button>
              )
            }
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } } @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

const wiz = {
  overlay: { position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 },
  modal: { width:560, maxHeight:'92vh', background:'var(--bg-surface)', borderRadius:'var(--radius-lg,12px)', boxShadow:'var(--shadow-pop)', display:'flex', flexDirection:'column', overflow:'hidden' },
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 14px', borderBottom:'1px solid var(--border-default)', flexShrink:0 },
  closeBtn: { width:32, height:32, borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-muted)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--fg-2)' },
  stepper: { display:'flex', alignItems:'center', padding:'14px 24px', borderBottom:'1px solid var(--border-default)', flexShrink:0 },
  body: { flex:1, overflowY:'auto', padding:'0 24px' },
  stepContent: { padding:'20px 0', display:'flex', flexDirection:'column', gap:0 },
  stepTitle: { fontSize:17, fontWeight:700, color:'var(--fg-1)', marginBottom:8, letterSpacing:'-0.02em' },
  stepDesc: { fontSize:14, color:'var(--fg-2)', lineHeight:1.6, marginBottom:4 },
  featureCard: { padding:'14px', border:'1px solid var(--border-default)', borderRadius:'var(--radius-sm)', background:'var(--bg-surface)' },
  infoBox: { display:'flex', gap:8, padding:'10px 12px', borderRadius:'var(--radius-sm)', border:'1px solid #C5D5FB', background:'var(--info-bg)', marginTop:8 },
  field: { display:'flex', flexDirection:'column', gap:6 },
  label: { fontSize:12, fontWeight:600, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'0.04em' },
  hint: { fontSize:12, color:'var(--fg-3)', lineHeight:1.4 },
  input: { height:38, padding:'0 12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontSize:14, color:'var(--fg-1)', outline:'none', width:'100%', boxSizing:'border-box' },
  select: { height:38, padding:'0 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', background:'var(--bg-surface)', fontSize:14, color:'var(--fg-1)', outline:'none', width:'100%' },
  footer: { display:'flex', alignItems:'center', padding:'14px 24px', borderTop:'1px solid var(--border-default)', flexShrink:0 },
  btnBack: { height:36, padding:'0 14px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-surface)', fontSize:13, fontWeight:500, color:'var(--fg-2)', cursor:'pointer' },
  btnPrimary: { height:36, padding:'0 18px', borderRadius:'var(--radius-sm)', border:'none', background:'var(--brand-blue)', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer' },
};

Object.assign(window, { WABAWizard });
