import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {

  public items: Question[] = []

  async findById(id: string) {
    const question = this.items.find(item => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question

  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.text === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page, limit }: PaginationParams): Promise<Question[]> {
    const OFFSET = (page - 1) * page;
    const LIMIT = page * (limit ?? 20);

    const questions = this.items
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice(OFFSET, LIMIT)

    return questions
  }

  async create(question: Question) {
    this.items.push(question);
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(item => item.id === question.id)
    this.items[questionIndex] = question
  }

  async delete(question: Question) {
    const questionExists = this.items.findIndex(item => item.id === question.id)

    if (!question) {
      throw new Error('Question not found')
    }

    this.items.splice(questionExists, 1)

  }
}