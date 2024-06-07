import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { makeQuestion } from 'test/factories/make-question'
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

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      limit: 2
    })

    expect(result.value?.questionComments).toEqual([
      expect.objectContaining(firstQuestionComment),
      expect.objectContaining(secondQuestionComment)
    ])
  })

  it('it should be able to fetch paginated question comments', async () => {

    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const firstQuestionComment = makeQuestionComment({
      questionId: question.id,
      createdAt: new Date(2024, 0, 1)
    })
    const secondQuestionComment = makeQuestionComment({
      questionId: question.id,
      createdAt: new Date(2024, 0, 4)
    })
    const thirtyQuestionComment = makeQuestionComment({
      questionId: question.id,
      createdAt: new Date(2024, 0, 8)
    })

    await inMemoryQuestionCommentsRepository.create(firstQuestionComment)
    await inMemoryQuestionCommentsRepository.create(secondQuestionComment)
    await inMemoryQuestionCommentsRepository.create(thirtyQuestionComment)

    const firstResult = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      limit: 2
    })

    const secondResult = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      limit: 2
    })

    expect(firstResult.value?.questionComments).toEqual([
      expect.objectContaining(thirtyQuestionComment),
      expect.objectContaining(secondQuestionComment)
    ])

    expect(secondResult.value?.questionComments).toEqual([
      expect.objectContaining(firstQuestionComment)
    ])

  })


})

