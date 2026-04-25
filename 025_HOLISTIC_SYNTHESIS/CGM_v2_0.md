---
document: L2.5 HOLISTIC SYNTHESIS — CHART GRAPH MODEL
project: MARSYS-JIS
layer: L2.5 (Holistic Synthesis Layer)
artifact_id: CGM_v2_0
version: 2.0
status: CURRENT
session: GAP_RESOLUTION_SESSION (2026-04-19)
purpose: Represents the chart as a single connected graph — every astrological entity a node, every classical relationship an edge. Foundation for Master Signal Register (MSR — Session 12), Cross-Domain Linkage Matrix (CDLM — Session 13), Resonance Map (RM — Session 13), and Unified Chart Narrative (UCN — Sessions 14-17).
source_layer: L1 Facts (v8.0 CURRENT), L2 Mode A (Deep Analysis v1.2.1), L2 Mode B (5 matrices Sessions 7-10)
architecture_ref: §G.4.A Chart Graph Model Build
outputs_feed_to: L2.5 MSR + CDLM + RM + UCN; L3 Domain Reports will traverse CGM for cross-domain linkage
supersedes: CGM_v1_0
---

# CHART GRAPH MODEL — Abhisek Mohanty

## §1 — META AND DESIGN

### §1.1 — Why a graph?

v1.2.1 Deep Analysis produced 15 SIG + 8 CVG + 7 CTR as a **flat curated-by-importance list**. Mode B matrices (Sessions 7-10) produced **systematic coverage tables** (12 houses, 9 planets, 12 signs, 16 Dx, 50 dasha-periods). Neither captures the **relational topology** — how entities connect to form the chart's integrated structure.

The Chart Graph Model represents the chart as a directed multigraph G = (V, E) where:
- **V** = nodes (astrological entities)
- **E** = edges (classical relationships with edge-type labels + optional weights)
- **Subgraphs**: pre-computed domain-filtered views for the 9 life domains (career, wealth, health, relationships, children, spirit, parents, mind, travel)

This enables:
1. **Centrality analysis** — which nodes dominate the chart's connective tissue
2. **Path analysis** — how any two chart entities connect through classical relationships
3. **Cluster detection** — structurally-tight signal groupings (yoga configurations, house-lord chains)
4. **Cross-domain linkage** — which entities span multiple life-domains (feeds CDLM Session 13)
5. **MSR generation** — every edge with strength > threshold generates an MSR signal candidate

### §1.2 — Principles

1. **Every v6.0/v7.0 entity appears as at least one node**. No entity is represented only as an attribute — nodes are first-class.
2. **Every classical relationship-type is represented**. 11 edge types defined in §3.
3. **Edges carry weights** when derivable (§5 weighting formula). Unweighted edges represent existence but not strength.
4. **Subgraphs are views**, not separate graphs — same nodes and edges, filtered by domain-attribute.
5. **Graph is dynamic at dasha level**: some edges activate only during specific dasha periods (see §4.11 Dasha-Activation edges).

### §1.3 — Scope for v2.0

v2.0 corrects four special lagna node positions per FORENSIC_v8_0 §12.1 (JH-authoritative). All position-dependent edges updated. v2.0 focuses on natal (D1) graph with D9/D10 divisional-confirmation overlays. Deeper Dx integration (D12, D27, D60 karma-chains) deferred to v2.1.

**Totals**: 234 nodes, 339 edges (counted in §2 and §4).

---

## §2 — NODE CATALOG (V)

### §2.1 — Planetary nodes (9)

| Node ID | Entity | Sign (D1) | House | Key Attributes |
|---|---|---|---|---|
| `PLN.SUN` | Sun | Capricorn 21°57' | 10 (Rashi) / 11 (Chalit) | Shadbala #1, BK, Atma Sthira, Enemy-sign-in-Cap |
| `PLN.MOON` | Moon | Aquarius 27°02' | 11 / 12 Chalit | AK, Shadbala #3, Uccha-Band-High |
| `PLN.MARS` | Mars | Libra 18°31' | 7 | Shadbala #5, Shuddha-Pinda #1 (198), PK, Avayogi |
| `PLN.MERCURY` | Mercury | Capricorn 00°50' | 10 (Chalit 2.14° from cusp) | **Yogi**, **Vargottama D1=D9 Cap**, DK, current MD |
| `PLN.JUPITER` | Jupiter | Sagittarius 09°48' | 9 | Own sign, Vimsopaka #1, GK, Uccha-Bala-last (CTR.03) |
| `PLN.VENUS` | Venus | Sagittarius 19°10' | 9 | Shadbala #7 weakest (SIG.12), MK, Ishta Devata ruler |
| `PLN.SATURN` | Saturn | Libra 22°27' | 7 | Exalted (max 59.18 Uccha), Shadbala #2, AmK, current AD |
| `PLN.RAHU` | Rahu | Taurus 19°01' | 2 | Exalted classically, Rohini nakshatra |
| `PLN.KETU` | Ketu | Scorpio 19°01' | 8 | Exalted classically, next MD (2027-2034) |

**9 nodes.**

### §2.2 — House nodes (12)

| Node ID | House | Sign | Bhavabala Rank | SAV |
|---|---|---|---|---|
| `HSE.1` | 1 | Aries | 10 | 29 |
| `HSE.2` | 2 | Taurus | 11 | 29 |
| `HSE.3` | 3 | Gemini | 7 | 28 |
| `HSE.4` | 4 | Cancer | 6 | 32 |
| `HSE.5` | 5 | Leo | **2** | 30 |
| `HSE.6` | 6 | Virgo | 8 | 26 |
| `HSE.7` | 7 | Libra | **12** (paradox with SAV 33) | 33 |
| `HSE.8` | 8 | Scorpio | 9 | 33 |
| `HSE.9` | 9 | Sagittarius | 5 | 25 |
| `HSE.10` | 10 | Capricorn | **3** | 26 |
| `HSE.11` | 11 | Aquarius | 4 | 23 |
| `HSE.12` | 12 | Pisces | **1** (paradox with SAV 23) | 23 |

**12 nodes.**

### §2.3 — Sign nodes (12)

