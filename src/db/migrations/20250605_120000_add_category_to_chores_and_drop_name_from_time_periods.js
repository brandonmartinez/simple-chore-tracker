export async function up(knex) {
	await knex.schema.table("Chores", (table) => {
		table.string("category");
	});

	await knex.schema.table("TimePeriods", (table) => {
		table.dropColumn("name");
	});
}

export async function down(knex) {
	await knex.schema.table("Chores", (table) => {
		table.dropColumn("category");
	});

	await knex.schema.table("TimePeriods", (table) => {
		table.string("name").notNullable();
	});
}
