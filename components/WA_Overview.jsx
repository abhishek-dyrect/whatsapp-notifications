
const { useState } = React;

function StatCard({ label, value, sub, color }) {
  return (
    <div style={ovStyles.statCard}>
      <div style={ovStyles.statLabel}>{label}</div>
      <div style={{ ...ovStyles.statValue, color: color || 'var(--slate-900)' }}>{value}</div>
      {sub && <div style={ovStyles.statSub}>{sub}</div>}
    </div>
  );
}

function QualityPip({ rating }) {
  if (!rating) return <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>—</span>;
  const map = {
    GREEN:  { bg: 'var(--success-bg)', color: 'var(--success)', label: 'Good' },
    YELLOW: { bg: 'var(--warning-bg)', color: 'var(--warning)', label: 'Medium' },
    RED:    { bg: 'var(--danger-bg)',  color: 'var(--danger)',  label: 'Low' },
  };
  const s = map[rating] || map.GREEN;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:'var(--radius-pill)', background: s.bg, fontSize:12, fontWeight:500, color: s.color }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background: s.color, display:'inline-block' }}></span>
      {s.label}
    </span>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 999, cursor: disabled ? 'default' : 'pointer',
        background: checked ? 'var(--brand-blue)' : 'var(--slate-200)',
        position: 'relative', transition: 'background .15s', flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        position:'absolute', top:3, left: checked ? 19 : 3,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        boxShadow: 'var(--shadow-xs)', transition: 'left .15s',
      }}></span>
    </div>
  );
}

function SenderCard({ channel, onUpgradeWABA }) {
  return (
    <div style={ovStyles.senderCard}>
      <div style={ovStyles.senderLeft}>
        <div style={{ ...ovStyles.senderIconWrap, background: channel.isBYO ? '#E7F8EE' : 'var(--success-bg)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.5 3.5A12 12 0 0 0 2 10.7L1 23l12.3-3.2A12 12 0 1 0 20.5 3.5Z"/>
            <path d="M8.8 7.2c-.3-.6-.6-.6-.9-.6H7.4c-.3 0-.8.1-1.2.6-.4.4-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.1 4.9 7.6 6.7 3.8 1.5 4.5 1.2 5.3 1.1.8-.1 2.4-.9 2.7-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5-.4-.2-2.3-1.1-2.6-1.3-.3-.2-.6-.2-.9.2-.3.3-1.1 1.3-1.3 1.5-.2.3-.5.3-.8.1-.6-.3-2.4-.9-4.5-2.8C9.7 15 8.9 13.6 8.7 13.3c-.2-.3 0-.6.2-.8l.6-.7c.2-.2.3-.5.4-.7.1-.3 0-.6-.1-.8-.2-.3-.9-2.2-1.3-3Z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>
            {channel.senderName}
            {channel.isBYO && (
              <span style={{ marginLeft:8, fontSize:11, padding:'2px 6px', borderRadius:4, background:'#E7F8EE', color:'#25D366', fontWeight:600 }}>BYO</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 1, display:'flex', alignItems:'center', gap:6 }}>
            {channel.phoneNumber} · Tier {channel.tier}
            {channel.qualityRating && <><span style={{ color:'var(--border-strong)' }}>·</span><QualityPip rating={channel.qualityRating} /></>}
          </div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {channel.isBYO
          ? <span style={{ ...ovStyles.badgeSuccess, fontSize:12 }}>Your WABA · Active</span>
          : (
            <>
              <span style={ovStyles.badgeNeutral}>Shared WABA</span>
              <button style={ovStyles.btnOutline} onClick={onUpgradeWABA}>
                Upgrade to BYO WABA
              </button>
            </>
          )
        }
      </div>
    </div>
  );
}

function EventRow({ event, onToggle }) {
  const pct = (n) => n != null ? `${n}%` : '—';
  return (
    <div style={ovStyles.eventRow}>
      <div style={{ display:'flex', alignItems:'center', gap:10, flex:'0 0 260px' }}>
        <Toggle checked={event.enabled} onChange={(v) => onToggle(event.id, v)} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg-1)' }}>{event.label}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 1 }}>{event.desc}</div>
        </div>
      </div>

      <div style={ovStyles.eventStats}>
        <div style={ovStyles.statPill}>
          <span style={ovStyles.statPillLabel}>Sent</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:600, letterSpacing:'-0.02em', color:'var(--fg-1)' }}>
            {event.enabled && event.stats ? event.stats.sent.toLocaleString() : '—'}
          </span>
        </div>
        <div style={ovStyles.statPill}>
          <span style={ovStyles.statPillLabel}>Delivery</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:600, letterSpacing:'-0.02em', color: event.enabled && event.stats ? 'var(--success)' : 'var(--fg-3)' }}>
            {event.enabled && event.stats ? pct(event.stats.delivery) : '—'}
          </span>
        </div>
        <div style={ovStyles.statPill}>
          <span style={ovStyles.statPillLabel}>Read</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:600, letterSpacing:'-0.02em', color: event.enabled && event.stats ? 'var(--brand-blue)' : 'var(--fg-3)' }}>
            {event.enabled && event.stats ? pct(event.stats.read) : '—'}
          </span>
        </div>
      </div>

      <div style={{ marginLeft:'auto' }}>
        <span style={event.enabled ? ovStyles.badgeSuccess : ovStyles.badgeNeutral}>
          {event.enabled ? 'Active' : 'Paused'}
        </span>
      </div>
    </div>
  );
}

