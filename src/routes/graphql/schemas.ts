import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

// Custom schema
type Context = {
  prisma: PrismaClient;
};

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const MemberIDEnum = new GraphQLEnumType({
  name: 'MemberIDEnum',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberIDEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberIDEnum) },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.user.findMany();
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.memberType.findMany();
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.post.findMany();
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.profile.findMany();
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
});
