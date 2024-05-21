import { PrismaClient } from "@prisma/client";

export class PrismaQuestionRepository {
  constructor(private readonly prisma: PrismaClient) {}
  
}