export async function up(knex) {
	await knex.schema.createView("PointTransactions", (view) => {
		view.columns([
			"parent_id",
			"person_id",
			"points",
			"created_at",
			"transaction_type",
		]);
		view.as(
			knex.raw(`
      SELECT
        reward_id AS parent_id,
        person_id,
        points_used * -1 AS points,
        created_at,
        'RewardClaim' AS transaction_type
      FROM "RewardClaims"
      UNION ALL
      SELECT
        chore_id AS parent_id,
        person_id,
        points_earned AS points,
        created_at,
        'ChoreCompletion' AS transaction_type
      FROM "ChoreCompletions"
      ORDER BY created_at
    `)
		);
	});
}

export async function down(knex) {
	await knex.schema.dropViewIfExists("PointTransactions");
}
