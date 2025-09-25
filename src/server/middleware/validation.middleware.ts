import * as z from 'zod/v4'
import { ZodError } from 'zod/v4'

import logger from '../../utils/logger.ts'

export function validate(toCheck: {
    body?: z.ZodObject<any>
    params?: z.ZodObject<any>
    query?: z.ZodObject<any>
}) {
    return (req: any, res: any, next: Function) => {
        try {
            // Parse and validate the request body
            if (toCheck.body) toCheck.body.parse(req.body)
            if (toCheck.params) toCheck.params.parse(req.params)
            if (toCheck.query) toCheck.query.parse(req.query)

            next()
        } catch (error: any) {
            if (error instanceof ZodError) {
                // Return formatted Zod validation errors

                const errors = error.issues
                logger.error({ errors }, `Invalid request: ${error.message}`)

                return res.status(400).send({
                    success: false,
                    message: 'Validation failed',
                    errors,
                })
            }

            logger.error(
                { error },
                `Error validating request body: ${error.message}`
            )

            // Handle unexpected errors
            return res.status(500).send({
                success: false,
                message: 'Internal server error',
            })
        }
    }
}
