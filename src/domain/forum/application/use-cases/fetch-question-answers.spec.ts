import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Recent Answers', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('it should be able to fetch question answers', async () => {

    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const firstAnswer = makeAnswer({
      questionId: question.id
    })
    const secondAnswer = makeAnswer({
      questionId: question.id
    })

    await inMemoryAnswersRepository.create(firstAnswer)
    await inMemoryAnswersRepository.create(secondAnswer)

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      limit: 2
    })

    expect(result.value?.answers).toEqual([
      expect.objectContaining(firstAnswer),
      expect.objectContaining(secondAnswer)
    ])
  })

  it('it should be able to fetch paginated question answers', async () => {

    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const firstAnswer = makeAnswer({
      questionId: question.id,
      createdAt: new Date(2024, 0, 1)
    })
    const secondAnswer = makeAnswer({
      questionId: question.id,
      createdAt: new Date(2024, 0, 4)
    })
    const thirtyAnswer = makeAnswer({
      questionId: question.id,
      createdAt: new Date(2024, 0, 8)
    })

    await inMemoryAnswersRepository.create(firstAnswer)
    await inMemoryAnswersRepository.create(secondAnswer)
    await inMemoryAnswersRepository.create(thirtyAnswer)

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

    expect(firstResult.value?.answers).toEqual([
      expect.objectContaining(thirtyAnswer),
      expect.objectContaining(secondAnswer)
    ])

    expect(secondResult.value?.answers).toEqual([
      expect.objectContaining(firstAnswer)
    ])

  })


})

