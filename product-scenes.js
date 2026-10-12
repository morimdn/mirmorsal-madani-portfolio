// Reconstructed HTML/CSS/SVG interfaces. Original assets remain the evidence view.
(() => {
  const scenes = {
    'crm-trader-room': ['TechnoFX', 'Trader Room', 'trader'],
    'crm-admin': ['TechnoFX', 'Administration', 'admin'],
    'crm-native-mobile-original': ['Native CRM', 'Home', 'mobile'],
    'crm-mobile-wallet-original': ['Wallet concept', 'Home', 'wallet'],
    'crm-mobile-finance-original': ['Finance concept', 'Wallet', 'finance'],
    'loyalty-home': ['Delta FX Club', 'Customer Home', 'loyalty'],
    'loyalty-missions': ['Delta FX Club', 'Mission Catalogue', 'missions'],
    'loyalty-admin': ['Delta FX Club', 'Client Progress', 'loyaltyAdmin'],
    'loyalty-quest-builder': ['Delta FX Club', 'Quest Builder', 'builder'],
    'ib-insights': ['TechnoFX', 'IB Insights', 'ib'],
    'ib-dashboard': ['TechnoFX', 'IB Dashboard', 'ibDashboard'],
    'ib-profile-sharing': ['TechnoFX', 'Share Profile', 'sharing'],
    'ib-wallet-transfer': ['TechnoFX', 'Wallet Transfer', 'transfer'],
    'social-discovery': ['TechnoFX', 'Social Trading', 'social'],
    'social-performance': ['TechnoFX', 'ProTrader Performance', 'performance'],
    'social-follow': ['TechnoFX', 'Following Setup', 'follow'],
    'risk-overview': ['Risk Management', 'Broker Overview', 'risk'],
    'risk-geography': ['Risk Management', 'Geographic Insights', 'geography'],
    'risk-exposure': ['Risk Management', 'Currency Exposure', 'exposure'],
    'risk-report': ['Risk Management', 'Operational Reports', 'report'],
    'ai-market-analysis': ['AI Market Analyst', 'Analysis Workspace', 'ai'],
    'payment-gateway': ['Payment Gateway', 'Connected Payment Flows', 'payments'],
    'sji-onboarding': ['SJI', 'Organizational Onboarding', 'onboarding'],
    'sji-performance-dashboard': ['SJI', 'Employee Evaluation', 'evaluation'],
    'sji-internal-portal': ['SJI', 'Internal Management', 'portal'],
    'plan-chin-travel': ['Plan Chin', 'Shared Travel Expenses', 'travel'],
    'deltafx-website-home': ['DeltaFX', 'Trade with clarity', 'deltaHome'],
    'deltafx-website-alternate': ['DeltaFX', 'Your trading journey', 'deltaHome'],
    'deltafx-website-trading': ['DeltaFX', 'Trading Accounts', 'deltaTrading'],
    'topfast-website-home': ['Top Fast Technology', 'Brokerage Technology', 'topHome'],
    'topfast-website-partners': ['Top Fast Technology', 'Partner with us', 'topPartners']
  };
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const chart = (kind = 'line') => `<svg class="scene-chart" viewBox="0 0 400 145" aria-hidden="true" focusable="false"><path class="chart-grid" d="M10 25H390M10 60H390M10 95H390M10 130H390"/>${kind === 'bars' ? [54,90,68,115,88,48,104,72].map((h,i)=>`<rect x="${24+i*45}" y="${130-h}" width="25" height="${h}" rx="3" class="chart-bar"/>`).join('') : '<path class="chart-line" d="M10 110 40 88 70 97 100 55 130 74 160 42 190 65 220 32 250 57 280 21 310 44 340 17 370 34 390 12"/><path class="chart-secondary" d="M10 122 40 112 70 120 100 102 130 113 160 88 190 95 220 71 250 79 280 49 310 65 340 54 370 68 390 42"/>'}</svg>`;
  const card = (title, body, extra='') => `<div class="scene-card ${extra}"><div class="scene-card-title">${title}</div>${body}</div>`;
  const stat = (label,value) => card(label,`<strong class="scene-value">${value}</strong><span class="scene-hint">Selected period</span>`);
  const stats = items => `<div class="scene-stats">${items.map(([k,v])=>stat(k,v)).join('')}</div>`;
  const pill = text => `<span class="scene-pill">${text}</span>`;
  const field = (label,value='Select an option') => `<div class="scene-field"><span>${label}</span><strong>${value}</strong><span aria-hidden="true">⌄</span></div>`;
  const table = (heads,rows) => `<div class="scene-table-wrap"><table class="scene-table"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const transactions = () => table(['Transaction','Amount','Method','Status'],[['Deposit','$1,500','TRC20','Completed'],['Transfer','$874','Wallet','Completed'],['Withdrawal','$125','Bank','In review'],['Deposit','$320','BEP20','Completed']]);
  const meter = (value=64) => `<div class="scene-meter"><span style="width:${value}%"></span></div>`;
  const missions = () => `<div class="scene-missions">${['Trade 10 Lots','Referral Champion','Daily Login','Perfect Week'].map((title,i)=>card(`<span class="scene-symbol">${['◎','◇','✓','☆'][i]}</span>${title}`,`<p>${['Build trading activity','Invite friends','5 consecutive days','Trade every day'][i]}</p>${pill('+200 points')}${meter(30+i*15)}${pill('Track progress')}`)).join('')}</div>`;
  const profiles = () => `<div class="scene-profiles">${['AlexCopy20','SkyWalker99','TechGuru88','CreativeMind77'].map((name,i)=>card(`<span class="scene-avatar">${name[0]}</span>${name}`,`${pill('Public')}${chart()}${stats([['30D ROI',[15,25,30,20][i]+'%'],['Investors',[156,158,42,275][i]]])}${pill('View details')}${pill('Follow')}`)).join('')}</div>`;
  const riskGauge = () => `<svg class="scene-gauge" viewBox="0 0 240 150" aria-hidden="true"><path d="M25 125a95 95 0 0 1 190 0" class="gauge-track"/><path d="M25 125a95 95 0 0 1 145-80" class="gauge-fill"/><text x="120" y="105" text-anchor="middle">268</text><text x="120" y="135" text-anchor="middle" class="gauge-label">Risk accounts</text></svg>`;
  const metrics = [['Total customers','1,500'],['Active customers','472'],['Sub IBs','15'],['New customers','90']];
  function dashboard(type) {
    switch(type) {
      case 'trader': return `<div class="scene-three">${card('Account',`<span>Balance</span><strong class="scene-value">$20,080.36</strong>${stats([['Leverage','33'],['Equity','$19,550'],['Free margin','0.00']])}${field('Trading account','MT4 · Real')}`)}${card('Performance',`${pill('Today')}${pill('Last week')}<strong class="scene-value">$2,000.65</strong>${chart()}`)}${card('Quick Access',`<div class="scene-actions">${['Wallet →','Campaigns →','Quests →','Requests →','IB management →','Support →'].map(pill).join('')}</div>`)}</div>${card('Latest Transactions',transactions())}`;
      case 'admin': return `${stats([['Active clients','1,248'],['Trading accounts','2,416'],['Requests','24'],['Net deposits','$39,394']])}<div class="scene-two">${card('Client activity',chart())}${card('Trading summary',chart('bars'))}</div>${card('Back-office requests',table(['Request','Client','Type','Status'],[['REQ-102','Demo client 01','KYC','In review'],['REQ-103','Demo client 02','Withdrawal','Pending'],['REQ-104','Demo client 03','Account','Approved']]))}`;
      case 'loyalty': return `<div class="scene-two">${card('Silver · Your level',`<strong class="scene-value">3,200 XP</strong>${meter()}<p>Progress toward the next level · 5,000 XP</p>`)}${stats([['Silver coins','3,500'],['Gold coins','10'],['Active quests','6'],['Days active','12']])}</div>${card('Most Recent Active Missions',missions())}${stats([['Your rank','865'],['Completed','25'],['In progress','4'],['Streak','18 days']])}`;
      case 'missions': return `${pill('All missions')}${pill('Trading')}${pill('Referrals')}${pill('Daily activity')}${missions()}${missions()}`;
      case 'loyaltyAdmin': return `${stats([['Total clients','1,500'],['Active missions','24'],['Completed quests','650'],['Rewards issued','180']])}${card('Client Progress',table(['Client','Level','XP','Progress'],[['Demo client 01','Silver','3,200','64%'],['Demo client 02','Gold','6,400','80%'],['Demo client 03','Bronze','800','32%']]))}${card('Activation history',chart('bars'))}`;
      case 'builder': return `${card('Quest details',`${field('Quest name','Weekly trading challenge')}${field('Category','Trading')}${field('Description','Trade 10 lots this week')}`)}<div class="scene-two">${card('Activation conditions',`${field('Customer level','Silver and above')}${field('Start trigger','Trading account active')}${field('Minimum deposit','$100')}`)}${card('Completion & rewards',`${field('Trading volume','10 lots')}${field('Time window','7 days')}${field('Reward','500 bonus points')}`)}</div>${pill('Save quest')}${pill('Preview')}`;
      case 'ib': return `${pill('Insight')}${pill('Customers')}${pill('My Income (Rebates)')}${pill('Share Profile')}${field('Select a link','All links')}${stats(metrics)}<div class="scene-two">${card('Partner performance',`${field('Top traded symbol','GOLD · XAU/USD')}${field('Average volume','1.2 lots')}`)}${card('Demographics',`${meter(25)}<p>16–24</p>${meter(54)}<p>25–50</p>${meter(33)}<p>50+</p>`)}</div>${card('Club Net Deposit',chart())}`;
      case 'ibDashboard': return `${stats([['Rebate balance','$6,540'],['Active clients','472'],['Sub-partners','15'],['Monthly volume','702 lots']])}${card('Partner network',table(['Partner','Clients','Volume','Commission'],[['Partner 01','124','210 lots','$1,240'],['Partner 02','86','148 lots','$875'],['Partner 03','62','98 lots','$540']]))}${card('Earnings history',chart())}`;
      case 'sharing': return `${card('IB Profile',`<span class="scene-avatar">M</span><strong class="scene-value">Partner profile</strong><p>Share your network and referral identity.</p>${field('Profile visibility','Public')}${field('Referral code','PARTNER-DEMO')}${field('Referral link','broker.example/join/partner')}${pill('Copy link')}${pill('Share profile')}`)}${card('Visibility settings',`${field('Show contact details','Enabled')}${field('Show partner statistics','Enabled')}`)}`;
      case 'transfer': return `${card('Transfer between wallets',`${field('Select client','Demo client 01')}${field('From wallet','USD Wallet · $3,200')}${field('To wallet','Trading account · MT5')}${field('Amount','$500.00')}${field('Transfer note','Internal account funding')}${pill('Review transfer')}`)}${card('Recent Transfers',transactions())}`;
      case 'social': return `${pill('All')}${pill('Watchlist')}${pill('Search ProTraders')}${pill('Filter')}${profiles()}`;
      case 'performance': return `${card('ProTrader profile',`<span class="scene-avatar">A</span>AlexCopy20 ${pill('Public')}${pill('Follow')}`)}${stats([['30D return','15%'],['Total profit','$1,200'],['Investors','156'],['Active days','22']])}${card('Performance History',chart())}${card('Risk & trading statistics',`${field('Equity','$1,590')}${field('Maximum drawdown','8.2%')}${field('Trading strategy','Diversified market exposure')}`)}`;
      case 'follow': return `<div class="scene-two">${card('Following setup',`${field('Select account','MT5 · Standard')}${field('Allocation','$1,000')}${field('Risk multiplier','1.0 ×')}${field('Stop loss','10%')}${field('Renewal','Monthly')}${pill('Review subscription')}`)}${card('Subscription summary',`${field('ProTrader','AlexCopy20')}${field('Fee percentage','5%')}${field('Subscription fee','$10')}${chart()}`)}</div>`;
      case 'risk': return `<div class="scene-risk-top">${stats([['Broker profit','$2,458'],['ProTrader commission','$1,650'],['First deposit','$3,859'],['IB commission','$4,541']])}${card('Net Account Deposit',`<strong class="scene-value">$9,394</strong>${chart()}`)}${card('Overall Risk',riskGauge())}</div><div class="scene-two">${card('Live Orders Overview',`${field('Active accounts','5,798')}${stats([['Equity','$15,650'],['Open trades','650'],['Pending orders','846'],['Lots','558']])}`)}${card('Top Exposure',table(['Platform','Currency','Trades','Profit'],[['MT4','XAU/USD','6','$56,980'],['MT5','EUR/USD','3','$13,263'],['MT4','GBP/USD','8','$16,765'],['MT5','USD/JPY','2','$20,765']]))}</div>`;
      case 'geography': return `<div class="scene-two">${card('Exposure by Region',`<svg class="scene-map" viewBox="0 0 500 240" aria-hidden="true"><path d="M30 40 110 20 170 65 135 100 75 110 45 85ZM135 120 175 135 190 180 160 220 140 180ZM240 45 280 28 335 50 365 35 460 60 470 100 400 125 355 115 335 80 285 90ZM260 105 315 110 340 155 300 205 275 180 250 125ZM395 175 445 170 460 205 410 212Z"/><circle cx="280" cy="70" r="8"/><circle cx="120" cy="70" r="10"/><circle cx="395" cy="87" r="12"/></svg>`)}${card('Region overview',table(['Region','Exposure','Risk'],[['Europe','$240,000','Medium'],['Asia','$180,000','High'],['Americas','$120,000','Low']]))}</div>${card('Regional activity',chart('bars'))}`;
      case 'exposure': return `${stats([['USD exposure','$240K'],['EUR exposure','$180K'],['GBP exposure','$120K'],['Open positions','650']])}${card('Exposure by Currency',chart('bars'))}${card('Currency Pairs',table(['Pair','Long','Short','Net exposure'],[['EUR/USD','128','96','$32,400'],['GBP/USD','84','62','$24,800'],['USD/JPY','106','98','$18,200'],['XAU/USD','210','175','$54,600']]))}`;
      case 'report': return `${field('Report type','Operational risk review')}${field('Date range','Last 30 days')}${stats([['Trading activity','650'],['Risk alerts','24'],['Active profiles','472']])}${card('Risk trends',chart())}${card('Operational summary',table(['Metric','Current','Previous'],[['Net exposure','$540K','$510K'],['Monitored accounts','5,798','5,612'],['Resolved alerts','18','16']]))}`;
      case 'ai': return `<div class="scene-two">${card('Analysis settings',`${field('Symbol','EUR/USD')}${field('Timeframe','4 hours')}${field('Analysis horizon','Short term')}${field('Resource','Price action')}${pill('Generate analysis')}`)}${card('Market context',chart())}</div>${card('AI-assisted Analysis',`<p>Price is testing a recent resistance zone. Review momentum, liquidity and the broader market context before considering a position.</p>${field('Trend','Range-bound')}${field('Support zone','1.0820–1.0850')}${field('Resistance zone','1.0920–1.0950')}<p class="scene-hint">Illustrative output. Product decisions remain with the user.</p>`)}`;
      case 'onboarding': return `${stats([['Users','124'],['Pending onboarding','18'],['Departments','8'],['Completed','106']])}${card('Organizational workflows',table(['Employee','Department','Onboarding','Status'],[['Demo employee 01','Product','4 / 5 steps','In progress'],['Demo employee 02','Engineering','5 / 5 steps','Complete'],['Demo employee 03','Operations','2 / 5 steps','In progress']]))}${card('Content & administration',`${field('Organization','Shokouhejavid Iranian')}${field('Content','Policies, learning and announcements')}${field('Permissions','Role-based access')}`)}`;
      case 'evaluation': return `${stats([['Total forms','20'],['Evaluations','3'],['Average score','56'],['Highest score','87.5'],['Awaiting review','1'],['Lowest score','0']])}${card('Evaluation Comparison',chart('bars'))}${card('Assessment forms',table(['Form','Type','Status'],[['Performance review','Manager','Complete'],['360° feedback','Peers','In progress'],['Self assessment','Employee','Complete']]))}`;
      case 'portal': return `${stats([['Employees','124'],['Announcements','8'],['Tasks','24']])}${card('Internal management',`${field('Users','Employee directory')}${field('Knowledge','Shared organizational resources')}${field('Forms','Requests and approvals')}`)}${card('Recent activity',chart('bars'))}`;
      default: return '';
    }
  }
  function mobile(type) {
    const native=type==='mobile';
    return `<div class="scene-phone"><div class="scene-status"><strong>10:01</strong><span>●●● ▰</span></div><div class="scene-phone-greeting"><span class="scene-avatar">M</span><div><strong>Hello, Morsal 👋</strong><span class="scene-hint">${native?'Trader · IB · ProTrader':'Personal wallet'}</span></div><span>♧</span></div>${card(native?'Total Balance':'Wallet Balance',`<strong class="scene-value">${native?'$3,664.50':'$3,434.80'}</strong>${chart()}<div class="scene-actions">${['Deposit','Withdraw','Transfer'].map(pill).join('')}</div>`,'scene-phone-balance')}<div class="scene-phone-title">Quick Access</div><div class="scene-quick">${['Request','History','Accounts','Copy Trade'].map((t,i)=>`<div><span>${['▤','↺','▣','↗'][i]}</span>${t}</div>`).join('')}</div>${native?`<div class="scene-phone-title">Explore ProTraders</div><div class="scene-quick">${['E','A','D','O'].map(t=>`<span class="scene-avatar">${t}</span>`).join('')}</div>${card('AI Analysis',`<p>Understand trading patterns with AI-powered insights.</p>${field('Choose pairs','EUR/USD')}${field('Analysis horizon','Short term')}${pill('Generate Analysis')}`)}${card('Earn More with Our IB Program','<p>Refer. Earn. Grow together.</p>'+pill('Become an IB'))}${card('Activity Trend',`${stats([['Deposit','$9,850'],['Withdraw','$1,850']])}${chart()}`)}`:card('Invite a friend','<p>Earn rewards for each new referral.</p>'+pill('Invite for free'))+card('Transactions',transactions())}<div class="scene-phone-nav"><span>Home</span><span>Explore</span><span>Trade</span><span>Account</span></div></div>`;
  }
  function finance() {
    const welcome=`<div class="scene-phone"><div class="scene-status">9:41 <span>●●● ▰</span></div><strong class="scene-value">Finanpay</strong><div class="scene-symbol">▱</div>${card('Your card','<strong class="scene-value">•••• 4289</strong><p>Demo cardholder</p>')}<strong class="scene-value">Step into a new financial experience.</strong><p>Manage finances and unlock new possibilities.</p>${pill('Get started →')}</div>`;
    const dashboard=`<div class="scene-phone"><div class="scene-status">9:41 <span>●●● ▰</span></div><div class="scene-phone-title">Hello, demo customer</div>${card('Total Balance','<strong class="scene-value">12,345.67 USD</strong>'+pill('Request')+pill('Transfer'))}${card('Daily Expense',stats([['Food','$98'],['Skincare','$21'],['Course','$52']]))}${card('Recent Transactions',transactions())}<div class="scene-phone-nav">Dashboard · Wallet · Profile</div></div>`;
    const wallet=`<div class="scene-phone"><div class="scene-status">9:41 <span>●●● ▰</span></div><div class="scene-phone-title">Wallet</div>${pill('My Wallet')}${pill('Shared to me')}${card('Your wallets',stats([['Main wallet','$21,018'],['Savings','$91,027'],['Emergency','$31,034']]))}${card('Analytics',stats([['Income','$9,850'],['Spending','$1,850']])+chart())}<div class="scene-phone-nav">Dashboard · Wallet · Profile</div></div>`;
    return `<div class="scene-finance-composition">${welcome}${dashboard}${wallet}</div>`;
  }
  function website(title,type) {
    const top=type.startsWith('top');
    const heading=type==='topPartners'?'Build the future of brokerage together':type==='deltaTrading'?'A trading account for your next move':top?'Technology that connects your brokerage':'Trade with confidence. Grow with clarity.';
    return `<div class="scene-website"><div class="scene-web-nav"><strong>${title}</strong><span>Products</span><span>Solutions</span><span>Company</span>${pill('Contact us')}</div><div class="scene-web-hero"><div><span class="scene-hint">${top?'Brokerage technology ecosystem':'Global trading services'}</span><strong>${heading}</strong><p>${top?'CRM, risk analytics, engagement and mobile experiences in one connected product ecosystem.':'Access markets, manage accounts and explore trading services through a clear customer journey.'}</p>${pill(type==='topPartners'?'Start a conversation':top?'Explore solutions':'Get started')}</div><svg class="scene-web-graphic" viewBox="0 0 300 240" aria-hidden="true"><path d="M150 15 280 80 150 145 20 80Z M20 110 150 175 280 110 M20 140 150 205 280 140"/><path d="M70 190 110 135 155 155 200 80 250 45"/></svg></div><div class="scene-three">${(top?['Brokerage CRM','Risk Management','Native Mobile']:['Trading Accounts','Platforms','Market Insights']).map(t=>card(t,'<p>Connected workflows. Clearer decisions.</p>'+pill('Learn more ↗'))).join('')}</div></div>`;
  }
  function payment() {return `<div class="scene-payment"><div>${card('BEP20 Wallet','<span class="scene-symbol">◇</span>')}${card('TRC20 Wallet','<span class="scene-symbol">△</span>')}</div><span class="scene-flow-arrow">→</span>${card('Payment Gateway','<span class="scene-symbol">♢</span><p>Validate · Route · Confirm</p>')}<span class="scene-flow-arrow">→</span>${card('Merchant','<span class="scene-symbol">▣</span><p>Payment received</p>')}</div>`;}
  function travel() {return `<div class="scene-phone scene-travel"><div class="scene-web-nav"><strong>Bazaar</strong><span>Apps</span><span>Support</span></div><p class="scene-hint">Apps / Travel / Plan Chin</p>${card('Plan Chin · Online expense splitting','<span class="scene-symbol">△</span><p>Travel budgeting and shared-expense calculation.</p>'+pill('Download'))}${pill('Travel')}${pill('Shared expenses')}${card('App preview','<p>Record trip costs and calculate how expenses are shared.</p><div class="scene-phone-title">Shared costs</div>'+table(['Item','Paid by','Split'],[['Transport','Member 01','Shared'],['Accommodation','Member 02','Shared']]))}<p class="scene-hint">Reconstruction of the supplied app-listing reference.</p></div>`;}
  function render(key) {
    const config=scenes[key]; if(!config)return null;
    const [brand,title,type]=config, mobileType=['mobile','wallet','finance','travel'].includes(type), web=type.startsWith('delta')||type.startsWith('top');
    const element=document.createElement('div'); element.className='product-coded';element.dataset.scene=key;element.setAttribute('role','img');element.setAttribute('aria-label',`${brand}: ${title}. Reconstructed interface with sample data.`);
    const nav=type.startsWith('risk')||['risk','geography','exposure','report'].includes(type)?['Insights','Exposure','Profiles','Funds','Trade Book','Risk Monitoring','Reporting','Settings']:type.startsWith('loyalty')||['missions','builder'].includes(type)?['Home','Missions','Rewards','Wallet','Profile','Notifications']:['Dashboard','Wallets','Accounts','Social Trading','Requests','Reports','Support','Settings'];
    const body=mobileType?(type==='travel'?travel():type==='finance'?finance():mobile(type)):web?website(brand,type):type==='payments'?payment():dashboard(type);
    element.innerHTML=`<div class="scene-reconstruction-label">Reconstructed interface · sample data</div>${mobileType||web||type==='payments'?body:`<div class="scene-shell"><div class="scene-sidebar"><strong>${esc(brand)}</strong>${nav.map((t,i)=>`<span class="${i===0?'is-active':''}">${['▦','◈','▣','◎','▤','↗','◇','⚙'][i%8]} ${t}</span>`).join('')}</div><div class="scene-main"><div class="scene-topbar"><span>${esc(brand)} · Workspace</span><span>⌕ &nbsp; ♧ &nbsp; ⚙</span></div><div class="scene-heading">${esc(title)}</div>${body}</div></div>`}`;
    return element;
  }
  const keyFor = image => image?.getAttribute('src')?.split('/').pop().split('?')[0].replace('.webp','');
  let theme='navy', mode='code';
  try {theme=localStorage.getItem('portfolio-product-theme')||theme;mode=localStorage.getItem('portfolio-product-mode')||mode;}catch{}
  if(!['navy','light','slate'].includes(theme))theme='navy';if(!['code','original'].includes(mode))mode='code';
  function sync(root=document) {
    root.querySelectorAll('[data-product-slot],.lightbox-code').forEach(slot=>{slot.dataset.productMode=mode;slot.dataset.productTheme=theme;});
    root.querySelectorAll('[data-product-theme-button]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.productThemeButton===theme)));
    root.querySelectorAll('[data-product-mode-button]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.productModeButton===mode)));
  }
  function toolbar(host) {
    if(host.querySelector(':scope > .product-palette'))return;
    const bar=document.createElement('div');bar.className='product-palette';bar.setAttribute('role','group');bar.setAttribute('aria-label','Product interface appearance');
    bar.innerHTML=`<span>Interface palette</span>${[['navy','Navy & Gold'],['light','Light & Blue'],['slate','Slate & Blue']].map(([id,title])=>`<button type="button" data-product-theme-button="${id}" aria-pressed="false"><span class="palette-swatch swatch-${id}" aria-hidden="true"></span>${title}</button>`).join('')}<span class="palette-divider" aria-hidden="true"></span><button type="button" data-product-mode-button="code" aria-pressed="false">Code preview</button><button type="button" data-product-mode-button="original" aria-pressed="false">Original images</button>`;
    host.prepend(bar);
  }
  function enhance(root=document) {
    const hosts=[...root.querySelectorAll('.case-content,.projects .wrap')];
    for(const host of hosts) {
      const slots=host.querySelectorAll('.project-image,.case-cover,.gallery-item > a');let count=0;
      slots.forEach(slot=>{
        if(slot.dataset.productSlot)return;
        const key=keyFor(slot.querySelector('img')),scene=render(key);if(!scene)return;
        slot.dataset.productSlot=key;slot.prepend(scene);count++;
      });
      if(count)toolbar(host);
    }
    sync(root);
  }
  document.addEventListener('click',event=>{
    const themeButton=event.target.closest('[data-product-theme-button]'),modeButton=event.target.closest('[data-product-mode-button]');
    if(!themeButton&&!modeButton)return;
    if(themeButton)theme=themeButton.dataset.productThemeButton;if(modeButton)mode=modeButton.dataset.productModeButton;
    try{localStorage.setItem('portfolio-product-theme',theme);localStorage.setItem('portfolio-product-mode',mode);}catch{}
    sync();
  });
  function renderLightbox(dialog,link) {
    dialog.querySelector('.lightbox-code')?.remove();
    const existingPalette=dialog.querySelector('.product-palette');if(existingPalette)existingPalette.hidden=link.dataset.productMode!=='code';
    const originalLink=dialog.querySelector('.lightbox-original');originalLink.textContent=link.dataset.productMode==='code'?'Open original image ↗':'Open full-size image ↗';
    const image=dialog.querySelector('.lightbox-image'); image.hidden=false;
    if(link.dataset.productMode!=='code')return;
    const scene=render(link.dataset.productSlot);if(!scene)return;
    scene.classList.add('lightbox-code');scene.dataset.productTheme=theme;
    if (!dialog.querySelector('.product-palette')) {
      const bar=document.createElement('div');bar.className='product-palette';bar.setAttribute('role','group');bar.setAttribute('aria-label','Image viewer interface palette');
      bar.innerHTML=[['navy','Navy & Gold'],['light','Light & Blue'],['slate','Slate & Blue']].map(([id,title])=>`<button type="button" data-product-theme-button="${id}" aria-pressed="${id===theme}"><span class="palette-swatch swatch-${id}" aria-hidden="true"></span>${title}</button>`).join('');
      dialog.querySelector('figure').before(bar);
    }
    image.hidden=true;dialog.querySelector('figure').prepend(scene);
  }
  window.ProductScenes={enhance,render,renderLightbox,keys:Object.keys(scenes)};
  enhance();
})();
