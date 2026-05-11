--
-- PostgreSQL database dump
--

\restrict JpytnWSrbm2S9LUpGVpAsrQxAHhAOHDp8SMPBs7d4QIesJnmoPHVNg2eXtyxrrX

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    "accountID" integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    provider text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    active boolean DEFAULT true NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    "emailNotification" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Account_accountID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Account_accountID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_accountID_seq" OWNER TO postgres;

--
-- Name: Account_accountID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Account_accountID_seq" OWNED BY public."Account"."accountID";


--
-- Name: CVAnalysis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CVAnalysis" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "fileHash" text NOT NULL,
    filename text NOT NULL,
    result jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CVAnalysis" OWNER TO postgres;

--
-- Name: CVAnalysisCache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CVAnalysisCache" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "fileHash" text NOT NULL,
    filename text NOT NULL,
    result jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CVAnalysisCache" OWNER TO postgres;

--
-- Name: CVAnalysisCache_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CVAnalysisCache_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CVAnalysisCache_id_seq" OWNER TO postgres;

--
-- Name: CVAnalysisCache_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CVAnalysisCache_id_seq" OWNED BY public."CVAnalysisCache".id;


--
-- Name: CVAnalysis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CVAnalysis_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CVAnalysis_id_seq" OWNER TO postgres;

--
-- Name: CVAnalysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CVAnalysis_id_seq" OWNED BY public."CVAnalysis".id;


--
-- Name: CVBuilder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CVBuilder" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    name text NOT NULL,
    "templateId" text NOT NULL,
    data jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CVBuilder" OWNER TO postgres;

--
-- Name: CVBuilder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CVBuilder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CVBuilder_id_seq" OWNER TO postgres;

--
-- Name: CVBuilder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CVBuilder_id_seq" OWNED BY public."CVBuilder".id;


--
-- Name: ChatMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatMessage" (
    id integer NOT NULL,
    "sessionID" integer NOT NULL,
    role text NOT NULL,
    content text,
    type text DEFAULT 'text'::text NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatMessage" OWNER TO postgres;

--
-- Name: ChatMessage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChatMessage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChatMessage_id_seq" OWNER TO postgres;

--
-- Name: ChatMessage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChatMessage_id_seq" OWNED BY public."ChatMessage".id;


--
-- Name: ChatSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatSession" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    title text DEFAULT 'New Chat'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ChatSession" OWNER TO postgres;

--
-- Name: ChatSession_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ChatSession_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChatSession_id_seq" OWNER TO postgres;

--
-- Name: ChatSession_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ChatSession_id_seq" OWNED BY public."ChatSession".id;


--
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    "companyID" integer NOT NULL,
    "companyName" text NOT NULL,
    "companyWebsite" text,
    "companyProfile" text,
    address text,
    "companySize" text,
    "companyLogo" text
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- Name: Company_companyID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Company_companyID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Company_companyID_seq" OWNER TO postgres;

--
-- Name: Company_companyID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Company_companyID_seq" OWNED BY public."Company"."companyID";


--
-- Name: Industry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Industry" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Industry" OWNER TO postgres;

--
-- Name: Industry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Industry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Industry_id_seq" OWNER TO postgres;

--
-- Name: Industry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Industry_id_seq" OWNED BY public."Industry".id;


--
-- Name: Job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Job" (
    "jobID" integer NOT NULL,
    "companyID" integer NOT NULL,
    "industryID" integer,
    title text,
    location text,
    salary text,
    description text,
    requirement text,
    benefit text,
    "jobType" text,
    "workingTime" text,
    "experienceYear" text,
    "postedAt" timestamp(3) without time zone,
    deadline timestamp(3) without time zone,
    "sourcePlatform" text,
    "sourceLink" text,
    "isActive" boolean DEFAULT true NOT NULL,
    other text,
    "shortLocation" text,
    "isNewJob" boolean DEFAULT false NOT NULL,
    "discoveredAt" timestamp(3) without time zone
);


ALTER TABLE public."Job" OWNER TO postgres;

--
-- Name: JobAlert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobAlert" (
    id integer NOT NULL,
    "accountID" integer NOT NULL,
    keyword text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."JobAlert" OWNER TO postgres;

--
-- Name: JobAlert_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobAlert_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobAlert_id_seq" OWNER TO postgres;

--
-- Name: JobAlert_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobAlert_id_seq" OWNED BY public."JobAlert".id;


--
-- Name: JobRecommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobRecommendation" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "jobID" integer NOT NULL,
    "matchPercent" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reason text,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."JobRecommendation" OWNER TO postgres;

