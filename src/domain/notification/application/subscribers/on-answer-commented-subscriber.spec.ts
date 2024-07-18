import { makeAnswer } from "test/factories/make-answer"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeAnswerComment } from "test/factories/make-answer-comment"
import { MockInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"
import { makeQuestion } from "test/factories/make-question"
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answers-comment-repository"
import { OnAnswerCommentedSubscriber } from "./on-answer-commented-subscriber"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('on answer commented', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryNotificationsRepository =
      new InMemoryNotificationsRepository()
    inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentedSubscriber(inMemoryAnswersRepository, sendNotificationUseCase)
  })

  it.only('should be able to send a notification when an answer is commented', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id
    });
    const answerComment = makeAnswerComment({
      answerId: answer.id,
      content: "Comment test"
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})