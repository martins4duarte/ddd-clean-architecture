import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {

  constructor(
    private answersRepository: AnswersRepository
  ) {}

  async execute({ content, questionId, instructorId }: AnswerQuestionUseCaseRequest) {

    const answer = new Answer({
      content, 
      authorId: instructorId, 
      questionId
    })

    const createdAnswer = await this.answersRepository.create(answer)

    return answer
  }
}