
const { useState } = React;

const STATUS_MAP = {
  sent:      { bg:'var(--info-bg)',    color:'var(--info)',    label:'Sent' },
  delivered: { bg:'var(--success-bg)', color:'var(--success)', label:'Delivered' },
  read:      { bg:'#E8F5E9',           color:'#2E7D32',        label:'Read' },
  failed:    { bg:'var(--danger-bg)',  color:'var(--danger)',  label:'Failed' },
};

const EVENT_LABEL = {
  'warranty.registered': 'Warranty registered',
  'claim.created':       'Claim created',
  'claim.status_changed':'Claim status update',
  'ticket.updated':      'Ticket update',
};

function StatusDot({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.sent;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:4, background:s.bg, color:s.color, fontSize:12, fontWeight:500 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, display:'inline-block', flexShrink:0 }}></span>
      {s.label}
    </span>
  );
}

function WAActivity({ logs }) {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'read', 'delivered', 'sent', 'failed'];

  const filtered = filter === 'all' ? logs : logs.filter(l => l.status === filter);

  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderBottom:'1px solid var(--border-default)', flexWrap:'wrap' }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--fg-1)', flex:1 }}>Activity log</div>

        {/* Filter pills */}
        <div style={{ display:'flex', gap:4, padding:'3px', background:'var(--bg-muted)', borderRadius:'var(--radius-sm)' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:'4px 10px', borderRadius:5, border:'none', cursor:'pointer',
                fontSize:12, fontWeight:500, textTransform:'capitalize',
                background: filter===f ? 'var(--bg-surface)' : 'transparent',
                color: filter===f ? 'var(--fg-1)' : 'var(--fg-2)',
                boxShadow: filter===f ? 'var(--shadow-xs)' : 'none',
              }}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button style={{ height:32, padding:'0 10px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-default)', background:'var(--bg-surface)', fontSize:12, fontWeight:500, color:'var(--fg-2)', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <Icon name="external" size={12} /> Export
        </button>
      </div>

      {/* Table */}
      <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'var(--font-sans)', fontSize:13 }}>
        <thead>
          <tr>
            {['Timestamp', 'Customer', 'Event', 'Template', 'Status', 'WAMID'].map((h, i) => (
              <th key={i} style={{ textAlign:'left', padding:'11px 16px', fontWeight:500, color:'var(--slate-700)', background:'var(--bg-muted)', fontSize:12, borderBottom:'1px solid var(--border-default)', letterSpacing:'-0.01em', whiteSpace:'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((log, i) => (
            <tr key={log.id} style={{ borderTop: i===0 ? 'none' : '1px solid var(--border-default)' }}>
              <td style={{ padding:'11px 16px', verticalAlign:'middle' }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:12, fontWeight:400, color:'var(--fg-2)', letterSpacing:'-0.01em' }}>
                  {log.ts}
                </span>
              </td>
              <td style={{ padding:'11px 16px', verticalAlign:'middle' }}>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--fg-1)' }}>{log.customer}</span>
              </td>
              <td style={{ padding:'11px 16px', verticalAlign:'middle' }}>
                <span style={{ fontSize:12, color:'var(--fg-2)' }}>{EVENT_LABEL[log.event] || log.event}</span>
              </td>
              <td style={{ padding:'11px 16px', verticalAlign:'middle' }}>
                <code style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-1)' }}>{log.template}</code>
              </td>
              <td style={{ padding:'11px 16px', verticalAlign:'middle' }}>
                <StatusDot status={log.status} />
              </td>
              <td style={{ padding:'11px 16px', verticalAlign:'middle' }}>
                {log.wamid
                  ? <code style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-3)' }}>{log.wamid.slice(0, 20)}…</code>
                  : <span style={{ color:'var(--fg-3)', fontSize:12 }}>—</span>
                }
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding:'32px 16px', textAlign:'center', color:'var(--fg-3)', fontSize:13 }}>
                No activity matching this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'#FAFBFC', borderTop:'1px solid var(--border-default)', fontSize:12, color:'var(--fg-2)' }}>
        <span>Showing {filtered.length} of {logs.length} events</span>
        <div style={{ display:'flex', gap:4 }}>
          {[1,2,3].map(p => (
            <button key={p} style={{ width:26, height:26, borderRadius:5, border:'1px solid var(--border-default)', background: p===1 ? 'var(--brand-blue)' : 'var(--bg-surface)', color: p===1 ? '#fff' : 'var(--fg-1)', fontSize:11, cursor:'pointer' }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WAActivity });
