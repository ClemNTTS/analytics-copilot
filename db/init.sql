-- On s'assure que l'extension pour les UUID est disponible
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- On supprime les tables existantes et leurs dépendances pour repartir sur une base propre
DROP TABLE IF EXISTS billing_invoice CASCADE;
DROP TABLE IF EXISTS billing_subscription CASCADE;
DROP TABLE IF EXISTS crm_customer CASCADE;


-- ====================================================================================
-- 1. TABLE DES CLIENTS (Schéma complet)
-- ====================================================================================
CREATE TABLE crm_customer (
    id BIGINT NOT NULL, 
    customer_brand_id BIGINT, 
    customer_category_id BIGINT, 
    seller_id BIGINT, 
    additional_details_id BIGINT, 
    address_book_id BIGINT, 
    minimum_target_account_id BIGINT, 
    invoicing_threshold numeric(23, 12), 
    check_threshold VARCHAR(25), 
    threshold_per_entity INTEGER DEFAULT 0, 
    minimum_article_id BIGINT, 
    version INTEGER, 
    created TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated TIMESTAMP WITHOUT TIME ZONE, 
    code VARCHAR(255) NOT NULL, 
    description VARCHAR(255), 
    address_1 VARCHAR(255), 
    address_2 VARCHAR(255), 
    address_3 VARCHAR(255), 
    address_4 VARCHAR(255), 
    address_5 VARCHAR(255), 
    address_city VARCHAR(100), 
    address_country_id BIGINT, 
    address_state VARCHAR(50), 
    address_zipcode VARCHAR(20), 
    default_level INTEGER DEFAULT 1, 
    external_ref_1 VARCHAR(255), 
    external_ref_2 VARCHAR(255), 
    firstname VARCHAR(100), 
    lastname VARCHAR(100), 
    provider_contact VARCHAR(255), 
    creator VARCHAR(100), 
    updater VARCHAR(100), 
    title_id BIGINT, 
    primary_contact BIGINT, 
    uuid VARCHAR(60) DEFAULT uuid_generate_v4() NOT NULL, 
    bam_id BIGINT, 
    cf_values JSONB, 
    job_title VARCHAR(255), 
    email VARCHAR(2000), 
    fax VARCHAR(50), 
    mobile VARCHAR(100), 
    phone VARCHAR(100), 
    vat_no VARCHAR(100), 
    vat_status VARCHAR(25) DEFAULT 'UNKNOWN', 
    minimum_amount_el VARCHAR(2000), 
    minimum_label_el VARCHAR(2000), 
    minimum_charge_template_id BIGINT, 
    company INTEGER DEFAULT 0, 
    legal_entity_type_id BIGINT, 
    anonymization_date TIMESTAMP WITHOUT TIME ZONE, 
    parent_customer_id BIGINT, 
    entity_type VARCHAR(15) DEFAULT 'INDIVIDUAL', 
    CONSTRAINT crm_customer_pkey PRIMARY KEY (id)
);


