import { AnswersRepository } from "../repositories/answers-repository"
import { Answer } from "../../enterprise/entities/answer"
import { PaginationParams } from "@/core/repositories/pagination-params"


interface FetchQuestionAnswersUseCaseRequest extends PaginationParams {
  questionId: string
}

interface FetchQuestionAnswersUseCaseResponse {
  answers: Answer[]
}

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

    return {
      answers,
    }
  }
}