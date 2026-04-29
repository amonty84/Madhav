--
-- PostgreSQL database dump
--

\restrict JEfzwHlwdjFV2lzhnsg2Z2FNA4y5rScp3D1dEZOn9RanS24427OladjmoP5aoqK

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: build_manifests; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.build_manifests (
    build_id text NOT NULL,
    triggered_at timestamp with time zone DEFAULT now() NOT NULL,
    triggered_by text NOT NULL,
    registry_fingerprint text NOT NULL,
    pipeline_image_uri text NOT NULL,
    embedding_model text NOT NULL,
    embedding_dim integer NOT NULL,
    chunk_count integer NOT NULL,
    embedding_count integer NOT NULL,
    status text NOT NULL,
    manifest_uri text NOT NULL,
    promoted_at timestamp with time zone,
    notes text,
    CONSTRAINT build_manifests_status_check CHECK ((status = ANY (ARRAY['staging'::text, 'live'::text, 'rolled_back'::text, 'failed'::text])))
);


ALTER TABLE public.build_manifests OWNER TO amjis_app;

--
-- Name: chart_facts; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.chart_facts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fact_id text NOT NULL,
    category text NOT NULL,
    divisional_chart text DEFAULT 'D1'::text NOT NULL,
    value_text text,
    value_number numeric,
    value_json jsonb,
    source_section text NOT NULL,
    build_id text NOT NULL,
    provenance jsonb NOT NULL,
    is_stale boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.chart_facts OWNER TO amjis_app;

--
-- Name: cluster_register; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.cluster_register (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cluster_id text NOT NULL,
    name text NOT NULL,
    theme text NOT NULL,
    description text NOT NULL,
    member_signal_ids text[] NOT NULL,
    member_fact_ids text[],
    member_event_ids text[],
    domain text,
    confidence numeric NOT NULL,
    discovered_at timestamp with time zone NOT NULL,
    discovered_in_build_id text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    CONSTRAINT cluster_register_confidence_check CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric)))
);


ALTER TABLE public.cluster_register OWNER TO amjis_app;

--
-- Name: contradiction_register; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.contradiction_register (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contradiction_id text NOT NULL,
    statement_a text NOT NULL,
    statement_b text NOT NULL,
    conflict_type text NOT NULL,
    evidence jsonb NOT NULL,
    source_signal_ids text[],
    source_fact_ids text[],
    resolution_status text NOT NULL,
    resolution_notes text,
    domain text,
    confidence numeric NOT NULL,
    discovered_at timestamp with time zone NOT NULL,
    discovered_in_build_id text NOT NULL,
    CONSTRAINT contradiction_register_confidence_check CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))),
    CONSTRAINT contradiction_register_resolution_status_check CHECK ((resolution_status = ANY (ARRAY['unresolved'::text, 'accepted'::text, 'dismissed'::text, 'reframed'::text])))
);


ALTER TABLE public.contradiction_register OWNER TO amjis_app;

--
-- Name: eclipses; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.eclipses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date NOT NULL,
    type text NOT NULL,
    longitude_deg numeric(11,7),
    sign text,
    nakshatra text,
    visibility_region text,
    build_id text NOT NULL,
    source_uri text NOT NULL
);


ALTER TABLE public.eclipses OWNER TO amjis_app;

--
-- Name: ephemeris_daily; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.ephemeris_daily (
    id bigint NOT NULL,
    date date NOT NULL,
    planet text NOT NULL,
    longitude_deg numeric(11,7) NOT NULL,
    latitude_deg numeric(11,7),
    speed_deg_per_day numeric(11,7) NOT NULL,
    is_retrograde boolean NOT NULL,
    sign text NOT NULL,
    sign_degree numeric(11,7) NOT NULL,
    nakshatra text NOT NULL,
    nakshatra_pada smallint NOT NULL,
    ayanamsha text DEFAULT 'lahiri'::text NOT NULL,
    ephemeris_version text NOT NULL,
    build_id text NOT NULL
);


ALTER TABLE public.ephemeris_daily OWNER TO amjis_app;

--
-- Name: ephemeris_daily_id_seq; Type: SEQUENCE; Schema: public; Owner: amjis_app
--

CREATE SEQUENCE public.ephemeris_daily_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ephemeris_daily_id_seq OWNER TO amjis_app;

--
-- Name: ephemeris_daily_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: amjis_app
--

