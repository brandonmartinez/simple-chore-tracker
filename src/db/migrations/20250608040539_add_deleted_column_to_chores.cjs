exports.up = function (knex) {
	return knex.schema.table("Chores", function (table) {
		table.boolean("deleted").defaultTo(false);
	});
};

exports.down = function (knex) {
	return knex.schema.table("Chores", function (table) {
		table.dropColumn("deleted");
	});
};