-- ====================================================================================
-- 2. TABLE DES ABONNEMENTS (Schéma complet)
-- ====================================================================================
CREATE TABLE billing_subscription (
    id BIGINT NOT NULL, 
    version INTEGER, 
    created TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated TIMESTAMP WITHOUT TIME ZONE, 
    code VARCHAR(255) NOT NULL, 
    description VARCHAR(255), 
    default_level INTEGER DEFAULT 1, 
    end_agrement_date TIMESTAMP WITHOUT TIME ZONE, 
    status VARCHAR(255), 
    status_date TIMESTAMP WITHOUT TIME ZONE, 
    subscription_date TIMESTAMP WITHOUT TIME ZONE, 
    termination_date TIMESTAMP WITHOUT TIME ZONE, 
    creator VARCHAR(100), 
    updater VARCHAR(100), 
    offer_id BIGINT, 
    sub_termin_reason_id BIGINT, 
 user_account_id BIGINT NOT NULL, 
    uuid VARCHAR(60) DEFAULT uuid_generate_v4() NOT NULL, 
    subscribed_till_date TIMESTAMP WITHOUT TIME ZONE, 
    auto_renew INTEGER DEFAULT 0 NOT NULL, 
    days_notify_renew INTEGER, 
    end_of_term_action VARCHAR(10), 
    auto_termin_reason_id BIGINT, 
    init_active_unit VARCHAR(5), 
    init_active INTEGER, 
    match_end_aggr_date INTEGER DEFAULT 0 NOT NULL, 
    renew_for_unit VARCHAR(5), 
    renew_for INTEGER, 
    renewed INTEGER DEFAULT 0 NOT NULL, 
    notify_of_renewal_date TIMESTAMP WITHOUT TIME ZONE, 
    renewal_notified_date TIMESTAMP WITHOUT TIME ZONE, 
    cf_values JSONB, 
    minimum_amount_el VARCHAR(2000), 
    minimum_label_el VARCHAR(2000), 
    initial_term_type VARCHAR(20), 
    billing_cycle BIGINT, 
    billing_run BIGINT, 
    auto_end_of_engagement INTEGER, 
    seller_id BIGINT NOT NULL, 
    rating_group VARCHAR(50), 
    auto_renew_date TIMESTAMP WITHOUT TIME ZONE, 
    mailing_type VARCHAR(255), 
    cced_emails VARCHAR(2000), 
    email VARCHAR(255), 
    electronic_billing INTEGER DEFAULT 0 NOT NULL, 
    email_template_id BIGINT, 
    initial_renewal TEXT, 
    calendar_init_active_id BIGINT, 
    calendar_renew_for_id BIGINT, 
    renewal_term_type VARCHAR(20), 
    minimum_invoice_sub_category_id BIGINT, 
    minimum_charge_template_id BIGINT, 
    payment_method_id BIGINT, 
    valid_from TIMESTAMP WITHOUT TIME ZONE, 
    valid_to TIMESTAMP WITHOUT TIME ZONE, 
    commercial_order_id BIGINT, 
    prestation VARCHAR(255), 
    minimum_article_id BIGINT, 
    order_offer_id BIGINT, 
    version_number INTEGER DEFAULT 1, 
    next_version BIGINT, 
    previous_version BIGINT, 
    sales_person_name VARCHAR(52), 
    contract_id BIGINT, 
    price_list_id BIGINT, 
    mrr numeric(23, 12), 
    CONSTRAINT billing_subscription_pkey PRIMARY KEY (id)
);


