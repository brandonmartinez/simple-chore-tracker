import express from 'express';
const router = express.Router();

// People endpoints
router.get('/people', async (req, res) => {
    const people = await req.app.locals.db('People').select('*');
    res.json(people);
});

router.post('/people', async (req, res) => {
    const [id] = await req.app.locals.db('People').insert(req.body);
    res.json({ id });
});

// Chores endpoints
router.get('/chores', async (req, res) => {
    const chores = await req.app.locals.db('Chores').select('*');
    res.json(chores);
});

router.post('/chores', async (req, res) => {
    const [id] = await req.app.locals.db('Chores').insert(req.body);
    res.json({ id });
});

// ChoreAvailableAssignments endpoints
router.get('/chore-available-assignments', async (req, res) => {
    const assignments = await req.app.locals.db('ChoreAvailableAssignments').select('*');
    res.json(assignments);
});

router.post('/chore-available-assignments', async (req, res) => {
    const [id] = await req.app.locals.db('ChoreAvailableAssignments').insert(req.body);
    res.json({ id });
});

// ChoreAssignments endpoints
router.get('/chore-assignments', async (req, res) => {
    const assignments = await req.app.locals.db('ChoreAssignments').select('*');
    res.json(assignments);
});

router.post('/chore-assignments', async (req, res) => {
    const [id] = await req.app.locals.db('ChoreAssignments').insert(req.body);
    res.json({ id });
});

// Rewards endpoints
router.get('/rewards', async (req, res) => {
    const rewards = await req.app.locals.db('Rewards').select('*');
    res.json(rewards);
});

router.post('/rewards', async (req, res) => {
    const [id] = await req.app.locals.db('Rewards').insert(req.body);
    res.json({ id });
});

// RewardClaims endpoints
router.get('/reward-claims', async (req, res) => {
    const claims = await req.app.locals.db('RewardClaims').select('*');
    res.json(claims);
});

router.post('/reward-claims', async (req, res) => {
    const [id] = await req.app.locals.db('RewardClaims').insert(req.body);
    res.json({ id });
});

// TimePeriods endpoints
router.get('/time-periods', async (req, res) => {
    const periods = await req.app.locals.db('TimePeriods').select('*');
    res.json(periods);
});

router.post('/time-periods', async (req, res) => {
    const [id] = await req.app.locals.db('TimePeriods').insert(req.body);
    res.json({ id });
});


export default router;
