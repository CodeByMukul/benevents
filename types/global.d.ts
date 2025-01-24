export {}

declare global {
  interface CustomJwtSessionClaims {
    username?: string
    id?: string
  }
}
