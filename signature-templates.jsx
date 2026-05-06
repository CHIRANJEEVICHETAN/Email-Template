// Avyren OFFICIAL email signature template — exact markup, table-based, Outlook-safe.
// Renders the user's data into the approved company HTML.

const escapeHTML = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const telHref = (s = '') => 'tel:' + String(s).replace(/[^+\d]/g, '');

// ──────────────────────────────────────────────────────────────────
// THE OFFICIAL Avyren signature template.
// Markup matches the company-approved version provided. Only data fields
// (name, role, email, mobile, address, telephone, social URLs) are dynamic.
// Brand-controlled URLs (logo, social icons, banner, website link) are fixed.
// ──────────────────────────────────────────────────────────────────

const BRAND = {
  logoURL:    'https://www.avyrentechnologies.in/assets/Company-Logo-DnX920W-.png',
  websiteURL: 'https://www.avyrentechnologies.com/',
  websiteLabel: 'www.avyrentechnologies.com',
  bannerURL:  'https://imgmsgen.com/img/technology-grid/banner.png',
  bannerHref: 'https://avyren.in/',
  fbIcon:     'https://imgmsgen.com/img/technology-grid/fb.png',
  liIcon:     'https://imgmsgen.com/img/technology-grid/ln.png',
  igIcon:     'https://imgmsgen.com/img/technology-grid/it.png',
  // Defaults (used if user leaves social fields blank, matching the company template)
  fbDefault:  'https://www.facebook.com/profile.php?id=61584379918651',
  liDefault:  'https://www.linkedin.com/in/avyren-technologies-102a5639a?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  igDefault:  'https://www.instagram.com/avyren.technologies',
};

