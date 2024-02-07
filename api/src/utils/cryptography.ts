import * as crypto from 'crypto';
import * as openpgp from 'openpgp';

// Algorytm szyfrowania AES-256-CBC.
const algorithm: string = 'aes-256-cbc';
// Funkcja szyfrująca dane z użyciem szyfru Bacona
export const decrypt = (text: string, key?: string, iv_length?: number) => {
  key = key || ''
  if (text == null || text == '' || typeof text == 'undefined')
    return text

  key = crypto.createHash('md5').update(baconEncrypt(key), 'utf-8').digest('hex').toUpperCase();
  let length = iv_length || 16
  let iv: Buffer = Buffer.alloc(length)
  let decipher = crypto.createDecipheriv(algorithm, key, iv)

  let decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8')
  return decrypted
};


export const encrypt = (text: string, key?: string, iv_length?: number) => {
  key = key || ''
  if (text == null || text == '' || typeof text == 'undefined')
    return text
  if (typeof text == 'number')
    text = text + ''
  key = crypto.createHash('md5').update(baconEncrypt(key), 'utf-8').digest('hex').toUpperCase();
  let length = iv_length || 16
  let iv = Buffer.alloc(length)
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

  return encrypted
};

// Funkcja szyfrująca klucz szyfrowania szyfrem Bacona
const baconEncrypt = (key: string): string => {
  const baconCipher: { [key: string]: string } = {
    'a': 'AAAAA', 'b': 'AAAAB', 'c': 'AAABA', 'd': 'AAABB', 'e': 'AABAA',
    'f': 'AABAB', 'g': 'AABBA', 'h': 'AABBB', 'i': 'ABAAA', 'j': 'ABAAB',
    'k': 'ABABA', 'l': 'ABABB', 'm': 'ABBAA', 'n': 'ABBAB', 'o': 'ABBBA',
    'p': 'ABBBB', 'q': 'BAAAA', 'r': 'BAAAB', 's': 'BAABA', 't': 'BAABB',
    'u': 'BABAA', 'v': 'BABAB', 'w': 'BABBA', 'x': 'BABBB', 'y': 'BBAAA',
    'z': 'BBAAB', ' ': 'BBBBB'
  };

  return key.split('').map((char: string) => baconCipher[char.toLowerCase()]).join('');
};


export const generateKeyPair = async (name: string, email: string, password: string) => {
  const { privateKey, publicKey } = await openpgp.generateKey({
    userIDs: [{ name, email }],
    curve: 'curve25519',
    passphrase: password,
    format: 'armored'
  });

  return <any>{ privateKey, publicKey };
}




