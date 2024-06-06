import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

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

  // async findManyRecent({ page, limit }: PaginationParams): Promise<QuestionComment[]> {
  //   const OFFSET = (page - 1) * page;
  //   const LIMIT = page * (limit ?? 20);

  //   const questioncomments = this.items
  //     .sort((a, b) => {
  //       return b.createdAt.getTime() - a.createdAt.getTime()
  //     })
  //     .slice(OFFSET, LIMIT)

  //   return questioncomments
  // }

  async create(questioncomment: QuestionComment) {
    this.items.push(questioncomment);
  }

  // async save(questioncomment: QuestionComment): Promise<void> {
  //   const questioncommentIndex = this.items.findIndex(item => item.id === questioncomment.id)
  //   this.items[questioncommentIndex] = questioncomment
  // }

  async delete(questionComment: QuestionComment) {
    const questionCommentExists = this.items.findIndex(item => item.id === questionComment.id)

    if (!questionComment) {
      throw new Error('QuestionComment not found')
    }

    this.items.splice(questionCommentExists, 1)

  }
}