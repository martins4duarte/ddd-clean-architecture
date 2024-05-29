import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionsRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  
  public items: Question[] = []

  async findById(id: string){
    const question = this.items.find(item => item.id.toString() === id)

    if(!question) {
      return null
    }

    return question

  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.text === slug)

    if(!question) {
      return null
    }

    return question
  }

  async create(question: Question) {
    this.items.push(question);
  }

  async delete(question: Question) {
    const questionExists = this.items.findIndex(item => item.id === question.id)

    if(!question) {
      throw new Error('Question not found')
    }

    this.items.splice(questionExists, 1)

  }
}