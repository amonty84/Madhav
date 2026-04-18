---
artifact: ACHARYA_ENGAGEMENT_KIT.md
version: 1.0
status: CLOSED
date: 2026-04-18
scope: "Execution-ready kit for native to engage an external senior Jyotish acharya to review AM-JIS corpus. Complements EXTERNAL_ACHARYA_REVIEW_INVITATION (the invitation letter artifact from Session 40)."
---

# ACHARYA ENGAGEMENT KIT
### 2026-04-18 | CLOSED

---

## §1 — ACHARYA SELECTION CRITERIA

**Required**:
- Deep Parashari (BPHS-tradition) familiarity
- Working knowledge of Jaimini system (Chara Karakas, Arudhas, Karakamsa, Sahams)
- Comfortable reading analytical corpora (not only client consultations)
- Willing to provide written commentary (not only verbal readings)

**Preferred**:
- Comfort with Jagannatha Hora software (aligns with the project's computational baseline)
- Experience with complex charts containing dual-engine (FORENSIC/JHora) variances — specifically Shadbala ranking divergence handling
- Open to dual-tradition reading (Parashari-Tajika-Jaimini fusion, as AM-JIS uses all three)
- Availability within 2-3 months

**Red flags to avoid**:
- Single-system practitioners who dismiss Jaimini or vice versa
- Practitioners who require only Indian-context client (AM-JIS includes Singapore-based content)
- Unwillingness to engage with Falsifier Registry discipline (some traditionalists find empirical-testing framing unfamiliar)

---

## §2 — CANDIDATE ACHARYA SOURCES (for native research)

Recommended starting points (native to research and vet independently):
- **Parampara-based teachers** in the BPHS/Jaimini tradition with published writing
- **VJAS (Vedic Jyotisha Academy)** certified acharyas with review-practice
- **Journals** (Journal of Astrology, Saptarishis Astrology, Modern Astrology Review) — seek contributors who write critically
- **Direct referrals** through the native's existing dharmic community (Tirumala-linked acharyas may align with the Venkateshwara devata orientation)
- **International practitioners** in Singapore/US Vedic astrology circles if domestic India unavailable

---

## §3 — REVIEW PACKET CONTENTS

Send the following as the review packet (all files in `/Users/Dev/Vibe-Coding/Apps/Madhav/`):

### 3.1 Primary materials (required)
1. `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` — blueprint
2. `AM_JIS_BOOTSTRAP_HANDOFF.md` — context
3. `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` — L1 facts
4. `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` — 36 dated events (retrodictive check)
5. `025_HOLISTIC_SYNTHESIS/UCN_v1_1.md` — primary synthesis document (use v1.1 post-Jupiter correction)
6. `025_HOLISTIC_SYNTHESIS/UCN_v1_0.md` — original reference (for preserved sections)
7. All 9 Domain Reports in `03_DOMAIN_REPORTS/REPORT_*.md`
8. `00_ARCHITECTURE/EXTERNAL_ACHARYA_REVIEW_INVITATION.md` — invitation letter
9. `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md` — internal audit (for transparency about prior state)
10. `00_ARCHITECTURE/FIX_SESSION_001_COMPLETION.md` + `FIX_SESSION_002_COMPLETION.md` — correction log

### 3.2 Secondary materials (offer on request)
11. L2 matrices in `02_ANALYTICAL_LAYER/` (5 files)
12. L2.5 components: `CGM_v1_0.md`, `MSR_v1_0.md`, `CDLM_v1_0.md`, `RM_v1_1.md`
13. `00_ARCHITECTURE/FALSIFIER_REGISTRY_v1_0.md` + `v2_0_EXPANSION.md`
14. `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_0.md`
15. `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md`
16. Temporal Engines (`05_TEMPORAL_ENGINES/`)
17. Remedial Codex (`04_REMEDIAL_CODEX/`)

### 3.3 Format and delivery
- **Preferred**: Shared cloud folder (Dropbox / Google Drive / OneDrive) with all files
- **Alternative**: Printed bound dossier (~300-400 pages)
- **Native to include**: Cover letter summarizing what acharya should prioritize (see §4)

---

## §4 — COVER LETTER TEMPLATE

> Dear [Acharya name],
>
> As arranged per our [prior communication / referral from X], I am submitting the AM-JIS (Abhisek Mohanty Jyotish Intelligence System) analytical corpus for your review. Please find the review packet at [URL / physical shipment].
>
> **Scope of review requested**:
> 1. **L1 factual accuracy** — Do you concur with FORENSIC v6.0's chart data? Ayanamsa Lahiri 23°37'58", Sripathi houses, birth 1984-02-05 10:43 IST Bhubaneswar.
> 2. **Interpretive integrity** — Sample 2-3 Domain Reports of your choice (from the 9 available). Do L2+ claims follow valid classical reasoning from L1 facts?
> 3. **Holistic coherence** — Does UCN v1.1 accurately represent the chart as integrated organism?
> 4. **Top 5 high-confidence claims** (see AUDIT_REPORT_v1_0 §1.4) — Please stress-test: Mercury Seven-System (0.98), 7H Six-Layer (0.97), Sade Sati Paradox (0.95), Devata Triple-Lock (0.91), Wealth-as-Dharmic-Output principle.
> 5. **Blind spots** — What important classical analysis does the corpus miss?
> 6. **Overreach** — Where does the corpus claim more confidence than warranted?
>
> **Known limitations for your awareness**:
> - GAP.01 (Birth Panchang Yoga), GAP.03 (D9 12H stellium precise degrees), LONGEVITY.GAP.01 (Ayurdasaya) — pending Facts Layer v8.0 upgrade
> - Dual-engine Shadbala variance (FORENSIC ranks Sun #1; Jagannatha Hora ranks Saturn #1) — see GAP.07
> - RM_v1_0 was marked SUPERSEDED post-audit; RM_v1_1 is the current Resonance Map
>
> **Your review format**: Any format that works for you. Written commentary preferred. I particularly value disagreement — where the corpus is wrong, please say so directly. I will integrate feedback through a formal red-team process.
>
> **Honorarium**: Your customary consultation fee, plus reasonable expenses. Please invoice to [email].
>
> With respect and gratitude,
> Abhisek Mohanty
> mail.abhisek.mohanty@gmail.com

---

## §5 — RECEIVING AND INTEGRATING FEEDBACK

When acharya feedback arrives:

1. **Native archives feedback** in `00_ARCHITECTURE/acharya_review/[acharya_name]_feedback.md`
2. **Trigger RED_TEAM_EXTERNAL_ACHARYA session** via Claude
3. **Claude produces** `RED_TEAM_EXTERNAL_ACHARYA_v1_0.md` analyzing each feedback point against current corpus claims
4. **Categorize each point** as:
   - CONFIRM: acharya-agrees-with-corpus (no action)
   - CORRECTION: acharya identifies error → schedule FIX_SESSION_003
   - ENHANCEMENT: acharya suggests addition → add to UCN v2.0 draft
   - DISAGREEMENT: acharya-disagrees but corpus stands (document in registry)
5. **Apply corrections** via FIX_SESSION_003 if warranted
6. **Formalize** in CONTRADICTION_REGISTRY or FALSIFIER_REGISTRY as appropriate

---

## §6 — TIMELINE

- **Month 1**: Native researches and selects candidate acharya
- **Month 2**: Invitation sent + review packet delivered
- **Month 2-4**: Acharya conducts review (typical timeframe)
- **Month 4**: Feedback received; RED_TEAM_EXTERNAL_ACHARYA session triggered
- **Month 4-5**: Integration + FIX_SESSION_003 if warranted

Total calendar: ~3-5 months from start to integrated feedback.

---

*End of ACHARYA_ENGAGEMENT_KIT.md — 2026-04-18 — CLOSED*
