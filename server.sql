--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.0 (Debian 14.0-1.pgdg110+1)

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

--
-- Name: drive; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drive;


ALTER SCHEMA drive OWNER TO postgres;

--
-- Name: sheets; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA sheets;


ALTER SCHEMA sheets OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: formify; Type: TABLE; Schema: drive; Owner: postgres
--

CREATE TABLE drive.formify (
    formify_id bigint NOT NULL,
    user_id bigint,
    cloud_guid uuid,
    cloud_worksheet text,
    formify_hash character varying(36)
);


ALTER TABLE drive.formify OWNER TO postgres;

--
-- Name: formify_formify_id_seq; Type: SEQUENCE; Schema: drive; Owner: postgres
--

CREATE SEQUENCE drive.formify_formify_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE drive.formify_formify_id_seq OWNER TO postgres;

--
-- Name: formify_formify_id_seq; Type: SEQUENCE OWNED BY; Schema: drive; Owner: postgres
--

ALTER SEQUENCE drive.formify_formify_id_seq OWNED BY drive.formify.formify_id;


--
-- Name: formify_log; Type: TABLE; Schema: drive; Owner: postgres
--

CREATE TABLE drive.formify_log (
    formify_id bigint,
    ip bigint
);


ALTER TABLE drive.formify_log OWNER TO postgres;

--
-- Name: sheets; Type: TABLE; Schema: drive; Owner: postgres
--

CREATE TABLE drive.sheets (
    sheet_id bigint NOT NULL,
    user_id integer,
    sheet_guid uuid,
    sheet_cluster smallint,
    sheet_privacy smallint,
    sheet_description text,
    sheet_created timestamp without time zone DEFAULT now(),
    sheet_updated timestamp without time zone DEFAULT now(),
    sheet_status smallint,
    sheet_changed smallint,
    sheet_config jsonb
)
PARTITION BY RANGE (sheet_id);


ALTER TABLE drive.sheets OWNER TO postgres;

--
-- Name: sheets_sheet_id_seq; Type: SEQUENCE; Schema: drive; Owner: postgres
--

CREATE SEQUENCE drive.sheets_sheet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE drive.sheets_sheet_id_seq OWNER TO postgres;

--
-- Name: sheets_sheet_id_seq; Type: SEQUENCE OWNED BY; Schema: drive; Owner: postgres
--

ALTER SEQUENCE drive.sheets_sheet_id_seq OWNED BY drive.sheets.sheet_id;


--
-- Name: sheets_0; Type: TABLE; Schema: drive; Owner: postgres
--

CREATE TABLE drive.sheets_0 (
    sheet_id bigint DEFAULT nextval('drive.sheets_sheet_id_seq'::regclass) NOT NULL,
    user_id integer,
    sheet_guid uuid,
    sheet_cluster smallint,
    sheet_privacy smallint,
    sheet_description text,
    sheet_created timestamp without time zone DEFAULT now(),
    sheet_updated timestamp without time zone DEFAULT now(),
    sheet_status smallint,
    sheet_changed smallint,
    sheet_config jsonb
);


ALTER TABLE drive.sheets_0 OWNER TO postgres;

--
-- Name: sheets_users; Type: TABLE; Schema: drive; Owner: postgres
--

CREATE TABLE drive.sheets_users (
    sheet_user_id bigint NOT NULL,
    sheet_guid uuid,
    sheet_id bigint,
    user_id bigint,
    sheet_user_date timestamp without time zone,
    sheet_user_email text,
    sheet_user_token text,
    sheet_user_level smallint,
    sheet_user_status smallint
)
PARTITION BY RANGE (sheet_id);


ALTER TABLE drive.sheets_users OWNER TO postgres;

--
-- Name: sheets_users_sheet_user_id_seq; Type: SEQUENCE; Schema: drive; Owner: postgres
--

CREATE SEQUENCE drive.sheets_users_sheet_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE drive.sheets_users_sheet_user_id_seq OWNER TO postgres;