function WAOverview({ data, onEventToggle, onUpgradeWABA }) {
  const { channel, stats, events } = data;

  return (
    <div style={ovStyles.root}>

      {/* Stats row */}
      <div style={ovStyles.statsGrid}>
        <StatCard
          label="Messages sent · 7 days"
          value={stats.messagesSent7d.toLocaleString()}
          sub={`${stats.messagesSentTotal.toLocaleString()} all time`}
        />
        <StatCard
          label="Delivery rate"
          value={`${stats.deliveryRate}%`}
          sub="Target >85%"
          color="var(--success)"
        />
        <StatCard
          label="Read rate"
          value={`${stats.readRate}%`}
          sub="Target >70%"
          color="var(--brand-blue)"
        />
        <StatCard
          label="Customer opt-in rate"
          value={`${stats.optInRate}%`}
          sub="At registration"
        />
      </div>

      {/* Sender config */}
      <div style={ovStyles.section}>
        <div style={ovStyles.sectionHeader}>
          <div>
            <div style={ovStyles.sectionTitle}>Sender configuration</div>
            <div style={ovStyles.sectionDesc}>Messages are sent from this WhatsApp Business Account.</div>
          </div>
        </div>
        <SenderCard channel={channel} onUpgradeWABA={onUpgradeWABA} />
      </div>

      {/* Event notifications */}
      <div style={ovStyles.section}>
        <div style={ovStyles.sectionHeader}>
          <div>
            <div style={ovStyles.sectionTitle}>Event notifications</div>
            <div style={ovStyles.sectionDesc}>Toggle each event on or off. Stats show the last 7 days.</div>
          </div>
        </div>
        <div style={ovStyles.eventList}>
          {events.map((ev, i) => (
            <React.Fragment key={ev.id}>
              {i > 0 && <div style={ovStyles.divider}></div>}
              <EventRow event={ev} onToggle={onEventToggle} />
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
}

const ovStyles = {
  root: { display:'flex', flexDirection:'column', gap:24 },

  statsGrid: {
    display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14,
  },
  statCard: {
    background:'var(--bg-surface)', border:'1px solid var(--border-default)',
    borderRadius:'var(--radius-md)', padding:'16px 18px',
  },
  statLabel: { fontSize:12, color:'var(--fg-2)', marginBottom:4 },
  statValue: {
    fontFamily:'var(--font-display)', fontSize:26, fontWeight:700,
    letterSpacing:'-0.03em', lineHeight:1,
    fontFeatureSettings:'"tnum"', color:'var(--slate-900)',
  },
  statSub: { fontSize:12, color:'var(--fg-3)', marginTop:4 },

  section: {
    background:'var(--bg-surface)', border:'1px solid var(--border-default)',
    borderRadius:'var(--radius-md)', overflow:'hidden',
  },
  sectionHeader: {
    padding:'16px 20px', borderBottom:'1px solid var(--border-default)',
    display:'flex', alignItems:'center', justifyContent:'space-between',
  },
  sectionTitle: { fontSize:14, fontWeight:600, color:'var(--fg-1)' },
  sectionDesc:  { fontSize:13, color:'var(--fg-2)', marginTop:2 },

  senderCard: {
    padding:'16px 20px',
    display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
  },
  senderLeft: { display:'flex', alignItems:'center', gap:12 },
  senderIconWrap: {
    width:40, height:40, borderRadius:'var(--radius-md)',
    background:'var(--success-bg)', display:'grid', placeItems:'center', flexShrink:0,
  },

  eventList: { padding:'0 0' },
  eventRow: {
    display:'flex', alignItems:'center', gap:16,
    padding:'14px 20px',
  },
  eventStats: {
    display:'flex', gap:8, marginLeft:16,
  },
  statPill: {
    display:'flex', flexDirection:'column', alignItems:'center',
    padding:'6px 12px', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)',
    minWidth:62,
  },
  statPillLabel: { fontSize:10, fontWeight:500, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:2 },
  divider: { height:1, background:'var(--border-default)', margin:'0 20px' },

  badgeSuccess: {
    display:'inline-flex', alignItems:'center', gap:4,
    padding:'3px 8px', borderRadius:4,
    background:'var(--success-bg)', color:'var(--success)',
    fontSize:12, fontWeight:500,
  },
  badgeNeutral: {
    display:'inline-flex', alignItems:'center', gap:4,
    padding:'3px 8px', borderRadius:4,
    background:'var(--bg-muted)', color:'var(--fg-2)',
    fontSize:12, fontWeight:500,
  },
  btnOutline: {
    height:32, padding:'0 12px', borderRadius:'var(--radius-sm)',
    border:'1px solid var(--border-strong)', background:'var(--bg-surface)',
    fontSize:13, fontWeight:500, color:'var(--fg-1)', cursor:'pointer',
  },
};

Object.assign(window, { WAOverview, Toggle, QualityPip, ovStyles });
