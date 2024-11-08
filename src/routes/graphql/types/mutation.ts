import { PrismaClient } from '@prisma/client';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { CreateUserInput, UserType } from './user.js';
import { CreatePostInput, PostType } from './post.js';
import { CreateProfileInput, ProfileType } from './profile.js';

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

    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (
        parent,
        args: {
          dto: { isMale: boolean; yearOfBirth: number; userId: string; memberTypeId: string };
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
  },
});
