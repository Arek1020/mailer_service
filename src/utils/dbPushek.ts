import { createPool, Pool, escape as dbEscape } from 'mysql';
import config from '../config';

// const dataSource = DATA_SOURCES.mySqlDataSource;

let pool: Pool;

/**
 * generates pool connection to be used throughout the app
 */
export const init = () => {
    try {
        pool = createPool({
            connectionLimit: config.DB_PUSHEK_CONNECTION_LIMIT,
            host: config.DB_PUSHEK_HOST,
            user: config.DB_PUSHEK_USER,
            password: config.DB_PUSHEK_PASSWORD,
            database: config.DB_PUSHEK_DATABASE,
        });

        console.debug('MySql Adapter Pool generated successfully for database: ', config.DB_PUSHEK_DATABASE);
    } catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('failed to initialized pool');
    }
};

/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
export const execute = <T>(query: string, params: string[] | Object, findOne: boolean | any): Promise<T> => {
    try {
        if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');

        return new Promise<T>((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) reject(error);
                if (findOne)
                    if (results?.length > 0) results = results[0]
                    else results = {}
                else resolve(results);
            });
        });

    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}

export const escape = dbEscape;