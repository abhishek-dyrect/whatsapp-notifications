
/* WA_EventNotifications.jsx
   Notifications tab:
   - Left sidebar: Customers / Business / SCM audience
   - Accordion modules per audience
   - Email / WhatsApp / SMS column toggles
   - Hover-reveal template edit icon per active-channel cell
*/

const { useState } = React;

/* ── Channels ─────────────────────────────────────────── */
const CHANNELS = [
  {
    id:'email', label:'Email', enabled:true, color:'var(--brand-blue)',
    icon:<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/><path d="M1.5 5.5 8 9.5l6.5-4"/></svg>,
  },
  {
    id:'whatsapp', label:'WhatsApp', enabled:true, color:'#25D366',
    icon:<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.8 2.2A7.8 7.8 0 0 0 2 10.6L1 15l4.5-1.2a7.8 7.8 0 1 0 8.3-11.6Z"/></svg>,
  },
  {
    id:'sms', label:'SMS', enabled:false, color:'var(--fg-3)',
    icon:<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 1.5h-11A1 1 0 0 0 1.5 2.5v8a1 1 0 0 0 1 1H5l3 2.5L11 11.5h2.5a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1Z"/><path d="M5 6.5h6M5 9h4"/></svg>,
  },
];

/* ── Module pool ──────────────────────────────────────── */
const ALL_MODULES = {
  registration: {
    id:'registration', label:'Registration',
    events:[
      { id:'reg_confirm',  label:'Registration Confirmation',             desc:'Sent when a customer successfully registers a product.',           email:true,  whatsapp:true,  sms:false },
      { id:'reg_pending',  label:'Registration Pending Review',           desc:'Sent when a registration is pending manual review.',               email:true,  whatsapp:false, sms:false },
      { id:'reg_rejected', label:'Registration Rejected',                 desc:'Sent when a registration is rejected after review.',               email:true,  whatsapp:true,  sms:false },
      { id:'reg_updated',  label:'Registration Details Updated',          desc:'Sent when registration details are updated.',                      email:true,  whatsapp:false, sms:false },
    ],
  },
  product_reg: {
    id:'product_reg', label:'Product Registration',
    events:[
      { id:'prod_created',  label:'Product Registered',                   desc:'Sent when a product is added to the warranty system.',             email:true,  whatsapp:true,  sms:false },
      { id:'prod_expiry',   label:'Warranty Expiry Reminder',             desc:'Sent 30 days before the warranty expiry date.',                    email:true,  whatsapp:true,  sms:false },
      { id:'prod_extended', label:'Warranty Extended',                    desc:'Sent when a warranty plan is extended or upgraded.',               email:true,  whatsapp:false, sms:false },
    ],
  },
  service_claims: {
    id:'service_claims', label:'Service & Claims',
    events:[
      { id:'claim_created',  label:'Claim Created',                       desc:'Sent when a new claim is raised by the customer.',                 email:true,  whatsapp:true,  sms:false },
      { id:'claim_status',   label:'Claim Status Update',                 desc:'Sent whenever a claim moves to a new status.',                     email:true,  whatsapp:true,  sms:false },
      { id:'claim_resolved', label:'Claim Resolved',                      desc:'Sent when a claim is closed or resolved.',                         email:true,  whatsapp:false, sms:false },
      { id:'claim_docs',     label:'Documents Requested',                 desc:'Sent when additional documents are required from the customer.',   email:true,  whatsapp:true,  sms:false },
    ],
  },
  support: {
    id:'support', label:'Support',
    events:[
      { id:'ticket_open',   label:'Ticket Opened',                        desc:'Sent when a new support ticket is created.',                       email:true,  whatsapp:false, sms:false },
      { id:'ticket_update', label:'Ticket Updated',                       desc:'Sent when a support ticket receives an update.',                   email:true,  whatsapp:false, sms:false },
      { id:'ticket_closed', label:'Ticket Resolved',                      desc:'Sent when a support ticket is closed.',                            email:true,  whatsapp:false, sms:false },
    ],
  },
  finance: {
    id:'finance', label:'Finance',
    events:[
      { id:'inv_generated', label:'Invoice Generated',                    desc:'Sent when an invoice is generated for the customer.',              email:true,  whatsapp:false, sms:false },
      { id:'pay_received',  label:'Payment Confirmed',                    desc:'Sent when a payment is successfully received.',                    email:true,  whatsapp:false, sms:false },
      { id:'refund_issued', label:'Refund Issued',                        desc:'Sent when a refund is processed.',                                 email:true,  whatsapp:true,  sms:false },
    ],
  },
  approvals: {
    id:'approvals', label:'Approvals & Reviews',
    events:[
      { id:'reg_review',     label:'New Registration Pending Review',     desc:'Notifies ops when a customer registration needs manual review.',   email:true,  whatsapp:true,  sms:false },
      { id:'warr_approval',  label:'Warranty Approval Required',          desc:'Notifies the client when a warranty needs their approval.',        email:true,  whatsapp:true,  sms:false },
      { id:'claim_escalate', label:'Claim Escalated',                     desc:'Notifies the manager when a claim is escalated.',                  email:true,  whatsapp:false, sms:false },
    ],
  },
  claims_ops: {
    id:'claims_ops', label:'Claims Operations',
    events:[
      { id:'claim_filed',   label:'New Claim Filed',                      desc:'Notifies the service team when a customer files a new claim.',     email:true,  whatsapp:false, sms:false },
      { id:'sla_breach',    label:'Claim SLA Breach Warning',             desc:'Notifies the manager when a claim is approaching SLA deadline.',   email:true,  whatsapp:true,  sms:false },
      { id:'docs_uploaded', label:'Documents Uploaded by Customer',       desc:'Notifies the reviewer when a customer uploads documents.',         email:true,  whatsapp:false, sms:false },
    ],
  },
  work_order: {
    id:'work_order', label:'Work Order',
    events:[
      { id:'wo_created',   label:'Work Order Created',                    desc:'Sent when a new work order is created.',                           email:true,  whatsapp:false, sms:false },
      { id:'wo_assigned',  label:'Work Order Assigned',                   desc:'Sent when a work order is assigned to a technician.',              email:false, whatsapp:true,  sms:false },
      { id:'wo_overdue',   label:'Work Order Overdue',                    desc:'Notifies the manager when a work order passes its due date.',       email:true,  whatsapp:true,  sms:false },
      { id:'wo_completed', label:'Work Order Completed',                  desc:'Sent when a work order is marked as complete.',                    email:true,  whatsapp:true,  sms:false },
    ],
  },
  system: {
    id:'system', label:'System & Admin',
    events:[
      { id:'user_added',   label:'New User Added',                        desc:'Notifies the admin when a new user is added to the account.',      email:true,  whatsapp:false, sms:false },
      { id:'role_changed', label:'Role or Permissions Changed',           desc:'Notifies the admin when a user\'s role is modified.',              email:true,  whatsapp:false, sms:false },
      { id:'user_invite',  label:'User Invitation',                       desc:'Sent when a new user is invited to the platform.',                 email:true,  whatsapp:false, sms:false },
      { id:'pwd_reset',    label:'Password Reset',                        desc:'Sent when a password reset is requested.',                         email:true,  whatsapp:false, sms:false },
    ],
  },
  return_shipping: {
    id:'return_shipping', label:'Return & Shipping',
    events:[
      { id:'return_init',    label:'Return Initiated',                    desc:'Sent when a return request is initiated.',                         email:true,  whatsapp:false, sms:false },
      { id:'return_pickup',  label:'Pickup Scheduled',                    desc:'Sent when a pickup is scheduled for return.',                      email:true,  whatsapp:true,  sms:false },
      { id:'return_recv',    label:'Item Received at Warehouse',          desc:'Sent when the returned item is received at the service centre.',   email:true,  whatsapp:false, sms:false },
      { id:'return_shipped', label:'Replacement Shipped',                 desc:'Sent when a replacement unit is dispatched.',                      email:true,  whatsapp:true,  sms:false },
    ],
  },
  dispatch: {
    id:'dispatch', label:'Dispatch & Delivery',
    events:[
      { id:'dispatch_ready', label:'Order Ready for Dispatch',            desc:'Notifies logistics when an order is packed and ready.',            email:true,  whatsapp:true,  sms:false },
      { id:'dispatched',     label:'Order Dispatched',                    desc:'Sent when the order is picked up by the courier.',                 email:true,  whatsapp:true,  sms:false },
      { id:'out_delivery',   label:'Out for Delivery',                    desc:'Sent when the shipment is out for last-mile delivery.',            email:false, whatsapp:true,  sms:false },
      { id:'delivered',      label:'Delivered',                           desc:'Sent when the shipment is marked as delivered.',                   email:true,  whatsapp:true,  sms:false },
    ],
  },
  inventory: {
    id:'inventory', label:'Inventory',
    events:[
      { id:'stock_low',  label:'Low Stock Alert',                         desc:'Notifies the warehouse manager when stock falls below threshold.', email:true,  whatsapp:false, sms:false },
      { id:'stock_in',   label:'Stock Received',                          desc:'Notifies the team when new stock is received at the warehouse.',   email:true,  whatsapp:false, sms:false },
      { id:'stock_adj',  label:'Inventory Adjustment',                    desc:'Notifies the admin when an inventory count is adjusted.',          email:true,  whatsapp:false, sms:false },
    ],
  },
};

