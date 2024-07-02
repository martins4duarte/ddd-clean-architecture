import { makeAnswer } from "test/factories/make-answer"
import { OnAnswerCreatedSubscriber } from "./on-answer-created-subscriber"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('on answer created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to send a notification when an answer is created', async () => {
   new OnAnswerCreatedSubscriber()

   const answer = makeAnswer();

   await inMemoryAnswersRepository.create(answer)

   expect(answer)
  })
})