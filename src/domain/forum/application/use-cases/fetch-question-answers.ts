import { AnswersRepository } from "../repositories/answers-repository"
import { Answer } from "../../enterprise/entities/answer"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { Either, success } from "@/core/either"


interface FetchQuestionAnswersUseCaseRequest extends PaginationParams {
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {

  constructor(
    private answersRepository: AnswersRepository,
  ) { }

  async execute({
    questionId,
    page,
    limit
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {

    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
        limit
      })

    return success({
      answers,
    })
  }
}