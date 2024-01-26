import * as openpgp from 'openpgp';
const publicKeyArmored = ` 
-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZbFDpxYJKwYBBAHaRw8BAQdAbYfSBc0vxVltzmBmfN7qf95lAiexRDDW
Se1VDyE5HmPNJ2FiYW5hc0BibHVlZm9ybS5wbCA8YWVya3Fwd29AZ21haWwu
Y29tPsKMBBAWCgA+BYJlsUOnBAsJBwgJkOLp1L+fUuKPAxUICgQWAAIBAhkB
ApsDAh4BFiEEeQmhlnNX9qZnSEAt4unUv59S4o8AAPQ6AP4jfEN7CWkhfKP7
jOAajgjzsQxYkLHtGrf/uGJYp8A7awD/T0JUCH2QkrFtDKFtNSyt4pQJUedp
+lqQVdB8kepxWQfOOARlsUOnEgorBgEEAZdVAQUBAQdADC+75bDx7R7B4iZ3
W0lKGoSbZ9Uy0pU9RzB+J8lFa1ADAQgHwngEGBYIACoFgmWxQ6cJkOLp1L+f
UuKPApsMFiEEeQmhlnNX9qZnSEAt4unUv59S4o8AAGs/AP969jIK5zYr1rFb
kUcZG24GzQl6DBsh85IekNKT7LEIRAEA1eP+gAE29rJHJRbgxIgzYv0aFnth
6W4R5B6OHaKC5wM=
=s8Fx
-----END PGP PUBLIC KEY BLOCK-----`

const privateKeyArmored = `
-----BEGIN PGP PRIVATE KEY BLOCK-----

xYYEZbFDpxYJKwYBBAHaRw8BAQdAbYfSBc0vxVltzmBmfN7qf95lAiexRDDW
Se1VDyE5HmP+CQMIn8zU5nXl837g2uS/3kTOcAmMxK6Tu1wGIKV19No9Zhn1
3h33jTMFOtyqXH5Lpb10o4vmJvPkAW+Sll2wTU6nneO7TpMzAX+JbIGhmGST
hc0nYWJhbmFzQGJsdWVmb3JtLnBsIDxhZXJrcXB3b0BnbWFpbC5jb20+wowE
EBYKAD4FgmWxQ6cECwkHCAmQ4unUv59S4o8DFQgKBBYAAgECGQECmwMCHgEW
IQR5CaGWc1f2pmdIQC3i6dS/n1LijwAA9DoA/iN8Q3sJaSF8o/uM4BqOCPOx
DFiQse0at/+4YlinwDtrAP9PQlQIfZCSsW0MoW01LK3ilAlR52n6WpBV0HyR
6nFZB8eLBGWxQ6cSCisGAQQBl1UBBQEBB0AML7vlsPHtHsHiJndbSUoahJtn
1TLSlT1HMH4nyUVrUAMBCAf+CQMIvT3BBSwr8lrg7ER42KooC164PRT9Soof
PE+OIGWOXPUTKBX3mxOhUVD6ElrvX61ZP1tGoz+FtulRD6Z40ck70QoQIGAF
ypkL1Z0Wk+q1msJ4BBgWCAAqBYJlsUOnCZDi6dS/n1LijwKbDBYhBHkJoZZz
V/amZ0hALeLp1L+fUuKPAABrPwD/evYyCuc2K9axW5FHGRtuBs0JegwbIfOS
HpDSk+yxCEQBANXj/oABNvayRyUW4MSIM2L9GhZ7YeluEeQejh2igucD
=hySg
-----END PGP PRIVATE KEY BLOCK-----`

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