function templateOfficial(d, opts = {}) {
  const showBanner     = opts.showBanner     !== false;
  const showSocials    = opts.showSocials    !== false;
  const showDisclaimer = opts.showDisclaimer !== false;

  const name      = d.name      || 'YOUR NAME';
  const title     = d.title     || 'Designation';
  const email     = d.email     || 'name@avyrentechnologies.com';
  const mobile    = d.phone     || '';
  const address   = d.address   || '1st Floor Shree Krishna Towers\nKhanapur Road Tilakwadi, Belgaum-590006, India';
  const telephone = d.telephone || '';

  const fb = d.facebook || BRAND.fbDefault;
  const li = d.linkedin || BRAND.liDefault;
  const ig = d.instagram || BRAND.igDefault;

  // Address may include line breaks; honor them with <br>
  const addressHTML = escapeHTML(address).replace(/\n/g, '<br>');

  return `<table cellspacing="0" cellpadding="0" border="0" style="width:400px;border-collapse:collapse;border-spacing:0;color:#444444;font-family:Arial,sans-serif;text-align:left;">
  <tbody>
    <tr>

      <!-- Logo -->
      <td style="width:88px;padding-top:5px;vertical-align:top;">
        <a href="https://avyrentechnologies.com/" target="_blank" style="text-decoration:none;">
          <img src="${BRAND.logoURL}" alt="Avyren Technologies" width="88" style="width:88px;height:auto;border:0;display:block;">
        </a>
      </td>

      <td style="width:30px;"></td>

      <!-- Right Content -->
      <td style="width:282px;vertical-align:top;">

        <table cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;border-spacing:0;">
          <tbody>

            <!-- Name -->
            <tr>
              <td colspan="3">
                <div style="font-size:13pt;color:#11098e;font-weight:bold;">
                  ${escapeHTML(name).toUpperCase()}
                </div>
                <div style="font-size:8pt;color:#262626;line-height:16px;">
                  ${escapeHTML(title)}
                </div>
              </td>
            </tr>

            <!-- Email & Mobile -->
            <tr>
              <td style="padding-top:10px;vertical-align:top;width:150px;">
                <div style="font-size:8pt;color:#262626;line-height:16px;">
                  <strong>Email:</strong><br>
                  <a href="mailto:${escapeHTML(email)}" style="color:#262626;text-decoration:none;">${escapeHTML(email)}</a>
                </div>
              </td>
              <td style="width:15px;"></td>
              <td style="padding-top:10px;vertical-align:top;width:117px;">
                ${mobile ? `<div style="font-size:8pt;color:#262626;line-height:16px;">
                  <strong>Mobile:</strong><br>
                  <a href="${telHref(mobile)}" style="color:#262626;text-decoration:none;">${escapeHTML(mobile)}</a>
                </div>` : ''}
              </td>
            </tr>

            <!-- Address & Telephone -->
            <tr>
              <td style="padding-top:10px;vertical-align:top;">
                <div style="font-size:8pt;color:#262626;line-height:12px;">
                  <strong>Address:</strong><br>
                  ${addressHTML}
                </div>
              </td>
              <td style="width:15px;"></td>
              <td style="padding-top:10px;vertical-align:top;">
                ${telephone ? `<div style="font-size:8pt;color:#262626;line-height:16px;">
                  <strong>Telephone:</strong><br>
                  <a href="${telHref(telephone)}" style="color:#262626;text-decoration:none;">${escapeHTML(telephone)}</a>
                </div>` : ''}
              </td>
            </tr>

          </tbody>
        </table>

      </td>
    </tr>
  </tbody>
</table>

<!-- Website & Social -->
<table cellspacing="0" cellpadding="0" border="0" style="width:400px;border-collapse:collapse;border-spacing:0;font-family:Arial,sans-serif;">
  <tbody>

    <!-- Website & Social -->
    <tr>
      <!-- Website -->
      <td style="padding-top:15px;text-align:left;">
        <a href="${BRAND.websiteURL}" target="_blank" style="font-size:8pt;color:#11098e;text-decoration:none;font-weight:bold;">
          ${BRAND.websiteLabel}
        </a>
      </td>

      ${showSocials ? `<!-- Social Icons -->
      <td style="padding-top:15px;text-align:right;">
        <a href="${escapeHTML(fb)}" target="_blank" rel="noopener" style="text-decoration:none;">
          <img src="${BRAND.fbIcon}" alt="Facebook" width="13" height="13" style="border:0;display:inline-block;">
        </a>
        &nbsp;&nbsp;&nbsp;
        <a href="${escapeHTML(li)}" target="_blank" rel="noopener" style="text-decoration:none;">
          <img src="${BRAND.liIcon}" alt="LinkedIn" width="13" height="13" style="border:0;display:inline-block;">
        </a>
        &nbsp;&nbsp;&nbsp;
        <a href="${escapeHTML(ig)}" target="_blank" rel="noopener" style="text-decoration:none;">
          <img src="${BRAND.igIcon}" alt="Instagram" width="13" height="13" style="border:0;display:inline-block;">
        </a>
      </td>` : '<td></td>'}
    </tr>

    ${showBanner ? `<!-- Banner -->
    <tr>
      <td colspan="2" style="padding-top:15px;">
        <a href="${BRAND.bannerHref}" target="_blank" rel="noopener">
          <img src="${BRAND.bannerURL}" alt="Avyren banner" width="400" style="width:400px;height:auto;border:0;display:block;">
        </a>
      </td>
    </tr>` : ''}

    ${showDisclaimer ? `<!-- Disclaimer -->
    <tr>
      <td colspan="2" style="padding-top:14px;max-width:400px;">
        <div style="font-size:7pt;line-height:10px;color:#65BCD6;text-align:justify;">
          The content of this email is confidential and intended for the recipient specified in message only.
          It is strictly forbidden to share any part of this message with any third party, without written
          consent of the sender. If you received this message by mistake, please reply to this message and
          follow with its deletion, so that we can ensure such a mistake does not occur in the future.
        </div>
      </td>
    </tr>` : ''}

  </tbody>
</table>`;
}

const SignatureTemplates = {
  official: { name: 'Official', render: templateOfficial, description: 'Avyren company-approved signature' },
};

// Pretty-print HTML for the code view
function prettifyHtml(html) {
  let formatted = '';
  let indent = 0;
  const tokens = html.replace(/></g, '>\n<').split('\n');
  for (const line of tokens) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('</')) indent = Math.max(0, indent - 1);
    formatted += '  '.repeat(indent) + t + '\n';
    if (t.startsWith('<') && !t.startsWith('</') && !t.endsWith('/>') && !t.match(/<(img|br|hr|input|meta|link)[^>]*>$/i) && !t.includes('</')) {
      indent++;
    }
  }
  return formatted.trim();
}

function highlightHtml(html) {
  return escapeHTML(html)
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tag">$2</span>')
    .replace(/([\w-]+)=(&quot;)([^&]*?)(&quot;)/g, '<span class="attr">$1</span>=$2<span class="str">$3</span>$4');
}

window.SignatureTemplates = SignatureTemplates;
window.prettifyHtml = prettifyHtml;
window.highlightHtml = highlightHtml;