--
-- Name: sheets_users_sheet_user_id_seq; Type: SEQUENCE OWNED BY; Schema: drive; Owner: postgres
--

ALTER SEQUENCE drive.sheets_users_sheet_user_id_seq OWNED BY drive.sheets_users.sheet_user_id;


--
-- Name: sheets_users_0; Type: TABLE; Schema: drive; Owner: postgres
--

CREATE TABLE drive.sheets_users_0 (
    sheet_user_id bigint DEFAULT nextval('drive.sheets_users_sheet_user_id_seq'::regclass) NOT NULL,
    sheet_guid uuid,
    sheet_id bigint,
    user_id bigint,
    sheet_user_date timestamp without time zone,
    sheet_user_email text,
    sheet_user_token text,
    sheet_user_level smallint,
    sheet_user_status smallint
);


ALTER TABLE drive.sheets_users_0 OWNER TO postgres;

--
-- Name: sheets_0; Type: TABLE ATTACH; Schema: drive; Owner: postgres
--

ALTER TABLE ONLY drive.sheets ATTACH PARTITION drive.sheets_0 FOR VALUES FROM ('0') TO ('100000');


--
-- Name: sheets_users_0; Type: TABLE ATTACH; Schema: drive; Owner: postgres
--

ALTER TABLE ONLY drive.sheets_users ATTACH PARTITION drive.sheets_users_0 FOR VALUES FROM ('0') TO ('100000');


--
-- Name: formify formify_id; Type: DEFAULT; Schema: drive; Owner: postgres
--

ALTER TABLE ONLY drive.formify ALTER COLUMN formify_id SET DEFAULT nextval('drive.formify_formify_id_seq'::regclass);


--
-- Name: sheets sheet_id; Type: DEFAULT; Schema: drive; Owner: postgres
--

ALTER TABLE ONLY drive.sheets ALTER COLUMN sheet_id SET DEFAULT nextval('drive.sheets_sheet_id_seq'::regclass);


--
-- Name: sheets_users sheet_user_id; Type: DEFAULT; Schema: drive; Owner: postgres
--

ALTER TABLE ONLY drive.sheets_users ALTER COLUMN sheet_user_id SET DEFAULT nextval('drive.sheets_users_sheet_user_id_seq'::regclass);


--
-- Data for Name: formify; Type: TABLE DATA; Schema: drive; Owner: postgres
--

COPY drive.formify (formify_id, user_id, cloud_guid, cloud_worksheet, formify_hash) FROM stdin;
\.


--
-- Data for Name: formify_log; Type: TABLE DATA; Schema: drive; Owner: postgres
--

COPY drive.formify_log (formify_id, ip) FROM stdin;
\.


--
-- Data for Name: sheets_0; Type: TABLE DATA; Schema: drive; Owner: postgres
--

COPY drive.sheets_0 (sheet_id, user_id, sheet_guid, sheet_cluster, sheet_privacy, sheet_description, sheet_created, sheet_updated, sheet_status, sheet_changed, sheet_config) FROM stdin;
\.


--
-- Data for Name: sheets_users_0; Type: TABLE DATA; Schema: drive; Owner: postgres
--

COPY drive.sheets_users_0 (sheet_user_id, sheet_guid, sheet_id, user_id, sheet_user_date, sheet_user_email, sheet_user_token, sheet_user_level, sheet_user_status) FROM stdin;
\.


--
-- Name: formify_formify_id_seq; Type: SEQUENCE SET; Schema: drive; Owner: postgres
--

SELECT pg_catalog.setval('drive.formify_formify_id_seq', 1, false);


--
-- Name: sheets_sheet_id_seq; Type: SEQUENCE SET; Schema: drive; Owner: postgres
--

SELECT pg_catalog.setval('drive.sheets_sheet_id_seq', 53, true);


--
-- Name: sheets_users_sheet_user_id_seq; Type: SEQUENCE SET; Schema: drive; Owner: postgres
--

SELECT pg_catalog.setval('drive.sheets_users_sheet_user_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

