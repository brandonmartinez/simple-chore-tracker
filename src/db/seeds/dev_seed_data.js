export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('RewardClaims').del();
  await knex('Rewards').del();
  await knex('ChoreAssignments').del();
  await knex('ChoreAvailableAssignments').del();
  await knex('Chores').del();
  await knex('People').del();

  // Inserts seed entries
  await knex('People').insert([
    { name: 'Brandon' },
    { name: 'Joy' },
    { name: 'Seth' },
    { name: 'Perry' },
    { name: 'Poppy' },
  ]);

  await knex('Chores').insert([
    { title: 'Mow Grass (Front Yard)', points: 3 },
    { title: 'Mow Grass (Side Yard)', points: 3 },
    { title: 'Mow Grass (Back Yard)', points: 3 },
    { title: 'Mow Grass (All Yards Bonus)', points: 1 },
    { title: 'Clean Dishes', points: 1 },
    { title: 'Manage Laundry', points: 1 },
    { title: 'Clean Tables', points: 1 },
    { title: 'Take Out Trash', points: 1 },
    { title: 'Trash and Recycling Day', points: 1 },
    { title: 'Wash Car', points: 2 },
    { title: 'Clean Car Interior', points: 2 },
  ]);

  await knex('Rewards').insert([
    { title: 'Robux', points_cost: 10 },
    { title: 'Screen Time (1 Hour)', points_cost: 2 },
    { title: '$10 Cash', points_cost: 20 },
  ]);
}
