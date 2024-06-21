import { Either, failure, success } from "@/core/either"
import { QuestionsRepository } from "../repositories/questions-repository"
import { NotAllowedError } from "@/core/errors/errors/not-allowed"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"


interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionUseCase {

  constructor(private questionRepository: QuestionsRepository) { }

  async execute({
    authorId,
    questionId
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {

    const question = await this.questionRepository.findById(questionId)

    if(!question) {
      return failure(new ResourceNotFoundError())
    }

    if(authorId !== question.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    await this.questionRepository.delete(question)

    return success({})
  }
}