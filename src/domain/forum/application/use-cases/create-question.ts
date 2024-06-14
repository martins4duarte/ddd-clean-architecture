import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { QuestionsRepository } from "../repositories/questions-repository"
import { Question } from "../../enterprise/entities/question"
import { Either, success } from "@/core/either"
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list"

interface CreateQuestionUseCaseRequest {
  authorId: string
  content: string
  title: string
  attachmentsIds: string[]
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
    authorId,
    attachmentsIds 
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {

    const question = Question.create({
      title, 
      content, 
      authorId: new UniqueEntityID(authorId),
    })

    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionRepository.create(question)

    return success({
      question
    })
  }
}