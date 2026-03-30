import { Router } from 'express'

import { initialize } from 'express-openapi'
import { apiDocRouter } from '../controllers/api-doc.controller.js'
import { responseValidationMiddleware } from '../middlewares/response-validation.middleware.js'
import { defaultMiddleware, errorMiddleware } from '../middlewares/error.middleware.js'
import errorsSchema from '../errors.json' with {type: 'json'}

export async function initializeApi({ apiSchema, apiBaseUrl, operations, middlewares = [], externalSchemas = {} }) {

  const router = new Router()

  router.use(apiDocRouter(apiBaseUrl, apiSchema))

  await initialize({
    apiDoc: {
      'x-express-openapi-additional-middleware': [
        ...middlewares,
        responseValidationMiddleware
      ],
      'x-express-openapi-validation-strict': true,
      ...apiSchema,
    },
    app: router,
    enableObjectCoercion: true,
    promiseMode: true,
    errorMiddleware,
    externalSchemas: {
      'https://raw.githubusercontent.com/bibudem/api-communs/main/src/errors.json': errorsSchema,
      ...externalSchemas
    },
    operations
  })

  router.use(defaultMiddleware(apiBaseUrl))

  return router
}