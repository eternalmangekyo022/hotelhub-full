class Cookie {
  cookieName: string;
  exp?: Date;

  constructor(cookieName: string, value: string, exp?: Date) {
    this.cookieName = cookieName;
    this.exp = exp;
    this.value = value;

    return new Proxy(this, {
      get(target, prop) {
        if (prop === "value") {
          return target.value;
        }
        return target[prop as keyof Cookie];
      },
      set(target, prop, newValue) {
        if (prop === "value") {
          target.value = newValue;
          return true;
        }
        target[prop as keyof Cookie] = newValue;
        return true;
      },
    });
  }

  private setCookie(value: string) {
    let cookieString = `${this.cookieName}=${value}`;
    if (this.exp) {
      cookieString += `; expires=${this.exp.toUTCString()}`;
    }
    cookieString += "; path=/";
    document.cookie = cookieString;
  }

  get value(): string | null {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, val] = cookie.split("=");
      if (name === this.cookieName) {
        return val;
      }
    }
    return null;
  }

  set value(newValue: string) {
    this.setCookie(newValue);
  }

  delete() {
    document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export default Cookie;