`SGN.ARIES`, `SGN.TAURUS`, `SGN.GEMINI`, `SGN.CANCER`, `SGN.LEO`, `SGN.VIRGO`, `SGN.LIBRA`, `SGN.SCORPIO`, `SGN.SAGITTARIUS`, `SGN.CAPRICORN`, `SGN.AQUARIUS`, `SGN.PISCES`

**12 nodes.** (For Aries Lagna, each sign = exactly one house. Sign nodes retain sign-as-sign properties: element, quality, dignity-hosting.)

### §2.4 — Nakshatra nodes (14 — only those occupied by a chart point)

| Node ID | Nakshatra | Occupants |
|---|---|---|
| `NAK.ASHWINI` | Ashwini | Lagna (12°23', Pada 4) |
| `NAK.ROHINI` | Rohini | Rahu (Pada 3) |
| `NAK.MRIGASHIRA` | Mrigashira | Ketu co-occupies Jyeshtha's 16th tara; Dhuma here; **LAG.HORA** (v2.0 corrected: 0°39′ Gemini) |
| `NAK.PUNARVASU` | Punarvasu | (Ketu's 22nd tara from Moon) |
| `NAK.PURVA_PHALGUNI` | Purva Phalguni | — (Vainashika tara from Moon nakshatra) |
| `NAK.UTTARA_PHALGUNI` | Uttara Phalguni | — |
| `NAK.SWATI` | Swati | Mars (Pada 4) |
| `NAK.VISHAKHA` | Vishakha | Saturn (Pada 1); **LAG.SHREE** (v2.0 corrected: 23°19′ Libra, Vishakha Pada 1) |
| `NAK.JYESHTHA` | Jyeshtha | Ketu (Pada 1) |
| `NAK.MOOLA` | Moola | Jupiter (Pada 3) |
| `NAK.PURVA_ASHADHA` | Purva Ashadha | Venus (Pada 2); Upaketu; **LAG.GHATI** (v2.0 corrected: 13°56′ Sagittarius, Pada 1) |
| `NAK.UTTARA_ASHADHA` | Uttara Ashadha | Mercury (Pada 2); Labha Saham |
| `NAK.SHRAVANA` | Shravana | Sun (Pada 4) |
| `NAK.PURVA_BHADRAPADA` | Purva Bhadrapada | **Moon (Pada 3) = Janma Nakshatra** |

| `NAK.PUSHYA` | Pushya | **LAG.VARNADA** (v2.0 corrected: 12°25′ Cancer, Pushya Pada 3) — no planet occupant; added for sensitive-point coverage |

**15 nodes** (v2.0 adds NAK.PUSHYA for LAG.VARNADA coverage).

### §2.5 — Yoga nodes (19)

Yogas detected in chart per Deep Analysis v1.2.1 + v7.0 supplement:

| Node ID | Yoga | Tier | Members (via edges) |
|---|---|---|---|
| `YOG.SASHA_MPY` | Sasha Mahapurusha | Mahapurusha | Saturn (exalted 7H Kendra) |
| `YOG.SARASWATI` | Saraswati | Rajasic (CYSS 91) | Jupiter + Venus + Mercury (kendra/trikona) |
| `YOG.LAKSHMI` | Lakshmi | Dhana (CYSS 77) | Jupiter (9L own) + Venus (9H trikona) |
| `YOG.HIDDEN_RAJA` | Hidden Raja | Raja-class | Mars + Saturn exalted 7H |
| `YOG.ANAPHA` | Anapha | Moon-adjacent | Saturn (12th from Moon in Cap) |
| `YOG.BUDH_ADITYA` | Budh-Aditya | Solar-Mercurial | Sun + Mercury conjunction 10H (NOT combust per §11.4) |
| `YOG.NBRY_VENUS` | D9 NBRY Venus | D9-Redemption | Venus (debil Virgo D9) + Mercury Vargottama dispositor |
| `YOG.NBRY_SATURN` | D9 NBRY Saturn | D9-Redemption | Saturn (debil Aries D9) + Sun (Aries exaltation-ruler in D9 Lagna Cancer) |
| `YOG.D9_12H_STELLIUM` | D9 12H Gemini Stellium | Structural | Moon + Jupiter + Rahu (in D9 Gemini 12H-from-D9-Lagna) |
| `YOG.GEMINI_3H_NEXUS` | Gemini 3H Nexus (CVG.07) | Composite | UL + A5 + A11 + Vivaha Saham + Gulika + Dhuma |
| `YOG.MERCURY_OPERATIONAL_SPINE` | Mercury Operational Spine (CVG.01) | Composite | Vargottama + Yogi + MD + Saraswati + D9 dispositor + Karakamsa |
| `YOG.JUPITER_9L_DHARMA_WEALTH` | Jupiter 9L Dharma-Wealth (CVG.02) | Composite | Jupiter own-sign + Lakshmi + 9L + MPY-near-miss |
| `YOG.MOON_AK_FOREIGN_CHAIN` | Moon AK Foreign Income (CVG.03) | Composite | AK + Chalit-12 + D9-12H-stellium + Karakamsa-house |
| `YOG.10H_CAREER_DENSITY` | 10H Career-Density (CVG.04) | Composite | Sun + Mercury + AL + 7-aspect-from-exalted-Jupiter |
| `YOG.SATURN_QUADRUPLE` | Saturn Quadruple-Activation (CVG.05) | Composite | Saturn 7H exalted + Shadbala + MPY + AD + Yogini |
| `YOG.JUPITER_9H_NEAR_MPY` | Jupiter 9H Near-MPY (CVG.06) | Composite | Jupiter own-sign + Lakshmi + 9L + MPY-near-miss |
| `YOG.ARIES_LIBRA_AXIS` | Aries-Libra Triple-Aspect (CVG.08) | Composite | Mars+Saturn 7th + Jupiter 5th + Bhrigu Bindu + Muntha |
| `YOG.RAHU_JAIMINI_QUADRUPLE` | **Rahu Jaimini Quadruple-Aspect (SIG.16 candidate)** | Proposed | Rahu → Sun+Mercury+Mars+Saturn via Jaimini sign-aspect |
| `YOG.TRIPLE_EXALTED_NODAL` | **Triple-Exalted-Nodal-Axis (SIG.23 candidate)** | Proposed | Saturn (Libra) + Rahu (Taurus) + Ketu (Scorpio) all exalted |

**19 nodes.** (13 from v1.2.1 + 6 new candidates from Sessions 6-10.)

### §2.6 — Karaka nodes (16)

Chara Karakas (Jaimini):
- `KRK.C.AK` = Atmakaraka (Moon)
- `KRK.C.AMK` = Amatyakaraka (Saturn)
- `KRK.C.BK` = Bhratrukaraka (Sun)
- `KRK.C.MK` = Matrukaraka (Venus)
- `KRK.C.PK` = Putrakaraka (Mars)
- `KRK.C.DK` = Darakaraka (Mercury)
- `KRK.C.GK` = Gnatikaraka (Jupiter)

Sthira Karakas (Parashari Fixed):
- `KRK.S.ATMA` = Sun
- `KRK.S.MATRU` = Moon
- `KRK.S.BHRATRU` = Mars
- `KRK.S.AMATYA` = Mercury
- `KRK.S.PUTRA` = Jupiter
- `KRK.S.DARA` = Venus
- `KRK.S.GNATI` = Saturn
- `KRK.S.PITRI` = Sun (implicit — father karaka)
- `KRK.S.VAHANA` = Venus (vehicle)

**16 nodes.**

### §2.7 — Divisional placement nodes (80, per planet × Dx)

Enumerated systematically: 9 planets × 16 Dx + 16 Dx Lagnas = 144 + 16 = 160 Dx placements. For CGM node count, we include the 16 Dx Lagnas + Vargottama explicit (Mercury D1=D9) + ~60 "of-interest" placements (yoga members in specific Dxs).

For v1.0, 80 Dx nodes included; full 160 expansion in v1.1.

**80 nodes.**

### §2.8 — Dasha-lord nodes (30)

Lifetime Vimshottari MD lords (7 unique) + AD combinations (key 20 AD instances) + Yogini phases (8 unique) + Chara lifetime (first 4 MD signs)

**30 nodes.**

### §2.9 — Sensitive points + Arudhas + Upagrahas + Sahams + Lagnas (30)

| Category | Node IDs | Count |
|---|---|---|
| Upagrahas (v6.0 §11.1) | `UPG.GULIKA`, `UPG.MANDI`, `UPG.YAMAGHANTAKA`, `UPG.ARDHAPRAHARA`, `UPG.DHUMA`, `UPG.VYATIPATA`, `UPG.PARIVESHA`, `UPG.INDRACHAPA`, `UPG.UPAKETU` | 9 |
| Arudhas | `ARD.AL`, `ARD.A2`, `ARD.A3`, `ARD.A4`, `ARD.A5`, `ARD.A6`, `ARD.A7`, `ARD.A8`, `ARD.A9`, `ARD.A10`, `ARD.A11`, `ARD.UL` | 12 |
| Special Lagnas | `LAG.BHAVA` (Aries 1H), `LAG.HORA` (Gemini 3H Mrigashira — **v2.0 corrected**), `LAG.GHATI` (Sagittarius 9H Purva Ashadha — **v2.0 corrected**), `LAG.INDU` (Scorpio 8H), `LAG.SHREE` (Libra 7H Vishakha — **v2.0 corrected**), `LAG.VARNADA` (Cancer 4H Pushya — **v2.0 corrected**), `LAG.PRANAPADA` (Pisces 12H), `LAG.VIGHATI` (Leo 5H Purva Phalguni — v8.0 new) | 8 (v6.0 + v7.0 + v8.0 new: VIGHATI) |
| Saham — key 10 of 23 | `SAH.PUNYA`, `SAH.RAJYA`, `SAH.KARMA`, `SAH.LABHA`, `SAH.VIVAHA`, `SAH.PUTRA`, `SAH.PITRI`, `SAH.MATRI`, `SAH.VYAPARA`, `SAH.PARADESA` | 10 (subset) |
| Bhrigu Bindu + Yogi/Avayogi + Mrityu-Bhaga refs | `BB.NATAL`, `YOG.POINT`, `AVY.POINT`, misc | 4 |

**42 nodes** (revised from 30 after inventory — architecture target was "~20-30 sensitive points" but full enumeration gives 42).

### §2.10 — Total nodes

| Category | Count |
|---|---|
| Planets | 9 |
| Houses | 12 |
| Signs | 12 |
| Nakshatras (occupied) | 14 |
| Yogas | 19 |
| Karakas | 16 |
| Divisional placements (selected) | 80 |
| Dasha-lord nodes | 30 |
| Sensitive points + arudhas + lagnas + sahams | 42 |
| **TOTAL** | **234 nodes** |

(Slightly above architecture target 200-220; acceptable.)

---

## §3 — EDGE TYPE CATALOG

11 edge types with classical definitions:

### §3.1 — EDGE.DISP (Dispositorship)

**Rule**: Planet A's dispositor = lord of sign A occupies. Directed edge A → dispositor.

**Count**: 9 edges (one per planet).

### §3.2 — EDGE.GRAHA_ASPECT (Vedic Graha Drishti)

**Rule**: Every planet aspects 7th-from-itself. Mars additionally 4th+8th. Jupiter 5th+9th. Saturn 3rd+10th. Rahu/Ketu 5/7/9 (Jupiter-like convention in v6.0).

**Count**: ~25-30 significant aspects above intensity threshold (v6.0 §16.1).

### §3.3 — EDGE.BHAV_ASPECT (Planet-to-House, Bhav-Madhya)

**Rule**: Same as Graha but targeted at house-cusps (v6.0 §16.3).

**Count**: ~30 edges (9 planets × ~3.5 average house targets).

### §3.4 — EDGE.JAIMINI_ASPECT (Rashi Drishti)

**Rule**: Movable aspects fixed ex-adjacent; fixed aspects movable ex-adjacent; dual aspects other duals. 12×12 = 144 cells; ~72 non-zero edges in matrix (from CGP audit §3.3).

**Applied to chart**: Sign-to-sign aspect activates when the aspecting sign has tenants.

**Count**: ~36 active Jaimini edges for this chart (where source sign is occupied).

### §3.5 — EDGE.OWNERSHIP (Planet owns House)

**Rule**: Each house-sign has a lord. Directed edge planet → house-owned.

**Count**: 9 edges (7 classical planets + Rahu/Ketu as secondary lords = up to 12 if modern school). For strict classical: 9 edges (Sun-Leo, Moon-Cancer, Mars-Aries+Scorpio, Mercury-Gemini+Virgo, Jupiter-Sagittarius+Pisces, Venus-Taurus+Libra, Saturn-Capricorn+Aquarius).

Actually for Aries Lagna specifically:
- H1 Aries → Mars
- H2 Taurus → Venus
- H3 Gemini → Mercury
- H4 Cancer → Moon
- H5 Leo → Sun
- H6 Virgo → Mercury (shared with H3)
- H7 Libra → Venus (shared with H2)
- H8 Scorpio → Mars (shared with H1) + Ketu (modern)
- H9 Sagittarius → Jupiter
- H10 Capricorn → Saturn
- H11 Aquarius → Saturn (shared with H10) + Rahu (modern)
- H12 Pisces → Jupiter (shared with H9)

**Count**: 12 edges (each house to its sign lord).

### §3.6 — EDGE.TENANCY (Planet in House)

**Rule**: Physical planet-in-house placement. Directed edge planet → house-occupied.

**Count**: 9 edges (one per planet, to its Rashi house).

### §3.7 — EDGE.EXALT_DEBIL_AFFINITY (Dignity host)

**Rule**: Sign X exalts/debilitates planet Y. Directed edge planet → exaltation-sign (positive) or debilitation-sign (negative).

**Count**: 18 edges (9 planets × 2 [exalt + debil]).

### §3.8 — EDGE.NAK_LORDSHIP (Nakshatra-ruler)

**Rule**: Each of 27 nakshatras has a ruling planet (Vimshottari lordship). Directed edge nakshatra → ruler.

**Count**: 14 edges (only for occupied nakshatras in this chart).

### §3.9 — EDGE.KARAKA_ROLE (Karaka ↔ Planet)

**Rule**: Each Karaka role (Chara or Sthira) is HELD BY a planet. Directed edge karaka → planet.

**Count**: 16 edges (7 Chara + 9 Sthira roles = 16).

### §3.10 — EDGE.YOGA_MEMBERSHIP (Planet-Yoga)

**Rule**: Planet A is a MEMBER OF yoga Y. Directed edge yoga → planet.

**Count**: ~60 edges (yoga × members across 19 yogas).

### §3.11 — EDGE.DASHA_ACTIVATION (Dasha-lord role)

**Rule**: Planet A is the lord of dasha period X in dasha system Y. Directed edge dasha-period → lord-planet.

**Count**: Large — 50 Vimshottari + 17 Yogini + lifetime Chara cycles = ~120 activation edges. For v1.0 CGM: 30 representative (key MD/AD periods).

### §3.12 — EDGE.DIVISIONAL_CONFIRMATION (Dx ↔ D1 cross-validation)

**Rule**: When a planet's Dx placement mirrors or reinforces D1 placement (Vargottama, own-sign, exaltation in both). Directed edge between divisional-placement-node and D1-planet-node.

**Count**: ~15 edges (including the prominent Mercury Vargottama D1=D9).

### §3.13 — EDGE.COMBUST / EDGE.WAR (Physical proximity)

**Rule**: v6.0 §11.4 — Sun-proximity combustion (by planet-specific orbs); planet-war (conjunction <1°).

**For this chart**: CMB check shows NO COMBUST, NO WAR per v6.0 §11.4. So **0 active edges** in this category. Structural finding: absence of these edge types is itself significant (Budh-Aditya not compromised; Mars-Saturn 7H conjunction at 3°56' NOT a war).

### §3.14 — EDGE.KAKSHYA_ZONE_RULERSHIP (Saturn-specific)

**Rule**: Saturn's Kakshya zones per sign each have a ruling planet (v6.0 §8).

**Count**: 96 edges potential (12 signs × 8 zones each); for CGM v1.0 include only active zone during current transit: **Pisces Kakshya zones** (8 zones × 1 sign = 8 edges).

### §3.15 — EDGE.SAHAM_COMPOSITION (Saham → component planets)

**Rule**: Each Saham has a formula involving 2-3 planets + Lagna. Directed edges from saham node to component planet nodes.

**Count**: 23 Sahams × ~2.5 components avg = ~55 edges.

### §3.16 — Total edges

| Edge type | Count |
|---|---|
| DISP | 9 |
| GRAHA_ASPECT | 27 |
| BHAV_ASPECT | 30 |
| JAIMINI_ASPECT | 36 |
| OWNERSHIP | 12 |
| TENANCY | 9 |
| EXALT_DEBIL_AFFINITY | 18 |
| NAK_LORDSHIP | 14 |
| KARAKA_ROLE | 16 |
| YOGA_MEMBERSHIP | 60 |
| DASHA_ACTIVATION | 30 |
| DIVISIONAL_CONFIRMATION | 15 |
| COMBUST/WAR | 0 (absence signal) |
| KAKSHYA_ZONE | 8 (current Pisces only; v1.1 expand) |
| SAHAM_COMPOSITION | 55 |
| **TOTAL v1.0** | **339 edges** |

(Lower than architecture target 800-1,200 due to v1.0 scope-constraint on divisional and dasha edges. v1.1 will expand to ~900 edges.)

---

## §4 — EDGE INVENTORY (selected high-weight samples)

### §4.1 — Dispositorship (9 edges)

```
PLN.SUN → PLN.SATURN  (Sun in Capricorn, Saturn rules Capricorn; Sun in enemy's dispositor)
PLN.MOON → PLN.SATURN (Moon in Aquarius, Saturn rules Aquarius)
PLN.MARS → PLN.VENUS  (Mars in Libra, Venus rules Libra — Mars in partnership sign ruled by partner-karaka)
PLN.MERCURY → PLN.SATURN (Mercury in Capricorn, Saturn rules)
PLN.JUPITER → PLN.JUPITER (own sign Sagittarius — self-dispositorship)
PLN.VENUS → PLN.JUPITER (Venus in Sagittarius, Jupiter rules)
PLN.SATURN → PLN.VENUS (Saturn in Libra, Venus rules — Saturn-Venus mutual reception-like)
PLN.RAHU → PLN.VENUS (Rahu in Taurus, Venus rules)
PLN.KETU → PLN.MARS (Ketu in Scorpio, Mars rules)
```

**Observation**: **3 planets disposit to Saturn** (Sun, Moon, Mercury) and **3 planets disposit to Venus** (Mars, Saturn, Rahu). Saturn + Venus are the chart's **dispositor hubs** — everything routes through them. Saturn-Venus have mutual reception-like (Saturn in Venus's Libra; Venus in Saturn's... wait, Venus is in Sagittarius, not Capricorn; so not strict mutual reception, but Saturn-dispositors-to-Venus while Venus-disposits-to-Jupiter).

### §4.2 — Ownership (12 edges)

```
HSE.1 → PLN.MARS
HSE.2 → PLN.VENUS
HSE.3 → PLN.MERCURY
HSE.4 → PLN.MOON
HSE.5 → PLN.SUN
HSE.6 → PLN.MERCURY
HSE.7 → PLN.VENUS
HSE.8 → PLN.MARS (+ PLN.KETU modern)
HSE.9 → PLN.JUPITER
HSE.10 → PLN.SATURN
HSE.11 → PLN.SATURN (+ PLN.RAHU modern)
HSE.12 → PLN.JUPITER
```

**Observation**: Saturn owns 2 houses (10+11 = career+gains). Venus owns 2 (2+7 = family+partnership — both structural-weakness houses per Bhavabala ranks 11, 12). Mars owns 2 (1+8). Mercury owns 2 (3+6). Jupiter owns 2 (9+12). Sun and Moon each own 1. Double lordship = double responsibility.

### §4.3 — Yoga membership (60 edges — top selections)

```
YOG.SASHA_MPY → PLN.SATURN
YOG.SARASWATI → PLN.JUPITER, PLN.VENUS, PLN.MERCURY
YOG.LAKSHMI → PLN.JUPITER, PLN.VENUS
YOG.HIDDEN_RAJA → PLN.MARS, PLN.SATURN
YOG.ANAPHA → PLN.SATURN (12th from Moon position signal)
YOG.BUDH_ADITYA → PLN.SUN, PLN.MERCURY
YOG.NBRY_VENUS → PLN.VENUS, PLN.MERCURY (cancellation via Vargottama)
YOG.NBRY_SATURN → PLN.SATURN, PLN.SUN (cancellation via exaltation ruler in D9 Lagna)
YOG.D9_12H_STELLIUM → PLN.MOON, PLN.JUPITER, PLN.RAHU
YOG.MERCURY_OPERATIONAL_SPINE → PLN.MERCURY, PLN.JUPITER, PLN.VENUS (CVG.01 composite)
YOG.JUPITER_9L_DHARMA_WEALTH → PLN.JUPITER, PLN.VENUS (CVG.02)
YOG.MOON_AK_FOREIGN_CHAIN → PLN.MOON, PLN.JUPITER, PLN.RAHU, PLN.MERCURY (dispositor)
YOG.10H_CAREER_DENSITY → PLN.SUN, PLN.MERCURY, HSE.10, ARD.AL, PLN.JUPITER (aspect)
YOG.SATURN_QUADRUPLE → PLN.SATURN (multi-attribute convergence on single planet)
YOG.ARIES_LIBRA_AXIS → PLN.MARS, PLN.SATURN, PLN.JUPITER, BB.NATAL
YOG.RAHU_JAIMINI_QUADRUPLE → PLN.RAHU, PLN.SUN, PLN.MERCURY, PLN.MARS, PLN.SATURN
YOG.TRIPLE_EXALTED_NODAL → PLN.SATURN, PLN.RAHU, PLN.KETU
```

**Observation**: Planets by yoga-membership count:
1. **Saturn** — 6 yogas (Sasha, Hidden Raja, Anapha, NBRY Saturn, Quadruple, Aries-Libra, Triple-exalted) = MOST yoga-dense
2. **Mercury** — 5 yogas (Saraswati, Budh-Aditya, NBRY Venus, Operational Spine, 10H Density)
3. **Jupiter** — 5 yogas (Saraswati, Lakshmi, D9 12H stellium, Dharma-Wealth, Operational Spine)
4. **Venus** — 4 yogas (Saraswati, Lakshmi, NBRY Venus, Dharma-Wealth)
5. **Rahu** — 3 yogas (D9 12H stellium, Jaimini Quadruple, Triple-exalted)

Saturn's 6-yoga membership is unusual and validates CVG.05 quadruple-activation. Mercury+Jupiter+Venus form the Saraswati-Lakshmi triple-core.

### §4.4 — Sensitive-point edges (key selections)

```
BB.NATAL (Libra 8°04') → HSE.7 (tenancy) → YOG.ARIES_LIBRA_AXIS (via composition)
LAG.BHAVA (Aries 14°23') → HSE.1 (sign-house match for Aries Lagna)
LAG.HORA (Gemini 0°39′ Mrigashira) → HSE.3 (v2.0 CORRECTED from 7H Libra; dispositor: PLN.MERCURY; Mercury rules Gemini+3H = communication-skill emphasis)
LAG.HORA → NAK.MRIGASHIRA (v2.0: nakshatra placement established)
LAG.HORA → PLN.MERCURY (v2.0: dispositor updated from Venus to Mercury)
LAG.GHATI (Sagittarius 13°56′ Purva Ashadha) → HSE.9 (v2.0 CORRECTED from 8H Scorpio; dispositor: PLN.JUPITER; Ghati-in-9H = authority through dharmic mastery)
LAG.GHATI → NAK.PURVA_ASHADHA (v2.0: nakshatra placement established)
LAG.GHATI → PLN.JUPITER (v2.0: dispositor updated from Mars to Jupiter)
LAG.VARNADA (Cancer 12°25′ Pushya) → HSE.4 (v2.0 CORRECTED from 8H Scorpio; dispositor: PLN.MOON; Varnada-in-4H = fulfillment through emotional depth)
LAG.VARNADA → NAK.PUSHYA (v2.0: nakshatra placement established)
LAG.VARNADA → PLN.MOON (v2.0: dispositor updated from Mars to Moon)
LAG.SHREE (Libra 23°19′ Vishakha Pada 1) → HSE.7 (v2.0 CORRECTED from 9H Sagittarius; dispositor: PLN.VENUS; Shree Lagna co-tenant with Saturn in 7H)
LAG.SHREE → NAK.VISHAKHA (v2.0: Vishakha-ruled Shree Lagna; nakshatra lord Jupiter adds dharmic overlay to Libra 7H prosperity)
LAG.SHREE → PLN.VENUS (v2.0: dispositor updated from Jupiter to Venus)
LAG.SHREE → PLN.JUPITER (v2.0: secondary edge via Vishakha nakshatra lordship — Jupiter rules Vishakha)
LAG.PRANAPADA (Pisces 28°27') → HSE.12 (moksha-activation; v7.0 addition)
ARD.AL → HSE.10 (karma-arudha in 10H — chart's identity projects as career)
ARD.UL → HSE.3 (spouse-arudha in Gemini = nexus per CVG.07)
UPG.GULIKA → HSE.3 (Gulika in Gemini = shadow in nexus)
UPG.VYATIPATA → HSE.10 (Vyatipata conjunct Sun in Cap — per v6.0 §11.1)
```

### §4.5 — Saham composition edges (samples)

```
SAH.PUNYA (Taurus 17°28') ← PLN.MOON + PLN.SUN + HSE.1 (formula: Moon - Sun + Asc)
SAH.VIVAHA (Gemini 09°07') ← PLN.VENUS + PLN.SATURN + HSE.1 (Venus - Saturn + Asc)
SAH.LABHA (Sag 28°44') ← PLN.SATURN (as 11L) + HSE.11 + HSE.1
SAH.PUTRA (Capricorn 25°09') ← PLN.JUPITER + PLN.MOON + HSE.1
SAH.PITRI (v7.0) ← PLN.SATURN + PLN.SUN + HSE.1
SAH.PARADESA (v7.0) ← HSE.9 + PLN.JUPITER (9L) + HSE.1
SAH.VYAPARA (v7.0) ← PLN.MARS + PLN.SUN + HSE.1
```

Saham edges map the sensitive-point architecture back to natal planets. Most sahams involve Moon/Sun/Saturn/Jupiter/Lagna — the "big 5" nodes of Saham composition.

---

## §5 — EDGE WEIGHTING FORMULA

For edges where weight is derivable, use:

### §5.1 — Aspect edge weight

```
weight(aspect from P1 to P2) = virupa_aspect_strength(P1 → P2) / 60
```

Where virupa_aspect_strength per v7.0 §V7.G. Range [0, 1].

### §5.2 — Ownership edge weight

```
weight(house → lord) = bhavabala_rank_normalized(house) × shadbala_normalized(lord)
```

Bhavabala rank 1 = 1.0; rank 12 = 1/12 = 0.083. Shadbala normalized = rupas / max.

### §5.3 — Yoga membership weight

```
weight(yoga → member-planet) = CYSS_score / 100  (where available)
                             | 0.5 (default for yogas without CYSS)
```

CYSS scores: Saraswati 91, Lakshmi 77. Others TBD per Deep Analysis v2.0.

### §5.4 — Dispositor edge weight

```
weight(planet → dispositor) = 1.0 (structural, always full)
  but modulated by: dispositor's Shadbala / max Shadbala
```

### §5.5 — Dignity-affinity weight

```
weight(planet → exalt_sign) = +1.0 (structural positive signal)
weight(planet → debil_sign) = -1.0 (structural negative signal)
```

### §5.6 — Summary

Edge weights in v1.0 are SPECIFIED BUT NOT COMPUTED for every edge — v1.1 will compute weights across all 339 edges and store as separate tab.

---

## §6 — DOMAIN SUBGRAPHS (9 views)

### §6.1 — Career subgraph

**Nodes**:
- `HSE.10`, `HSE.6`, `HSE.2` (primary career/effort/wealth houses)
- `HSE.1` (self, Lagna), `HSE.11` (gains)
- `PLN.SUN` (10H tenant, BK, 5L), `PLN.MERCURY` (10H tenant, 3L/6L, Yogi, MD lord), `PLN.SATURN` (10L + 11L, 7H exalted, AD lord)
- `PLN.JUPITER` (9L → dharmic-career), `PLN.MARS` (Lagna lord → career energy)
- `ARD.AL` (karma-arudha at HSE.10)
- `YOG.10H_CAREER_DENSITY`, `YOG.SARASWATI`, `YOG.LAKSHMI`, `YOG.BUDH_ADITYA`, `YOG.SASHA_MPY` (career-dharma-wealth yoga cluster)
- `YOG.RAHU_JAIMINI_QUADRUPLE` (new — Rahu-aspects 10H stellium at Jaimini)
- Dasha lords Mercury MD, Saturn AD, Ketu upcoming MD

**Size**: ~35 nodes, ~100 edges

### §6.2 — Wealth subgraph

**Nodes**: `HSE.2`, `HSE.11`, `HSE.9` (dhana houses) + `PLN.RAHU` (2H tenant, SIG.10) + `PLN.VENUS` (2L + 7L) + `PLN.JUPITER` (9L Lakshmi) + `YOG.LAKSHMI` + `YOG.JUPITER_9L_DHARMA_WEALTH` + `SAH.PUNYA`, `SAH.LABHA`, `SAH.VYAPARA`, `SAH.ARTHA`
**Size**: ~25 nodes, ~60 edges

### §6.3 — Health subgraph

**Nodes**: `HSE.1` (body), `HSE.6` (disease), `HSE.8` (crisis/surgery), `HSE.12` (hospitalization) + `PLN.MARS` (Lagna lord, Avayogi), `PLN.SATURN` (chronic), `PLN.KETU` (sudden) + `UPG.GULIKA`, `UPG.MANDI` (shadow-health) + `SAH.ROGA`, `SAH.MRITYU`
**Size**: ~20 nodes, ~45 edges

### §6.4 — Relationships subgraph

**Nodes**: `HSE.7` (primary partnership), `HSE.2` (family), `HSE.11` (friendships), `HSE.5` (romance), `HSE.12` (hidden relationships) + `PLN.MARS+SATURN` 7H + `PLN.VENUS` (7L, DK Chara via Mercury; DK-karaka) + `PLN.MERCURY` (DK) + `ARD.UL` (spouse) + `ARD.A7` + `YOG.SASHA_MPY`, `YOG.HIDDEN_RAJA`, `YOG.ARIES_LIBRA_AXIS` + `YOG.GEMINI_3H_NEXUS` (UL+A5+A11 cluster) + `SAH.VIVAHA`
**Size**: ~30 nodes, ~80 edges

### §6.5 — Children subgraph

**Nodes**: `HSE.5` (primary children), `PLN.JUPITER` (Putra karaka), `PLN.MARS` (PK Chara), `ARD.A5` (in Gemini nexus) + `SAH.PUTRA` + D7 reference nodes + Ketu-5H-effect (Ketu in 8H natally, not 5H, but aspects 5H via certain rules)
**Size**: ~15 nodes, ~30 edges

### §6.6 — Spiritual subgraph

**Nodes**: `HSE.12` (moksha), `HSE.9` (dharma), `HSE.8` (occult/moksha-secondary) + `PLN.JUPITER` (9L, Dharma-karaka) + `PLN.KETU` (moksha karaka, next MD) + `PLN.MOON` (AK) + D20 Vimsamsa references + `YOG.LAKSHMI` (dharma-wealth overlap) + CTR.02 (Dharma Devata Venkateshwara) + `SAH.PUNYA`
**Size**: ~20 nodes, ~45 edges

### §6.7 — Parents subgraph

**Nodes**: `HSE.9` (father), `HSE.4` (mother) + `PLN.JUPITER` (Sthira Putra = progeny, but also 9L = father ruler) + `PLN.SUN` (Sthira Atma/Pitri) + `PLN.MOON` (Sthira Matru) + `PLN.VENUS` (MK Chara = mother) + CTR.03 (Jupiter-weak father chain) + D12 reference nodes + `SAH.PITRI`, `SAH.MATRI`
**Size**: ~18 nodes, ~40 edges

### §6.8 — Mind subgraph

**Nodes**: `PLN.MOON` (primary mind-karaka, AK), `HSE.4` (home of mind), `HSE.3` (mental-effort) + `PLN.MERCURY` (intellect) + `YOG.SARASWATI` (intellectual-yoga) + SIG.06 D9 12H stellium (soul-emotional dispersion) + Sade Sati states (mental-pressure register) + Bhramari/Mars Yogini (panic episode signal) + `UPG.GULIKA`, `UPG.MANDI` (shadow-mental)
**Size**: ~20 nodes, ~50 edges

### §6.9 — Travel/Foreign subgraph

**Nodes**: `HSE.12` (foreign long-stay), `HSE.9` (foreign education/dharma) + `HSE.3` (short travel) + `PLN.MOON` (Chalit-12, CVG.03 foreign chain) + `PLN.RAHU` (foreign amplification) + `PLN.KETU` (8H crossings) + `SGN.PISCES` (12H sign) + D9 12H Gemini stellium + `SAH.PARADESA` + Moon-foreign-chain CVG.03
**Size**: ~15 nodes, ~35 edges

### §6.10 — Subgraph overlap (domain-coupling)

| Nodes appearing in 4+ subgraphs | Indicates cross-domain hub |
|---|---|
| PLN.MERCURY | career, wealth, health (6H lord), relationships (DK), spiritual (sort-of), mind | 5 domains |
| PLN.SATURN | career, wealth (Anapha-gains), relationships, spiritual (AmK), parents (indirect) | 5 domains |
| PLN.JUPITER | career (9L dharmic), wealth (Lakshmi), spiritual (9L dharma), parents (Putra/9L), children (natural) | 5 domains |
| HSE.7 | relationships (primary), career (via Saturn 10L here), wealth (Venus 2L/7L both in 7H-lord-chain), spiritual (via Mars-Saturn as karma-delivery) | 4 domains |
| HSE.10 | career (primary), wealth (Sun+Mercury-on-10H stellium, Saturn 10L exalted 7H), parents (Sun = Pitri karaka tenant), public-life | 4 domains |

**Top cross-domain hub nodes**: Mercury, Saturn, Jupiter, HSE.7, HSE.10. These 5 nodes will receive most MSR signal-weight and most CDLM cell-contribution.

---

## §7 — CENTRALITY ANALYSIS

### §7.1 — In-degree centrality (most-referenced nodes)

Top 10 nodes by how many edges point TO them:

| Rank | Node | In-degree | Why |
|---|---|---|---|
| 1 | PLN.SATURN | 24+ | 3 dispositors, 6 yoga memberships, multiple aspects, AD lord, AmK, 10L+11L |
| 2 | PLN.MERCURY | 22+ | 3 dispositors to it, MD lord, Yogi, 5 yogas, Vargottama anchor |
| 3 | PLN.JUPITER | 20+ | 2 dispositors, 5 yogas, 9L-own-sign, D9 12H stellium member, GK |
| 4 | PLN.VENUS | 18+ | 3 dispositors, 4 yogas, 2L+7L double-lord, MK |
| 5 | PLN.MOON | 16+ | AK, Chalit-12, D9 12H stellium, Sade Sati Peak-sign, 4L |
| 6 | HSE.10 | 15+ | 2 planets + AL + SAV-32 + yoga 10H density + transit target |
| 7 | HSE.7 | 14+ | 2 planets + Sasha MPY + Hidden Raja + Bhrigu Bindu + SAV 33 |
| 8 | PLN.SUN | 13+ | 10H tenant + BK + Sthira Atma + 5L + NBRY-cancellation agent |
| 9 | PLN.MARS | 12+ | Lagna lord + 7H tenant + PK + Avayogi |
| 10 | HSE.9 | 11+ | Jupiter+Venus tenants + Lakshmi yoga + 3 yoga memberships |

**Observation**: **Saturn is the chart's single most-connected node** by in-degree. This validates CVG.05 Saturn quadruple-activation + the Mercury-Saturn AD's structural dominance in current window. Mercury close second = Mercury operational spine.

### §7.2 — Betweenness centrality (bridging nodes)

Nodes that frequently lie on shortest paths between other nodes:

1. **PLN.MERCURY** (highest — Mercury is dispositor of most other planets' stellium anchors, D9 dispositor, Yogi)
2. **PLN.VENUS** (bridge between 2H/7H + 9H + Sag-Gemini UL axis)
3. **HSE.7** (bridge between Lagna-axis + 2H-9H wealth-axis + yogas)
4. **PLN.JUPITER** (9L bridge for multiple yogas)
5. **YOG.GEMINI_3H_NEXUS** (aggregates UL+A5+A11+Vivaha — routes relational queries)

### §7.3 — Isolated or low-degree nodes (minor structural role)

- Some nakshatras occupied only by minor upagrahas (Mrigashira, Punarvasu as Vainashika)
- Some arudhas with no planet co-location (A3 in Leo)
- Some specialty lagnas with peripheral usage (Varnada, Pranapada)
- Some Dx placements that don't reinforce major yogas

These contribute minimally to signal-density but remain in graph for completeness.

---

## §8 — RED-TEAM CHECK

- **Completeness**: 234 nodes + 339 edges enumerated. Below architecture target of 200-220 nodes / 800-1200 edges on edge count due to v1.0 scope-constraint (divisional confirmation + saham composition limited to ~15 + 55 respectively). v1.1 expands to ~900 edges.
- **Over-claim**: Centrality rankings qualitative (in-degree counts approximate). Formal betweenness requires algorithmic computation not performed in v1.0; ranked by structural-intuition from edge catalog.
- **Bias**: Yoga-membership count reflects v1.2.1 + 16 new candidates — some double-counting possible if composite yogas overlap (e.g., CVG.01 Mercury Operational Spine includes Saraswati member = could over-count Mercury's yoga count slightly).
- **Missing**: D60 past-karma edges not in v1.0 (RPT.DVS.02 references but full D60 node-edge expansion in v1.1). Dasha-sub-period edges (PD/SD) not included.
- **Sun-dignity correction**: Sun node attribute corrected post Session 10b — "Enemy-sign-in-Cap" not "debilitated." Graph integrity maintained.

---

## §9 — OUTPUT FEED TO L2.5 DOWNSTREAM

### §9.1 — Master Signal Register (MSR — Session 12)

Every edge with weight above threshold OR involving yoga-membership OR involving sensitive-point = candidate MSR signal. Estimate: 200-300 candidate signals from 339 edges + 19 yogas + 42 sensitive-points. MSR target 500-600 requires additional signal-types (transit-windowed signals, compound-signals, etc.) to reach target.

### §9.2 — Cross-Domain Linkage Matrix (CDLM — Session 13)

Domain subgraph overlap (§6.10) directly feeds CDLM. Top cross-domain hub nodes (Mercury, Saturn, Jupiter, HSE.7, HSE.10) drive the highest-weighted CDLM cells.

### §9.3 — Resonance Map (RM — Session 13)

Major chart elements identified via centrality (§7.1) are RM candidates. Top-10 in-degree nodes = RM entry subjects. For each, traverse CGM to find constructive/destructive resonance.

### §9.4 — Unified Chart Narrative (UCN — Sessions 14-17)

CGM provides the **structural spine**. Each UCN Part maps to subgraphs:
- UCN Part I "Fundamental Architecture" ← HSE.10 + PLN.MERCURY + PLN.SATURN + PLN.JUPITER centrality cluster
- UCN Part II "Soul-Trajectory" ← PLN.MOON (AK) + D9 subgraph + Karakamsa
- UCN Part III "Mind-Body" ← Mind subgraph + Health subgraph
- UCN Part IV "Dharmic-Material Engine" ← Wealth subgraph + Career subgraph + YOG.SARASWATI + YOG.LAKSHMI
- UCN Part V "Relational Web" ← Relationships subgraph
- UCN Part VI "Foreign/Moksha" ← Travel subgraph + Spiritual subgraph + HSE.12
- UCN Part VII "Authority-Through-Tension" ← HSE.7 + SIG.01 + SIG.15 + CTR.01
- UCN Part VIII "Timing Metaphysics" ← Dasha-activation edges + Mercury MD + Saturn AD
- UCN Part IX "Contradictions" ← CTR.01-07 edges
- UCN Part X "Operating Instructions" ← Aggregate insight from all subgraphs

---

## §10 — CHANGELOG

```yaml
v2.0 (2026-04-19, GAP_RESOLUTION_SESSION):
  - Node corrections per FORENSIC_v8_0 §12.1 (JH authoritative):
      LAG.HORA: 7H Libra (Libra 10°11′) → 3H Gemini (0°39′ Mrigashira); dispositor: Venus → Mercury
      LAG.GHATI: 8H Scorpio (6°53′) → 9H Sagittarius (13°56′ Purva Ashadha); dispositor: Mars → Jupiter
      LAG.VARNADA: 8H Scorpio → 4H Cancer (12°25′ Pushya); dispositor: Mars → Moon
      LAG.SHREE: 9H Sagittarius (24°15′) → 7H Libra (23°19′ Vishakha Pada 1); dispositor: Jupiter → Venus
  - All position-dependent edges in §4.4 updated to new house/sign/nakshatra/dispositor
  - New dispositor edges added: HORA→Mercury, GHATI→Jupiter, VARNADA→Moon, SHREE→Venus
  - New nakshatra edges added: HORA→Mrigashira, GHATI→Purva Ashadha, VARNADA→Pushya, SHREE→Vishakha
  - Secondary SHREE→Jupiter edge added (Vishakha nakshatra lord)
  - NAK.PUSHYA added to node catalog (§2.4) for LAG.VARNADA coverage (15 nakshatra nodes)
  - LAG.VIGHATI added to §2.9 (v8.0 new node from §12.1)
  - §2.9 Special Lagnas count updated: 7 → 8
  - Status: CURRENT; CGM_v1_0 SUPERSEDED
  - Source: FORENSIC_ASTROLOGICAL_DATA_v8_0.md §12.1

v1.0 (2026-04-17, Session 11 — first L2.5 artifact):
  - Initial Chart Graph Model: 234 nodes + 339 edges
  - 11 edge types defined with classical rules
  - 9 domain subgraphs specified with size and top nodes
  - Centrality analysis (in-degree ranking) — Saturn #1, Mercury #2, Jupiter #3
  - Design for weighting formula (computation deferred to v1.1)
  - Sun-dignity correction from Session 10b reflected
  - Status: SUPERSEDED by CGM_v2_0

# Future:
v2.1 (planned — after MSR + CDLM Sessions 12-13):
  - Expand to ~900 edges (divisional-confirmation full, saham composition full, dasha sub-periods)
  - Compute edge weights across all edges per §5 formula
  - Add betweenness centrality via algorithmic traversal
  - Add D60 past-karma edge layer
  - Promote tentative SIG.16-31 to full yoga nodes after Deep Analysis v2.0 review
  - Integrate LAG.VIGHATI edges (v8.0 new lagna)
```

**END OF CHART GRAPH MODEL v2.0 — special lagna node + edge corrections applied per FORENSIC_v8_0 §12.1.**
