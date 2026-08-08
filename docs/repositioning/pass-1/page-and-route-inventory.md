# Page and Route Inventory

## Public Pages

| Route | Purpose | Main headings | Primary claims | Calls to action | Service references | Forms or integrations | Metadata | Gaps against approved repositioning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Corporate homepage | `SIKHWARI GROUP (Pty) Ltd`; telecommunications, cybersecurity and software development headline; `Quick facts`; `Focused service areas`; conditional `Proof` | Single accountable legal entity; South Africa-based delivery; POPIA-aware enquiries; authorised cybersecurity work | Request a quote; Contact; View all services | Telecommunications, Cybersecurity, Software/Digital only | Dynamic proof items via Prisma | Home metadata says telecommunications, cybersecurity and software development | Hospitality missing from hero, cards and metadata; approved two-group positioning absent |
| `/about` | Company, leadership, selected work and proof | `About Sikhwari Group`; `Leadership`; `Selected Work`; `Proof and governance` | One legal entity; coordinated service lines; disciplined delivery; leader experience; Mzansi Select delivery claims | LinkedIn profile for Fhatuwani Sikhwari | Telecommunications, ICT and Network; Culinary and Hospitality; proof categories | Dynamic proof items via Prisma | About metadata says single legal entity and focused service divisions | Leadership titles narrower than approved working titles; only one selected work item; proof wording may imply company-level evidence without visible source |
| `/services` | Service-category listing | `Services` plus service titles | Four public service lines under Sikhwari Group | None on page | Telecommunications; Cybersecurity; Culinary and Hospitality; Software/Digital | Dynamic service content via Prisma with seed fallback | Metadata omits hospitality | Approved four service areas are present; approved two public groups are not yet expressed |
| `/contact` | Enquiry and quotation flow | `Contact`; `Contact details`; `What happens next` | Business enquiries and consultation requests; POPIA-aware handling; enquiries routed to correct service area | Submit | Service-area selector includes four approved public services and Not sure | Client form posts to `/api/leads`; SMTP and database downstream | Contact metadata says business and consultation enquiries | Future required reason options are not fully aligned; registered-address visibility needs approval |
| `/divisions/telecommunications-ict-network-services` | Division placeholder | Telecommunications, ICT, and Network Services | Division of Sikhwari Group; delivery and support aligned to governance, reliability and execution | None | Telecommunications, ICT and network operations | None | Route-specific division metadata | Brief placeholder; no SG Telecom division naming or portfolio-group context |
| `/divisions/cybersecurity-services` | Division placeholder | Cybersecurity Services | Division of Sikhwari Group; authorised cybersecurity delivery; risk reduction and controls | None | Cybersecurity | None | Route-specific division metadata | Brief placeholder; no SG Cyber naming or portfolio-group context |
| `/divisions/culinary-and-hospitality-services` | Division placeholder | Culinary and Hospitality Services | Division of Sikhwari Group; catering and hospitality delivery; food safety discipline | None | Culinary and hospitality | None | Route-specific division metadata | Brief placeholder; hospitality not connected to homepage/footer positioning |
| `/divisions/software-development-and-digital-services` | Division placeholder | Software Development and Digital Services | Division of Sikhwari Group; secure implementation and maintainable outcomes | None | Software and digital delivery | None | Route-specific division metadata | Brief placeholder; no SG Digital division naming or portfolio-group context |
| `/legal/privacy` | Privacy notice | `Privacy Policy` | Collection of contact form data and website logs; POPIA rights; 24-month default retention | Contact page for rights requests | None | Describes contact forms and website logs | Privacy metadata | Body does not name responsible party clearly; no direct privacy email; SMTP/database/operator handling incomplete |
| `/legal/terms` | Website terms | `Terms of Use` | General information only; no contractual offer; separate agreements govern services; South African law | None | Service engagement wording | None | Terms metadata | Legal review recommended for dates and entity detail |
| `/legal/disclaimer` | General and proprietary-trading disclaimer | `Disclaimer`; `Proprietary Trading Disclaimer` | No legal, financial, tax or investment advice; services under one company; trading internal only | None | Service lines generally; trading restriction | None | Disclaimer metadata | Must be preserved; legal review recommended |
| `/sitemap.xml` | Search-engine sitemap | Not applicable | Public route inclusion | Not applicable | Four division routes and legal routes | Generated by Next metadata route | Uses `SITE_URL` | Sitemap excludes admin/API as expected |
| `/robots.txt` | Crawler directives | Not applicable | Allows `/`; points to sitemap | Not applicable | None | Generated by Next metadata route | Uses `SITE_URL` | No current issue identified |

## Protected Admin Pages

| Route | Purpose | Main headings | Forms or integrations | Public exposure risk |
| --- | --- | --- | --- | --- |
| `/admin` | Redirector | None | Authentication check | Low if redirects remain intact |
| `/admin/login` | Login | `Admin login` | Username/password form to `/api/admin/login` | Brute force and credential handling depend on env and rate limits |
| `/admin/leads` | Lead inbox | `Lead inbox`; `Recent leads`; `Lead details` | Reads recent leads from Prisma | Contains personal data and technical request data; must remain protected and no-store |
| `/admin/services` | Service copy editor | `Service content`; `Copy guardrail` | Edits service content records | Can alter public claims; needs content governance |
| `/admin/posts` | Post editor | `Posts`; `Create post`; `Existing posts` | Creates and edits posts | Can publish unsupported claims if enabled in public views later |
| `/admin/proof` | Proof editor | `Proof`; `Create proof item`; `Existing proof items` | Creates and edits proof items | Can publish proof claims on Home/About when active |

## Selected Work and Proof Views

Selected Work is embedded in `/about`, not a separate route. Proof appears conditionally on `/` and `/about` through `ProofSection` when active database proof items exist. No repository seed data proves live proof item titles.
