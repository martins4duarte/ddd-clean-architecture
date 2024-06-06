import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"


interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

interface CommentOnAnswerUseCaseResponse {
  commentAnswer: AnswerComment
}

export class CommentOnAnswerUseCase {

  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({ 
    content, 
    authorId,
    answerId 
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {

    const answer = this.answerRepository.findById(answerId)

    if(!answer) {
      throw new Error('Answer not found.')
    }

    const commentAnswer = AnswerComment.create({
      content, 
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
    })

    await this.answerCommentsRepository.create(commentAnswer)

    return {
      commentAnswer
    }
  }
}