--
-- Name: JobRecommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobRecommendation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobRecommendation_id_seq" OWNER TO postgres;

--
-- Name: JobRecommendation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobRecommendation_id_seq" OWNED BY public."JobRecommendation".id;


--
-- Name: JobSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobSkill" (
    id integer NOT NULL,
    "jobID" integer NOT NULL,
    "skillID" integer NOT NULL
);


ALTER TABLE public."JobSkill" OWNER TO postgres;

--
-- Name: JobSkill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobSkill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobSkill_id_seq" OWNER TO postgres;

--
-- Name: JobSkill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobSkill_id_seq" OWNED BY public."JobSkill".id;


--
-- Name: JobSourceTracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobSourceTracking" (
    id integer NOT NULL,
    "jobID" integer NOT NULL,
    platform text NOT NULL,
    "externalJobID" text NOT NULL,
    "crawledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."JobSourceTracking" OWNER TO postgres;

--
-- Name: JobSourceTracking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobSourceTracking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobSourceTracking_id_seq" OWNER TO postgres;

--
-- Name: JobSourceTracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobSourceTracking_id_seq" OWNED BY public."JobSourceTracking".id;


--
-- Name: Job_jobID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Job_jobID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Job_jobID_seq" OWNER TO postgres;

--
-- Name: Job_jobID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Job_jobID_seq" OWNED BY public."Job"."jobID";


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dedupeKey" text,
    "deletedAt" timestamp(3) without time zone,
    body text NOT NULL,
    metadata jsonb,
    "readAt" timestamp(3) without time zone
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "subscriptionID" integer NOT NULL,
    amount integer NOT NULL,
    currency text DEFAULT 'VND'::text NOT NULL,
    status text NOT NULL,
    method text,
    "transactionRef" text,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: PlanLimit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PlanLimit" (
    id integer NOT NULL,
    "planID" integer NOT NULL,
    "jobSuggestPerDay" integer DEFAULT 3 NOT NULL,
    "cvAnalysisPerMonth" integer DEFAULT 0 NOT NULL,
    "cvMatchCheckCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."PlanLimit" OWNER TO postgres;

--
-- Name: PlanLimit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PlanLimit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PlanLimit_id_seq" OWNER TO postgres;

--
-- Name: PlanLimit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PlanLimit_id_seq" OWNED BY public."PlanLimit".id;


--
-- Name: RefundRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefundRequest" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "paymentID" integer NOT NULL,
    reason text NOT NULL,
    "accountNumber" text NOT NULL,
    "accountName" text NOT NULL,
    "bankName" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resolvedAt" timestamp(3) without time zone,
    note text
);


ALTER TABLE public."RefundRequest" OWNER TO postgres;

--
-- Name: RefundRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RefundRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RefundRequest_id_seq" OWNER TO postgres;

--
-- Name: RefundRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RefundRequest_id_seq" OWNED BY public."RefundRequest".id;


--
-- Name: SavedJob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SavedJob" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "jobID" integer NOT NULL,
    "savedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SavedJob" OWNER TO postgres;

--
-- Name: SavedJob_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SavedJob_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SavedJob_id_seq" OWNER TO postgres;

--
-- Name: SavedJob_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SavedJob_id_seq" OWNED BY public."SavedJob".id;


--
-- Name: SearchHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SearchHistory" (
    id integer NOT NULL,
    "accountID" integer NOT NULL,
    keyword text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type text DEFAULT 'job'::text NOT NULL
);


ALTER TABLE public."SearchHistory" OWNER TO postgres;

--
-- Name: SearchHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SearchHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SearchHistory_id_seq" OWNER TO postgres;

--
-- Name: SearchHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SearchHistory_id_seq" OWNED BY public."SearchHistory".id;


--
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    "skillID" integer NOT NULL,
    "industryID" integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- Name: Skill_skillID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Skill_skillID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Skill_skillID_seq" OWNER TO postgres;

--
-- Name: Skill_skillID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Skill_skillID_seq" OWNED BY public."Skill"."skillID";


--
-- Name: SubscriptionPlan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SubscriptionPlan" (
    id integer NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    "monthlyPrice" integer DEFAULT 0 NOT NULL,
    "yearlyPrice" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SubscriptionPlan" OWNER TO postgres;

--
-- Name: SubscriptionPlan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SubscriptionPlan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SubscriptionPlan_id_seq" OWNER TO postgres;

