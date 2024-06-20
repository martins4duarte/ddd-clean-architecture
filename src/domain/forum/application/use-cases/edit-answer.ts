import { Either, failure, success } from "@/core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "./errors/not-allowed"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"


interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {

  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {

    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    const currentAttachments = 
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAttachments,
    )

    const answerAttachments = attachmentsIds.map(attachmentId => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList


    await this.answerRepository.save(answer)

    return success({
      answer,
    })
  }
}