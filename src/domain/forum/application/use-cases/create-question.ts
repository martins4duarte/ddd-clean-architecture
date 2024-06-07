import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { QuestionsRepository } from "../repositories/questions-repository"
import { Question } from "../../enterprise/entities/question"
import { Either, success } from "@/core/either"


interface CreateQuestionUseCaseRequest {
  authorId: string
  content: string
  title: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
> 

export class CreateQuestionUseCase {

  constructor(private questionRepository: QuestionsRepository) {}

  async execute({ 
    title, 
    content, 
    authorId 
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {

    const question = Question.create({
      title, 
      content, 
      authorId: new UniqueEntityID(authorId)
    })

    await this.questionRepository.create(question)

    return success({
      question
    })
  }
}