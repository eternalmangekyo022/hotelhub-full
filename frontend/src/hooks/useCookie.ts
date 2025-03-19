export default class Cookie {
  /**
   * Sets a cookie with a specified name, value, and expiration date.
   * @param name - The name of the cookie.
   * @param value - The value of the cookie.
   * @param daysToExpire - The number of days until the cookie expires.
   */
  static set(name: string, value: string, daysToExpire: number): void {
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  /**
   * Gets the value of a cookie by its name.
   * @param name - The name of the cookie.
   * @returns The value of the cookie if it exists, otherwise null.
   */
  static get(name: string): string | null {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(cookieName)) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }

  /**
   * Deletes a cookie by setting its expiration date to a past date.
   * @param name - The name of the cookie to delete.
   */
  static delete(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}
