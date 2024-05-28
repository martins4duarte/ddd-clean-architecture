import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

interface CreateQuestionUseCaseResponse {
  answer: Answer
}

export class AnswerQuestionUseCase {

  constructor(
    private answersRepository: AnswersRepository
  ) { }

  async execute({ content, questionId, instructorId }: AnswerQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {

    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId)
    })

    await this.answersRepository.create(answer)

    return {
      answer
    }
  }
}