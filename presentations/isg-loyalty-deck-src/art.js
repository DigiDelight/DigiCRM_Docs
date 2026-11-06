// SVG illustrations for the ISG deck (rendered to PNG by build.js)
const F = 'font-family="Arial, Helvetica, sans-serif"';

const shadowDef = (id = 'sh', dy = 14, sd = 18, op = 0.4) =>
  `<filter id="${id}" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="${dy}" stdDeviation="${sd}" flood-color="#020817" flood-opacity="${op}"/></filter>`;

const sparkle = (x, y, s, op = 0.9) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -20 C2 -6 6 -2 20 0 C6 2 2 6 0 20 C-2 6 -6 2 -20 0 C-6 -2 -2 -6 0 -20Z" fill="#FFFFFF" fill-opacity="${op}"/>`;

exports.bgDark = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<defs>
 <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#081235"/><stop offset=".55" stop-color="#1B3180"/><stop offset="1" stop-color="#0A78B8"/></linearGradient>
 <radialGradient id="r1" cx="1450" cy="380" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#009FE0" stop-opacity=".45"/><stop offset="1" stop-color="#009FE0" stop-opacity="0"/></radialGradient>
 <radialGradient id="r2" cx="120" cy="1080" r="620" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#E83C37" stop-opacity=".22"/><stop offset="1" stop-color="#E83C37" stop-opacity="0"/></radialGradient>
 <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#FFFFFF" fill-opacity=".10"/></pattern>
</defs>
<rect width="1920" height="1080" fill="url(#g)"/>
<rect width="1920" height="1080" fill="url(#r1)"/>
<rect width="1920" height="1080" fill="url(#r2)"/>
<rect x="0" y="640" width="560" height="440" fill="url(#dots)"/>
<circle cx="1450" cy="420" r="620" fill="none" stroke="#FFFFFF" stroke-opacity=".07" stroke-width="2"/>
<circle cx="1450" cy="420" r="480" fill="none" stroke="#FFFFFF" stroke-opacity=".06" stroke-width="2"/>
<path d="M0 960 C 420 860, 900 1060, 1920 900 L1920 1080 L0 1080Z" fill="#FFFFFF" fill-opacity=".04"/>
</svg>`;

exports.bgLight = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<defs>
 <radialGradient id="a" cx="1920" cy="0" r="620" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#009FE0" stop-opacity=".13"/><stop offset="1" stop-color="#009FE0" stop-opacity="0"/></radialGradient>
 <radialGradient id="b" cx="0" cy="1080" r="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#223A87" stop-opacity=".07"/><stop offset="1" stop-color="#223A87" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1920" height="1080" fill="#FFFFFF"/>
<rect width="1920" height="1080" fill="url(#a)"/>
<rect width="1920" height="1080" fill="url(#b)"/>
</svg>`;

exports.hero = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="760" viewBox="0 0 900 760">
<defs>
 <linearGradient id="c1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14B8F5"/><stop offset="1" stop-color="#223A87"/></linearGradient>
 <linearGradient id="c2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#31509F"/><stop offset="1" stop-color="#081235"/></linearGradient>
 <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE7A8"/><stop offset="1" stop-color="#D99A1E"/></linearGradient>
 <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#009FE0" stop-opacity=".5"/><stop offset="1" stop-color="#009FE0" stop-opacity="0"/></radialGradient>
 ${shadowDef()}
 ${shadowDef('sm', 6, 8, 0.3)}
</defs>
<circle cx="450" cy="390" r="370" fill="url(#glow)"/>
<circle cx="450" cy="390" r="310" fill="none" stroke="#FFFFFF" stroke-opacity=".14" stroke-width="2"/>
<circle cx="450" cy="390" r="230" fill="none" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="2" stroke-dasharray="6 12"/>
<g transform="translate(150 150) rotate(-14 230 142)" filter="url(#sh)">
 <rect width="460" height="285" rx="28" fill="url(#c1)"/>
 <rect x="38" y="96" width="66" height="50" rx="10" fill="url(#gold)"/>
 <text x="38" y="236" ${F} font-size="26" fill="#FFFFFF" fill-opacity=".92" letter-spacing="3">•••• •••• •••• 4821</text>
 <circle cx="386" cy="62" r="22" fill="#FFFFFF" fill-opacity=".35"/><circle cx="414" cy="62" r="22" fill="#FFFFFF" fill-opacity=".6"/>
