import { PrismaClient } from '@prisma/client';
import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { Context } from './query.js';
import { PostType } from './post.js';

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (parent: { id: string }, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        const profile = await prisma.profile.findUnique({
          where: { userId: parent.id },
        });
        return profile || null;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent: { id: string }, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
  },
});
