import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

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

  async create(AnswerComment: AnswerComment) {
    this.items.push(AnswerComment);
  }

  // async save(AnswerComment: AnswerComment): Promise<void> {
  //   const AnswerCommentIndex = this.items.findIndex(item => item.id === AnswerComment.id)
  //   this.items[AnswerCommentIndex] = AnswerComment
  // }

  async delete(AnswerComment: AnswerComment) {
    const AnswerCommentExists = this.items.findIndex(item => item.id === AnswerComment.id)

    if (!AnswerComment) {
      throw new Error('AnswerComment not found')
    }

    this.items.splice(AnswerCommentExists, 1)
  }
}