</g>
<g transform="translate(240 300) rotate(6 230 142)" filter="url(#sh)">
 <rect width="460" height="285" rx="28" fill="url(#c2)"/>
 <path d="M0 196 Q230 116 460 206 L460 257 Q460 285 432 285 L28 285 Q0 285 0 257Z" fill="#009FE0" fill-opacity=".28"/>
 <text x="38" y="62" ${F} font-weight="bold" font-size="22" fill="#FFFFFF" letter-spacing="4">PLATINUM</text>
 <rect x="38" y="96" width="66" height="50" rx="10" fill="url(#gold)"/>
 <path d="M130 104 q12 17 0 34 M144 96 q18 25 0 50 M158 88 q24 33 0 66" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="5" fill="none" stroke-linecap="round"/>
 <text x="38" y="238" ${F} font-size="24" fill="#FFFFFF" letter-spacing="3">•••• 7310</text>
 <circle cx="404" cy="236" r="20" fill="#E83C37"/><circle cx="380" cy="236" r="20" fill="#F5A524" fill-opacity=".9"/>
</g>
<g transform="translate(610 92) rotate(16)" filter="url(#sh)">
 <path d="M18 0 H138 L192 58 L138 116 H18 Q0 116 0 98 V18 Q0 0 18 0Z" fill="#E83C37"/>
 <circle cx="150" cy="58" r="11" fill="#0B1A4A"/>
 <text x="20" y="76" ${F} font-weight="bold" font-size="50" fill="#FFFFFF">10%</text>
</g>
<g filter="url(#sm)">
 <circle cx="140" cy="610" r="46" fill="url(#gold)"/><circle cx="140" cy="610" r="34" fill="none" stroke="#B37A10" stroke-width="4"/>
 <text x="140" y="628" ${F} font-weight="bold" font-size="46" fill="#8A5A00" text-anchor="middle">₹</text>
 <circle cx="214" cy="672" r="32" fill="url(#gold)"/><circle cx="214" cy="672" r="23" fill="none" stroke="#B37A10" stroke-width="3"/>
</g>
<g transform="translate(560 615)" filter="url(#sm)">
 <rect width="300" height="74" rx="37" fill="#FFFFFF"/>
 <circle cx="38" cy="37" r="22" fill="#047857"/>
 <path d="M27 38 l8 8 l15 -17" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <text x="72" y="33" ${F} font-weight="bold" font-size="21" fill="#020817">Cashback confirmed</text>
 <text x="72" y="56" ${F} font-size="16" fill="#64748B">posted by the bank ledger</text>
</g>
<g transform="translate(36 210)" filter="url(#sm)">
 <rect width="232" height="66" rx="33" fill="#FFFFFF"/>
 <circle cx="34" cy="33" r="20" fill="#223A87"/>
 <text x="34" y="41" ${F} font-weight="bold" font-size="20" fill="#FFFFFF" text-anchor="middle">5×</text>
 <text x="64" y="41" ${F} font-weight="bold" font-size="20" fill="#020817">points on travel</text>
</g>
${sparkle(720, 300, 1.2)}${sparkle(110, 420, 0.8, 0.7)}${sparkle(790, 560, 0.7, 0.6)}${sparkle(330, 110, 0.9, 0.8)}
</svg>`;

// --- phone helpers ---
function phone(inner, w = 520, h = 1000) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
 <linearGradient id="hd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#223A87"/><stop offset="1" stop-color="#009FE0"/></linearGradient>
 <clipPath id="scr"><rect x="28" y="28" width="${w - 56}" height="${h - 56}" rx="52"/></clipPath>
 ${shadowDef('ph', 18, 22, 0.35)}${shadowDef('cd', 4, 8, 0.12)}
</defs>
<rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="70" fill="#0F172A" filter="url(#ph)"/>
<rect x="28" y="28" width="${w - 56}" height="${h - 56}" rx="52" fill="#F3F6FB"/>
<g clip-path="url(#scr)">${inner}</g>
<rect x="${w / 2 - 62}" y="40" width="124" height="28" rx="14" fill="#0F172A"/>
</svg>`;
}