--
-- Name: SubscriptionPlan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SubscriptionPlan_id_seq" OWNED BY public."SubscriptionPlan".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "userID" integer NOT NULL,
    "fullName" text,
    "birthYear" integer,
    phone text,
    gender text,
    address text,
    "accountID" integer NOT NULL,
    avatar text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserBehavior; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserBehavior" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "jobID" integer NOT NULL,
    action text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserBehavior" OWNER TO postgres;

--
-- Name: UserBehavior_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserBehavior_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserBehavior_id_seq" OWNER TO postgres;

--
-- Name: UserBehavior_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserBehavior_id_seq" OWNED BY public."UserBehavior".id;


--
-- Name: UserProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserProfile" (
    id integer NOT NULL,
    "jobTitle" text,
    "experienceYear" text,
    "careerLevel" text,
    "expectedSalary" text,
    "workingType" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userID" integer NOT NULL,
    "industryID" integer
);


ALTER TABLE public."UserProfile" OWNER TO postgres;

--
-- Name: UserProfile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserProfile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserProfile_id_seq" OWNER TO postgres;

--
-- Name: UserProfile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserProfile_id_seq" OWNED BY public."UserProfile".id;


--
-- Name: UserQuota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserQuota" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    month text NOT NULL,
    "jobSuggestPerDay" integer DEFAULT 3 NOT NULL,
    "cvAnalysisTotal" integer DEFAULT 0 NOT NULL,
    "cvMatchCheckTotal" integer DEFAULT 0 NOT NULL,
    "cvAnalysisUsed" integer DEFAULT 0 NOT NULL,
    "cvMatchCheckUsed" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "jobSuggestResetDate" text,
    "jobSuggestUsedToday" integer DEFAULT 0 NOT NULL,
    "subscriptionID" integer
);


ALTER TABLE public."UserQuota" OWNER TO postgres;

--
-- Name: UserQuota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserQuota_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserQuota_id_seq" OWNER TO postgres;

--
-- Name: UserQuota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserQuota_id_seq" OWNED BY public."UserQuota".id;


--
-- Name: UserSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSkill" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "skillID" integer NOT NULL
);


ALTER TABLE public."UserSkill" OWNER TO postgres;

--
-- Name: UserSkill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserSkill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserSkill_id_seq" OWNER TO postgres;

--
-- Name: UserSkill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserSkill_id_seq" OWNED BY public."UserSkill".id;


--
-- Name: UserSubscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserSubscription" (
    id integer NOT NULL,
    "userID" integer NOT NULL,
    "planID" integer NOT NULL,
    billing text NOT NULL,
    status text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "autoRenew" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."UserSubscription" OWNER TO postgres;

--
-- Name: UserSubscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserSubscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserSubscription_id_seq" OWNER TO postgres;

--
-- Name: UserSubscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserSubscription_id_seq" OWNED BY public."UserSubscription".id;


--
-- Name: User_userID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_userID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_userID_seq" OWNER TO postgres;

--
-- Name: User_userID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_userID_seq" OWNED BY public."User"."userID";


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Account accountID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account" ALTER COLUMN "accountID" SET DEFAULT nextval('public."Account_accountID_seq"'::regclass);


--
-- Name: CVAnalysis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVAnalysis" ALTER COLUMN id SET DEFAULT nextval('public."CVAnalysis_id_seq"'::regclass);


--
-- Name: CVAnalysisCache id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVAnalysisCache" ALTER COLUMN id SET DEFAULT nextval('public."CVAnalysisCache_id_seq"'::regclass);


--
-- Name: CVBuilder id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVBuilder" ALTER COLUMN id SET DEFAULT nextval('public."CVBuilder_id_seq"'::regclass);


--
-- Name: ChatMessage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage" ALTER COLUMN id SET DEFAULT nextval('public."ChatMessage_id_seq"'::regclass);


--
-- Name: ChatSession id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatSession" ALTER COLUMN id SET DEFAULT nextval('public."ChatSession_id_seq"'::regclass);


--
-- Name: Company companyID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company" ALTER COLUMN "companyID" SET DEFAULT nextval('public."Company_companyID_seq"'::regclass);


--
-- Name: Industry id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Industry" ALTER COLUMN id SET DEFAULT nextval('public."Industry_id_seq"'::regclass);


--
-- Name: Job jobID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job" ALTER COLUMN "jobID" SET DEFAULT nextval('public."Job_jobID_seq"'::regclass);


--
-- Name: JobAlert id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobAlert" ALTER COLUMN id SET DEFAULT nextval('public."JobAlert_id_seq"'::regclass);


--
-- Name: JobRecommendation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobRecommendation" ALTER COLUMN id SET DEFAULT nextval('public."JobRecommendation_id_seq"'::regclass);


