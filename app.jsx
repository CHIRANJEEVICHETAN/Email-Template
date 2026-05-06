/* global React, ReactDOM, Icon, SignatureTemplates, prettifyHtml, highlightHtml, TweaksPanel, useTweaks, TweakSection, TweakToggle */
const { useState, useEffect, useMemo, useRef, useCallback } = React;

const DEFAULT_DATA = {
  name: 'CHETAN B R',
  title: 'CO-Founder - CTO',
  email: 'chetan.br@avyrentechnologies.com',
  phone: '+91 6363451047',
  telephone: '+91 90191 89889',
  address: '1st Floor Shree Krishna Towers\nKhanapur Road Tilakwadi, Belgaum-590006, India',
  linkedin: '',
  facebook: '',
  instagram: '',
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showSocials": true,
  "showBanner": true,
  "showDisclaimer": true
}/*EDITMODE-END*/;

function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [errors, setErrors] = useState({});
  const [view, setView] = useState('preview');
  const [toast, setToast] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupTab, setSetupTab] = useState('outlook');
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const sigFrameRef = useRef(null);

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  useEffect(() => {
    const e = {};
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email';
    if (data.phone && !/^[+\d\s()-]{7,}$/.test(data.phone)) e.phone = 'Enter a valid phone';
    if (data.telephone && !/^[+\d\s()-]{7,}$/.test(data.telephone)) e.telephone = 'Enter a valid telephone';
    setErrors(e);
  }, [data.email, data.phone, data.telephone]);

  const sigHTML = useMemo(() => {
    return SignatureTemplates.official.render(data, {
      showSocials: tweaks.showSocials,
      showBanner: tweaks.showBanner,
      showDisclaimer: tweaks.showDisclaimer,
    });
  }, [data, tweaks]);

  const prettyHTML = useMemo(() => prettifyHtml(sigHTML), [sigHTML]);

  useEffect(() => {
    const f = sigFrameRef.current;
    if (!f) return;
    const doc = f.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><style>
      body { margin: 0; padding: 24px; font-family: Arial, sans-serif; background: #FFFFFF; color: #333; font-size: 14px; line-height: 1.6; }
      a { color: inherit; }
      .ghost { color: #888; margin-bottom: 14px; font-family: Helvetica, Arial, sans-serif; }
    </style></head><body>
      <div class="ghost">— Best regards,</div>
      ${sigHTML}
    </body></html>`);
    doc.close();
    const resize = () => {
      try {
        const h = doc.documentElement.scrollHeight || 280;
        f.style.height = (h + 8) + 'px';
      } catch {}
    };
    setTimeout(resize, 30);
    setTimeout(resize, 250);
    setTimeout(resize, 800); // after banner image loads
  }, [sigHTML]);

  const copySignature = useCallback(async () => {
    try {
      if (window.ClipboardItem && navigator.clipboard?.write) {
        const blobHTML = new Blob([sigHTML], { type: 'text/html' });
        const blobText = new Blob([sigHTML.replace(/<[^>]+>/g, '')], { type: 'text/plain' });
        await navigator.clipboard.write([new ClipboardItem({ 'text/html': blobHTML, 'text/plain': blobText })]);
      } else {
        await navigator.clipboard.writeText(sigHTML);
      }
      setToast({ kind: 'success', text: 'Signature copied — paste it into your email client' });
    } catch (err) {
      setToast({ kind: 'error', text: 'Could not copy. Try the Download .htm option.' });
    }
    setTimeout(() => setToast(null), 3200);
  }, [sigHTML]);

  const copyHTMLSource = useCallback(async () => {
    await navigator.clipboard.writeText(prettyHTML);
    setToast({ kind: 'success', text: 'HTML source copied to clipboard' });
    setTimeout(() => setToast(null), 2400);
  }, [prettyHTML]);

  const downloadHTM = useCallback(() => {
    const blob = new Blob([
      `<!doctype html><html><head><meta charset="utf-8"><title>${data.name} — Avyren signature</title></head><body>${sigHTML}</body></html>`
    ], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.name || 'avyren').toLowerCase().replace(/\s+/g, '-')}-signature.htm`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    setToast({ kind: 'success', text: '.htm file downloaded' });
    setTimeout(() => setToast(null), 2400);
  }, [sigHTML, data.name]);

  const stats = useMemo(() => ({
    chars: sigHTML.length,
    size: (new Blob([sigHTML]).size / 1024).toFixed(1),
    fields: Object.values(data).filter(v => v && v.length).length,
  }), [sigHTML, data]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <div className="brand-name">Avyren Technologies</div>
              <div className="brand-sub">Email Signature Generator</div>
            </div>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setSetupOpen(true)}>
            <Icon.Help size={13} /> Setup guide
          </button>
          <button className="btn btn-sm" onClick={downloadHTM}>
            <Icon.Download size={13} /> Download .htm
          </button>
          <button className="btn btn-accent btn-sm" onClick={copySignature}>
            <Icon.Copy size={13} /> Copy signature
          </button>
        </div>
      </header>

      <div className="main">
        <div className="form-col">
          <div className="form-inner">
            <div className="pageheader">
              <h1>Your Avyren <em>signature</em>.</h1>
              <p>Enter your details to generate the company-approved email signature. Outlook & Gmail safe — table-based with inline styles. Live preview updates as you type.</p>
            </div>

            <div className="section">
              <div className="section-title"><span className="num">1</span> Identity</div>
              <div className="field-row">
                <div className="field">
                  <label>Full name</label>
                  <input type="text" value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. CHETAN B R" />
                  <div className="field-hint">Will be rendered in UPPERCASE per brand spec.</div>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Designation</label>
                  <input type="text" value={data.title} onChange={(e) => update('title', e.target.value)} placeholder="CO-Founder - CTO" />
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-title"><span className="num">2</span> Contact</div>
              <div className="field-row">
                <div className="field">
                  <label>Official email</label>
                  <div className="input-wrap has-prefix">
                    <span className="prefix"><Icon.Mail size={13} /></span>
                    <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="name@avyrentechnologies.com" className={errors.email ? 'error' : ''} />
                  </div>
                  {errors.email && <div className="field-error"><Icon.X size={11} /> {errors.email}</div>}
                </div>
              </div>
              <div className="field-row cols-2">
                <div className="field">
                  <label>Mobile</label>
                  <div className="input-wrap has-prefix">
                    <span className="prefix"><Icon.Phone size={13} /></span>
                    <input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" className={errors.phone ? 'error' : ''} />
                  </div>
                  {errors.phone && <div className="field-error"><Icon.X size={11} /> {errors.phone}</div>}
                </div>
                <div className="field">
                  <label>Telephone <span className="opt">office</span></label>
                  <div className="input-wrap has-prefix">
                    <span className="prefix"><Icon.Phone size={13} /></span>
                    <input type="tel" value={data.telephone} onChange={(e) => update('telephone', e.target.value)} placeholder="+91 90191 89889" className={errors.telephone ? 'error' : ''} />
                  </div>
                  {errors.telephone && <div className="field-error"><Icon.X size={11} /> {errors.telephone}</div>}
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Office address</label>
                  <textarea
                    value={data.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="1st Floor Shree Krishna Towers&#10;Khanapur Road Tilakwadi, Belgaum-590006, India"
                    rows={2}
                    style={{ width: '100%', fontFamily: 'inherit', fontSize: '13.5px', color: 'var(--ink)', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 12px', resize: 'vertical', outline: 'none', lineHeight: 1.4 }}
                  />
                  <div className="field-hint">Press Enter for line breaks — they're preserved in the signature.</div>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-title"><span className="num">3</span> Personal social <span style={{ marginLeft: 'auto', textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'var(--muted-2)', fontSize: 11 }}>optional — falls back to company profiles</span></div>
              {[
                { key: 'linkedin',  icon: <Icon.Linkedin size={14} />,  ph: 'https://linkedin.com/in/...' },
                { key: 'facebook',  icon: <Icon.Mail size={14} />,      ph: 'https://facebook.com/...', label: 'Facebook' },
                { key: 'instagram', icon: <Icon.Instagram size={14} />, ph: 'https://instagram.com/...' },
              ].map(s => (
                <div key={s.key} className="social-row">
                  <div className="social-icon">{s.icon}</div>
                  <input type="url" value={data[s.key]} onChange={(e) => update(s.key, e.target.value)} placeholder={s.ph} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-col">
          <div className="preview-inner">
            <div className="preview-toolbar">
              <div className="preview-tabs">
                <button className={`preview-tab ${view === 'preview' ? 'active' : ''}`} onClick={() => setView('preview')}>
                  <Icon.Eye size={13} /> Preview
                </button>
                <button className={`preview-tab ${view === 'code' ? 'active' : ''}`} onClick={() => setView('code')}>
                  <Icon.Code size={13} /> HTML source
                </button>
              </div>
              <div className="preview-actions">
                {view === 'code' ? (
                  <button className="btn btn-sm" onClick={copyHTMLSource}><Icon.Copy size={13} /> Copy HTML</button>
                ) : (
                  <button className="btn btn-accent btn-sm" onClick={copySignature}><Icon.Copy size={13} /> Copy signature</button>
                )}
              </div>
            </div>

            {view === 'preview' ? (
              <div className="email-mock">
                <div className="email-mock-chrome">
                  <div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
                  <div className="url">outlook.office.com / compose</div>
                </div>
                <div className="email-mock-body">
                  <div className="email-meta">
                    <div className="email-meta-row"><span className="email-meta-label">From</span><span className="email-meta-value">{data.name || 'You'} &lt;{data.email || 'you@avyrentechnologies.com'}&gt;</span></div>
                    <div className="email-meta-row"><span className="email-meta-label">To</span><span className="email-meta-value" style={{ color: 'var(--muted)' }}>client@example.com</span></div>
                    <div className="email-subject">Project kickoff — next steps</div>
                  </div>
                  <div className="email-body">
                    <p>Hi team,</p>
                    <p>Thanks for the productive call this morning. I've attached the updated specification and timeline. Let me know if anything needs further refinement before Friday.</p>
                    <p>Looking forward to building this with you.</p>
                  </div>
                  <div className="signature-anchor" data-highlight="true">
                    <iframe ref={sigFrameRef} className="sig-frame" title="signature" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="html-preview">
                <div className="html-preview-head">
                  <span>signature.html · {stats.chars.toLocaleString()} chars · {stats.size} KB</span>
                  <span style={{ color: '#5C6B82' }}>Outlook-safe · table-based · inline styles</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: highlightHtml(prettyHTML) }} />
              </div>
            )}

            <div className="compat-row">
              {['Outlook 2016+', 'Outlook Web', 'Gmail', 'Apple Mail', 'Yahoo Mail'].map(c => (
                <span key={c} className="compat"><span className="check"><Icon.Check size={8} /></span>{c}</span>
              ))}
            </div>

            <div className="stats-row">
              <div className="stat">
                <div className="stat-label">Fields filled</div>
                <div className="stat-value">{stats.fields}<small>of 9</small></div>
              </div>
              <div className="stat">
                <div className="stat-label">HTML size</div>
                <div className="stat-value">{stats.size}<small>KB</small></div>
              </div>
              <div className="stat">
                <div className="stat-label">Validation</div>
                <div className="stat-value" style={{ color: Object.keys(errors).length === 0 ? 'var(--success)' : 'var(--warn)' }}>
                  {Object.keys(errors).length === 0 ? 'Pass' : `${Object.keys(errors).length} issue${Object.keys(errors).length > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="toast-wrap">
        {toast && (
          <div className={`toast ${toast.kind}`}>
            <div className="ico"><Icon.Check size={11} /></div>
            <span>{toast.text}</span>
          </div>
        )}
      </div>

      {setupOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setSetupOpen(false); }}>
          <div className="modal">
            <div className="modal-head">
              <h3>How to use your Avyren signature</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => setSetupOpen(false)}><Icon.X size={14} /></button>
            </div>
            <div className="modal-tabs">
              {[
                ['outlook', 'Outlook Web'],
                ['outlook-desktop', 'Outlook Desktop'],
                ['gmail', 'Gmail'],
              ].map(([k, label]) => (
                <button key={k} className={`modal-tab ${setupTab === k ? 'active' : ''}`} onClick={() => setSetupTab(k)}>{label}</button>
              ))}
            </div>
            <div className="modal-body">
              {setupTab === 'outlook' && <SetupSteps steps={[
                ['Click "Copy signature" in this app', 'In the top-right of this page or in the preview toolbar. You\'ll see a confirmation toast.'],
                ['Open Outlook on the web', 'Go to outlook.office.com and sign in with your @avyrentechnologies.com account.'],
                ['Open Settings', 'Click the gear icon (⚙) in the top-right corner, then choose "View all Outlook settings" at the bottom of the panel.'],
                ['Navigate to Compose and reply', 'In the Settings dialog, go to Mail → Compose and reply.'],
                ['Create a new signature', 'Under "Email signature", click + New signature. Name it "Avyren — Default".'],
                ['Paste the signature', 'Click inside the editor and press Ctrl+V (Cmd+V on Mac). The full signature — logo, banner, and disclaimer — will paste in.'],
                ['Set as default for new and reply emails', 'Under "Select default signatures", choose "Avyren — Default" for both "For new messages" and "For replies/forwards".'],
                ['Save', 'Click Save at the bottom. Send a test email to yourself to confirm the logo and banner load correctly.'],
              ]} />}
              {setupTab === 'outlook-desktop' && <SetupSteps steps={[
                ['Click "Copy signature" in this app', 'You\'ll see a confirmation toast.'],
                ['Open Outlook desktop', 'Launch Outlook for Windows or Mac and sign in.'],
                ['Open Signatures', 'Windows: File → Options → Mail → Signatures. Mac: Outlook → Settings → Signatures.'],
                ['Create a new signature', 'Click New, name it "Avyren — Default".'],
                ['Paste into the editor', 'Click inside the signature editor and press Ctrl+V (Cmd+V on Mac). If formatting looks off, use the Download .htm option, open the file in a browser, select all (Ctrl+A), copy, and paste again — this preserves table formatting better.'],
                ['Set defaults', 'On the right, set "Avyren — Default" for both "New messages" and "Replies/forwards".'],
                ['Apply', 'Click OK. Compose a new email to verify everything renders correctly.'],
              ]} />}
              {setupTab === 'gmail' && <SetupSteps steps={[
                ['Click "Copy signature" in this app', 'You\'ll see a confirmation toast in the bottom-right.'],
                ['Open Gmail settings', 'In Gmail, click the gear icon (⚙) in the top-right, then "See all settings".'],
                ['Find the Signature section', 'Stay on the General tab and scroll down to "Signature".'],
                ['Create new signature', 'Click "+ Create new" and name it "Avyren — Default".'],
                ['Paste your signature', 'Click inside the signature editor on the right, then press Ctrl+V (Cmd+V on Mac). Logo, banner, and disclaimer will all paste in.'],
                ['Set defaults', 'Below the editor, under "Signature defaults", select "Avyren — Default" for both NEW EMAILS USE and ON REPLY/FORWARD USE.'],
                ['Important: uncheck "Insert signature before quoted text"', 'Leave it UNCHECKED so your signature appears at the very bottom of replies — the standard placement.'],
                ['Save changes', 'Scroll to the bottom of Settings and click "Save Changes". Send yourself a test email to confirm.'],
              ]} />}
              <div style={{ marginTop: 18, padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 8, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--accent-2)' }}>Note:</strong> Images (logo & banner) are loaded from Avyren's CDN. Recipients with image-blocking enabled may see them as broken until they "show images" — this is normal email behavior.
              </div>
            </div>
          </div>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Signature elements">
          <TweakToggle label="Promotional banner" value={tweaks.showBanner}     onChange={(v) => setTweak('showBanner', v)} />
          <TweakToggle label="Social icons"       value={tweaks.showSocials}    onChange={(v) => setTweak('showSocials', v)} />
          <TweakToggle label="Disclaimer text"    value={tweaks.showDisclaimer} onChange={(v) => setTweak('showDisclaimer', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function SetupSteps({ steps }) {
  return (
    <div>
      {steps.map(([title, desc], i) => (
        <div className="step" key={i}>
          <div className="step-num">{i + 1}</div>
          <div className="step-content">
            <div className="step-title">{title}</div>
            <div className="step-desc">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
