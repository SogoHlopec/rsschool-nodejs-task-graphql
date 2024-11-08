import { PrismaClient } from "@prisma/client";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserType } from "./user.js";
import { UUIDType } from "./uuid.js";
import { MemberType, MemberTypeId } from "./memberType.js";
import { PostType } from "./post.js";
import { ProfileType } from "./profile.js";

export type Context = {
  prisma: PrismaClient;
};

export const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.user.findMany();
      },
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args: { id: string }, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        const user = await prisma.user.findUnique({
          where: { id: args.id },
        });
        return user || null;
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.memberType.findMany();
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (parent, args: { id: string }, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.memberType.findUnique({
          where: { id: args.id },
        });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.post.findMany();
      },
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args: { id: string }, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        const post = await prisma.post.findUnique({
          where: { id: args.id },
        });
        return post || null;
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent, args, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        return await prisma.profile.findMany();
      },
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args: { id: string }, context: Context) => {
        const prisma: PrismaClient = context.prisma;
        const profile = await prisma.profile.findUnique({
          where: { id: args.id },
        });
        return profile || null;
      },
    },
  },
});