-- ====================================================================================
-- 3. TABLE DES FACTURES (Schéma complet)
-- ====================================================================================
CREATE TABLE billing_invoice (
    id BIGINT NOT NULL, 
    version INTEGER, 
    created TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated TIMESTAMP WITHOUT TIME ZONE, 
    alias VARCHAR(255), 
    amount numeric(23, 12), 
    amount_tax numeric(23, 12), 
    amount_with_tax numeric(23, 12), 
    amount_without_tax numeric(23, 12), 
    comment_text VARCHAR(1200), 
    discount numeric(23, 12), 
    due_date TIMESTAMP WITHOUT TIME ZONE, 
    iban VARCHAR(255), 
    invoice_date TIMESTAMP WITHOUT TIME ZONE, 
    invoice_number VARCHAR(50), 
    net_to_pay numeric(23, 12), 
    payment_method VARCHAR(255), 
    product_date TIMESTAMP WITHOUT TIME ZONE, 
    temporary_invoice_number VARCHAR(60), 
    creator VARCHAR(100), 
    updater VARCHAR(100), 
    billing_account_id BIGINT, 
    billing_run_id BIGINT, 
    recorded_invoice_id BIGINT, 
    trading_country_id BIGINT, 
    trading_currency_id BIGINT, 
    trading_language_id BIGINT, 
    detailed_invoice INTEGER DEFAULT 1 NOT NULL, 
    invoice_id BIGINT, 
    uuid VARCHAR(60) DEFAULT uuid_generate_v4() NOT NULL, 
    invoice_type_id BIGINT, 
    quote_id BIGINT, 
    cf_values JSONB, 
    pdf_filename VARCHAR(255), 
    xml_filename VARCHAR(255), 
    payment_method_id BIGINT, 
    due_balance numeric(23, 12), 
    seller_id BIGINT NOT NULL, 
    subscription_id BIGINT, 
    order_id BIGINT, 
    already_sent INTEGER DEFAULT 0 NOT NULL, 
    dont_send INTEGER DEFAULT 0 NOT NULL, 
    prepaid INTEGER DEFAULT 0 NOT NULL, 
    status VARCHAR(50), 
    external_ref VARCHAR(255), 
    initial_collection_date TIMESTAMP WITHOUT TIME ZONE, 
    reject_reason VARCHAR(255), 
    status_date TIMESTAMP WITHOUT TIME ZONE, 
    xml_date TIMESTAMP WITHOUT TIME ZONE, 
    pdf_date TIMESTAMP WITHOUT TIME ZONE, 
    discount_amount numeric(23, 12) NOT NULL, 
    discount_rate numeric(3, 3), 
    is_already_applied_minimum INTEGER, 
    is_already_added_discount INTEGER, 
    email_sent_date TIMESTAMP WITHOUT TIME ZONE, 
    payment_status VARCHAR(255), 
    payment_status_date TIMESTAMP WITHOUT TIME ZONE, 
    start_date TIMESTAMP WITHOUT TIME ZONE, 
    end_date TIMESTAMP WITHOUT TIME ZONE, 
    raw_amount numeric(23, 12) NOT NULL, 
    new_invoicing_process INTEGER DEFAULT 0 NOT NULL, 
    has_taxes INTEGER DEFAULT 0, 
    has_discounts INTEGER DEFAULT 0, 
    has_minimum INTEGER DEFAULT 0, 
    commercial_order_id BIGINT, 
    discount_plan_id BIGINT, 
    cpq_quote_id BIGINT, 
    amount_without_tax_before_discount numeric(23, 12), 
    is_reminder_level_triggered INTEGER DEFAULT 0, 
    related_dunning_collection_plan_id BIGINT, 
    dunning_collection_plan_triggered INTEGER DEFAULT 0, 
    last_applied_rate numeric(23, 12), 
    last_applied_rate_date TIMESTAMP WITHOUT TIME ZONE, 
    transactional_amount_without_tax numeric(23, 12), 
    transactional_amount_with_tax numeric(23, 12), 
    transactional_amount_tax numeric(23, 12), 
    transactional_net_to_pay numeric(23, 12), 
    transactional_raw_amount numeric(23, 12), 
    transactional_discount_amount numeric(23, 12), 
    transactional_amount_without_tax_before_discount numeric(23, 12), 
    payment_plan_id BIGINT, 
    open_order_number VARCHAR(255), 
    invoice_balance numeric(23, 12), 
    use_current_rate INTEGER DEFAULT 0, 
    invoice_validation_rule_id BIGINT, 
    transactional_invoice_balance numeric(23, 12), 
    use_specific_price_conversion INTEGER DEFAULT 0, 
    conversion_from_billing_currency INTEGER DEFAULT 0, 
    auto_matching INTEGER DEFAULT 0, 
    external_purchase_order_number VARCHAR(100), 
    ubl_reference INTEGER DEFAULT 0, 
    sips_batch_archive_name VARCHAR(255), 
    pdp_status_id BIGINT, 
    certificate_uncollectibility_number VARCHAR(50), 
    dunning_collection_plan_id BIGINT, 
    CONSTRAINT billing_invoice_pkey PRIMARY KEY (id)
);


-- ====================================================================================
-- INSERTION DES DONNÉES DE TEST MASSIVES
-- ====================================================================================