function offerCard(y, color, letter, title, merchant, meta, btn, btnColor, btnText = '#FFFFFF') {
  return `<g transform="translate(48 ${y})" filter="url(#cd)">
 <rect width="424" height="150" rx="22" fill="#FFFFFF"/>
 <circle cx="48" cy="52" r="28" fill="${color}"/>
 <text x="48" y="62" ${F} font-weight="bold" font-size="26" fill="#FFFFFF" text-anchor="middle">${letter}</text>
 <text x="92" y="50" ${F} font-weight="bold" font-size="23" fill="#020817">${title}</text>
 <text x="92" y="78" ${F} font-size="17" fill="#475569">${merchant}</text>
 <text x="24" y="124" ${F} font-size="15" fill="#64748B">${meta}</text>
 <rect x="282" y="98" width="124" height="40" rx="20" fill="${btnColor}"/>
 <text x="344" y="124" ${F} font-weight="bold" font-size="16" fill="${btnText}" text-anchor="middle">${btn}</text>
</g>`;
}

exports.phoneHub = phone(`
<rect x="0" y="0" width="520" height="270" fill="url(#hd)"/>
<text x="56" y="128" ${F} font-weight="bold" font-size="32" fill="#FFFFFF">Offers for you</text>
<text x="56" y="160" ${F} font-size="18" fill="#FFFFFF" fill-opacity=".85">Platinum Credit  •• 7310</text>
<rect x="48" y="188" width="424" height="48" rx="24" fill="#FFFFFF"/>
<circle cx="80" cy="211" r="9" fill="none" stroke="#94A3B8" stroke-width="3"/><path d="M87 218 l8 8" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
<text x="104" y="218" ${F} font-size="18" fill="#94A3B8">Search offers</text>
<rect x="48" y="290" width="70" height="38" rx="19" fill="#223A87"/><text x="83" y="315" ${F} font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">All</text>
<rect x="128" y="290" width="92" height="38" rx="19" fill="#FFFFFF" stroke="#CBD5E1"/><text x="174" y="315" ${F} font-size="16" fill="#334155" text-anchor="middle">Dining</text>
<rect x="230" y="290" width="92" height="38" rx="19" fill="#FFFFFF" stroke="#CBD5E1"/><text x="276" y="315" ${F} font-size="16" fill="#334155" text-anchor="middle">Travel</text>
<rect x="332" y="290" width="112" height="38" rx="19" fill="#FFFFFF" stroke="#CBD5E1"/><text x="388" y="315" ${F} font-size="16" fill="#334155" text-anchor="middle">Shopping</text>
${offerCard(352, '#E83C37', 'C', '10% cashback', 'Café Aroma · Dining', 'Min ₹500 · Cap ₹300 · till 30 Nov', 'Activate', '#009FE0')}
${offerCard(522, '#223A87', 'S', '5× points', 'SkyJet · Travel', 'All bookings · till 15 Dec', 'Activated ✓', '#DCFCE7', '#047857')}
${offerCard(692, '#F59E0B', 'U', '₹250 off', 'UrbanCart · Shopping', 'Min ₹1,999 · one per card', 'Reveal code', '#E83C37')}
<rect x="28" y="878" width="464" height="94" fill="#FFFFFF"/>
<circle cx="120" cy="918" r="12" fill="#223A87"/><circle cx="220" cy="918" r="12" fill="#CBD5E1"/><circle cx="300" cy="918" r="12" fill="#CBD5E1"/><circle cx="400" cy="918" r="12" fill="#CBD5E1"/>
`);

