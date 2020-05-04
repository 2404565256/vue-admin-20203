import cookie from "cookie_js"

const adminToKen = "admin_toKen"
const userNameKey = "username"

export function getToKen() {
    return cookie.get(adminToKen)
}

export function setToKen(toKen) {
    return cookie.set(adminToKen, toKen)
}

export function removeToKen() {
    return cookie.remove(adminToKen)
}

export function getUserName() {
    return cookie.get(userNameKey)
}

export function setUserName(value) {
    return cookie.set(userNameKey, value)
}

export function removeUserName() {
    return cookie.remove(userNameKey)
}