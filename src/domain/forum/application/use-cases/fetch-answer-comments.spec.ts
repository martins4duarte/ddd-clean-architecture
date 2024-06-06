import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { makeAnswer } from 'test/factories/make-answer'
import moment from 'moment'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Recent AnswerComments', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
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

    const { answerComments } = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
      limit: 2
    })

    expect(answerComments).toEqual([
      expect.objectContaining(firstAnswerComment),
      expect.objectContaining(secondAnswerComment)
    ])
  })

  it('it should be able to fetch paginated answer comments', async () => {

    const answer = makeAnswer()
    await inMemoryAnswersRepository.create(answer)

    const firstAnswerComment = makeAnswerComment({
      answerId: answer.id,
      createdAt: moment.utc().toDate()
    })
    const secondAnswerComment = makeAnswerComment({
      answerId: answer.id,
      createdAt: moment.utc().add(10).toDate()
    })
    const thirtyAnswerComment = makeAnswerComment({
      answerId: answer.id,
      createdAt: moment.utc().add(20).toDate()
    })

    await inMemoryAnswerCommentsRepository.create(firstAnswerComment)
    await inMemoryAnswerCommentsRepository.create(secondAnswerComment)
    await inMemoryAnswerCommentsRepository.create(thirtyAnswerComment)

    const { answerComments: firstPageAnswerComments } = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
      limit: 2
    })

    const { answerComments: secondPageAnswerComments } = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
      limit: 2
    })

    expect(firstPageAnswerComments).toEqual([
      expect.objectContaining(thirtyAnswerComment),
      expect.objectContaining(secondAnswerComment)
    ])

    expect(secondPageAnswerComments).toEqual([
      expect.objectContaining(firstAnswerComment)
    ])

  })


})

