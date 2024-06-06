import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"


interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

interface DeleteAnswerCommentUseCaseResponse { }

export class DeleteAnswerCommentUseCase {

  constructor(private answerCommentsRepository: AnswerCommentsRepository) { }

  async execute({
    authorId,
    answerCommentId
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {

    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if(!answerComment) {
      throw new Error("AnswerComment not found")
    }

    if(authorId !== answerComment.authorId.toString()) {
      throw new Error("You can't delete a answerComment that is not yours")
    }

    await this.answerCommentsRepository.delete(answerComment)

    return {}
  }
}