--
-- Name: JobSkill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSkill" ALTER COLUMN id SET DEFAULT nextval('public."JobSkill_id_seq"'::regclass);


--
-- Name: JobSourceTracking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSourceTracking" ALTER COLUMN id SET DEFAULT nextval('public."JobSourceTracking_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: PlanLimit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PlanLimit" ALTER COLUMN id SET DEFAULT nextval('public."PlanLimit_id_seq"'::regclass);


--
-- Name: RefundRequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefundRequest" ALTER COLUMN id SET DEFAULT nextval('public."RefundRequest_id_seq"'::regclass);


--
-- Name: SavedJob id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SavedJob" ALTER COLUMN id SET DEFAULT nextval('public."SavedJob_id_seq"'::regclass);


--
-- Name: SearchHistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SearchHistory" ALTER COLUMN id SET DEFAULT nextval('public."SearchHistory_id_seq"'::regclass);


--
-- Name: Skill skillID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill" ALTER COLUMN "skillID" SET DEFAULT nextval('public."Skill_skillID_seq"'::regclass);


--
-- Name: SubscriptionPlan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SubscriptionPlan" ALTER COLUMN id SET DEFAULT nextval('public."SubscriptionPlan_id_seq"'::regclass);


--
-- Name: User userID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN "userID" SET DEFAULT nextval('public."User_userID_seq"'::regclass);


--
-- Name: UserBehavior id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBehavior" ALTER COLUMN id SET DEFAULT nextval('public."UserBehavior_id_seq"'::regclass);


--
-- Name: UserProfile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile" ALTER COLUMN id SET DEFAULT nextval('public."UserProfile_id_seq"'::regclass);


--
-- Name: UserQuota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserQuota" ALTER COLUMN id SET DEFAULT nextval('public."UserQuota_id_seq"'::regclass);


--
-- Name: UserSkill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill" ALTER COLUMN id SET DEFAULT nextval('public."UserSkill_id_seq"'::regclass);


--
-- Name: UserSubscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSubscription" ALTER COLUMN id SET DEFAULT nextval('public."UserSubscription_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" ("accountID", email, password, provider, "createdAt", active, role, "emailNotification") FROM stdin;
\.