/* ── Audience sidebar ─────────────────────────────────── */
const AUDIENCES = [
  {
    id:'customers', label:'Customers',
    desc:'Notifications sent to end customers',
    icon:<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="5.5" r="2.5"/><path d="M3 13c.5-2.5 2.5-4 5-4s4.5 1.5 5 4"/></svg>,
    moduleIds:['registration','product_reg','service_claims','support','finance'],
  },
  {
    id:'business', label:'Business',
    desc:'Internal ops & client team notifications',
    icon:<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M2 8h12"/></svg>,
    moduleIds:['approvals','claims_ops','work_order','system'],
  },
  {
    id:'scm', label:'SCM',
    desc:'Supply chain & logistics notifications',
    icon:<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="5" width="9" height="6" rx="1"/><path d="M10 7l4 2-4 2V7Z"/><circle cx="3.5" cy="12.5" r="1.5"/><circle cx="8" cy="12.5" r="1.5"/></svg>,
    moduleIds:['return_shipping','dispatch','inventory'],
  },
];

/* ── Build initial toggle state ───────────────────────── */
function buildInitialNotifData() {
  const data = {};
  Object.values(ALL_MODULES).forEach(mod => {
    data[mod.id] = {};
    mod.events.forEach(ev => {
      data[mod.id][ev.id] = { email:ev.email, whatsapp:ev.whatsapp, sms:ev.sms };
    });
  });
  return data;
}

