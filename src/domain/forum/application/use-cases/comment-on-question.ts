import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { QuestionsRepository } from "../repositories/questions-repository"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { QuestionCommentsRepository } from "../repositories/question-comments-repository"
import { Either, failure, success } from "@/core/either"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"


interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    commentQuestion: QuestionComment
  }
>

export class CommentOnQuestionUseCase {

  constructor(
    private questionRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) { }

  async execute({
    content,
    authorId,
    questionId
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {

    const question = this.questionRepository.findById(questionId)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    const commentQuestion = QuestionComment.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    })

    await this.questionCommentsRepository.create(commentQuestion)

    return success({
      commentQuestion
    })
  }
}