const isDev = process.env.NODE_ENV === "development"
const isEnabled = isDev && process.env.AUTH_BYPASS === "1"

if (isEnabled && !(globalThis as { __authBypassLogged?: boolean }).__authBypassLogged) {
  ;(globalThis as { __authBypassLogged?: boolean }).__authBypassLogged = true
  console.log("[AUTH] Dev auth bypass enabled (AUTH_BYPASS=1)")
}

export const isAuthBypassEnabled = () => isEnabled

