import { createHash } from "node:crypto"
import * as argon2 from 'argon2'

export async function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}


export function isProd() {
    return (process.env.NODE_ENV || '').indexOf('prod') > -1
}

export function toSha256Base64(s: string) {
    return createHash('sha256')
        .update(s)
        .digest('hex')
}

export async function generatePasswordHash(pass: string) {
    /*
    The variant of the hash function. Argon2 has several variants with different aims:

    argon2d is faster and highly resistant against GPU attacks, which is useful for cryptocurrency
    argon2i is slower and resistant against tradeoff attacks, which is preferred for password hashing and key derivation
    argon2id is a hybrid combination of the above, being resistant against GPU and tradeoff attacks

    The default is argon2id, and the types are available as attributes of the module.
    */

    return argon2.hash(pass, {
        type: argon2.argon2id,
        timeCost: 8,        // num iterations
        parallelism: 4,     // num threads
        hashLength: 40,
        memoryCost: 65536,  // bytes (default is 64MB)
    })

}
