import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "./.env" });
console.log("Current working directory:", process.cwd()); // Log current working directory for debugging

console.log("Database connection details:", {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.PORT),
}); // Log database connection details for debugging

const conn = mysql.createPool({

  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.PORT),
});

/**
 * Executes a SQL query using a connection pool and returns a promise with the result.
 *
 * @template T - The expected type of the query result.
 * @param {string} q - The SQL query string to be executed.
 * @param {any} [val] - Optional values to be used in the query.
 * @returns {Promise<T>} A promise that resolves with the query result.
 */

const query = <T = any>(q: string, val?: any): Promise<T> => {
  return new Promise<T>((res, rej) => {
    conn.query(q, val, (err, q) => {
      if (err) rej(err);
      res(q as T);
    });
  });
};

export default {
  insert: async <T = {}>(
    q: string,
    val?: any
  ): Promise<T & { insertId: number }> => {
    if (!q.toLowerCase().includes("insert"))
      throw { message: 'Query did not include keyword "insert".' };
    return await query<T & { insertId: number }>(q, val);
  },
  select: async <T = any>(q: string, val?: any): Promise<T[]> => {
    if (!q.toLowerCase().includes("select"))
      throw { message: 'Query did not include keyword "select".' };
    return await query<T[]>(q, val);
  },

  selectOne: async <T = any>(q: string, val?: any): Promise<T> => {
    if (!q.toLowerCase().includes("select"))
      throw { message: 'Query did not include keyword "select".' };
    const result = await query<T[]>(q, val);
    return result[0];
  },

  delete: async <T = any>(q: string, val?: any): Promise<T> => {
    if (!q.toLowerCase().includes("delete"))
      throw { message: 'Query did not include keyword "delete".' };
    return await query<T>(q, val);
  },
  patch: async <T = {}>(
    q: string,
    val: any
  ): Promise<T & { affectedRows: number }> => {
    if (!q.toLowerCase().includes("update"))
      throw { message: 'Query did not include keyword "update".' };
    return (await query<T & { affectedRows: number }>(q, val)) as T & {
      affectedRows: number;
    };
  },
  update: async <T = any>(
    q: string,
    val: any
  ): Promise<T & { affectedRows: number }> => {
    if (!q.toLowerCase().includes("update"))
      throw { message: 'Query did not include keyword "update".' };
    return await query<T & { affectedRows: number }>(q, val);
  },
};