ALTER SEQUENCE public.ephemeris_daily_id_seq OWNED BY public.ephemeris_daily.id;


--
-- Name: l25_cdlm_links; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.l25_cdlm_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    link_id text NOT NULL,
    from_domain text NOT NULL,
    to_domain text NOT NULL,
    link_type text NOT NULL,
    strength text NOT NULL,
    source_signals text[],
    notes text,
    source_section text NOT NULL,
    build_id text NOT NULL
);


ALTER TABLE public.l25_cdlm_links OWNER TO amjis_app;

--
-- Name: l25_cgm_edges; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.l25_cgm_edges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    edge_id text NOT NULL,
    source_node_id text NOT NULL,
    target_node_id text NOT NULL,
    edge_type text NOT NULL,
    strength numeric,
    notes text,
    source_section text NOT NULL,
    build_id text NOT NULL
);


ALTER TABLE public.l25_cgm_edges OWNER TO amjis_app;

--
-- Name: l25_cgm_nodes; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.l25_cgm_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    node_id text NOT NULL,
    node_type text NOT NULL,
    display_name text NOT NULL,
    properties jsonb NOT NULL,
    source_section text NOT NULL,
    build_id text NOT NULL
);


ALTER TABLE public.l25_cgm_nodes OWNER TO amjis_app;

--
-- Name: l25_msr_signals; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.l25_msr_signals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    signal_id text NOT NULL,
    signal_number integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    valence text NOT NULL,
    weight numeric,
    planets_involved text[],
    houses_involved integer[],
    signs_involved text[],
    description text NOT NULL,
    source_section text NOT NULL,
    build_id text NOT NULL,
    provenance jsonb NOT NULL
);


ALTER TABLE public.l25_msr_signals OWNER TO amjis_app;

--
-- Name: l25_rm_resonances; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.l25_rm_resonances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resonance_id text NOT NULL,
    signal_a_id text NOT NULL,
    signal_b_id text NOT NULL,
    resonance_type text NOT NULL,
    strength text NOT NULL,
    theme text,
    notes text,
    source_section text NOT NULL,
    build_id text NOT NULL
);


ALTER TABLE public.l25_rm_resonances OWNER TO amjis_app;

--
-- Name: l25_ucn_sections; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.l25_ucn_sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_id text NOT NULL,
    parent_section_id text,
    domain text,
    title text NOT NULL,
    content text NOT NULL,
    derived_from_signals text[],
    source_lines text,
    build_id text NOT NULL
);


ALTER TABLE public.l25_ucn_sections OWNER TO amjis_app;

--
-- Name: life_events; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.life_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id text NOT NULL,
    event_date date NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    significance text,
    chart_state jsonb NOT NULL,
    source_section text NOT NULL,
    build_id text NOT NULL,
    provenance jsonb NOT NULL
);


ALTER TABLE public.life_events OWNER TO amjis_app;

--
-- Name: pattern_register; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.pattern_register (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pattern_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    domain text,
    evidence jsonb NOT NULL,
    source_signal_ids text[],
    source_fact_ids text[],
    confidence numeric NOT NULL,
    discovered_at timestamp with time zone NOT NULL,
    discovered_in_build_id text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    CONSTRAINT pattern_register_confidence_check CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))),
    CONSTRAINT pattern_register_status_check CHECK ((status = ANY (ARRAY['active'::text, 'superseded'::text, 'rejected'::text])))
);


ALTER TABLE public.pattern_register OWNER TO amjis_app;

--
-- Name: rag_chunks; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.rag_chunks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chunk_id text NOT NULL,
    doc_type text NOT NULL,
    layer text NOT NULL,
    source_file text NOT NULL,
    source_version text NOT NULL,
    content text NOT NULL,
    token_count integer NOT NULL,
    is_stale boolean DEFAULT false,
    stale_reason text,
    stale_since text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.rag_chunks OWNER TO amjis_app;

--
-- Name: rag_embeddings; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.rag_embeddings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chunk_id text NOT NULL,
    model text NOT NULL,
    embedding public.vector(768),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.rag_embeddings OWNER TO amjis_app;

--
-- Name: resonance_register; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.resonance_register (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resonance_id text NOT NULL,
    theme text NOT NULL,
    description text NOT NULL,
    signal_ids text[] NOT NULL,
    pattern_ids text[],
    domains text[],
    confidence numeric NOT NULL,
    discovered_at timestamp with time zone NOT NULL,
    discovered_in_build_id text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    CONSTRAINT resonance_register_confidence_check CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric)))
);


