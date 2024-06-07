import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { Either, success } from "@/core/either"


interface FetchAnswerCommentsUseCaseRequest extends PaginationParams {
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

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

    return success({
      answerComments,
    })
  }
}