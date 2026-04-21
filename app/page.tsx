import Link from 'next/link';
import LandingScripts from './LandingScripts';

export default function Home() {
  return (
    <>
      <nav id="nav">
        <div className="nav-brand">Three Lions Capital</div>
        <div className="nav-badge">Confidential &middot; Qualified Investors Only</div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/img/p6_0.jpeg')" }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-content fade" style={{ transitionDelay: '0.1s' }}>
          <div className="hero-eyebrow">Confidential Investment Opportunity &nbsp;&middot;&nbsp; Norco, California</div>
          <h1 className="hero-title">
            SilverLakes<br />
            <strong>Sports Park</strong>
          </h1>
          <p className="hero-subtitle">122-Acre Sports &amp; Entertainment Campus &nbsp;&middot;&nbsp; Southern California</p>
          <div className="hero-pills">
            <span className="pill pill-solid">Up to $50M Target Raise</span>
            <span className="pill pill-outline">Asset-Specific SPV</span>
            <span className="pill pill-outline">8% Preferred Return</span>
          </div>
        </div>
        <div className="stats-bar fade" style={{ transitionDelay: '0.4s' }}>
          <div className="stat-item">
            <div className="stat-value">122<sup style={{ fontSize: '16px', fontWeight: 400 }}> ac</sup></div>
            <div className="stat-label">Riverside County, CA</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24</div>
            <div className="stat-label">Full-Size Fields</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">10<sup>K</sup></div>
            <div className="stat-label">Concert Capacity</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">21.2<sup>M+</sup></div>
            <div className="stat-label">Local Population</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1.4<sup>M+</sup></div>
            <div className="stat-label">Annual Visitors</div>
          </div>
          <div className="stat-item">
            <div className="stat-value gold">$1B</div>
            <div className="stat-label">Structural Value</div>
          </div>
        </div>
      </div>

      {/* THE OPPORTUNITY */}
      <div className="section-alt">
        <div className="section wrap fade">
          <div className="eyebrow">The Opportunity</div>
          <h2>An Irreplaceable Asset at<br />an <em>Inflection Point</em></h2>
          <div className="rule"></div>
          <p className="lead">Three Lions Capital has entered into an exclusive agreement to acquire SilverLakes Sports Park &mdash; among the premier privately operated facilities of its kind in North America &mdash; built on a foundation of favorable long-term ground lease terms and substantial on-site infrastructure whose replacement cost would be materially higher today.</p>
          <div className="pillars">
            <div className="pillar fade">
              <div className="pillar-num">01</div>
              <div className="pillar-title">Irreplaceable Asset</div>
              <div className="pillar-body">122 acres in Southern California with a long-term, below-market ground lease, proprietary water rights, and completed infrastructure conservatively valued at $1 billion. Cannot be replicated at this basis.</div>
            </div>
            <div className="pillar fade">
              <div className="pillar-num">02</div>
              <div className="pillar-title">Ownership Unlocks Value</div>
              <div className="pillar-body">With Three Lions as the right owner-operator, SilverLakes can achieve its full potential &mdash; which has yet to be realized due to economic shocks from 2008 and COVID-19. Current EBITDA massively understates asset potential.</div>
            </div>
            <div className="pillar fade">
              <div className="pillar-num">03</div>
              <div className="pillar-title">City Partnership</div>
              <div className="pillar-body">Deep municipal commitment including financial support, pre-approved development rights, potential property tax benefits, and Tax Increment Financing (TIF) &mdash; a rare structural advantage.</div>
            </div>
            <div className="pillar fade">
              <div className="pillar-num">04</div>
              <div className="pillar-title">Day One Cash Flow</div>
              <div className="pillar-body">1.4M annual visitors and fully operational today. Revenue from events, sponsorship, naming rights, hospitality, and technology remains largely untapped &mdash; immediate improvement path with no new construction required.</div>
            </div>
            <div className="pillar fade">
              <div className="pillar-num">05</div>
              <div className="pillar-title">Global Destination Asset</div>
              <div className="pillar-body">Long-term vision of world-class training facilities, on-site hotel, and purpose-built arena positioning SilverLakes as a globally recognized sports and entertainment destination.</div>
            </div>
            <div className="pillar fade">
              <div className="pillar-num">06</div>
              <div className="pillar-title">Institutional Fund Anchor</div>
              <div className="pillar-body">Potential seed asset of a purpose-built sports and entertainment portfolio, with value and basis growing as future phases progress &mdash; a compelling entry point for institutional capital deployment.</div>
            </div>
          </div>
        </div>
      </div>

      {/* DEAL STRUCTURE */}
      <div className="section wrap fade">
        <div className="eyebrow">Asset &amp; Deal Structure</div>
        <h2>Investment Terms</h2>
        <div className="rule"></div>
        <table className="terms">
          <tbody>
            <tr><td>Acquisition</td><td>Exclusive right to purchase 122-acre sports/entertainment campus with all assets, improvements, leasehold, water rights, and more.</td></tr>
            <tr><td>Target Raise</td><td><span className="hi">Up to $50 million</span> in an asset-specific SPV, held in escrow pending (i) execution of acceptable bond re-purchase terms and (ii) agreement on equity buyout pricing.</td></tr>
            <tr><td>Phase I &mdash; Years 0&ndash;2</td><td><span className="phase-tag">Target EBITDA</span><span className="hi">$5.3M &ndash; $7.1M</span> &middot; No new construction required &middot; Revenue programs activated: Sponsorship, Tournaments, Entertainment, F&amp;B, Parking</td></tr>
            <tr><td>Phase II &mdash; Years 2&ndash;5</td><td><span className="phase-tag">Target EBITDA</span><span className="hi">$10.8M &ndash; $14.6M</span> &middot; Pre-approved construction including 300,000+ SF indoor multi-sport facility + on-site accommodations</td></tr>
            <tr><td>Ground Lease</td><td>Well below-market at $428K/year with 88 years remaining + 30-year extension option. Comparables start at $25 million/year. <span className="hi">$403M structural NPV.</span></td></tr>
            <tr><td>Water Rights</td><td>On-site sources including two deep wells at no cost in perpetuity. <span className="hi">$482M structural value.</span></td></tr>
            <tr><td>Management Fee</td><td>2% per annum on committed capital</td></tr>
            <tr><td>Preferred Return</td><td><span className="hi">8% annualized hurdle rate</span></td></tr>
            <tr><td>Carried Interest</td><td><span className="hi">20%</span> of profits above the 8% preferred return</td></tr>
          </tbody>
        </table>
      </div>

      {/* RETURNS */}
      <div className="section-alt">
        <div className="section wrap fade">
          <div className="eyebrow">Return Analysis</div>
          <h2>IRR &amp; Multiple on<br /><em>Invested Capital</em></h2>
          <div className="rule"></div>
          <p className="lead">$50M total deployed: $30M for Phase I + $20M for Phase II capex at Year 2. 5-year hold. Exit at 12x&ndash;14x EBITDA multiples &mdash; in line with comparable sports facility transactions.</p>
          <div className="returns-grid">
            <div className="return-card low fade">
              <div className="return-label low">Phase I + II &mdash; Low Case</div>
              <div className="return-big-nums">
                <div><div className="big-num teal">21.0%</div><div className="big-label">IRR</div></div>
                <div><div className="big-num teal">2.59x</div><div className="big-label">MoIC</div></div>
              </div>
              <div className="return-meta">
                <div><div className="meta-val">$50M</div><div className="meta-label">Capital Deployed</div></div>
                <div><div className="meta-val">5 Years</div><div className="meta-label">Hold Period</div></div>
                <div><div className="meta-val">12x</div><div className="meta-label">Exit Multiple</div></div>
                <div><div className="meta-val">$129.6M</div><div className="meta-label">Exit Value</div></div>
              </div>
            </div>
            <div className="return-card high fade">
              <div className="return-label high">Phase I + II &mdash; High Case</div>
              <div className="return-big-nums">
                <div><div className="big-num gold">32.5%</div><div className="big-label">IRR</div></div>
                <div><div className="big-num gold">4.09x</div><div className="big-label">MoIC</div></div>
              </div>
              <div className="return-meta">
                <div><div className="meta-val">$50M</div><div className="meta-label">Capital Deployed</div></div>
                <div><div className="meta-val">5 Years</div><div className="meta-label">Hold Period</div></div>
                <div><div className="meta-val">14x</div><div className="meta-label">Exit Multiple</div></div>
                <div><div className="meta-val">$204.4M</div><div className="meta-label">Exit Value</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STRUCTURAL VALUE */}
      <div className="section wrap fade">
        <div className="eyebrow">Non-Operational Structural Value</div>
        <h2>$1 Billion in Value<br /><em>Excluded from Return Analysis</em></h2>
        <div className="rule"></div>
        <p className="lead">Three components of structural value &mdash; none of which appear in any of the IRR projections above. Comparable sports facilities are being built at multiples of this going-in basis.</p>
        <div className="value-grid">
          <div className="value-card fade"><div className="value-amt">$403M</div><div className="value-name">Ground Lease</div><div className="value-desc">Deeply below-market lease at $396,000/year, extendable to 129 years. Nearby Ontario Sports Empire&rsquo;s lease starts at $25M/year. NPV of pro forma savings at 6% discount rate over the life of the term.</div></div>
          <div className="value-card fade"><div className="value-amt">$482M</div><div className="value-name">Water Rights</div><div className="value-desc">On-site sources at zero cost in perpetuity. Conservative savings of $482M over the life of the ground lease versus water sourced from the Chino Water Basin and/or the City of Norco.</div></div>
          <div className="value-card fade"><div className="value-amt">$125M</div><div className="value-name">In-Place Infrastructure</div><div className="value-desc">Obama-era stimulus funding, Army Corps of Engineers flood mitigation, 6-lane bridge expansion, LED-lit synthetic and grass field infrastructure. $125M in estimated replacement costs.</div></div>
        </div>
        <div className="value-total-bar fade">
          <div>
            <div className="total-left-label">Total Structural Value Created</div>
            <div className="total-note">Excluded from all return analysis above. Comparable sports facilities are being built across the country at multiples of the going-in basis.</div>
          </div>
          <div className="total-amt">$1B+</div>
        </div>
      </div>

      {/* TWO-PHASE STRATEGY */}
      <div className="section-alt">
        <div className="section wrap fade">
          <div className="eyebrow">Two-Phase Investment Strategy</div>
          <h2>Operational Control,<br />Then <em>Campus Expansion</em></h2>
          <div className="rule"></div>
          <div className="phases">
            <div className="phase-card fade">
              <div className="phase-yr p1">Years 0&ndash;2</div>
              <div className="phase-title">Phase I: Operational Control</div>
              <div className="phase-ebitda p1">$5.3M&ndash;$7.1M</div>
              <div className="phase-ebitda-lbl">Target EBITDA</div>
              <ul className="phase-list">
                <li>No new construction required</li>
                <li>Activate naming rights &amp; sponsorship (currently $0 &rarr; $700K)</li>
                <li>Scale concert revenue from $668K to $2.6M</li>
                <li>Reposition F&amp;B from &lt;$500K to $3.1M</li>
                <li>Operate outdoor food hall on zero-cost basis</li>
                <li>Maximize tournament registration &amp; parking</li>
              </ul>
            </div>
            <div className="phase-connector"><div className="phase-arrow-icon">&#x2192;</div></div>
            <div className="phase-card p2 fade">
              <div className="phase-yr p2">Years 2&ndash;5</div>
              <div className="phase-title">Phase II: Campus Expansion</div>
              <div className="phase-ebitda p2">$10.8M&ndash;$14.6M</div>
              <div className="phase-ebitda-lbl">Target EBITDA</div>
              <ul className="phase-list">
                <li>300,000+ SF indoor multi-sport facility (pre-approved)</li>
                <li>On-site overnight athlete accommodations</li>
                <li>Professional-level stadium</li>
                <li>Surf park &amp; residential athletic academy</li>
                <li>Hotel + expanded food hall</li>
                <li>TIF financing from City of Norco</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MARKET */}
      <div className="section wrap fade">
        <div className="eyebrow">Market Opportunity</div>
        <h2>Southern California&rsquo;s<br /><em>Premier Sports Destination</em></h2>
        <div className="rule"></div>
        <div className="market-layout">
          <div>
            <p className="lead" style={{ marginBottom: '32px' }}>22.1 million people across 5 SoCal counties &mdash; with global reach for training, tournaments, events, and partnerships across a 30/60/90-mile map.</p>
            <div className="catchment">
              <div className="ring fade"><div className="ring-badge r1">30 mi</div><div><div className="ring-pop r1">4.2M</div><div className="ring-lbl">Inland Empire + East LA</div></div></div>
              <div className="ring fade"><div className="ring-badge r2">60 mi</div><div><div className="ring-pop r2">14.8M</div><div className="ring-lbl">Greater Los Angeles DMA</div></div></div>
              <div className="ring fade"><div className="ring-badge r3">90 mi</div><div><div className="ring-pop r3">22.1M</div><div className="ring-lbl">SoCal + San Diego + IE</div></div></div>
            </div>
          </div>
          <div className="market-stats-grid">
            <div className="mstat fade"><div className="mstat-val">64%</div><div className="mstat-lbl">Population growth since 2000 (1.5M &rarr; 2.5M)</div></div>
            <div className="mstat fade"><div className="mstat-val">75%</div><div className="mstat-lbl">Family households vs. 66% nationally</div></div>
            <div className="mstat fade"><div className="mstat-val">$93K</div><div className="mstat-lbl">Median household income &mdash; above national average</div></div>
            <div className="mstat fade"><div className="mstat-val">4</div><div className="mstat-lbl">Major international airports within 60 miles</div></div>
            <div className="mstat fade" style={{ gridColumn: 'span 2' }}>
              <div className="mstat-val" style={{ fontSize: '14px', fontWeight: 500, fontFamily: "'Inter',sans-serif", color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Disneyland (30 mi) &nbsp;&middot;&nbsp; Downtown LA (50 mi) &nbsp;&middot;&nbsp; Newport Beach (40 mi) &nbsp;&middot;&nbsp; UC Riverside (15 mi)</div>
              <div className="mstat-lbl">Proximity to major destinations + tourist attractions</div>
            </div>
          </div>
        </div>
      </div>

      {/* CAMPUS */}
      <div className="section-alt">
        <div className="section wrap fade">
          <div className="eyebrow">Campus Highlights</div>
          <h2>Existing Revenue-<em>Generating Assets</em></h2>
          <div className="rule"></div>
          <div className="campus-grid">
            <div className="campus-cell fade"><div className="campus-icon">&#x26BD;</div><div className="campus-cell-title">24 Full-Size Fields</div><div className="campus-cell-body">4 LED-lit AstroTurf synthetic + 20 grass. Home to 480+ club youth soccer league.</div></div>
            <div className="campus-cell fade"><div className="campus-icon">&#x1F3B5;</div><div className="campus-cell-title">10,000-Person Venue</div><div className="campus-cell-body">On-site concert and large-scale event venue with full production infrastructure.</div></div>
            <div className="campus-cell fade"><div className="campus-icon">&#x1F37D;</div><div className="campus-cell-title">Restaurant &amp; Bar</div><div className="campus-cell-body">Operated bar, outdoor cafe &amp; private banquet. Repositioning from &lt;$500K to $3.1M EBITDA.</div></div>
            <div className="campus-cell fade"><div className="campus-icon">&#x1F3EA;</div><div className="campus-cell-title">12,000-SF Food Hall</div><div className="campus-cell-body">Outdoor cafe and food hall on zero-cost basis. Immediate cash flow potential.</div></div>
            <div className="campus-cell fade"><div className="campus-icon">&#x1F3DB;</div><div className="campus-cell-title">Fieldhouse &amp; Indoor</div><div className="campus-cell-body">Fieldhouse programming at $1.9M today. Path to $2.7M with professional management.</div></div>
            <div className="campus-cell fade"><div className="campus-icon">&#x1F3F7;</div><div className="campus-cell-title">Naming Rights</div><div className="campus-cell-body">Sponsorship currently at $0. Target $400K&ndash;$700K with naming rights.</div></div>
            <div className="campus-cell fade"><div className="campus-icon">&#x1F4A7;</div><div className="campus-cell-title">Water Rights</div><div className="campus-cell-body">Two on-site deep wells. Water at zero cost in perpetuity &mdash; $482M structural value excluded from IRR.</div></div>
            <div className="campus-cell fade"><div className="campus-icon">&#x1F3C6;</div><div className="campus-cell-title">Tournament HQ</div><div className="campus-cell-body">Premier tournament &amp; field sports hub. $3.32M today, $5.8M optimized. ~70% EBITDA margin.</div></div>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div className="section wrap fade">
        <div className="eyebrow">The Campus</div>
        <h2>SilverLakes in <em>Real Life</em></h2>
        <div className="rule"></div>
        <div className="gallery-grid">
          <div className="gallery-item fade"><img src="/img/p4_1.jpeg" alt="Grass Fields" /><div className="gallery-caption">Grass Fields</div></div>
          <div className="gallery-item fade"><img src="/img/p4_2.jpeg" alt="LED-Lit AstroTurf Fields" /><div className="gallery-caption">LED-Lit AstroTurf Fields</div></div>
          <div className="gallery-item fade"><img src="/img/p4_3.jpeg" alt="Fieldhouse Restaurant" /><div className="gallery-caption">Fieldhouse Restaurant</div></div>
          <div className="gallery-item fade"><img src="/img/p4_4.jpeg" alt="Lakeside Venue" /><div className="gallery-caption">Lakeside Venue</div></div>
          <div className="gallery-item fade"><img src="/img/p4_5.jpeg" alt="On-Site Concerts" /><div className="gallery-caption">On-Site Concerts</div></div>
          <div className="gallery-item fade"><img src="/img/p4_6.jpeg" alt="The Backyard Event Space" /><div className="gallery-caption">The Backyard Event Space</div></div>
        </div>
      </div>

      {/* SPORTS ASSET CLASS */}
      <div className="section wrap fade">
        <div className="eyebrow">Sports as an Asset Class</div>
        <h2>Outperforming Equities<br />with <em>Lower Volatility</em></h2>
        <div className="rule"></div>
        <p className="lead">Sports assets have demonstrated exceptional risk-adjusted returns &mdash; structural scarcity, recession-resilient cash flows, and institutional capital entering at an unprecedented rate.</p>
        <div className="asset-metrics">
          <div className="asset-cell fade"><div className="asset-val">$388B</div><div className="asset-lbl">U.S. Sports Spending (2026 projected)</div></div>
          <div className="asset-cell fade"><div className="asset-val">$132B</div><div className="asset-lbl">Sports Facilities Market Value (2024)</div></div>
          <div className="asset-cell fade"><div className="asset-val">24.3%</div><div className="asset-lbl">Facilities Market CAGR Through 2034</div></div>
          <div className="asset-cell fade"><div className="asset-val">13.1%</div><div className="asset-lbl">Franchise Annual Returns vs. 10.5% Equities</div></div>
          <div className="asset-cell fade"><div className="asset-val">8.47%</div><div className="asset-lbl">Sports Volatility vs. 18.82% Equities</div></div>
        </div>
        <div className="quote-block fade">
          <p>Sports-anchored, mixed-use districts have emerged as a compelling intersection of commercial real estate and sports. The market remains early-stage with significant runway: 72% of existing districts span fewer than 50 acres, only 20% of the roughly 260 venues across the Big 5 North American leagues currently anchor a defined mixed-use district, and 37 new districts were announced in 2024 alone.</p>
        </div>
      </div>

      {/* TEAM */}
      <div className="section-alt">
        <div className="section wrap fade">
          <div className="eyebrow">The Sponsor</div>
          <h2><em>Three Lions Capital</em></h2>
          <div className="rule"></div>
          <p className="lead">Founded by Brett M. Johnson and Berke Bakay &mdash; with direct relationships with national and global sports leagues and experience with accretive capital structures including tax increment financing, EB-5 capital, and public grants.</p>
          <div className="team-grid">
            <div className="team-card fade"><div className="avatar">BJ</div><div className="team-name">Brett M. Johnson</div><div className="team-role">Co-Founder &amp; Partner</div><a href="mailto:brett@threelionscapital.com" className="team-email">brett@threelionscapital.com</a></div>
            <div className="team-card fade"><div className="avatar">BB</div><div className="team-name">Berke Bakay</div><div className="team-role">Co-Founder &amp; Partner</div><a href="mailto:berke@threelionscapital.com" className="team-email">berke@threelionscapital.com</a></div>
            <div className="team-card fade"><div className="avatar">AM</div><div className="team-name">Abdullah Mohsin</div><div className="team-role">Associate</div><a href="tel:+17736776463" className="team-email">(773) 677-6463</a><a href="mailto:abdullah@threelionscapital.com" className="team-email" style={{ marginTop: '6px' }}>abdullah@threelionscapital.com</a></div>
          </div>
          <div className="portfolio fade">
            <div className="portfolio-label">Portfolio Companies</div>
            <div className="portfolio-items">
              <div className="pitem">Phoenix Rising FC &nbsp;<span style={{ opacity: 0.4, fontSize: '10px' }}>2023 USL Champions</span></div>
              <div className="pitem">Ipswich Town FC &nbsp;<span style={{ opacity: 0.4, fontSize: '10px' }}>Premier League</span></div>
              <div className="pitem">Rhode Island FC &nbsp;<span style={{ opacity: 0.4, fontSize: '10px' }}>2025 Conference Finalist</span></div>
              <div className="pitem">Centreville Bank Stadium &nbsp;<span style={{ opacity: 0.4, fontSize: '10px' }}>11,500-seat</span></div>
              <div className="pitem">Tiger Hospitality &nbsp;<span style={{ opacity: 0.4, fontSize: '10px' }}>SoCal Food Halls</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA — REPLACED */}
      <div className="cta-wrap">
        <div className="cta-bg" style={{ backgroundImage: "url('/img/p3_0.jpeg')" }}></div>
        <div className="section wrap">
          <div className="cta-inner fade">
            <div className="eyebrow">Investor Access</div>
            <h2>Access the<br /><em>Data Room</em></h2>
            <div className="rule" style={{ margin: '24px auto' }}></div>
            <p className="lead" style={{ margin: '0 auto', textAlign: 'center' }}>Sign a brief NDA to gain immediate access to the full investor data room &mdash; financial statements, legal documents, appraisals, and more.</p>
            <div style={{ textAlign: 'center' }}>
              <Link href="/access" className="cta-btn">Access Data Room</Link>
            </div>
            <div className="disclaimer fade">
              CONFIDENTIAL &mdash; DO NOT DISTRIBUTE. This document is intended solely for the recipient and may not be reproduced or shared without prior written consent of Three Lions Capital. It is for informational purposes only and does not constitute an offer to sell or solicitation to buy any security. All investments involve risk. Past performance is not indicative of future results. Prospective investors should conduct independent due diligence and consult their legal, tax, and financial advisors prior to making any investment decision.
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">&#169; 2025 Three Lions Capital &nbsp;&middot;&nbsp; SilverLakes Sports Park &nbsp;&middot;&nbsp; Norco, California</div>
        <div className="footer-right">Confidential &middot; For Qualified Investors Only &middot; Past performance is not indicative of future results.</div>
      </footer>

      <LandingScripts />
    </>
  );
}