ALTER TABLE public.resonance_register OWNER TO amjis_app;

--
-- Name: retrogrades; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.retrogrades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    planet text NOT NULL,
    station_type text NOT NULL,
    date date NOT NULL,
    longitude_deg numeric(11,7),
    sign text,
    nakshatra text,
    build_id text NOT NULL,
    source_uri text NOT NULL,
    CONSTRAINT retrogrades_station_type_check CHECK ((station_type = ANY (ARRAY['retrograde_start'::text, 'retrograde_end'::text])))
);


ALTER TABLE public.retrogrades OWNER TO amjis_app;

--
-- Name: sade_sati_phases; Type: TABLE; Schema: public; Owner: amjis_app
--

CREATE TABLE public.sade_sati_phases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cycle_number smallint NOT NULL,
    phase text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    saturn_sign_at_start text NOT NULL,
    notes text,
    source_section text NOT NULL,
    build_id text NOT NULL,
    CONSTRAINT sade_sati_phases_phase_check CHECK ((phase = ANY (ARRAY['pre_birth'::text, 'rising'::text, 'peak'::text, 'setting'::text, 'gap'::text])))
);


ALTER TABLE public.sade_sati_phases OWNER TO amjis_app;

--
-- Name: ephemeris_daily id; Type: DEFAULT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.ephemeris_daily ALTER COLUMN id SET DEFAULT nextval('public.ephemeris_daily_id_seq'::regclass);


--
-- Name: build_manifests build_manifests_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.build_manifests
    ADD CONSTRAINT build_manifests_pkey PRIMARY KEY (build_id);


--
-- Name: chart_facts chart_facts_fact_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.chart_facts
    ADD CONSTRAINT chart_facts_fact_id_key UNIQUE (fact_id);


--
-- Name: chart_facts chart_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.chart_facts
    ADD CONSTRAINT chart_facts_pkey PRIMARY KEY (id);


--
-- Name: cluster_register cluster_register_cluster_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.cluster_register
    ADD CONSTRAINT cluster_register_cluster_id_key UNIQUE (cluster_id);


--
-- Name: cluster_register cluster_register_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.cluster_register
    ADD CONSTRAINT cluster_register_pkey PRIMARY KEY (id);


--
-- Name: contradiction_register contradiction_register_contradiction_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.contradiction_register
    ADD CONSTRAINT contradiction_register_contradiction_id_key UNIQUE (contradiction_id);


--
-- Name: contradiction_register contradiction_register_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.contradiction_register
    ADD CONSTRAINT contradiction_register_pkey PRIMARY KEY (id);


--
-- Name: eclipses eclipses_date_type_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.eclipses
    ADD CONSTRAINT eclipses_date_type_key UNIQUE (date, type);


--
-- Name: eclipses eclipses_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.eclipses
    ADD CONSTRAINT eclipses_pkey PRIMARY KEY (id);


--
-- Name: ephemeris_daily ephemeris_daily_date_planet_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.ephemeris_daily
    ADD CONSTRAINT ephemeris_daily_date_planet_key UNIQUE (date, planet);


--
-- Name: ephemeris_daily ephemeris_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.ephemeris_daily
    ADD CONSTRAINT ephemeris_daily_pkey PRIMARY KEY (id);


--
-- Name: l25_cdlm_links l25_cdlm_links_from_domain_to_domain_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cdlm_links
    ADD CONSTRAINT l25_cdlm_links_from_domain_to_domain_key UNIQUE (from_domain, to_domain);


--
-- Name: l25_cdlm_links l25_cdlm_links_link_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cdlm_links
    ADD CONSTRAINT l25_cdlm_links_link_id_key UNIQUE (link_id);


--
-- Name: l25_cdlm_links l25_cdlm_links_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cdlm_links
    ADD CONSTRAINT l25_cdlm_links_pkey PRIMARY KEY (id);


--
-- Name: l25_cgm_edges l25_cgm_edges_edge_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cgm_edges
    ADD CONSTRAINT l25_cgm_edges_edge_id_key UNIQUE (edge_id);


--
-- Name: l25_cgm_edges l25_cgm_edges_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cgm_edges
    ADD CONSTRAINT l25_cgm_edges_pkey PRIMARY KEY (id);


