import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const body = req.body;
      const query = body.query;
      const variables = body.variables;

      const parsedQuery = parse(query);
      const validationErrors = validate(schema, parsedQuery, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        return {
          errors: validationErrors.map((error) => ({
            message: error.message,
            locations: error.locations,
          })),
        };
      }

      const result = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });
      return result;
    },
  });
};

export default plugin;
