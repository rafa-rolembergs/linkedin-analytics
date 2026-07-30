/*
==========================================================
NoTopo Prospect Intelligence
Database Schema
==========================================================

Este arquivo documenta o modelo de dados da aplicação.

A extensão utiliza chrome.storage.local.

Este schema serve como referência para manter todos os
módulos utilizando a mesma estrutura de dados.

==========================================================
*/


/* =======================================================
   COMPANIES
======================================================= */

CREATE TABLE companies (

    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    linkedin TEXT NOT NULL UNIQUE,

    status TEXT NOT NULL,

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL

);


/* =======================================================
   PEOPLE
======================================================= */

CREATE TABLE people (

    id TEXT PRIMARY KEY,

    company_id TEXT NOT NULL,

    name TEXT NOT NULL,

    job_title TEXT,

    linkedin TEXT NOT NULL UNIQUE,

    photo TEXT,

    connection_status TEXT,

    invitation_sent_at DATETIME,

    connection_accepted_at DATETIME,

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL,

    FOREIGN KEY(company_id) REFERENCES companies(id)

);


/* =======================================================
   MESSAGES
======================================================= */

CREATE TABLE messages (

    id TEXT PRIMARY KEY,

    person_id TEXT NOT NULL,

    script INTEGER NOT NULL,

    sent_at DATETIME NOT NULL,

    replied BOOLEAN DEFAULT FALSE,

    replied_at DATETIME,

    FOREIGN KEY(person_id) REFERENCES people(id)

);


/* =======================================================
   DASHBOARD METRICS
=======================================================

Empresas Prospectadas

SELECT COUNT(*)
FROM companies
WHERE status = 'ICP';


Conexões Enviadas

SELECT COUNT(*)
FROM people
WHERE invitation_sent_at IS NOT NULL;


Conexões Aceitas

SELECT COUNT(*)
FROM people
WHERE connection_accepted_at IS NOT NULL;


Script 1

SELECT COUNT(*)
FROM messages
WHERE script = 1;


Script 2

SELECT COUNT(*)
FROM messages
WHERE script = 2;


Script 3

SELECT COUNT(*)
FROM messages
WHERE script = 3;


Todas as tabelas possuem datas para permitir filtros por:

- Dia
- Semana
- Mês
- Período personalizado

======================================================= */