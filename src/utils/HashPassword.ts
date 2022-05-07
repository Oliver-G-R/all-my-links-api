import { genSaltSync, hashSync, compareSync } from 'bcrypt'

export class HashPassword {
  static hash (password: string): string {
    const salt = genSaltSync(10)
    return hashSync(password, salt)
  }

  static comparePassword = (password: string, hash: string):boolean => compareSync(password, hash)
}
