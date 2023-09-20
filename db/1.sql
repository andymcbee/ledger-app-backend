    CREATE TYPE USER_ROLE AS ENUM ('Admin', 'User', 'Read Only');
    CREATE TYPE transaction_type AS ENUM ('credit', 'debit');



    DROP TABLE organization_users CASCADE;
    DROP TABLE users CASCADE;
    DROP TABLE organizations CASCADE;
    


    CREATE TABLE users(
        id             VARCHAR(255) PRIMARY KEY    NOT NULL,
        name           VARCHAR(255),
        email          VARCHAR(255) UNIQUE NOT NULL,
        password       VARCHAR(255) NOT NULL,
        created_at     TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE organizations(
        id             VARCHAR(255) PRIMARY KEY    NOT NULL,
        name           VARCHAR(255),
        created_at     TIMESTAMPTZ DEFAULT NOW()
    );



    CREATE TABLE organization_users(
        id                VARCHAR(255) PRIMARY KEY    NOT NULL,
        organization_id   VARCHAR(255) NOT NULL,
        user_role USER_ROLE,
        user_id           VARCHAR(255)  NOT NULL,
        created_at        TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        UNIQUE (organization_id, user_id)
    );




INSERT INTO users (id, name, email, password) VALUES ('1', 'John Doe', 'john2@example.com', 'hashed_password');

INSERT INTO organizations (id, name) VALUES ('1', 'AMC Corp');

INSERT INTO organization_users (id, organization_id, user_id) VALUES ('1', '1', '1');


SELECT * FROM organization_users;

DELETE FROM users WHERE id='1';

/*LEDGER TABLES*/

    CREATE TABLE ledgers(
        id                VARCHAR(255) PRIMARY KEY    NOT NULL,
        organization_id   VARCHAR(255) NOT NULL,
        name              VARCHAR(255),
        created_at        TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );



/*CHANGE TRANSACTION_DATE TO NOT NULL AND NO DEFAULT VALUE LATER.*/




    CREATE TABLE ledger_transactions(
        id                VARCHAR(255) PRIMARY KEY    NOT NULL,
        organization_id   VARCHAR(255) NOT NULL,
        ledger_id         VARCHAR(255) NOT NULL,
        amount_cents      INT NOT NULL,
        description       VARCHAR(255),
        transaction_date  TIMESTAMPTZ DEFAULT NOW(),
        transaction_type transaction_type,  /*OPTIONS: credit or debit*/
        created_at        TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE

    );



/*Orphan records allowed if its initial transaction is deleted*/
    CREATE TABLE ledger_history(
        id                          VARCHAR(255) PRIMARY KEY    NOT NULL,
        organization_id   VARCHAR(255) NOT NULL,
        ledger_id                   VARCHAR(255) NOT NULL,
        ledger_transaction_id       VARCHAR(255) NOT NULL,
        modified_by_user_id         VARCHAR(255) NOT NULL,
        amount_before_cents         INT NOT NULL,
        amount_after_cents          INT NOT NULL,
        description                 VARCHAR(255),
        created_at                  TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE


    );




    CREATE TABLE ledger_users(
        id                VARCHAR(255) PRIMARY KEY    NOT NULL,
        organization_id   VARCHAR(255) NOT NULL,
        ledger_id         VARCHAR(255) NOT NULL,
        user_id           VARCHAR(255)  NOT NULL,
        created_at        TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        UNIQUE (ledger_id, user_id)


    );