-- 1. CLIENTS (50)
INSERT INTO crm_customer (id, created, code, firstname, lastname, email, phone, address_city, address_zipcode, address_country_id, entity_type, seller_id) VALUES
(1, '2024-01-10', 'CUST-001', 'Jean', 'Dupont', 'jean.dupont@innova.tech', '0612345678', 'Paris', '75001', 1, 'INDIVIDUAL', 1),
(2, '2024-02-15', 'CUST-002', 'Marie', 'Curie', 'marie.curie@science.org', '0687654321', 'Lyon', '69002', 1, 'INDIVIDUAL', 1),
(3, '2024-03-20', 'CUST-003', 'Pierre', 'Martin', 'pierre.martin@webcorp.fr', '0611223344', 'Marseille', '13008', 1, 'INDIVIDUAL', 1),
(4, '2024-04-05', 'CUST-004', 'Sophie', 'Lefebvre', 'sophie.lefebvre@startup.io', '0655667788', 'Lille', '59000', 1, 'INDIVIDUAL', 2),
(5, '2024-05-12', 'CUST-005', 'Acme', 'Corp', 'contact@acmecorp.com', '0123456789', 'Bordeaux', '33000', 1, 'COMPANY', 2),
(6, '2024-06-18', 'CUST-006', 'Lucas', 'Garcia', 'lucas.garcia@email.com', '0699887766', 'Nantes', '44000', 1, 'INDIVIDUAL', 1),
(7, '2024-07-22', 'CUST-007', 'Chloé', 'Bernard', 'chloe.bernard@gmail.com', '0612121212', 'Strasbourg', '67000', 1, 'INDIVIDUAL', 1),
(8, '2024-08-30', 'CUST-008', 'Innovate', 'Solutions', 'support@innovate.com', '0456789012', 'Toulouse', '31000', 1, 'COMPANY', 3),
(9, '2024-09-01', 'CUST-009', 'Emma', 'Petit', 'emma.petit@email.fr', '0634343434', 'Nice', '06000', 1, 'INDIVIDUAL', 3),
(10, '2024-10-10', 'CUST-010', 'Louis', 'Robert', 'louis.robert@outlook.com', '0656565656', 'Montpellier', '34000', 1, 'INDIVIDUAL', 1),
(11, '2024-11-15', 'CUST-011', 'Global', 'Tech', 'admin@global.tech', '0987654321', 'Rennes', '35000', 1, 'COMPANY', 2),
(12, '2024-12-01', 'CUST-012', 'Alice', 'Moreau', 'alice.moreau@web.com', '0678787878', 'Reims', '51100', 1, 'INDIVIDUAL', 1),
(13, '2025-01-05', 'CUST-013', 'Julien', 'Simon', 'julien.simon@me.com', '0698989898', 'Saint-Étienne', '42000', 1, 'INDIVIDUAL', 1),
(14, '2025-01-20', 'CUST-014', 'Camille', 'Laurent', 'c.laurent@office.com', '0613131313', 'Le Havre', '76600', 1, 'INDIVIDUAL', 2),
(15, '2025-02-01', 'CUST-015', 'Dynamic', 'Systems', 'hr@dynamicsys.com', '0876543210', 'Grenoble', '38000', 1, 'COMPANY', 3),
(16, '2025-02-10', 'CUST-016', 'Manon', 'Fontaine', 'manon.fontaine@service.com', '0624242424', 'Dijon', '21000', 1, 'INDIVIDUAL', 1),
(17, '2025-02-15', 'CUST-017', 'Léo', 'Roux', 'leo.roux@company.com', '0663636363', 'Angers', '49000', 1, 'INDIVIDUAL', 2),
(18, '2025-02-20', 'CUST-018', 'Pauline', 'Vincent', 'pauline.vincent@mail.io', '0645454545', 'Nîmes', '30000', 1, 'INDIVIDUAL', 1),
(19, '2025-02-25', 'CUST-019', 'NextGen', 'Consulting', 'info@nextgen.co', '0765432109', 'Clermont-Ferrand', '63000', 1, 'COMPANY', 3),
(20, '2025-02-27', 'CUST-020', 'Hugo', 'Marchand', 'hugo.marchand@email.net', '0689898989', 'Aix-en-Provence', '13100', 1, 'INDIVIDUAL', 1),
(21, '2025-03-01', 'CUST-021', 'Zoe', 'Morel', 'zoe.morel@test.com', '0600000021', 'Brest', '29200', 1, 'INDIVIDUAL', 1),
(22, '2025-03-02', 'CUST-022', 'Thomas', 'Andre', 'thomas.andre@gmail.com', '0600000022', 'Tours', '37000', 1, 'INDIVIDUAL', 1),
(23, '2025-03-03', 'CUST-023', 'Ines', 'Mercier', 'ines.mercier@orange.fr', '0600000023', 'Amiens', '80000', 1, 'INDIVIDUAL', 2),
(24, '2025-03-04', 'CUST-024', 'Nathan', 'Guerin', 'n.guerin@outlook.fr', '0600000024', 'Limoges', '87000', 1, 'INDIVIDUAL', 1),
(25, '2025-03-05', 'CUST-025', 'Solar', 'Energy', 'contact@solarenergy.fr', '0100000025', 'Perpignan', '66000', 1, 'COMPANY', 3),
(26, '2025-03-06', 'CUST-026', 'Jade', 'Boyer', 'jade.boyer@sfr.fr', '0600000026', 'Metz', '57000', 1, 'INDIVIDUAL', 1),
(27, '2025-03-07', 'CUST-027', 'Theo', 'Gauthier', 'theo.gauthier@laposte.net', '0600000027', 'Besançon', '25000', 1, 'INDIVIDUAL', 2),
(28, '2025-03-08', 'CUST-028', 'Alpha', 'Logistics', 'ops@alphalog.com', '0300000028', 'Orléans', '45000', 1, 'COMPANY', 1),
(29, '2025-03-09', 'CUST-029', 'Lola', 'Fournier', 'lola.fournier@web.fr', '0600000029', 'Rouen', '76000', 1, 'INDIVIDUAL', 1),
(30, '2025-03-10', 'CUST-030', 'Enzo', 'Muller', 'enzo.muller@mail.de', '0600000030', 'Mulhouse', '68100', 1, 'INDIVIDUAL', 3),
(31, '2024-05-01', 'CUST-031', 'Fast', 'Delivery', 'info@fastdelivery.fr', '0144556677', 'Boulogne-Billancourt', '92100', 1, 'COMPANY', 2),
(32, '2024-06-15', 'CUST-032', 'Sarah', 'Lemoine', 'sarah.lemoine@gmail.com', '0622334455', 'Argenteuil', '95100', 1, 'INDIVIDUAL', 1),
(33, '2024-07-20', 'CUST-033', 'Marc', 'Dufour', 'marc.dufour@yahoo.fr', '0611889900', 'Saint-Denis', '93200', 1, 'INDIVIDUAL', 1),
(34, '2024-08-05', 'CUST-034', 'Eco', 'Build', 'contact@ecobuild.com', '0199887766', 'Montreuil', '93100', 1, 'COMPANY', 2),
(35, '2024-09-12', 'CUST-035', 'Manon', 'Girard', 'manon.girard@orange.fr', '0644551122', 'Nancy', '54000', 1, 'INDIVIDUAL', 1),
(36, '2024-10-18', 'CUST-036', 'Paul', 'Bonnet', 'paul.bonnet@outlook.com', '0677889900', 'Avignon', '84000', 1, 'INDIVIDUAL', 3),
(37, '2024-11-22', 'CUST-037', 'Cloud', 'Service', 'support@cloudservice.net', '0122334455', 'Poitiers', '86000', 1, 'COMPANY', 2),
(38, '2024-12-30', 'CUST-038', 'Julie', 'Masson', 'julie.masson@gmail.com', '0655667788', 'Courbevoie', '92400', 1, 'INDIVIDUAL', 1),
(39, '2025-01-12', 'CUST-039', 'Kevin', 'Sanchez', 'kevin.sanchez@test.fr', '0633445566', 'Versailles', '78000', 1, 'INDIVIDUAL', 1),
(40, '2025-02-05', 'CUST-040', 'Smart', 'Home', 'sales@smarthome.io', '0188776655', 'Pau', '64000', 1, 'COMPANY', 3),
(41, '2025-02-18', 'CUST-041', 'Antoine', 'Rey', 'antoine.rey@gmail.com', '0612341234', 'Antibes', '06600', 1, 'INDIVIDUAL', 1),
(42, '2025-02-22', 'CUST-042', 'Celia', 'Hubert', 'celia.hubert@web.fr', '0643214321', 'Cannes', '06400', 1, 'INDIVIDUAL', 2),
(43, '2025-02-28', 'CUST-043', 'Tech', 'Expert', 'contact@techexpert.com', '0199001122', 'La Rochelle', '17000', 1, 'COMPANY', 1),
(44, '2025-03-01', 'CUST-044', 'Sami', 'Bennani', 'sami.bennani@mail.com', '0677665544', 'Calais', '62100', 1, 'INDIVIDUAL', 1),
(45, '2025-03-02', 'CUST-045', 'Ocean', 'Drive', 'info@oceandrive.fr', '0233445566', 'Saint-Malo', '35400', 1, 'COMPANY', 2),
(46, '2025-03-03', 'CUST-046', 'Fanny', 'Perrin', 'fanny.perrin@gmail.com', '0611221122', 'Lorient', '56100', 1, 'INDIVIDUAL', 1),
(47, '2025-03-04', 'CUST-047', 'Lucas', 'Le Gall', 'lucas.legall@orange.fr', '0699889988', 'Quimper', '29000', 1, 'INDIVIDUAL', 3),
(48, '2025-03-05', 'CUST-048', 'Sky', 'High', 'ops@skyhigh.com', '0144332211', 'Troyes', '10000', 1, 'COMPANY', 2),
(49, '2025-03-06', 'CUST-049', 'Elisa', 'Marchal', 'elisa.marchal@outlook.fr', '0655443322', 'Chambéry', '73000', 1, 'INDIVIDUAL', 1),
(50, '2025-03-07', 'CUST-050', 'Victor', 'Schmitt', 'victor.schmitt@gmail.com', '0622112233', 'Colmar', '68000', 1, 'INDIVIDUAL', 1);


