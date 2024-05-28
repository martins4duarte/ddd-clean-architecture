import { PrismaClient } from "@prisma/client";

export class PrismaQuestionRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findBySlug(slug: string) {
    const question = await this.prisma.question.findMany({
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!question) {
      return null
    }

    return question
  }

}