import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AnswersRepository } from "../repositories/answers-repository"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository"
import { Either, failure, success } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"


interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    commentAnswer: AnswerComment
  }
>

export class CommentOnAnswerUseCase {

  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) { }

  async execute({
    content,
    authorId,
    answerId
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {

    const answer = this.answerRepository.findById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    const commentAnswer = AnswerComment.create({
      content,
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
    })

    await this.answerCommentsRepository.create(commentAnswer)

    return success({
      commentAnswer
    })
  }
}