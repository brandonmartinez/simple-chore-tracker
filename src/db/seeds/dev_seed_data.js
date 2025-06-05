export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("RewardClaims").del();
	await knex("Rewards").del();
	await knex("ChoreAssignments").del();
	await knex("ChoreAvailableAssignments").del();
	await knex("Chores").del();
	await knex("People").del();
	await knex("TimePeriods").del();

	// Inserts seed entries
	await knex("People").insert([
		{ name: "Brandon" },
		{ name: "Joy" },
		{ name: "Seth" },
		{ name: "Perry" },
		{ name: "Poppy" },
	]);

	await knex("Chores").insert([
		{ title: "Mow Grass (Front Yard)", points: 3, category: "Outdoor" },
		{ title: "Mow Grass (Side Yard)", points: 3, category: "Outdoor" },
		{ title: "Mow Grass (Back Yard)", points: 3, category: "Outdoor" },
		{ title: "Mow Grass (All Yards Bonus)", points: 1, category: "Outdoor" },
		{ title: "Clean Dishes", points: 1, category: "Kitchen" },
		{ title: "Manage Laundry", points: 1, category: "Laundry Room" },
		{ title: "Clean Tables", points: 1, category: "Living Room" },
		{ title: "Take Out Trash", points: 1, category: "Garage" },
		{ title: "Trash and Recycling Day", points: 1, category: "Garage" },
		{ title: "Wash Car", points: 2, category: "Vehicles" },
		{ title: "Clean Car Interior", points: 2, category: "Vehicles" },
	]);

	await knex("Rewards").insert([
		{ title: "Robux", points_cost: 10 },
		{ title: "Screen Time (1 Hour)", points_cost: 2 },
		{ title: "$10 Cash", points_cost: 20 },
	]);

	// Inserts seed entries for TimePeriods
	const currentDate = new Date();
	const oneWeekMillis = 7 * 24 * 60 * 60 * 1000;

	const timePeriods = [];

	// Generate 5 previous weeks
	for (let i = 5; i > 0; i--) {
		const startDate = new Date(currentDate.getTime() - i * oneWeekMillis);
		startDate.setDate(startDate.getDate() - startDate.getDay());
		const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
		timePeriods.push({
			start_date: startDate,
			end_date: endDate,
		});
	}

	// Generate this week
	const startDate = new Date(currentDate);
	startDate.setDate(startDate.getDate() - startDate.getDay());
	const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
	timePeriods.push({
		start_date: startDate,
		end_date: endDate,
	});

	// Generate 5 future weeks
	for (let i = 1; i <= 5; i++) {
		const startDate = new Date(currentDate.getTime() + i * oneWeekMillis);
		startDate.setDate(startDate.getDate() - startDate.getDay());
		const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
		timePeriods.push({
			start_date: startDate,
			end_date: endDate,
		});
	}

	await knex("TimePeriods").insert(timePeriods);
}
