import { describe, expect, test, jest } from '@jest/globals';
import { getMailOptions, prepareForSend } from "../src/controllers/autosender"; // Replace with the actual path
import app from './../src/app';
import supertest from 'supertest';

const request = supertest(app)

const mailsToSend = require('../mocks/mailsToSend')
const preparedMail = require('../mocks/preparedMail')
const user = require('../mocks/user')
const mailConfig = require('../mocks/mailConfig')



describe("AutoSender - start function", () => {

    test("Check the test endpoint", async () => {
        const res = await request.post("/status");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("It works!");
    });

    for (let mailToSend of mailsToSend) {
        test('Check mails preparing', () => {
            expect(prepareForSend(mailToSend, user, mailConfig)).toStrictEqual(preparedMail)
        })
    }

    for (let mailToSend of mailsToSend) {
        test('Check generating mailoptions for mail: ' + mailToSend.id, () => {
            expect(getMailOptions(mailToSend, mailToSend.desc, user, [])).toStrictEqual({
                to: 'mail@gmail.com',
                subject: 'aaa',
                body: '<html> <a href="http://localhost:3000/decrypt/145"> ODSZYFRUJ WIADOMOŚĆ</a></html>',
                password: 'qwer',
                attachments: [],
                publicKey: ''
            })
        })
    }
});


