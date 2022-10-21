import { rest } from 'msw'

/*
export const handlers = [
  // Capture a GET /user/:userId request,
  rest.get('/user/:userId', (req, res, ctx) => {
    // ...and respond with this mocked response.
    return res(ctx.json({}))
  }),
]
*/

const baseUrl = "https://localhost:5000";
const getSupportPath = `${baseUrl}/support`;

const supportHandler = rest.get(getSupportPath, async (req, res, ctx) =>

  res(ctx.json({}))
);
/*
export const tasksHandlerException = rest.get(
  getTasksPath,
  async (req, res, ctx) =>
    res(ctx.status(500), ctx.json({ message: 'Deliberately broken request' }))
);
*/
export const handlers = [supportHandler];