exports.phoneCode = phone(`
<rect x="0" y="0" width="520" height="210" fill="url(#hd)"/>
<path d="M62 120 l-14 14 l14 14" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
<text x="84" y="142" ${F} font-weight="bold" font-size="24" fill="#FFFFFF">Offer details</text>
<circle cx="260" cy="250" r="56" fill="#F59E0B" stroke="#FFFFFF" stroke-width="8"/>
<text x="260" y="268" ${F} font-weight="bold" font-size="48" fill="#FFFFFF" text-anchor="middle">U</text>
<text x="260" y="350" ${F} font-weight="bold" font-size="34" fill="#020817" text-anchor="middle">₹250 off</text>
<text x="260" y="382" ${F} font-size="19" fill="#475569" text-anchor="middle">UrbanCart · online orders</text>
<rect x="56" y="416" width="408" height="110" rx="18" fill="#FFFFFF" stroke="#009FE0" stroke-width="3" stroke-dasharray="10 7"/>
<text x="84" y="452" ${F} font-size="15" fill="#64748B">YOUR CODE</text>
<text x="84" y="496" font-family="Courier New, monospace" font-weight="bold" font-size="32" fill="#223A87">URB-7Q4K-92XM</text>
<rect x="408" y="470" width="34" height="38" rx="6" fill="none" stroke="#223A87" stroke-width="3"/><rect x="400" y="462" width="34" height="38" rx="6" fill="#FFFFFF" stroke="#223A87" stroke-width="3"/>
<circle cx="72" cy="560" r="11" fill="#047857"/><path d="M66 560 l4 5 l8 -9" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
<text x="92" y="566" ${F} font-size="16" fill="#334155">Assigned to you just now · single use</text>
<rect x="56" y="598" width="408" height="150" rx="18" fill="#EEF4FB"/>
<text x="80" y="634" ${F} font-weight="bold" font-size="17" fill="#223A87">KEY CONDITIONS</text>
<text x="80" y="668" ${F} font-size="17" fill="#020817">Min spend ₹1,999 · Max ₹250</text>
<text x="80" y="698" ${F} font-size="17" fill="#020817">Valid till 15 Nov · online only</text>
<text x="80" y="728" ${F} font-size="16" fill="#0369A1" text-decoration="underline">Full terms and conditions</text>
<rect x="56" y="790" width="408" height="62" rx="31" fill="#223A87"/>
<text x="260" y="829" ${F} font-weight="bold" font-size="21" fill="#FFFFFF" text-anchor="middle">Shop now</text>
`);

exports.whatsapp = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="940" viewBox="0 0 560 940">
<defs>
 <linearGradient id="hi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#223A87"/><stop offset="1" stop-color="#009FE0"/></linearGradient>
 <clipPath id="scr"><rect x="28" y="28" width="504" height="884" rx="52"/></clipPath>
 <clipPath id="img"><rect x="70" y="200" width="396" height="190" rx="12"/></clipPath>
 <pattern id="wp" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2" fill="#CFC6B8"/><circle cx="28" cy="26" r="1.6" fill="#CFC6B8"/></pattern>
 ${shadowDef('ph', 18, 22, 0.35)}${shadowDef('cd', 2, 3, 0.15)}
