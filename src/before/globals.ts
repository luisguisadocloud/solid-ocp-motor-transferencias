/**
 * Globals declarados - en producción serían imports reales (`undici`, `mysql2`, `@sendgrid/mail`).
 */
export interface FraudApiResponse {
  json: () => Promise<{ risk: number }>;
}

export interface MysqlConnection {
  query: (sql: string, params: unknown[]) => Promise<void>;
  end: () => Promise<void>;
}

declare const fetch: (url: string) => Promise<FraudApiResponse>;
declare const mysql: {
  createConnection: (cfg: object) => Promise<MysqlConnection>;
};
declare const sendgrid: {
  send: (msg: { to: string; subject: string; text: string }) => Promise<void>;
};

export const globalFetch = (url: string): Promise<FraudApiResponse> => fetch(url);
export const globalMysql = mysql;
export const globalSendgrid = sendgrid;
