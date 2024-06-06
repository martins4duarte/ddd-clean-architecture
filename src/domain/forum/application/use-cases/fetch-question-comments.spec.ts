import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { makeQuestion } from 'test/factories/make-question'
import moment from 'moment'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Recent QuestionComments', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('it should be able to fetch question comments', async () => {

    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const firstQuestionComment = makeQuestionComment({
      questionId: question.id
    })
    const secondQuestionComment = makeQuestionComment({
      questionId: question.id
    })

    await inMemoryQuestionCommentsRepository.create(firstQuestionComment)
    await inMemoryQuestionCommentsRepository.create(secondQuestionComment)

    const { questionComments } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      limit: 2
    })

    expect(questionComments).toEqual([
      expect.objectContaining(firstQuestionComment),
      expect.objectContaining(secondQuestionComment)
    ])
  })

  it('it should be able to fetch paginated question comments', async () => {

    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const firstQuestionComment = makeQuestionComment({
      questionId: question.id,
      createdAt: moment.utc().toDate()
    })
    const secondQuestionComment = makeQuestionComment({
      questionId: question.id,
      createdAt: moment.utc().add(10).toDate()
    })
    const thirtyQuestionComment = makeQuestionComment({
      questionId: question.id,
      createdAt: moment.utc().add(20).toDate()
    })

    await inMemoryQuestionCommentsRepository.create(firstQuestionComment)
    await inMemoryQuestionCommentsRepository.create(secondQuestionComment)
    await inMemoryQuestionCommentsRepository.create(thirtyQuestionComment)

    const { questionComments: firstPageQuestionComments } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      limit: 2
    })

    const { questionComments: secondPageQuestionComments } = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      limit: 2
    })

    expect(firstPageQuestionComments).toEqual([
      expect.objectContaining(thirtyQuestionComment),
      expect.objectContaining(secondQuestionComment)
    ])

    expect(secondPageQuestionComments).toEqual([
      expect.objectContaining(firstQuestionComment)
    ])

  })


})

