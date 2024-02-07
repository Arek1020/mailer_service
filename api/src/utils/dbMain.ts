import { createPool, Pool, escape as dbEscape } from 'mysql';

// const dataSource = DATA_SOURCES.mySqlDataSource;

let pool: Pool;

/**
 * generates pool connection to be used throughout the app
 */
export const init = () => {
    try {
        pool = createPool({
            connectionLimit: 5,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        console.debug('MySql Adapter Pool generated successfully for database: ', process.env.DB_DATABASE);
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
                if (error) return reject(error);
                if (findOne)
                    if (results?.length > 0) results = results[0]
                    else results = {}
                return resolve(results);
            });
        });

    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}

export const escape = dbEscape;