-- 2. ABONNEMENTS (300 pour plus de diversité)
INSERT INTO billing_subscription (id, created, code, description, status, status_date, subscription_date, termination_date, user_account_id, offer_id, mrr, seller_id)
SELECT 
    100 + i as id,
    '2024-01-01'::timestamp + (i * interval '17 hours 23 minutes') as created,
    'SUB-' || LPAD(i::text, 3, '0') as code,
    -- Utilisation d'un multiplicateur premier (7) pour "vibrer" la distribution
    CASE 
        WHEN (i * 7) % 100 < 17 THEN 'Abonnement Mobile Illimité' -- ~17%
        WHEN (i * 7) % 100 < 35 THEN 'Abonnement Fibre Premium'   -- ~18%
        WHEN (i * 7) % 100 < 48 THEN 'SaaS Licence Per User'     -- ~13%
        WHEN (i * 7) % 100 < 60 THEN 'Pack Business Standard'    -- ~12%
        WHEN (i * 7) % 100 < 71 THEN 'Abonnement Cloud 1TB'      -- ~11%
        WHEN (i * 7) % 100 < 80 THEN 'Home Security Pack'        -- ~9%
        WHEN (i * 7) % 100 < 88 THEN 'Dedicated Server XL'       -- ~8%
        WHEN (i * 7) % 100 < 94 THEN 'Enterprise Suite Platinum' -- ~6%
        WHEN (i * 7) % 100 < 97 THEN 'Smart City Dashboard'      -- ~3%
        ELSE 'Consulting Retainer'                               -- ~3%
    END as description,
    -- Statuts moins prévisibles
    CASE 
        WHEN (i * 13) % 15 = 0 THEN 'TERMINATED'
        WHEN (i * 13) % 15 = 1 THEN 'SUSPENDED'
        ELSE 'ACTIVE'
    END as status,
    '2024-01-01'::timestamp + (i * interval '17 hours') as status_date,
    '2024-01-01'::timestamp + (i * interval '17 hours') as subscription_date,
    CASE WHEN (i * 13) % 15 = 0 THEN '2025-01-01'::timestamp + ((i % 30) * interval '1 day') ELSE NULL END as termination_date,
    -- Clients Grands Comptes (Biaisé mais pas linéaire)
    CASE 
        WHEN (i * 3) % 10 < 3 THEN (i % 5) + 1 
        ELSE (i % 50) + 1 
    END as user_account_id,
    -- Offer ID mappé sur la description
    CASE 
        WHEN (i * 7) % 100 < 17 THEN 1001
        WHEN (i * 7) % 100 < 35 THEN 1002
        WHEN (i * 7) % 100 < 48 THEN 1003
        WHEN (i * 7) % 100 < 60 THEN 1004
        WHEN (i * 7) % 100 < 71 THEN 1005
        WHEN (i * 7) % 100 < 80 THEN 1006
        WHEN (i * 7) % 100 < 88 THEN 1007
        WHEN (i * 7) % 100 < 94 THEN 1008
        WHEN (i * 7) % 100 < 97 THEN 1009
        ELSE 1010
    END as offer_id,
    -- MRR avec forte variation (+/- 15%)
    (CASE 
        WHEN (i * 7) % 100 < 17 THEN 49.90
        WHEN (i * 7) % 100 < 35 THEN 99.00
        WHEN (i * 7) % 100 < 48 THEN 59.00
        WHEN (i * 7) % 100 < 60 THEN 79.00
        WHEN (i * 7) % 100 < 71 THEN 19.90
        WHEN (i * 7) % 100 < 80 THEN 45.00
        WHEN (i * 7) % 100 < 88 THEN 450.00
        WHEN (i * 7) % 100 < 94 THEN 899.00
        WHEN (i * 7) % 100 < 97 THEN 2500.00
        ELSE 1500.00
    END) * (0.85 + ( ( (i * 17) % 31)::numeric / 100.0 )) as mrr,
    (i % 3) + 1 as seller_id
