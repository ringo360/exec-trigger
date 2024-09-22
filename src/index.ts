import { execa } from 'execa';
import { Hono } from 'hono';
import config from '../config.json';

const app = new Hono();

async function run(x: string) {
	try {
		const { stdout } = await execa`${x}`;
		console.log(stdout);
		return {
			success: true,
			stdout: stdout,
			err: null,
		};
	} catch (e) {
		console.error(e);
		return {
			success: false,
			stdout: null,
			err: `${e}`,
		};
	}
}

app.get('/', async (c) => {
	return c.text('Hello Sekai!');
});

app.get('/run', async (c) => {
	const passwd = c.req.query('p');
	if (config.password !== passwd) {
		//prettier-ignore
		return c.json({
			success: false,
			err: 'Bad request(wrong or missing password)',
		}, 400);
	}
	const result = await run(config.exec_cmd);
	if (result.success) {
		return c.json({
			success: true,
			err: null,
		});
	} else {
		//prettier-ignore
		return c.json({
			success: false,
			err: result.err,
		}, 500);
	}
});

export default app;
