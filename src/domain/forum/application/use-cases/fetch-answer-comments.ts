import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { AnswerComment } from "../../enterprise/entities/answer-comment"


interface FetchAnswerCommentsUseCaseRequest extends PaginationParams {
  answerId: string
}

interface FetchAnswerCommentsUseCaseResponse {
  answerComments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {

  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
  ) { }

  async execute({
    answerId,
    page,
    limit
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {

    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(
      answerId,
      {
        page,
        limit
      })

    return {
      answerComments,
    }
  }
}