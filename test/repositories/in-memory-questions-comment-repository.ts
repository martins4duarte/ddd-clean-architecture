import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
 

  public items: QuestionComment[] = []

  async findById(id: string) {
    const questionComment = this.items.find(item => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment

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

  async findManyRecent({ page, limit }: PaginationParams): Promise<QuestionComment[]> {
    const OFFSET = (page - 1) * page;
    const LIMIT = page * (limit ?? 20);

    const questionComments = this.items
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice(OFFSET, LIMIT)

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);

    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async save(questionComment: QuestionComment): Promise<void> {
    const QuestionCommentIndex = this.items.findIndex(item => item.id === questionComment.id)
    this.items[QuestionCommentIndex] = questionComment

    DomainEvents.dispatchEventsForAggregate(questionComment.id)
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentExists = this.items.findIndex(item => item.id === questionComment.id)

    if (!questionComment) {
      throw new Error('QuestionComment not found')
    }

    this.items.splice(questionCommentExists, 1)

  }
}