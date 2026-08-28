const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DEMO_USER = { username: 'admin', password: 'admin123' };

export const authService = {
  async login(username: string, password: string): Promise<boolean> {
    await delay(500);
    return username === DEMO_USER.username && password === DEMO_USER.password;
  },
};
