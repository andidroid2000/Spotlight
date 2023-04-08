
CREATE TABLE public.date_productii
(
    id_prod integer NOT NULL DEFAULT nextval('date_productii_id_prod_seq'::regclass),
    nume character varying(60) COLLATE pg_catalog."default" NOT NULL,
    descriere text COLLATE pg_catalog."default",
    cale_imagine character varying(300) COLLATE pg_catalog."default" NOT NULL,
    categ_prod categ_productie DEFAULT 'film'::categ_productie,
    regizor character varying(60) COLLATE pg_catalog."default" NOT NULL,
    nota numeric(3,1) NOT NULL,
    durata integer NOT NULL,
    data_lansare date,
    tara_prod tara_productie DEFAULT 'SUA'::tara_productie,
    gen_film character varying[] COLLATE pg_catalog."default" NOT NULL,
    actori character varying[] COLLATE pg_catalog."default",
    pt_copii boolean NOT NULL DEFAULT false,
    CONSTRAINT date_productii_pkey PRIMARY KEY (id_prod),
    CONSTRAINT date_productii_nota_check CHECK (nota > 0::numeric AND nota <= 10::numeric),
    CONSTRAINT date_productii_durata_check CHECK (durata > 0)
)

TABLESPACE pg_default;

ALTER TABLE public.date_productii
    OWNER to postgres;

GRANT ALL ON TABLE public.date_productii TO andi WITH GRANT OPTION;

GRANT ALL ON TABLE public.date_productii TO postgres;