--
-- Data for Name: CVAnalysis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CVAnalysis" (id, "userID", "fileHash", filename, result, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CVAnalysisCache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CVAnalysisCache" (id, "userID", "fileHash", filename, result, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CVBuilder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CVBuilder" (id, "userID", name, "templateId", data, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ChatMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatMessage" (id, "sessionID", role, content, type, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: ChatSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatSession" (id, "userID", title, "createdAt", "updatedAt", "isPinned") FROM stdin;
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Company" ("companyID", "companyName", "companyWebsite", "companyProfile", address, "companySize", "companyLogo") FROM stdin;
1	HEADHUNTER HRCHANNELS GROUP	https://careerviet.vn/vi/nha-tuyen-dung/headhunter-hrchannels-group.35A73BCE.html	Recruitment Service of Headhunter HRchannels Group\nWith more than 17 years of combined recruitment experience and a massive referral network, we are uniquely positioned to quickly locate highly qualified C-level and senior management candidates carry out your vision.\nThe recruitment service of HRchannels is a consultative process that will help employers with:\n· Identifying talented Highly qualified C-level and senior management candidates with appropriate skills for the role involved.\n· Management of the recruitment process for roles including middle to senior management positions\n· We will only submit relevant and appropriate applications saving you valuable time\n· Save time, money and resources with us -Unrivalled fee only upon successful placement\n· Advertising job opportunities on our website www.HRchannels.com\nWhen you’re ready to find the right staff, let our experience work for you.	Tòa MD Complex, Hàm Nghi, Hà Nội, Việt Nam.	25-99 nhân viên	https://images.careerviet.vn/employer_folders/lot0/152270/150025logo.png
\.


--
-- Data for Name: Industry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Industry" (id, name) FROM stdin;
1	Kế toán / Kiểm toán
\.


--
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Job" ("jobID", "companyID", "industryID", title, location, salary, description, requirement, benefit, "jobType", "workingTime", "experienceYear", "postedAt", deadline, "sourcePlatform", "sourceLink", "isActive", other, "shortLocation", "isNewJob", "discoveredAt") FROM stdin;
1	1	1	Kỹ Sư Thiết Kế và Lập Trình CNC (Cơ Khí)	\N	20 Tr - 30 Tr triệu VNĐ	Thiết kế đồ gá phục vụ gia công cơ khí bằng phần mềm NX\nLập trình gia công trên các dòng máy CNC\nThực hiện setup máy cho các sản phẩm hiện có\nThay dao cụ, điều chỉnh và lắp đặt đồ gá kẹp\nChạy thử sản phẩm mới và kiểm tra trước khi sản xuất hàng loạt\nĐảm bảo kiểm tra kích thước sản phẩm đạt tiêu chuẩn\nQuản lý đội ngũ công nhân sản xuất	Giới tính: Nam. Độ tuổi: Dưới 45\nTrình độ: Tốt nghiệp Cao đẳng trở lên các ngành: Cơ khí, Chế tạo ô tô, Tự động hóa, Cơ điện tử\nCó kinh nghiệm chuyên sâu trong thiết kế JIG gia công cơ khí bằng NX\nTối thiểu 1 năm kinh nghiệm vận hành và lập trình gia công trên máy phay CNC \nĐọc hiểu tốt bản vẽ kỹ thuật 2D, 3D\nThành thạo sử dụng các thiết bị đo lường\nHiểu rõ nguyên lý vận hành của máy móc, thiết bị\nCó khả năng làm việc độc lập cũng như phối hợp nhóm	Laptop\nChế độ bảo hiểm\nDu Lịch\nPhụ cấp\nDu lịch nước ngoài\nChế độ thưởng\nChăm sóc sức khỏe\nĐào tạo\nTăng lương\nNghỉ phép năm	Nhân viên chính thức	\N	Không yêu cầu	2026-05-06 00:00:00	2026-06-30 00:00:00	CareerViet	https://careerviet.vn/vi/tim-viec-lam/ky-su-thiet-ke-va-lap-trinh-cnc-co-khi.35C74C66.html	t	Bằng cấp: Cao đẳng\nGiới tính: Nam\nĐộ tuổi: 25 - 50\nLương: 20 Tr - 30 Tr VND	Bắc Ninh	t	2026-05-08 15:27:04.906
\.


--
-- Data for Name: JobAlert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobAlert" (id, "accountID", keyword, active, "createdAt") FROM stdin;
\.


--
-- Data for Name: JobRecommendation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobRecommendation" (id, "userID", "jobID", "matchPercent", "createdAt", reason, "updatedAt") FROM stdin;
\.


--
-- Data for Name: JobSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobSkill" (id, "jobID", "skillID") FROM stdin;
\.


--
-- Data for Name: JobSourceTracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobSourceTracking" (id, "jobID", platform, "externalJobID", "crawledAt") FROM stdin;
1	1	CareerViet	https://careerviet.vn/vi/tim-viec-lam/ky-su-thiet-ke-va-lap-trinh-cnc-co-khi.35C74C66.html	2026-05-08 15:27:04.91
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userID", title, type, "isRead", "createdAt", "dedupeKey", "deletedAt", body, metadata, "readAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "userID", "subscriptionID", amount, currency, status, method, "transactionRef", "paidAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: PlanLimit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PlanLimit" (id, "planID", "jobSuggestPerDay", "cvAnalysisPerMonth", "cvMatchCheckCount") FROM stdin;
\.


--
-- Data for Name: RefundRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefundRequest" (id, "userID", "paymentID", reason, "accountNumber", "accountName", "bankName", status, "createdAt", "resolvedAt", note) FROM stdin;
\.


--
-- Data for Name: SavedJob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SavedJob" (id, "userID", "jobID", "savedAt") FROM stdin;
\.


--
-- Data for Name: SearchHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SearchHistory" (id, "accountID", keyword, "createdAt", type) FROM stdin;
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skill" ("skillID", "industryID", name) FROM stdin;
\.


--
-- Data for Name: SubscriptionPlan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SubscriptionPlan" (id, name, "displayName", "monthlyPrice", "yearlyPrice", "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" ("userID", "fullName", "birthYear", phone, gender, address, "accountID", avatar) FROM stdin;
\.


--
-- Data for Name: UserBehavior; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserBehavior" (id, "userID", "jobID", action, "createdAt") FROM stdin;
\.


--
-- Data for Name: UserProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserProfile" (id, "jobTitle", "experienceYear", "careerLevel", "expectedSalary", "workingType", "createdAt", "updatedAt", "userID", "industryID") FROM stdin;
\.


--
-- Data for Name: UserQuota; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserQuota" (id, "userID", month, "jobSuggestPerDay", "cvAnalysisTotal", "cvMatchCheckTotal", "cvAnalysisUsed", "cvMatchCheckUsed", "updatedAt", "jobSuggestResetDate", "jobSuggestUsedToday", "subscriptionID") FROM stdin;
\.


--
-- Data for Name: UserSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserSkill" (id, "userID", "skillID") FROM stdin;
\.


--
-- Data for Name: UserSubscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserSubscription" (id, "userID", "planID", billing, status, "startedAt", "expiresAt", "autoRenew") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
26393ce0-892c-4299-a082-96c414b30b70	5f05a9005e38f1a064d3613251a18fe6c10c3972edde285771da489e59cac38f	2026-05-08 15:26:21.873271+07	20260508062213_update_schema	\N	\N	2026-05-08 15:26:21.658317+07	1
80fdb198-d267-439b-b681-d505a5cc6775	491ec417d5f5f51691b35db7ed5662800755eb0c6a3fddc410871e9374c39983	2026-05-08 15:26:21.877197+07	20260508063606_add_type_search_history	\N	\N	2026-05-08 15:26:21.874179+07	1
aa588636-aed4-4dbd-bbb1-821cd53bba6c	c9638e881346e8bee32d9c8b245c9c75cb080a942a50af02780bc5ea94f0c432	2026-05-08 15:26:21.882083+07	20260508063723_update_all	\N	\N	2026-05-08 15:26:21.878079+07	1
\.


--
-- Name: Account_accountID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Account_accountID_seq"', 1, false);


--
-- Name: CVAnalysisCache_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CVAnalysisCache_id_seq"', 1, false);


--
-- Name: CVAnalysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CVAnalysis_id_seq"', 1, false);


--
-- Name: CVBuilder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CVBuilder_id_seq"', 1, false);


--
-- Name: ChatMessage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatMessage_id_seq"', 1, false);


--
-- Name: ChatSession_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatSession_id_seq"', 1, false);


--
-- Name: Company_companyID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Company_companyID_seq"', 1, true);


--
-- Name: Industry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Industry_id_seq"', 1, true);


--
-- Name: JobAlert_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JobAlert_id_seq"', 1, false);


--
-- Name: JobRecommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JobRecommendation_id_seq"', 1, false);


--
-- Name: JobSkill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JobSkill_id_seq"', 1, false);


--
-- Name: JobSourceTracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JobSourceTracking_id_seq"', 1, true);


--
-- Name: Job_jobID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Job_jobID_seq"', 1, true);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, false);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 1, false);


--
-- Name: PlanLimit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PlanLimit_id_seq"', 1, false);


--
-- Name: RefundRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RefundRequest_id_seq"', 1, false);


--
-- Name: SavedJob_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SavedJob_id_seq"', 1, false);


--
-- Name: SearchHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SearchHistory_id_seq"', 1, false);


--
-- Name: Skill_skillID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Skill_skillID_seq"', 1, false);


--
-- Name: SubscriptionPlan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SubscriptionPlan_id_seq"', 1, false);


--
-- Name: UserBehavior_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserBehavior_id_seq"', 1, false);


--
-- Name: UserProfile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserProfile_id_seq"', 1, false);


--
-- Name: UserQuota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserQuota_id_seq"', 1, false);


--
-- Name: UserSkill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserSkill_id_seq"', 1, false);


--
-- Name: UserSubscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserSubscription_id_seq"', 1, false);


--
-- Name: User_userID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_userID_seq"', 1, false);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("accountID");


--
-- Name: CVAnalysisCache CVAnalysisCache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVAnalysisCache"
    ADD CONSTRAINT "CVAnalysisCache_pkey" PRIMARY KEY (id);


--
-- Name: CVAnalysis CVAnalysis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVAnalysis"
    ADD CONSTRAINT "CVAnalysis_pkey" PRIMARY KEY (id);


--
-- Name: CVBuilder CVBuilder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVBuilder"
    ADD CONSTRAINT "CVBuilder_pkey" PRIMARY KEY (id);


--
-- Name: ChatMessage ChatMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: ChatSession ChatSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatSession"
    ADD CONSTRAINT "ChatSession_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("companyID");


--
-- Name: Industry Industry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Industry"
    ADD CONSTRAINT "Industry_pkey" PRIMARY KEY (id);


--
-- Name: JobAlert JobAlert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobAlert"
    ADD CONSTRAINT "JobAlert_pkey" PRIMARY KEY (id);


--
-- Name: JobRecommendation JobRecommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobRecommendation"
    ADD CONSTRAINT "JobRecommendation_pkey" PRIMARY KEY (id);


--
-- Name: JobSkill JobSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSkill"
    ADD CONSTRAINT "JobSkill_pkey" PRIMARY KEY (id);


--
-- Name: JobSourceTracking JobSourceTracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSourceTracking"
    ADD CONSTRAINT "JobSourceTracking_pkey" PRIMARY KEY (id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY ("jobID");


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PlanLimit PlanLimit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PlanLimit"
    ADD CONSTRAINT "PlanLimit_pkey" PRIMARY KEY (id);


--
-- Name: RefundRequest RefundRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefundRequest"
    ADD CONSTRAINT "RefundRequest_pkey" PRIMARY KEY (id);


--
-- Name: SavedJob SavedJob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SavedJob"
    ADD CONSTRAINT "SavedJob_pkey" PRIMARY KEY (id);


--
-- Name: SearchHistory SearchHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SearchHistory"
    ADD CONSTRAINT "SearchHistory_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY ("skillID");


--
-- Name: SubscriptionPlan SubscriptionPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SubscriptionPlan"
    ADD CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY (id);


--
-- Name: UserBehavior UserBehavior_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBehavior"
    ADD CONSTRAINT "UserBehavior_pkey" PRIMARY KEY (id);


--
-- Name: UserProfile UserProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY (id);


--
-- Name: UserQuota UserQuota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserQuota"
    ADD CONSTRAINT "UserQuota_pkey" PRIMARY KEY (id);


--
-- Name: UserSkill UserSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_pkey" PRIMARY KEY (id);


--
-- Name: UserSubscription UserSubscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSubscription"
    ADD CONSTRAINT "UserSubscription_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_email_key" ON public."Account" USING btree (email);


--
-- Name: CVAnalysisCache_fileHash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CVAnalysisCache_fileHash_idx" ON public."CVAnalysisCache" USING btree ("fileHash");


--
-- Name: CVAnalysisCache_fileHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CVAnalysisCache_fileHash_key" ON public."CVAnalysisCache" USING btree ("fileHash");


--
-- Name: CVAnalysisCache_userID_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CVAnalysisCache_userID_idx" ON public."CVAnalysisCache" USING btree ("userID");


--
-- Name: CVAnalysis_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CVAnalysis_createdAt_idx" ON public."CVAnalysis" USING btree ("createdAt");


--
-- Name: CVAnalysis_fileHash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CVAnalysis_fileHash_idx" ON public."CVAnalysis" USING btree ("fileHash");


--
-- Name: CVAnalysis_fileHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CVAnalysis_fileHash_key" ON public."CVAnalysis" USING btree ("fileHash");


--
-- Name: CVAnalysis_userID_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CVAnalysis_userID_idx" ON public."CVAnalysis" USING btree ("userID");


--
-- Name: CVBuilder_userID_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CVBuilder_userID_idx" ON public."CVBuilder" USING btree ("userID");


--
-- Name: ChatMessage_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_createdAt_idx" ON public."ChatMessage" USING btree ("createdAt");


--
-- Name: ChatMessage_sessionID_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_sessionID_createdAt_idx" ON public."ChatMessage" USING btree ("sessionID", "createdAt");


--
-- Name: ChatMessage_sessionID_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_sessionID_idx" ON public."ChatMessage" USING btree ("sessionID");


--
-- Name: Company_companyName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Company_companyName_key" ON public."Company" USING btree ("companyName");


--
-- Name: Industry_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Industry_name_key" ON public."Industry" USING btree (name);


--
-- Name: JobAlert_accountID_keyword_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JobAlert_accountID_keyword_key" ON public."JobAlert" USING btree ("accountID", keyword);


--
-- Name: JobRecommendation_userID_jobID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JobRecommendation_userID_jobID_key" ON public."JobRecommendation" USING btree ("userID", "jobID");


--
-- Name: Job_sourceLink_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Job_sourceLink_key" ON public."Job" USING btree ("sourceLink");


--
-- Name: Notification_dedupeKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON public."Notification" USING btree ("dedupeKey");


--
-- Name: Payment_transactionRef_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_transactionRef_key" ON public."Payment" USING btree ("transactionRef");


--
-- Name: PlanLimit_planID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PlanLimit_planID_key" ON public."PlanLimit" USING btree ("planID");


--
-- Name: RefundRequest_paymentID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RefundRequest_paymentID_key" ON public."RefundRequest" USING btree ("paymentID");


--
-- Name: SavedJob_userID_jobID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SavedJob_userID_jobID_key" ON public."SavedJob" USING btree ("userID", "jobID");


--
-- Name: SearchHistory_accountID_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SearchHistory_accountID_idx" ON public."SearchHistory" USING btree ("accountID");


--
-- Name: Skill_name_industryID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Skill_name_industryID_key" ON public."Skill" USING btree (name, "industryID");


--
-- Name: SubscriptionPlan_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON public."SubscriptionPlan" USING btree (name);


--
-- Name: UserProfile_userID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserProfile_userID_key" ON public."UserProfile" USING btree ("userID");


--
-- Name: UserQuota_subscriptionID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserQuota_subscriptionID_key" ON public."UserQuota" USING btree ("subscriptionID");


--
-- Name: UserQuota_userID_month_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserQuota_userID_month_key" ON public."UserQuota" USING btree ("userID", month);


--
-- Name: User_accountID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_accountID_key" ON public."User" USING btree ("accountID");


--
-- Name: CVAnalysisCache CVAnalysisCache_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVAnalysisCache"
    ADD CONSTRAINT "CVAnalysisCache_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CVAnalysis CVAnalysis_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVAnalysis"
    ADD CONSTRAINT "CVAnalysis_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CVBuilder CVBuilder_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CVBuilder"
    ADD CONSTRAINT "CVBuilder_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessage ChatMessage_sessionID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_sessionID_fkey" FOREIGN KEY ("sessionID") REFERENCES public."ChatSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatSession ChatSession_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatSession"
    ADD CONSTRAINT "ChatSession_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobAlert JobAlert_accountID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobAlert"
    ADD CONSTRAINT "JobAlert_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES public."Account"("accountID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobRecommendation JobRecommendation_jobID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobRecommendation"
    ADD CONSTRAINT "JobRecommendation_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES public."Job"("jobID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobRecommendation JobRecommendation_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobRecommendation"
    ADD CONSTRAINT "JobRecommendation_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobSkill JobSkill_jobID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSkill"
    ADD CONSTRAINT "JobSkill_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES public."Job"("jobID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobSkill JobSkill_skillID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSkill"
    ADD CONSTRAINT "JobSkill_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES public."Skill"("skillID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JobSourceTracking JobSourceTracking_jobID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSourceTracking"
    ADD CONSTRAINT "JobSourceTracking_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES public."Job"("jobID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_companyID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES public."Company"("companyID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_industryID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_industryID_fkey" FOREIGN KEY ("industryID") REFERENCES public."Industry"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_subscriptionID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_subscriptionID_fkey" FOREIGN KEY ("subscriptionID") REFERENCES public."UserSubscription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PlanLimit PlanLimit_planID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PlanLimit"
    ADD CONSTRAINT "PlanLimit_planID_fkey" FOREIGN KEY ("planID") REFERENCES public."SubscriptionPlan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RefundRequest RefundRequest_paymentID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefundRequest"
    ADD CONSTRAINT "RefundRequest_paymentID_fkey" FOREIGN KEY ("paymentID") REFERENCES public."Payment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RefundRequest RefundRequest_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefundRequest"
    ADD CONSTRAINT "RefundRequest_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SavedJob SavedJob_jobID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SavedJob"
    ADD CONSTRAINT "SavedJob_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES public."Job"("jobID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SavedJob SavedJob_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SavedJob"
    ADD CONSTRAINT "SavedJob_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SearchHistory SearchHistory_accountID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SearchHistory"
    ADD CONSTRAINT "SearchHistory_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES public."Account"("accountID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Skill Skill_industryID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_industryID_fkey" FOREIGN KEY ("industryID") REFERENCES public."Industry"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserBehavior UserBehavior_jobID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBehavior"
    ADD CONSTRAINT "UserBehavior_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES public."Job"("jobID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserBehavior UserBehavior_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserBehavior"
    ADD CONSTRAINT "UserBehavior_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserProfile UserProfile_industryID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_industryID_fkey" FOREIGN KEY ("industryID") REFERENCES public."Industry"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserProfile UserProfile_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserQuota UserQuota_subscriptionID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserQuota"
    ADD CONSTRAINT "UserQuota_subscriptionID_fkey" FOREIGN KEY ("subscriptionID") REFERENCES public."UserSubscription"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserQuota UserQuota_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserQuota"
    ADD CONSTRAINT "UserQuota_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSkill UserSkill_skillID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES public."Skill"("skillID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSkill UserSkill_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSkill"
    ADD CONSTRAINT "UserSkill_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSubscription UserSubscription_planID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSubscription"
    ADD CONSTRAINT "UserSubscription_planID_fkey" FOREIGN KEY ("planID") REFERENCES public."SubscriptionPlan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSubscription UserSubscription_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserSubscription"
    ADD CONSTRAINT "UserSubscription_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_accountID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES public."Account"("accountID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict JpytnWSrbm2S9LUpGVpAsrQxAHhAOHDp8SMPBs7d4QIesJnmoPHVNg2eXtyxrrX

