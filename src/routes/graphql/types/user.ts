import { PrismaClient } from '@prisma/client';
import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { Context } from './query.js';
import { PostType } from './post.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
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

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: parent.id },
          include: {
            author: true,
          },
        });
        return subscriptions.map((sub) => sub.author);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: parent.id },
          include: {
            subscriber: true,
          },
        });
        return subscriptions.map((sub) => sub.subscriber);
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  },
});