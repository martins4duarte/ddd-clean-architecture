import { QuestionsRepository } from "../repositories/questions-repository"
import { Question } from "../../enterprise/entities/question"
import { PaginationParams } from "@/core/repositories/pagination-params"


interface FetchRecentQuestionsUseCaseRequest extends PaginationParams { }

interface FetchRecentQuestionsUseCaseResponse {
  questions: Question[]
}

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
      throw new Error("Question not found")
    }


    return {
      questions,
    }
  }
}