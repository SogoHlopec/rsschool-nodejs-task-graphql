import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
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
