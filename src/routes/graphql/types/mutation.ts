import { PrismaClient } from '@prisma/client';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { ChangeUserInput, CreateUserInput, UserType } from './user.js';
import { ChangePostInput, CreatePostInput, PostType } from './post.js';
import { ChangeProfileInput, CreateProfileInput, ProfileType } from './profile.js';
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

    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        parent,
        args: { id: string; dto: { name?: string; balance?: number } },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;
        const updatedUser = await prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
        return updatedUser;
      },
    },

    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        parent,
        args: { userId: string; authorId: string },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;

        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });

        return `User ${args.userId} subscribed to author ${args.authorId}`;
      },
    },

    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        parent,
        args: { userId: string; authorId: string },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;
        await prisma.subscribersOnAuthors.deleteMany({
          where: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });

        return `User ${args.userId} unsubscribed from author ${args.authorId}`;
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

    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        parent,
        args: { id: string; dto: { title?: string; content?: string } },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;
        const updatedPost = await prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
        return updatedPost;
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

    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        parent,
        args: {
          id: string;
          dto: { isMale?: boolean; yearOfBirth?: number; memberTypeId?: string };
        },
        context: Context,
      ) => {
        const prisma: PrismaClient = context.prisma;
        const updatedProfile = await prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
        return updatedProfile;
      },
    },
  },
});
