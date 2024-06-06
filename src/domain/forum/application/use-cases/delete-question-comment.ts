import { QuestionCommentsRepository } from "../repositories/question-comments-repository"


interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

interface DeleteQuestionCommentUseCaseResponse { }

export class DeleteQuestionCommentUseCase {

  constructor(private questionCommentsRepository: QuestionCommentsRepository) { }

  async execute({
    authorId,
    questionCommentId
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {

    const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

    if(!questionComment) {
      throw new Error("QuestionComment not found")
    }

    if(authorId !== questionComment.authorId.toString()) {
      throw new Error("You can't delete a questionComment that is not yours")
    }

    await this.questionCommentsRepository.delete(questionComment)

    return {}
  }
}