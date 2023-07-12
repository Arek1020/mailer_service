import * as crypto from 'crypto'
import { Buffer } from 'buffer';

const alg = 'aes-256-ctr';

export const decrypt = (text: string, key: string, iv_length?: number) => {
    if (text == null || text == '' || typeof text == 'undefined')
        return text

    key = crypto.createHash('md5').update(key, 'utf-8').digest('hex').toUpperCase();
    let length = iv_length || 16
    let iv: Buffer = Buffer.alloc(length)
    let decipher = crypto.createDecipheriv(alg, key, iv)

    let decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8')

    return decrypted
};