import { QuestionsRepository } from "../repositories/questions-repository"
import { Question } from "../../enterprise/entities/question"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { Either, failure, success } from "@/core/either"


interface FetchRecentQuestionsUseCaseRequest extends PaginationParams { }

type FetchRecentQuestionsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questions: Question[]
  }
>
 

export class FetchRecentQuestionsUseCase {

  constructor(
    private questionsRepository: QuestionsRepository,
  ) { }

  async execute({ 
    page,
    limit
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {

    const questions = await this.questionsRepository.findManyRecent({
      page,
      limit,
    })

    if (!questions) {
      return failure(new ResourceNotFoundError())
    }

    return success({
      questions,
    })
  }
}