--
-- Name: l25_cgm_nodes l25_cgm_nodes_node_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cgm_nodes
    ADD CONSTRAINT l25_cgm_nodes_node_id_key UNIQUE (node_id);


--
-- Name: l25_cgm_nodes l25_cgm_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cgm_nodes
    ADD CONSTRAINT l25_cgm_nodes_pkey PRIMARY KEY (id);


--
-- Name: l25_msr_signals l25_msr_signals_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_msr_signals
    ADD CONSTRAINT l25_msr_signals_pkey PRIMARY KEY (id);


--
-- Name: l25_msr_signals l25_msr_signals_signal_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_msr_signals
    ADD CONSTRAINT l25_msr_signals_signal_id_key UNIQUE (signal_id);


--
-- Name: l25_rm_resonances l25_rm_resonances_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_rm_resonances
    ADD CONSTRAINT l25_rm_resonances_pkey PRIMARY KEY (id);


--
-- Name: l25_rm_resonances l25_rm_resonances_resonance_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_rm_resonances
    ADD CONSTRAINT l25_rm_resonances_resonance_id_key UNIQUE (resonance_id);


--
-- Name: l25_rm_resonances l25_rm_resonances_signal_a_id_signal_b_id_resonance_type_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_rm_resonances
    ADD CONSTRAINT l25_rm_resonances_signal_a_id_signal_b_id_resonance_type_key UNIQUE (signal_a_id, signal_b_id, resonance_type);


--
-- Name: l25_ucn_sections l25_ucn_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_ucn_sections
    ADD CONSTRAINT l25_ucn_sections_pkey PRIMARY KEY (id);


--
-- Name: l25_ucn_sections l25_ucn_sections_section_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_ucn_sections
    ADD CONSTRAINT l25_ucn_sections_section_id_key UNIQUE (section_id);


--
-- Name: life_events life_events_event_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.life_events
    ADD CONSTRAINT life_events_event_id_key UNIQUE (event_id);


--
-- Name: life_events life_events_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.life_events
    ADD CONSTRAINT life_events_pkey PRIMARY KEY (id);


--
-- Name: pattern_register pattern_register_pattern_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.pattern_register
    ADD CONSTRAINT pattern_register_pattern_id_key UNIQUE (pattern_id);


--
-- Name: pattern_register pattern_register_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.pattern_register
    ADD CONSTRAINT pattern_register_pkey PRIMARY KEY (id);


--
-- Name: rag_chunks rag_chunks_chunk_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.rag_chunks
    ADD CONSTRAINT rag_chunks_chunk_id_key UNIQUE (chunk_id);


--
-- Name: rag_chunks rag_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.rag_chunks
    ADD CONSTRAINT rag_chunks_pkey PRIMARY KEY (id);


--
-- Name: rag_embeddings rag_embeddings_chunk_model_unique; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.rag_embeddings
    ADD CONSTRAINT rag_embeddings_chunk_model_unique UNIQUE (chunk_id, model);


--
-- Name: rag_embeddings rag_embeddings_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.rag_embeddings
    ADD CONSTRAINT rag_embeddings_pkey PRIMARY KEY (id);


--
-- Name: resonance_register resonance_register_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.resonance_register
    ADD CONSTRAINT resonance_register_pkey PRIMARY KEY (id);


--
-- Name: resonance_register resonance_register_resonance_id_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.resonance_register
    ADD CONSTRAINT resonance_register_resonance_id_key UNIQUE (resonance_id);


--
-- Name: retrogrades retrogrades_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.retrogrades
    ADD CONSTRAINT retrogrades_pkey PRIMARY KEY (id);


--
-- Name: retrogrades retrogrades_planet_station_type_date_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.retrogrades
    ADD CONSTRAINT retrogrades_planet_station_type_date_key UNIQUE (planet, station_type, date);


--
-- Name: sade_sati_phases sade_sati_phases_cycle_number_phase_start_date_key; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.sade_sati_phases
    ADD CONSTRAINT sade_sati_phases_cycle_number_phase_start_date_key UNIQUE (cycle_number, phase, start_date);


--
-- Name: sade_sati_phases sade_sati_phases_pkey; Type: CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.sade_sati_phases
    ADD CONSTRAINT sade_sati_phases_pkey PRIMARY KEY (id);


