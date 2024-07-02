
import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";


export class InMemoryAnswersRepository implements AnswersRepository {

  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const answer = this.items.find(item => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer

  }

  async findManyByQuestionId(questionId: string, { page, limit }: PaginationParams) {
    const OFFSET = (page - 1) * page;
    const LIMIT = page * (limit ?? 20);

    const answers = this.items.filter(answer =>
      answer.questionId.toString() === questionId
    )
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice(OFFSET, LIMIT)

    return answers
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(item => item.id === answer.id)
    this.items[answerIndex] = answer

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const answerExists = this.items.findIndex(item => item.id === answer.id)

    if (!answer) {
      throw new Error('answer not found')
    }

    this.items.splice(answerExists, 1)

    this.answerAttachmentsRepository.findManyByAnswerId(
      answer.id.toString(),
    )

  }
}