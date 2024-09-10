import { makeQuestion } from "test/factories/make-question"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { SendNotificationUseCase, type SendNotificationUseCaseRequest, type SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeQuestionComment } from "test/factories/make-question-comment"
import type { MockInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-questions-comment-repository"
import { OnQuestionCommentedSubscriber } from "./on-question-commented-subscriber"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on question commented', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryNotificationsRepository =
      new InMemoryNotificationsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionCommentedSubscriber(inMemoryQuestionsRepository, sendNotificationUseCase)
  })

  it('should be able to send a notification when an question is commented', async () => {
    const question = makeQuestion();
    const questionComment = makeQuestionComment({
      questionId: question.id,
      content: "Comment test"
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})