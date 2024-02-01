import * as openpgp from 'openpgp';

export const decrypt = async (message: string, password: string, privateKeyArmored: string, publicKeyArmored: string) => {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: password
    });

    const encryptedMessage = await openpgp.readMessage({
        armoredMessage: message // parse armored message
    });
    const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        verificationKeys: publicKey as any, // optional
        decryptionKeys: privateKey as any
    });
    return decrypted;
}

export const encrypt = async (message: string, password: string, privateKeyArmored: string, publicKeyArmored: string,) => {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: password
    });
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey // optional
    });
    return encrypted;
}