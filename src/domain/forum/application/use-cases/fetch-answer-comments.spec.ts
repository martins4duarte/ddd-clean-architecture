import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Recent AnswerComments', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('it should be able to fetch answer comments', async () => {

    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const firstAnswerComment = makeAnswerComment({
      answerId: answer.id
    })
    const secondAnswerComment = makeAnswerComment({
      answerId: answer.id
    })

    await inMemoryAnswerCommentsRepository.create(firstAnswerComment)
    await inMemoryAnswerCommentsRepository.create(secondAnswerComment)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
      limit: 2
    })

    expect(result.value?.answerComments).toEqual([
      expect.objectContaining(firstAnswerComment),
      expect.objectContaining(secondAnswerComment)
    ])
  })

  it('it should be able to fetch paginated answer comments', async () => {

    const answer = makeAnswer()
    await inMemoryAnswersRepository.create(answer)

    const firstAnswerComment = makeAnswerComment({
      answerId: answer.id,
      createdAt: new Date(2024, 0, 1)
    })
    const secondAnswerComment = makeAnswerComment({
      answerId: answer.id,
      createdAt: new Date(2024, 0, 4)
    })
    const thirtyAnswerComment = makeAnswerComment({
      answerId: answer.id,
      createdAt: new Date(2024, 0, 8)
    })

    await inMemoryAnswerCommentsRepository.create(firstAnswerComment)
    await inMemoryAnswerCommentsRepository.create(secondAnswerComment)
    await inMemoryAnswerCommentsRepository.create(thirtyAnswerComment)

    const firstResult = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
      limit: 2
    })

    const secondResult = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
      limit: 2
    })

    expect(firstResult.value?.answerComments).toEqual([
      expect.objectContaining(thirtyAnswerComment),
      expect.objectContaining(secondAnswerComment)
    ])

    expect(secondResult.value?.answerComments).toEqual([
      expect.objectContaining(firstAnswerComment)
    ])

  })


})