FROM generate_series(1, 300) i;


-- 3. FACTURES (Génération massive de factures liées aux abonnements)
-- On génère environ 12 factures par abonnement actif
INSERT INTO billing_invoice (id, created, invoice_number, invoice_date, due_date, amount_with_tax, amount_without_tax, payment_method, status, billing_account_id, subscription_id, seller_id, discount_amount, raw_amount)
SELECT 
    2000 + (s.id * 50) + g.i as id,
    s.subscription_date + (g.i * interval '1 month') as created,
    'INV-' || s.code || '-' || LPAD(g.i::text, 2, '0') as invoice_number,
    s.subscription_date + (g.i * interval '1 month') as invoice_date,
    s.subscription_date + (g.i * interval '1 month') + interval '30 days' as due_date,
    (s.mrr * 1.2) as amount_with_tax,
    s.mrr as amount_without_tax,
    CASE WHEN s.id % 2 = 0 THEN 'CREDIT_CARD' ELSE 'DIRECT_DEBIT' END as payment_method,
    CASE WHEN (s.subscription_date + (g.i * interval '1 month')) < '2025-02-01' THEN 'PAID' ELSE 'UNPAID' END as status,
    s.user_account_id as billing_account_id,
    s.id as subscription_id,
    s.seller_id,
    0 as discount_amount,
    s.mrr as raw_amount
FROM billing_subscription s, generate_series(0, 12) g(i)
WHERE s.status != 'TERMINATED' OR (s.status = 'TERMINATED' AND (s.subscription_date + (g.i * interval '1 month')) <= s.termination_date);


-- ====================================================================================
-- GESTION DES DROITS
-- ====================================================================================
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'llm_user') THEN

      CREATE ROLE llm_user WITH LOGIN PASSWORD 'llm_access_only';
   END IF;
END
$$;

DO
$$
BEGIN
   EXECUTE format(
      'GRANT CONNECT ON DATABASE %I TO llm_user',
      current_database()
   );
END
$$;
GRANT USAGE ON SCHEMA public TO llm_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO llm_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO llm_user;
