// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		client: "pg",
		connection: {
			host: "localhost",
			user: "devuser",
			password: "devpassword",
			database: "devdb",
		},
		migrations: {
			directory: "./src/db/migrations",
		},
		seeds: {
			directory: "./src/db/seeds",
		},
	},

	production: {
		client: "pg",
		connection: {
			host: process.env.PG_HOST,
			user: process.env.PG_USER,
			password: process.env.PG_PASSWORD,
			database: process.env.PG_DATABASE,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
};
