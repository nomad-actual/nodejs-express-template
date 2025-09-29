import express from 'express';
import { validate } from '../server/middleware/validation.middleware.js';
import { type GetUserByIdRequest, GetUserByIdSchema } from './types.js';

const router = express.Router();


router.get('/:id', validate({ params: GetUserByIdSchema }), async (
    _req: express.Request<GetUserByIdRequest, {}, {}, {}>,
    res
) => {
    // const user = db.findUserById(req.params.id)
    const user = null
    if (!user) {
        return res.status(404).send('Not Found')
    }

    res.status(200).send(user)
})

router.get('/hello', async (_req, res) => {
    res.status(200).send({ ok: true })
})

router.get('/about', async(_req, res) => {
    res.status(200).send({ ok: false })
})


export default router
