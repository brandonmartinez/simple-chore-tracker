export async function up(knex) {
	await knex.schema.createTable("People", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();

		// Common Columns for soft deletion and timestamps
		table.boolean("deleted").defaultTo(false);
		table.timestamps(true, true);
	});

	await knex.schema.createTable("Chores", (table) => {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.integer("points").notNullable();
		table.string("category");

		// Common Columns for soft deletion and timestamps
		table.boolean("deleted").defaultTo(false);
		table.timestamps(true, true);
	});

	await knex.schema.createTable("ChoreAvailableAssignments", (table) => {
		table.increments("id").primary();
		table
			.integer("chore_id")
			.unsigned()
			.references("id")
			.inTable("Chores")
			.onDelete("CASCADE");
		table
			.integer("person_id")
			.unsigned()
			.references("id")
			.inTable("People")
			.onDelete("CASCADE");
		table.timestamps(true, true);
	});

	await knex.schema.createTable("TimePeriods", (table) => {
		table.increments("id").primary();
		table.date("start_date").notNullable();
		table.date("end_date").notNullable();

		// Common Columns for soft deletion and timestamps
		table.boolean("deleted").defaultTo(false);
		table.timestamps(true, true);
	});

	await knex.schema.createTable("ChoreAssignments", (table) => {
		table.increments("id").primary();
		table
			.integer("chore_id")
			.unsigned()
			.references("id")
			.inTable("Chores")
			.onDelete("CASCADE");
		table
			.integer("person_id")
			.unsigned()
			.references("id")
			.inTable("People")
			.onDelete("CASCADE");
		table
			.integer("time_period_id")
			.unsigned()
			.references("id")
			.inTable("TimePeriods")
			.onDelete("CASCADE");
		table.timestamps(true, true);
	});

	await knex.schema.createTable("ChoreCompletions", (table) => {
		table.increments("id").primary();
		table
			.integer("chore_id")
			.unsigned()
			.references("id")
			.inTable("Chores")
			.onDelete("CASCADE");
		table
			.integer("person_id")
			.unsigned()
			.references("id")
			.inTable("People")
			.onDelete("CASCADE");
		table
			.integer("time_period_id")
			.unsigned()
			.references("id")
			.inTable("TimePeriods")
			.onDelete("CASCADE");
		table.integer("points_earned").notNullable();
		table.timestamps(true, true);
	});

	await knex.schema.createTable("Rewards", (table) => {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.integer("points_cost").notNullable();

		// Common Columns for soft deletion and timestamps
		table.boolean("deleted").defaultTo(false);
		table.timestamps(true, true);
	});

	await knex.schema.createTable("RewardClaims", (table) => {
		table.increments("id").primary();
		table
			.integer("reward_id")
			.unsigned()
			.references("id")
			.inTable("Rewards")
			.onDelete("CASCADE");
		table
			.integer("person_id")
			.unsigned()
			.references("id")
			.inTable("People")
			.onDelete("CASCADE");
		table.integer("points_used").notNullable();

		// Common Columns for soft deletion and timestamps
		table.boolean("deleted").defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex) {
	await knex.schema.dropTableIfExists("RewardClaims");
	await knex.schema.dropTableIfExists("Rewards");
	await knex.schema.dropTableIfExists("ChoreCompletions");
	await knex.schema.dropTableIfExists("ChoreAssignments");
	await knex.schema.dropTableIfExists("ChoreAvailableAssignments");
	await knex.schema.dropTableIfExists("Chores");
	await knex.schema.dropTableIfExists("People");
	await knex.schema.dropTableIfExists("TimePeriods");
}
