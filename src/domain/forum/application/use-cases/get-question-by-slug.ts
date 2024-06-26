import { QuestionsRepository } from "../repositories/questions-repository"
import { Question } from "../../enterprise/entities/question"
import { Either, failure, success } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"


interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>  

export class GetQuestionBySlugUseCase {

  constructor(private questionRepository: QuestionsRepository) {}

  async execute({ 
    slug
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {

    const question = await this.questionRepository.findBySlug(slug)

    if(!question) {
      return failure(new ResourceNotFoundError())
    }

    return success({
      question
    })
  }
}