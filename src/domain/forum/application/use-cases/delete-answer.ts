import { AnswersRepository } from "../repositories/answers-repository"


interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

interface DeleteAnswerUseCaseResponse { }

export class DeleteAnswerUseCase {

  constructor(private answerRepository: AnswersRepository) { }

  async execute({
    authorId,
    answerId
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {

    const answer = await this.answerRepository.findById(answerId)

    if(!answer) {
      throw new Error("Answer not found")
    }

    if(authorId !== answer.authorId.toString()) {
      throw new Error("You can't delete a answer that is not yours")
    }

    await this.answerRepository.delete(answer)

    return {}
  }
}