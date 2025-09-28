declare namespace Express {
  export interface Request {
    context?: {
        userId: string,
        role: 'user' | 'admin' | 'super-admin',

    }
  }
}