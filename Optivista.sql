--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (PGlite 0.2.0)
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: embeddings; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.embeddings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding public.vector(384) NOT NULL
);


ALTER TABLE meta.embeddings OWNER TO postgres;

--
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.embeddings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.embeddings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migrations (
    version text NOT NULL,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migrations OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id bigint NOT NULL,
    code text NOT NULL,
    discount_percentage numeric,
    valid_from date NOT NULL,
    valid_until date NOT NULL,
    usage_limit integer,
    CONSTRAINT coupons_discount_percentage_check CHECK (((discount_percentage >= (0)::numeric) AND (discount_percentage <= (100)::numeric)))
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.coupons ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.coupons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id bigint NOT NULL,
    user_id bigint,
    product_id bigint,
    rating integer,
    review text,
    feedback_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT feedback_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.feedback ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id bigint NOT NULL,
    product_id bigint,
    quantity_in_stock integer NOT NULL,
    reorder_level integer
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.inventory ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inventory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint,
    message text NOT NULL,
    read_status boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: orderitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderitems (
    id bigint NOT NULL,
    order_id bigint,
    product_id bigint,
    quantity integer NOT NULL,
    price numeric NOT NULL
);


ALTER TABLE public.orderitems OWNER TO postgres;

--
-- Name: orderitems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.orderitems ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.orderitems_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_id bigint,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text,
    total_price numeric NOT NULL,
    shipping_address text,
    payment_method text
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.orders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    name text NOT NULL,
    style text,
    color text,
    size text,
    price numeric NOT NULL,
    model_3d text,
    description text,
    category_id bigint,
    brand text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.products ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id bigint NOT NULL,
    product_id bigint,
    discount_percentage numeric,
    start_date date NOT NULL,
    end_date date NOT NULL,
    CONSTRAINT promotions_discount_percentage_check CHECK (((discount_percentage >= (0)::numeric) AND (discount_percentage <= (100)::numeric)))
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.promotions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.promotions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    user_id bigint,
    product_id bigint,
    title text,
    content text,
    rating integer,
    review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id bigint NOT NULL,
    user_id bigint,
    session_token text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sessions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: useractivitylog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.useractivitylog (
    id bigint NOT NULL,
    user_id bigint,
    activity_type text NOT NULL,
    activity_details text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.useractivitylog OWNER TO postgres;

--
-- Name: useractivitylog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.useractivitylog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.useractivitylog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    profile text,
    preferences text,
    auth_token text,
    last_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    id bigint NOT NULL,
    user_id bigint,
    product_id bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- Name: wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.wishlist ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.wishlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: meta; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: meta; Owner: postgres
--

INSERT INTO meta.migrations VALUES ('202407160001', 'embeddings', '2024-12-14 04:44:46.483+00');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories OVERRIDING SYSTEM VALUE VALUES (1, 'Sunglasses', 'Various styles of sunglasses');
INSERT INTO public.categories OVERRIDING SYSTEM VALUE VALUES (2, 'Prescription Glasses', 'Glasses with prescription lenses');
INSERT INTO public.categories OVERRIDING SYSTEM VALUE VALUES (34, 'Sunglasses', 'Various styles of sunglasses');
INSERT INTO public.categories OVERRIDING SYSTEM VALUE VALUES (35, 'Prescription Glasses', 'Glasses with prescription lenses');
INSERT INTO public.categories OVERRIDING SYSTEM VALUE VALUES (36, 'Sports Glasses', 'Glasses designed for sports activities');
INSERT INTO public.categories OVERRIDING SYSTEM VALUE VALUES (37, 'Fashion Glasses', 'Trendy glasses for fashion enthusiasts');
INSERT INTO public.categories OVERRIDING SYSTEM VALUE VALUES (38, 'Safety Glasses', 'Protective eyewear for safety purposes');


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orderitems; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products OVERRIDING SYSTEM VALUE VALUES (3, 'Aviator Sunglasses', 'Aviator', 'Black', 'Medium', 150.00, 'model_3d_1', 'Classic aviator sunglasses', 1, 'Ray-Ban');
INSERT INTO public.products OVERRIDING SYSTEM VALUE VALUES (4, 'Round Glasses', 'Round', 'Gold', 'Small', 120.00, 'model_3d_2', 'Stylish round glasses', 2, 'Gucci');


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: useractivitylog; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (5, 'johndoe', 'johndoe@example.com', 'hashed_password_1', 'Profile of John Doe', 'Preferences of John', 'auth_token_1', '2023-10-01 10:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (6, 'janedoe', 'janedoe@example.com', 'hashed_password_2', 'Profile of Jane Doe', 'Preferences of Jane', 'auth_token_2', '2023-10-02 11:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (34, 'user1', 'user1@example.com', 'hashed_password_1', 'Profile of User 1', 'Preferences of User 1', 'auth_token_1', '2023-10-01 10:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (35, 'user2', 'user2@example.com', 'hashed_password_2', 'Profile of User 2', 'Preferences of User 2', 'auth_token_2', '2023-10-02 11:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (36, 'user3', 'user3@example.com', 'hashed_password_3', 'Profile of User 3', 'Preferences of User 3', 'auth_token_3', '2023-10-03 12:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (37, 'user4', 'user4@example.com', 'hashed_password_4', 'Profile of User 4', 'Preferences of User 4', 'auth_token_4', '2023-10-04 13:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (38, 'user5', 'user5@example.com', 'hashed_password_5', 'Profile of User 5', 'Preferences of User 5', 'auth_token_5', '2023-10-05 14:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (39, 'user6', 'user6@example.com', 'hashed_password_6', 'Profile of User 6', 'Preferences of User 6', 'auth_token_6', '2023-10-06 15:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (40, 'user7', 'user7@example.com', 'hashed_password_7', 'Profile of User 7', 'Preferences of User 7', 'auth_token_7', '2023-10-07 16:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (41, 'user8', 'user8@example.com', 'hashed_password_8', 'Profile of User 8', 'Preferences of User 8', 'auth_token_8', '2023-10-08 17:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (42, 'user9', 'user9@example.com', 'hashed_password_9', 'Profile of User 9', 'Preferences of User 9', 'auth_token_9', '2023-10-09 18:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (43, 'user10', 'user10@example.com', 'hashed_password_10', 'Profile of User 10', 'Preferences of User 10', 'auth_token_10', '2023-10-10 19:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (44, 'user11', 'user11@example.com', 'hashed_password_11', 'Profile of User 11', 'Preferences of User 11', 'auth_token_11', '2023-10-11 20:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (45, 'user12', 'user12@example.com', 'hashed_password_12', 'Profile of User 12', 'Preferences of User 12', 'auth_token_12', '2023-10-12 21:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (46, 'user13', 'user13@example.com', 'hashed_password_13', 'Profile of User 13', 'Preferences of User 13', 'auth_token_13', '2023-10-13 22:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (47, 'user14', 'user14@example.com', 'hashed_password_14', 'Profile of User 14', 'Preferences of User 14', 'auth_token_14', '2023-10-14 23:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (48, 'user15', 'user15@example.com', 'hashed_password_15', 'Profile of User 15', 'Preferences of User 15', 'auth_token_15', '2023-10-15 00:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (49, 'user16', 'user16@example.com', 'hashed_password_16', 'Profile of User 16', 'Preferences of User 16', 'auth_token_16', '2023-10-16 01:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (50, 'user17', 'user17@example.com', 'hashed_password_17', 'Profile of User 17', 'Preferences of User 17', 'auth_token_17', '2023-10-17 02:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (51, 'user18', 'user18@example.com', 'hashed_password_18', 'Profile of User 18', 'Preferences of User 18', 'auth_token_18', '2023-10-18 03:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (52, 'user19', 'user19@example.com', 'hashed_password_19', 'Profile of User 19', 'Preferences of User 19', 'auth_token_19', '2023-10-19 04:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (53, 'user20', 'user20@example.com', 'hashed_password_20', 'Profile of User 20', 'Preferences of User 20', 'auth_token_20', '2023-10-20 05:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (54, 'user21', 'user21@example.com', 'hashed_password_21', 'Profile of User 21', 'Preferences of User 21', 'auth_token_21', '2023-10-21 06:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (55, 'user22', 'user22@example.com', 'hashed_password_22', 'Profile of User 22', 'Preferences of User 22', 'auth_token_22', '2023-10-22 07:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (56, 'user23', 'user23@example.com', 'hashed_password_23', 'Profile of User 23', 'Preferences of User 23', 'auth_token_23', '2023-10-23 08:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (57, 'user24', 'user24@example.com', 'hashed_password_24', 'Profile of User 24', 'Preferences of User 24', 'auth_token_24', '2023-10-24 09:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (58, 'user25', 'user25@example.com', 'hashed_password_25', 'Profile of User 25', 'Preferences of User 25', 'auth_token_25', '2023-10-25 10:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (59, 'user26', 'user26@example.com', 'hashed_password_26', 'Profile of User 26', 'Preferences of User 26', 'auth_token_26', '2023-10-26 11:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (60, 'user27', 'user27@example.com', 'hashed_password_27', 'Profile of User 27', 'Preferences of User 27', 'auth_token_27', '2023-10-27 12:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (61, 'user28', 'user28@example.com', 'hashed_password_28', 'Profile of User 28', 'Preferences of User 28', 'auth_token_28', '2023-10-28 13:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (62, 'user29', 'user29@example.com', 'hashed_password_29', 'Profile of User 29', 'Preferences of User 29', 'auth_token_29', '2023-10-29 14:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (63, 'user30', 'user30@example.com', 'hashed_password_30', 'Profile of User 30', 'Preferences of User 30', 'auth_token_30', '2023-10-30 15:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (64, 'user31', 'user31@example.com', 'hashed_password_31', 'Profile of User 31', 'Preferences of User 31', 'auth_token_31', '2023-10-31 16:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (65, 'user32', 'user32@example.com', 'hashed_password_32', 'Profile of User 32', 'Preferences of User 32', 'auth_token_32', '2023-11-01 17:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (66, 'user33', 'user33@example.com', 'hashed_password_33', 'Profile of User 33', 'Preferences of User 33', 'auth_token_33', '2023-11-02 18:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (67, 'user34', 'user34@example.com', 'hashed_password_34', 'Profile of User 34', 'Preferences of User 34', 'auth_token_34', '2023-11-03 19:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (68, 'user35', 'user35@example.com', 'hashed_password_35', 'Profile of User 35', 'Preferences of User 35', 'auth_token_35', '2023-11-04 20:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (69, 'user36', 'user36@example.com', 'hashed_password_36', 'Profile of User 36', 'Preferences of User 36', 'auth_token_36', '2023-11-05 21:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (70, 'user37', 'user37@example.com', 'hashed_password_37', 'Profile of User 37', 'Preferences of User 37', 'auth_token_37', '2023-11-06 22:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (71, 'user38', 'user38@example.com', 'hashed_password_38', 'Profile of User 38', 'Preferences of User 38', 'auth_token_38', '2023-11-07 23:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (72, 'user39', 'user39@example.com', 'hashed_password_39', 'Profile of User 39', 'Preferences of User 39', 'auth_token_39', '2023-11-08 00:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (73, 'user40', 'user40@example.com', 'hashed_password_40', 'Profile of User 40', 'Preferences of User 40', 'auth_token_40', '2023-11-09 01:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (74, 'user41', 'user41@example.com', 'hashed_password_41', 'Profile of User 41', 'Preferences of User 41', 'auth_token_41', '2023-11-10 02:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (75, 'user42', 'user42@example.com', 'hashed_password_42', 'Profile of User 42', 'Preferences of User 42', 'auth_token_42', '2023-11-11 03:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (76, 'user43', 'user43@example.com', 'hashed_password_43', 'Profile of User 43', 'Preferences of User 43', 'auth_token_43', '2023-11-12 04:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (77, 'user44', 'user44@example.com', 'hashed_password_44', 'Profile of User 44', 'Preferences of User 44', 'auth_token_44', '2023-11-13 05:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (78, 'user45', 'user45@example.com', 'hashed_password_45', 'Profile of User 45', 'Preferences of User 45', 'auth_token_45', '2023-11-14 06:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (79, 'user46', 'user46@example.com', 'hashed_password_46', 'Profile of User 46', 'Preferences of User 46', 'auth_token_46', '2023-11-15 07:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (80, 'user47', 'user47@example.com', 'hashed_password_47', 'Profile of User 47', 'Preferences of User 47', 'auth_token_47', '2023-11-16 08:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (81, 'user48', 'user48@example.com', 'hashed_password_48', 'Profile of User 48', 'Preferences of User 48', 'auth_token_48', '2023-11-17 09:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (82, 'user49', 'user49@example.com', 'hashed_password_49', 'Profile of User 49', 'Preferences of User 49', 'auth_token_49', '2023-11-18 10:00:00');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (83, 'user50', 'user50@example.com', 'hashed_password_50', 'Profile of User 50', 'Preferences of User 50', 'auth_token_50', '2023-11-19 11:00:00');


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.embeddings_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 38, true);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, false);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: orderitems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderitems_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 38, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 33, true);


--
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_id_seq', 1, false);


--
-- Name: useractivitylog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.useractivitylog_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 83, true);


--
-- Name: wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlist_id_seq', 1, false);


--
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: orderitems orderitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);


--
-- Name: useractivitylog useractivitylog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.useractivitylog
    ADD CONSTRAINT useractivitylog_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: feedback feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: inventory inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orderitems orderitems_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: orderitems orderitems_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: promotions promotions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: useractivitylog useractivitylog_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.useractivitylog
    ADD CONSTRAINT useractivitylog_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: wishlist wishlist_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

