import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {

  public items: AnswerComment[] = []

  async findById(id: string) {
    const AnswerComment = this.items.find(item => item.id.toString() === id)

    if (!AnswerComment) {
      return null
    }

    return AnswerComment

  }

  async findManyByAnswerId(answerId: string, { page, limit }: PaginationParams) {
    const OFFSET = (page - 1) * page;
    const LIMIT = page * (limit ?? 20);

    const answers = this.items.filter(answer =>
      answer.answerId.toString() === answerId
    )
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice(OFFSET, LIMIT)

    return answers
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async save(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.findIndex(item => item.id === answerComment.id)
    this.items[answerCommentIndex] = answerComment

    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async delete(answerComment: AnswerComment) {
    const answerCommentExists = this.items.findIndex(item => item.id === answerComment.id)

    if (!answerComment) {
      throw new Error('AnswerComment not found')
    }

    this.items.splice(answerCommentExists, 1)
  }
}