--
-- Name: idx_build_manifests_status; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_build_manifests_status ON public.build_manifests USING btree (status);


--
-- Name: idx_build_manifests_triggered_at; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_build_manifests_triggered_at ON public.build_manifests USING btree (triggered_at DESC);


--
-- Name: idx_chart_facts_category; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_chart_facts_category ON public.chart_facts USING btree (category, divisional_chart);


--
-- Name: idx_chart_facts_fact_id; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_chart_facts_fact_id ON public.chart_facts USING btree (fact_id);


--
-- Name: idx_cluster_domain; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_cluster_domain ON public.cluster_register USING btree (domain);


--
-- Name: idx_cluster_signals; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_cluster_signals ON public.cluster_register USING gin (member_signal_ids);


--
-- Name: idx_cluster_theme; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_cluster_theme ON public.cluster_register USING btree (theme);


--
-- Name: idx_contradiction_domain; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_contradiction_domain ON public.contradiction_register USING btree (domain);


--
-- Name: idx_contradiction_signals; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_contradiction_signals ON public.contradiction_register USING gin (source_signal_ids);


--
-- Name: idx_contradiction_status; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_contradiction_status ON public.contradiction_register USING btree (resolution_status);


--
-- Name: idx_eclipses_date; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_eclipses_date ON public.eclipses USING btree (date);


--
-- Name: idx_ephemeris_date; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_ephemeris_date ON public.ephemeris_daily USING btree (date);


--
-- Name: idx_ephemeris_planet_date; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_ephemeris_planet_date ON public.ephemeris_daily USING btree (planet, date);


--
-- Name: idx_ephemeris_retro; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_ephemeris_retro ON public.ephemeris_daily USING btree (planet, date) WHERE (is_retrograde = true);


--
-- Name: idx_l25_cdlm_from; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_cdlm_from ON public.l25_cdlm_links USING btree (from_domain);


--
-- Name: idx_l25_cdlm_to; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_cdlm_to ON public.l25_cdlm_links USING btree (to_domain);


--
-- Name: idx_l25_cgm_edges_source; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_cgm_edges_source ON public.l25_cgm_edges USING btree (source_node_id);


--
-- Name: idx_l25_cgm_edges_target; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_cgm_edges_target ON public.l25_cgm_edges USING btree (target_node_id);


--
-- Name: idx_l25_cgm_edges_type; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_cgm_edges_type ON public.l25_cgm_edges USING btree (edge_type);


--
-- Name: idx_l25_cgm_nodes_type; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_cgm_nodes_type ON public.l25_cgm_nodes USING btree (node_type);


--
-- Name: idx_l25_msr_category_valence; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_msr_category_valence ON public.l25_msr_signals USING btree (category, valence);


--
-- Name: idx_l25_msr_houses; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_msr_houses ON public.l25_msr_signals USING gin (houses_involved);


--
-- Name: idx_l25_msr_planets; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_msr_planets ON public.l25_msr_signals USING gin (planets_involved);


--
-- Name: idx_l25_rm_signal_a; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_rm_signal_a ON public.l25_rm_resonances USING btree (signal_a_id);


--
-- Name: idx_l25_rm_signal_b; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_rm_signal_b ON public.l25_rm_resonances USING btree (signal_b_id);


--
-- Name: idx_l25_ucn_domain; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_ucn_domain ON public.l25_ucn_sections USING btree (domain);


--
-- Name: idx_l25_ucn_signals; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_l25_ucn_signals ON public.l25_ucn_sections USING gin (derived_from_signals);


--
-- Name: idx_life_events_category; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_life_events_category ON public.life_events USING btree (category, event_date);


--
-- Name: idx_life_events_date; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_life_events_date ON public.life_events USING btree (event_date);


--
-- Name: idx_pattern_confidence; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_pattern_confidence ON public.pattern_register USING btree (confidence DESC);


--
-- Name: idx_pattern_domain; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_pattern_domain ON public.pattern_register USING btree (domain);


--
-- Name: idx_pattern_signals; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_pattern_signals ON public.pattern_register USING gin (source_signal_ids);


--
-- Name: idx_pattern_status; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_pattern_status ON public.pattern_register USING btree (status);


--
-- Name: idx_rag_chunks_content_gin; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_rag_chunks_content_gin ON public.rag_chunks USING gin (to_tsvector('english'::regconfig, content));


