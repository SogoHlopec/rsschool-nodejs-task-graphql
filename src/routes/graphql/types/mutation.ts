import { PrismaClient } from '@prisma/client';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { CreateUserInput, UserType } from './user.js';
import { CreatePostInput, PostType } from './post.js';
import { CreateProfileInput, ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';

export type Context = {
  prisma: PrismaClient;
};

export const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (
        parent,
        args: { dto: { name: string; balance: number } },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;
        const newUser = await prisma.user.create({
          data: args.dto,
        });
        return newUser;
      },
    },

    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args: { id: string }, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        await prisma.user.delete({
          where: { id: args.id },
        });
        return `User ${args.id} deleted`;
      },
    },

    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (
        parent,
        args: { dto: { title: string; content: string; authorId: string } },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;
        const newPost = await prisma.post.create({
          data: args.dto,
        });
        return newPost;
      },
    },

    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args: { id: string }, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        await prisma.post.delete({
          where: { id: args.id },
        });
        return `Post ${args.id} deleted`;
      },
    },

    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (
        parent,
        args: {
          dto: {
            isMale: boolean;
            yearOfBirth: number;
            userId: string;
            memberTypeId: string;
          };
        },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;
        const newProfile = await prisma.profile.create({
          data: args.dto,
        });
        return newProfile;
      },
    },

    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args: { id: string }, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        await prisma.profile.delete({
          where: { id: args.id },
        });
        return `Profile ${args.id} deleted`;
      },
    },
  },
});
