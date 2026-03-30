import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import errorsSchema from '../errors.json' with { type: 'json'}
import aboutSchema from '../about.json' with { type: 'json'}

export function apiDocRouter(apiBaseUrl, apiSchema) {

  const apiDocRouter = new Router()

  const swaggerUiOptions = {
    explorer: true,
    deepLinking: true,
    swaggerOptions: {
      urls: [
        {
          url: `${apiBaseUrl}/schemas/openapi`,
          name: apiSchema.info.title
        },
        {
          // url: `${apiBaseUrl}/schemas/errors.json`,
          url: `https://raw.githubusercontent.com/bibudem/api-communs/main/src/errors.json`,
          name: errorsSchema.info.title
        },
        {
          url: `https://raw.githubusercontent.com/bibudem/api-communs/main/src/about.json`,
          name: aboutSchema.info.title
        }
      ],
      displayRequestDuration: true,
    }
  }

  apiDocRouter.use('/schemas/openapi', (req, res) => res.json(apiSchema))
  apiDocRouter.get('/schemas/errors', (req, res) => res.json(errorsSchema))
  apiDocRouter.use('/api-doc/', swaggerUi.serve)
  apiDocRouter.get('/api-doc/', swaggerUi.setup(null, swaggerUiOptions))

  return apiDocRouter
}