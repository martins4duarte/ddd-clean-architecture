import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { Either, success } from "@/core/either"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {

  constructor(
    private answersRepository: AnswersRepository,
  ) { }

  async execute({ 
    content, 
    questionId, 
    instructorId,
    attachmentsIds
  }: AnswerQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {

    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId)
    })

    const answerAttachments = attachmentsIds.map(attachmentId => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id
      })
    })
 
    answer.attachments =  new AnswerAttachmentList(
      answerAttachments,
    )

    await this.answersRepository.create(answer)

    return success({
      answer
    })
  }
}