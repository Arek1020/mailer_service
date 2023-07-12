
const config = {
    TEST: false,
    PORT: 4000,
    DB_CONNECTION_LIMIT: 5,
    DB_DATABASE: 'mailer',
    DB_HOST: '127.0.0.1',
    DB_USER: 'root',
    DB_PASSWORD: 'root',

    SECRETKEY: 'FSNOGOSHDG89GSDOFGHDS0',

    MAILER_HOST: 'smtp.poczta.onet.pl',
    MAILER_SMTP_PORT: 465,
    MAILER_USER: 'arecki@spoko.pl',
    MAILER_ADDRESS: 'arecki@spoko.pl',
    MAILER_PASS: 'Test123!@#',
    SMTP_DOMAIN: 'smtp.poczta.onet.pl',

    MAIL_SSL: 1,
}

export default config;