</defs>
<rect x="10" y="10" width="540" height="920" rx="70" fill="#0F172A" filter="url(#ph)"/>
<g clip-path="url(#scr)">
 <rect x="28" y="28" width="504" height="884" fill="#ECE5DD"/>
 <rect x="28" y="28" width="504" height="884" fill="url(#wp)"/>
 <rect x="28" y="28" width="504" height="128" fill="#075E54"/>
 <circle cx="92" cy="112" r="24" fill="#FFFFFF"/><text x="92" y="120" ${F} font-weight="bold" font-size="20" fill="#223A87" text-anchor="middle">B</text>
 <text x="130" y="108" ${F} font-weight="bold" font-size="21" fill="#FFFFFF">Your Bank</text>
 <circle cx="244" cy="101" r="9" fill="#25D366"/><path d="M239 101 l4 4 l6 -7" stroke="#FFFFFF" stroke-width="2.5" fill="none"/>
 <text x="130" y="132" ${F} font-size="15" fill="#FFFFFF" fill-opacity=".8">Business account</text>
 <g filter="url(#cd)">
  <rect x="56" y="186" width="424" height="430" rx="16" fill="#FFFFFF"/>
  <g clip-path="url(#img)">
   <rect x="70" y="200" width="396" height="190" fill="url(#hi)"/>
   <circle cx="400" cy="250" r="110" fill="#FFFFFF" fill-opacity=".10"/>
   <circle cx="150" cy="300" r="62" fill="#FFFFFF" fill-opacity=".92"/><circle cx="150" cy="300" r="44" fill="none" stroke="#E2E8F0" stroke-width="4"/>
   <text x="300" y="318" ${F} font-weight="bold" font-size="74" fill="#FFFFFF" text-anchor="middle">15%</text>
   <text x="300" y="352" ${F} font-weight="bold" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">CASHBACK</text>
   <rect x="380" y="214" width="72" height="30" rx="15" fill="#E83C37"/><text x="416" y="235" ${F} font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">DINING</text>
  </g>
  <text x="72" y="428" ${F} font-weight="bold" font-size="21" fill="#111B21">Weekend Dining Fest</text>
  <text x="72" y="460" ${F} font-size="17" fill="#111B21">Hi Priya, get 15% cashback up to ₹300</text>
  <text x="72" y="484" ${F} font-size="17" fill="#111B21">at 200+ restaurants with your card</text>
  <text x="72" y="508" ${F} font-size="17" fill="#111B21">ending 7310. Fri–Sun, till 30 Nov.</text>
  <text x="72" y="548" ${F} font-size="15" fill="#667781">Min bill ₹800 · Cap ₹300 · T&amp;C apply</text>
  <text x="72" y="574" ${F} font-size="15" fill="#667781">Reply STOP to opt out</text>
  <text x="462" y="600" ${F} font-size="13" fill="#667781" text-anchor="end">10:42</text>
 </g>
 <g filter="url(#cd)">
  <rect x="56" y="624" width="208" height="52" rx="12" fill="#FFFFFF"/><text x="160" y="657" ${F} font-weight="bold" font-size="18" fill="#0284C7" text-anchor="middle">View offer</text>
  <rect x="272" y="624" width="208" height="52" rx="12" fill="#FFFFFF"/><text x="376" y="657" ${F} font-weight="bold" font-size="18" fill="#0284C7" text-anchor="middle">Activate now</text>
 </g>
 <g filter="url(#cd)">
  <rect x="300" y="700" width="200" height="54" rx="14" fill="#D9FDD3"/>
  <text x="320" y="733" ${F} font-size="17" fill="#111B21">Activate now</text>
  <text x="484" y="744" ${F} font-size="12" fill="#667781" text-anchor="end">10:43 ✓✓</text>
 </g>
 <g filter="url(#cd)">
  <rect x="56" y="772" width="400" height="104" rx="14" fill="#FFFFFF"/>
  <text x="74" y="806" ${F} font-size="17" fill="#111B21">You're in! Cashback shows as</text>
  <text x="74" y="830" ${F} font-size="17" fill="#111B21">confirmed once the bank posts it.</text>
  <text x="440" y="862" ${F} font-size="12" fill="#667781" text-anchor="end">10:43</text>
 </g>
</g>
<rect x="218" y="40" width="124" height="28" rx="14" fill="#0F172A"/>
</svg>`;

exports.shield = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="500" viewBox="0 0 440 500">
<defs>
 <linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#009FE0"/><stop offset="1" stop-color="#223A87"/></linearGradient>
 <radialGradient id="gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#009FE0" stop-opacity=".25"/><stop offset="1" stop-color="#009FE0" stop-opacity="0"/></radialGradient>
 ${shadowDef('sh', 16, 18, 0.3)}
</defs>
<circle cx="220" cy="250" r="220" fill="url(#gl)"/>
<circle cx="220" cy="250" r="196" fill="none" stroke="#223A87" stroke-opacity=".18" stroke-width="2" stroke-dasharray="4 10"/>
<circle cx="220" cy="250" r="160" fill="none" stroke="#009FE0" stroke-opacity=".25" stroke-width="2"/>
<path filter="url(#sh)" d="M220 80 L340 126 Q346 129 346 136 V236 C346 318 292 378 222 410 Q220 411 218 410 C148 378 94 318 94 236 V136 Q94 129 100 126Z" fill="url(#s)"/>
<path d="M220 112 L318 150 V236 C318 300 276 350 220 378Z" fill="#FFFFFF" fill-opacity=".10"/>
<rect x="172" y="230" width="96" height="78" rx="14" fill="#FFFFFF"/>
<path d="M190 232 V206 a30 30 0 0 1 60 0 V232" stroke="#FFFFFF" stroke-width="14" fill="none"/>
<circle cx="220" cy="262" r="11" fill="#223A87"/><rect x="215" y="266" width="10" height="24" rx="4" fill="#223A87"/>
${sparkle(352, 104, 0.9, 0.9).replace('#FFFFFF', '#009FE0')}${sparkle(84, 392, 0.7, 0.8).replace('#FFFFFF', '#E83C37')}
</svg>`;
