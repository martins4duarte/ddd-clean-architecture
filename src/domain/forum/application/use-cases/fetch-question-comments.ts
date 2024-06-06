import { QuestionCommentsRepository } from "../repositories/question-comments-repository"
import { Answer } from "../../enterprise/entities/answer"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { QuestionComment } from "../../enterprise/entities/question-comment"


interface FetchQuestionCommentsUseCaseRequest extends PaginationParams {
  questionId: string
}

interface FetchQuestionCommentsUseCaseResponse {
  questionComments: QuestionComment[]
}

export class FetchQuestionCommentsUseCase {

  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) { }

  async execute({
    questionId,
    page,
    limit
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {

    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
      questionId,
      {
        page,
        limit
      })

    return {
      questionComments,
    }
  }
}