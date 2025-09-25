import express from "express";
import { validate } from "../server/middleware/validation.middleware.ts";
import * as db from "../server/db/database.ts"
import { type GetUserByIdRequest, GetUserByIdSchema } from "./types.ts";
import logger from "../utils/logger.ts";

const router = express.Router();


router.get('/:id', validate({ params: GetUserByIdSchema }), async (
    req: express.Request<GetUserByIdRequest, {}, {}, {}>,
    res
) => {
    const user = db.findUserById(req.params.id)
    if (!user) {
        return res.status(404).send('Not Found')
    }

    res.status(200).send(user)
})

router.get('/hello', async (req, res) => {
    res.status(200).send({ ok: true })
})

router.get('/about', async(req, res) => {
    res.status(200).send({ ok: false })
})


export default router
