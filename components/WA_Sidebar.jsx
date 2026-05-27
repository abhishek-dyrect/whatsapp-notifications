
const { useState } = React;

function Icon({ name, size = 16 }) {
  const paths = {
    home:        <path d="M2.5 7.5 8 3l5.5 4.5V13a1 1 0 0 1-1 1h-3V9.5h-3V14h-3a1 1 0 0 1-1-1V7.5Z"/>,
    customers:   <><circle cx="8" cy="5" r="2.5"/><path d="M3 13.5c.5-2.5 2.5-4 5-4s4.5 1.5 5 4"/></>,
    products:    <><path d="m8 2 5.5 3v6L8 14 2.5 11V5L8 2Z"/><path d="m2.5 5 5.5 3 5.5-3M8 8v6"/></>,
    serial:      <><path d="M6 2v12M10 2v12M3 6h10M3 10h10"/></>,
    contracts:   <><rect x="3" y="3" width="10" height="10" rx="1.5"/><path d="M3 6h10"/></>,
    support:     <><circle cx="8" cy="8" r="5.5"/><path d="M5 5l1 1M10 5l-1 1M5 11l1-1M10 11l-1-1"/></>,
    finance:     <><rect x="3" y="5" width="10" height="7" rx="1"/><path d="M6 5V4a2 2 0 0 1 4 0v1"/></>,
    analytics:   <path d="M3 13V7l5-4 5 4v6M7 13v-3h2v3"/>,
    flows:       <><circle cx="4" cy="4" r="1.5"/><circle cx="12" cy="4" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><path d="M5.5 4h5M5.5 12h5M4 5.5v5M12 5.5v5"/></>,
    config:      <><circle cx="4" cy="5" r="1.5"/><circle cx="12" cy="11" r="1.5"/><path d="M2 5h.5M5.5 5H14M2 11h4.5M13.5 11H14"/></>,
    settings:    <><circle cx="8" cy="8" r="2.5"/><path d="M13.4 8c0-.5-.1-1-.2-1.4l1.2-1-1.5-2.6-1.5.6c-.8-.5-1.6-.9-2.6-1.1L8.5 1h-3l-.3 1.5c-1 .2-1.8.6-2.6 1.1L1.1 3l-1.5 2.6 1.2 1C.7 7 .6 7.5.6 8s.1 1 .3 1.4l-1.2 1 1.5 2.6 1.5-.6c.8.5 1.6.9 2.6 1.1L5.5 15h3l.3-1.5c1-.2 1.8-.6 2.6-1.1l1.5.6 1.5-2.6-1.2-1c.1-.4.2-.9.2-1.4Z"/></>,
    whatsapp:    <><path d="M13.8 2.2A7.8 7.8 0 0 0 2 10.6L1 15l4.5-1.2a7.8 7.8 0 1 0 8.3-11.6ZM8 14.3a6.5 6.5 0 0 1-3.3-.9l-.3-.2L2 14l.8-2.3-.2-.3A6.5 6.5 0 1 1 8 14.3Z"/><path d="M5.8 4.8c-.2-.4-.4-.4-.6-.4H4.9c-.2 0-.5.1-.8.4C3.8 5.1 3 5.9 3 7.4s1.1 3 1.2 3.2c.1.2 2 3.2 4.9 4.4 2.5 1 3 .8 3.5.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3-.3-.2-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-.4-.2-1.5-.5-2.8-1.8C7 12 6.4 11 6.3 10.7c-.1-.3 0-.4.1-.5l.4-.4c.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5-.1-.1-.6-1.4-.8-1.9-.1-.4-.3-.3-.5-.3Z"/></>,
    chevDown:    <path d="m4 6 4 4 4-4"/>,
    search:      <><circle cx="7" cy="7" r="4"/><path d="m13 13-2.5-2.5"/></>,
    bell:        <><path d="M4 8a4 4 0 0 1 8 0v3H4V8Z"/><path d="M6 11v.5a2 2 0 0 0 4 0V11"/></>,
    external:    <><path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"/><path d="M9 1h6v6M15 1 8 8"/></>,
    close:       <><path d="M12 4 4 12M4 4l8 8"/></>,
    copy:        <><rect x="7" y="7" width="7" height="7" rx="1"/><path d="M4 10H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/></>,
    check:       <path d="m4 8 3 3 5-6"/>,
    plus:        <><path d="M8 3v10M3 8h10"/></>,
    edit:        <><path d="m11 3 2 2-8 8H3v-2l8-8Z"/></>,
    clone:       <><rect x="7" y="7" width="7" height="7" rx="1.5"/><path d="M4 10H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/></>,
    warning:     <><path d="M10 3 2.5 16h15L10 3Z"/><path d="M10 9v3M10 14v.01"/></>,
    info:        <><circle cx="8" cy="8" r="6"/><path d="M8 5v.01M8 8v4"/></>,
    send:        <><path d="m2 2 12 6-12 6V9l8-1-8-1V2Z"/></>,
    refresh:     <><path d="M13.5 6A6 6 0 1 0 14 9"/><path d="M14 3v3h-3"/></>,
    arrowRight:  <><path d="M3 8h10M9 4l4 4-4 4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}

function WASidebar({ active = 'whatsapp' }) {
  const [collapsed, setCollapsed] = useState(false);

  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'customers', label: 'Customers', icon: 'customers' },
    { id: 'products', label: 'Products', icon: 'products' },
    { id: 'serial', label: 'Serialization', icon: 'serial', badge: 'New' },
    { type: 'sep', label: 'Operations' },
    { id: 'contracts', label: 'Contracts', icon: 'contracts', chevron: true },
    { id: 'support', label: 'Support & Service', icon: 'support', chevron: true },
    { type: 'sep', label: 'Business' },
    { id: 'finance', label: 'Finance', icon: 'finance', chevron: true },
    { id: 'analytics', label: 'Analytics', icon: 'analytics', chevron: true },
    { id: 'flows', label: 'Flows', icon: 'flows', badge: 'New' },
    { id: 'config', label: 'Configurations', icon: 'config', chevron: true },
    { type: 'sep', label: 'Account' },
    {
      id: 'settings', label: 'Settings', icon: 'settings', chevron: true, expanded: true,
      children: [{ id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' }]
    },
  ];

  const C = collapsed;

  return (
    <>
      <style>{`
        .wa-sidebar { transition: width 0.2s cubic-bezier(.4,0,.2,1); }
        .wa-nav-label { transition: opacity 0.15s, width 0.2s; }
        .wa-sidebar-item:hover { background: var(--slate-50) !important; }
        .wa-tooltip { position: relative; }
        .wa-tooltip::after {
          content: attr(data-tip);
          position: absolute; left: calc(100% + 10px); top: 50%; transform: translateY(-50%);
          background: var(--slate-800); color: #fff;
          font-size: 12px; font-weight: 500; white-space: nowrap;
          padding: 5px 9px; border-radius: 6px;
          pointer-events: none; opacity: 0;
          transition: opacity .12s; z-index: 999;
          font-family: var(--font-sans);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .wa-tooltip:hover::after { opacity: 1; }
      `}</style>

      <aside className="wa-sidebar" style={{
        width: C ? 52 : 248, flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'sticky', top: 0,
        overflow: 'hidden',
      }}>

        {/* Logo row */}
        <div style={{
          padding: C ? '16px 0' : '18px 14px 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: C ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-default)',
          minHeight: 57, flexShrink: 0,
        }}>
          {!C && <img src="assets/logo-wordmark-blue.png" alt="Dyrect" style={{ height: 22 }} />}
          <div
            onClick={() => setCollapsed(v => !v)}
            title={C ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: 24, height: 24, display: 'grid', placeItems: 'center',
              color: 'var(--slate-500)', cursor: 'pointer', borderRadius: 4,
              flexShrink: 0, transition: 'background .1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {C ? (
              /* chevron-right / expand icon */
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M10 3v10"/>
              </svg>
            ) : (
              /* sidebar collapse icon */
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M6 3v10"/>
              </svg>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: C ? '10px 6px' : '10px 10px',
          display: 'flex', flexDirection: 'column', gap: 1,
        }}>
          {NAV_ITEMS.map((item, i) => {
            if (item.type === 'sep') {
              if (C) return <div key={i} style={{ height: 1, background: 'var(--border-default)', margin: '8px 4px' }} />;
              return <div key={i} style={{ fontSize: 11, fontWeight: 500, color: 'var(--slate-400)', padding: '14px 10px 4px', userSelect: 'none' }}>{item.label}</div>;
            }

            const isParentActive = item.children && item.children.some(c => c.id === active);
            const isActive = item.id === active;
            const highlight = isActive || isParentActive;

            return (
              <React.Fragment key={item.id}>
                <a
                  className={`wa-sidebar-item${C ? ' wa-tooltip' : ''}`}
                  data-tip={C ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: C ? 0 : 9,
                    padding: C ? '8px 0' : '7px 10px',
                    justifyContent: C ? 'center' : 'flex-start',
                    borderRadius: 8,
                    fontSize: 14, fontWeight: 500,
                    color: highlight ? 'var(--slate-900)' : 'var(--slate-600)',
                    textDecoration: 'none', cursor: 'pointer', userSelect: 'none',
                    background: highlight ? 'var(--bg-surface)' : 'transparent',
                    boxShadow: highlight ? 'inset 0 0 0 1px var(--border-default)' : 'none',
                    position: 'relative',
                  }}
                >
                  <span style={{ color: highlight ? 'var(--slate-900)' : 'var(--slate-500)', display: 'flex', flexShrink: 0 }}>
                    <Icon name={item.icon} size={16} />
                  </span>
                  {!C && <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.label}</span>}
                  {!C && item.badge && <span style={{ fontSize: 11, color: 'var(--brand-blue)', fontWeight: 600 }}>{item.badge}</span>}
                  {!C && item.chevron && (
                    <span style={{ color: 'var(--slate-400)', display: 'flex', transform: item.expanded ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                      <Icon name="chevDown" size={12} />
                    </span>
                  )}
                  {/* Active dot in collapsed mode */}
                  {C && highlight && (
                    <span style={{ position: 'absolute', right: 4, top: 4, width: 5, height: 5, borderRadius: '50%', background: 'var(--brand-blue)' }} />
                  )}
                </a>

                {/* Children — only show when expanded and not collapsed */}
                {!C && item.expanded && item.children && item.children.map(child => {
                  const childActive = child.id === active;
                  return (
                    <a key={child.id} className="wa-sidebar-item" style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '7px 10px', paddingLeft: 28,
                      borderRadius: 8, fontSize: 13, fontWeight: 400,
                      color: 'var(--slate-600)', textDecoration: 'none',
                      cursor: 'pointer', userSelect: 'none',
                      background: childActive ? 'var(--bg-surface)' : 'transparent',
                      boxShadow: childActive ? 'inset 0 0 0 1px var(--border-default)' : 'none',
                    }}>
                      <span style={{ color: childActive ? 'var(--brand-blue)' : 'var(--slate-400)', display: 'flex' }}>
                        <Icon name={child.icon} size={14} />
                      </span>
                      <span style={{ flex: 1 }}>{child.label}</span>
                      {childActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-blue)' }} />}
                    </a>
                  );
                })}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--border-default)',
          padding: C ? '8px 6px' : '8px 10px 10px',
          display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0,
        }}>
          {!C && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, fontSize: 14, color: 'var(--slate-600)', cursor: 'pointer' }}>
              <Icon name="search" size={14} />
              Search
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brand-blue)' }}>Ctrl+K</span>
            </div>
          )}
          {C && (
            <div className="wa-tooltip" data-tip="Search" style={{ display: 'flex', justifyContent: 'center', padding: '7px 0', cursor: 'pointer', borderRadius: 8, color: 'var(--slate-500)' }}>
              <Icon name="search" size={16} />
            </div>
          )}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: C ? 0 : 9,
            padding: C ? '7px 0' : '8px 6px',
            borderTop: '1px solid var(--border-default)',
            marginTop: 4, cursor: 'pointer',
            justifyContent: C ? 'center' : 'flex-start',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--slate-100)', color: 'var(--slate-700)',
              display: 'grid', placeItems: 'center',
              fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>AB</div>
            {!C && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--slate-800)', lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Abhishek Bindal</div>
                  <div style={{ fontSize: 11, color: 'var(--slate-500)', lineHeight: 1.3 }}>admin@dyrect.co</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ color: 'var(--slate-400)', flexShrink: 0 }}>
                  <circle cx="3" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="13" cy="8" r="1.3"/>
                </svg>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

const sidebarStyles = {};

Object.assign(window, { WASidebar, Icon });