/* ── Toggle ───────────────────────────────────────────── */
function EvToggle({ checked, onChange, disabled }) {
  return (
    <div onClick={() => !disabled && onChange(!checked)}
      title={disabled ? 'Channel not configured' : undefined}
      style={{
        width:34, height:19, borderRadius:999,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? 'var(--slate-200)' : checked ? 'var(--brand-blue)' : 'var(--slate-200)',
        position:'relative', transition:'background .15s', flexShrink:0,
        opacity: disabled ? 0.4 : 1,
      }}>
      <span style={{
        position:'absolute', top:2.5,
        left: (!disabled && checked) ? 17 : 2.5,
        width:14, height:14, borderRadius:'50%', background:'#fff',
        boxShadow:'var(--shadow-xs)', transition:'left .15s',
      }}></span>
    </div>
  );
}

/* ── Chevron ──────────────────────────────────────────── */
function Chevron({ dir='right', size=14 }) {
  const rot = { right:0, down:90, up:-90 }[dir] || 0;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform:`rotate(${rot}deg)`, transition:'transform .2s', display:'block' }}>
      <path d="M6 4l4 4-4 4"/>
    </svg>
  );
}

/* ── Hover-reveal edit icon ───────────────────────────── */
function EditIcon({ channel, eventLabel, onOpen }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); onOpen(channel.id, eventLabel); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`Edit ${channel.label} template`}
      style={{
        width:20, height:20, display:'grid', placeItems:'center',
        border:`1px solid ${hov ? 'var(--border-strong)' : 'var(--border-default)'}`,
        borderRadius:4,
        background: hov ? 'var(--bg-muted)' : 'transparent',
        cursor:'pointer',
        color: hov ? 'var(--fg-1)' : 'var(--fg-3)',
        transition:'all .1s', flexShrink:0,
      }}>
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2l3 3-8 8H3v-3L11 2Z"/>
      </svg>
    </button>
  );
}

/* ── Accordion section ────────────────────────────────── */
const CH_W = 130;