--
-- Name: idx_rag_chunks_doc_type; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_rag_chunks_doc_type ON public.rag_chunks USING btree (doc_type);


--
-- Name: idx_rag_chunks_layer; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_rag_chunks_layer ON public.rag_chunks USING btree (layer);


--
-- Name: idx_rag_chunks_stale; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_rag_chunks_stale ON public.rag_chunks USING btree (is_stale);


--
-- Name: idx_rag_embeddings_chunk; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_rag_embeddings_chunk ON public.rag_embeddings USING btree (chunk_id);


--
-- Name: idx_rag_embeddings_hnsw; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_rag_embeddings_hnsw ON public.rag_embeddings USING hnsw (embedding public.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_resonance_domains; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_resonance_domains ON public.resonance_register USING gin (domains);


--
-- Name: idx_resonance_signals; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_resonance_signals ON public.resonance_register USING gin (signal_ids);


--
-- Name: idx_resonance_theme; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_resonance_theme ON public.resonance_register USING btree (theme);


--
-- Name: idx_retrogrades_date; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_retrogrades_date ON public.retrogrades USING btree (date);


--
-- Name: idx_retrogrades_planet_date; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_retrogrades_planet_date ON public.retrogrades USING btree (planet, date);


--
-- Name: idx_sade_sati_dates; Type: INDEX; Schema: public; Owner: amjis_app
--

CREATE INDEX idx_sade_sati_dates ON public.sade_sati_phases USING btree (start_date, end_date);


--
-- Name: chart_facts chart_facts_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.chart_facts
    ADD CONSTRAINT chart_facts_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: cluster_register cluster_register_discovered_in_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.cluster_register
    ADD CONSTRAINT cluster_register_discovered_in_build_id_fkey FOREIGN KEY (discovered_in_build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: contradiction_register contradiction_register_discovered_in_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.contradiction_register
    ADD CONSTRAINT contradiction_register_discovered_in_build_id_fkey FOREIGN KEY (discovered_in_build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: eclipses eclipses_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.eclipses
    ADD CONSTRAINT eclipses_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: ephemeris_daily ephemeris_daily_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.ephemeris_daily
    ADD CONSTRAINT ephemeris_daily_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: l25_cdlm_links l25_cdlm_links_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cdlm_links
    ADD CONSTRAINT l25_cdlm_links_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: l25_cgm_edges l25_cgm_edges_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cgm_edges
    ADD CONSTRAINT l25_cgm_edges_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: l25_cgm_nodes l25_cgm_nodes_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_cgm_nodes
    ADD CONSTRAINT l25_cgm_nodes_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: l25_msr_signals l25_msr_signals_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_msr_signals
    ADD CONSTRAINT l25_msr_signals_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: l25_rm_resonances l25_rm_resonances_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_rm_resonances
    ADD CONSTRAINT l25_rm_resonances_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: l25_ucn_sections l25_ucn_sections_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.l25_ucn_sections
    ADD CONSTRAINT l25_ucn_sections_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: life_events life_events_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.life_events
    ADD CONSTRAINT life_events_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: pattern_register pattern_register_discovered_in_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.pattern_register
    ADD CONSTRAINT pattern_register_discovered_in_build_id_fkey FOREIGN KEY (discovered_in_build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: rag_embeddings rag_embeddings_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.rag_embeddings
    ADD CONSTRAINT rag_embeddings_chunk_id_fkey FOREIGN KEY (chunk_id) REFERENCES public.rag_chunks(chunk_id) ON DELETE CASCADE;


--
-- Name: resonance_register resonance_register_discovered_in_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.resonance_register
    ADD CONSTRAINT resonance_register_discovered_in_build_id_fkey FOREIGN KEY (discovered_in_build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: retrogrades retrogrades_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.retrogrades
    ADD CONSTRAINT retrogrades_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- Name: sade_sati_phases sade_sati_phases_build_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: amjis_app
--

ALTER TABLE ONLY public.sade_sati_phases
    ADD CONSTRAINT sade_sati_phases_build_id_fkey FOREIGN KEY (build_id) REFERENCES public.build_manifests(build_id);


--
-- PostgreSQL database dump complete
--

\unrestrict JEfzwHlwdjFV2lzhnsg2Z2FNA4y5rScp3D1dEZOn9RanS24427OladjmoP5aoqK

