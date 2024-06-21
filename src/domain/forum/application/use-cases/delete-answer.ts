import { Either, failure, success } from "@/core/either"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "@/core/errors/errors/not-allowed"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"


interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {

  constructor(private answerRepository: AnswersRepository) { }

  async execute({
    authorId,
    answerId
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {

    const answer = await this.answerRepository.findById(answerId)

    if(!answer) {
      return failure(new ResourceNotFoundError())
    }

    if(authorId !== answer.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return success({})
  }
}