function Section({ mod, evState, onToggle, onOpenTemplate }) {
  const [open, setOpen] = useState(true);
  const [hovRow, setHovRow] = useState(null);

  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 20px', border:'none', background:'var(--bg-muted)',
        cursor:'pointer', textAlign:'left',
      }}>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--fg-1)' }}>{mod.label}</span>
        <span style={{ color:'var(--fg-3)', display:'flex' }}><Chevron dir={open ? 'up' : 'down'} size={14}/></span>
      </button>

      {open && mod.events.map(ev => {
        const st = evState?.[ev.id] || { email:ev.email, whatsapp:ev.whatsapp, sms:ev.sms };
        const rk = `${mod.id}-${ev.id}`;
        const isHov = hovRow === rk;

        return (
          <React.Fragment key={ev.id}>
            <div style={{ height:1, background:'var(--border-default)' }}></div>
            <div
              style={{ display:'flex', alignItems:'center', padding:'11px 20px', background: isHov ? 'var(--bg-muted)' : 'transparent', transition:'background .1s' }}
              onMouseEnter={() => setHovRow(rk)}
              onMouseLeave={() => setHovRow(null)}
            >
              {/* Event label */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, color:'var(--fg-1)', marginBottom:1 }}>{ev.label}</div>
                <div style={{ fontSize:12, color:'var(--fg-2)', lineHeight:1.4 }}>{ev.desc}</div>
              </div>

              {/* Channel cells */}
              {CHANNELS.map(ch => (
                <div key={ch.id} style={{ width:CH_W, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <EvToggle
                    checked={st[ch.id]}
                    disabled={!ch.enabled}
                    onChange={val => onToggle(mod.id, ev.id, ch.id, val)}
                  />
                  {/* Edit icon — only when channel enabled + toggle ON + row hovered */}
                  {ch.enabled && st[ch.id] && isHov && (
                    <EditIcon channel={ch} eventLabel={ev.label} onOpen={onOpenTemplate} />
                  )}
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
function WAEventNotifications({ notifData, onToggle, onOpenTemplate }) {
  const [audience, setAudience] = useState('customers');
  const aud = AUDIENCES.find(a => a.id === audience);
  const modules = aud.moduleIds.map(id => ALL_MODULES[id]).filter(Boolean);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0, flex:1, minHeight:0 }}>

      {/* Page header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'var(--fg-1)', letterSpacing:'-0.02em', marginBottom:3 }}>
          Notifications
        </div>
        <div style={{ fontSize:13, color:'var(--fg-2)' }}>
          Manage which notifications are sent per audience and channel. Hover a row to edit its template.
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div style={{
        display:'flex', flex:1, minHeight:0,
        background:'var(--bg-surface)', border:'1px solid var(--border-default)',
        borderRadius:'var(--radius-md)', overflow:'hidden',
      }}>

        {/* Audience sidebar */}
        <div style={{
          width:190, flexShrink:0, borderRight:'1px solid var(--border-default)',
          padding:'16px 10px', display:'flex', flexDirection:'column', gap:2,
        }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-3)', letterSpacing:'0.06em', textTransform:'uppercase', padding:'0 8px', marginBottom:8 }}>
            Audience
          </div>
          {AUDIENCES.map(a => {
            const active = a.id === audience;
            return (
              <button key={a.id} onClick={() => setAudience(a.id)} style={{
                width:'100%', textAlign:'left', padding:'9px 10px',
                borderRadius:'var(--radius-sm)', border:'none',
                background: active ? 'var(--brand-blue-100)' : 'transparent',
                cursor:'pointer', transition:'background .1s',
                display:'flex', alignItems:'center', gap:8,
              }}>
                <span style={{ color: active ? 'var(--brand-blue)' : 'var(--fg-3)', display:'flex', flexShrink:0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight: active ? 600 : 400, color: active ? 'var(--brand-blue)' : 'var(--fg-1)', lineHeight:1.2 }}>{a.label}</div>
                  <div style={{ fontSize:11, color:'var(--fg-3)', lineHeight:1.3, marginTop:1 }}>{a.desc}</div>
                </div>
              </button>
            );
          })}

          {/* Channel legend */}
          <div style={{ marginTop:'auto', paddingTop:16, borderTop:'1px solid var(--border-default)', marginLeft:2, marginRight:2 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--fg-3)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>Channels</div>
            {CHANNELS.map(ch => (
              <div key={ch.id} style={{ display:'flex', alignItems:'center', gap:7, padding:'4px 0', fontSize:12, color: ch.enabled ? 'var(--fg-2)' : 'var(--fg-3)' }}>
                <span style={{ color: ch.enabled ? ch.color : 'var(--slate-300)', display:'flex' }}>{ch.icon}</span>
                {ch.label}
                {!ch.enabled && <span style={{ fontSize:10, color:'var(--fg-3)', background:'var(--bg-muted)', border:'1px solid var(--border-default)', borderRadius:3, padding:'1px 4px', marginLeft:'auto' }}>Off</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Table area */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* Column headers */}
          <div style={{
            display:'flex', alignItems:'center', padding:'10px 20px',
            borderBottom:'1px solid var(--border-default)', background:'var(--bg-muted)',
            fontSize:12, fontWeight:600, color:'var(--fg-2)', flexShrink:0,
          }}>
            <div style={{ flex:1 }}>Event</div>
            {CHANNELS.map(ch => (
              <div key={ch.id} style={{ width:CH_W, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                {ch.label}
                {!ch.enabled && <span style={{ fontSize:10, padding:'1px 5px', borderRadius:3, background:'var(--bg-app)', color:'var(--fg-3)', border:'1px solid var(--border-default)' }}>Off</span>}
              </div>
            ))}
          </div>

          {/* Accordion */}
          <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
            {modules.map(mod => (
              <Section
                key={mod.id}
                mod={mod}
                evState={notifData[mod.id]}
                onToggle={onToggle}
                onOpenTemplate={onOpenTemplate || (() => {})}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WAEventNotifications, ALL_MODULES, buildInitialNotifData });
