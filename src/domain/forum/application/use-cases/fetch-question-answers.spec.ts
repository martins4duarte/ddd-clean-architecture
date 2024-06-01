import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import moment from 'moment'
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

    const { answers } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      limit: 2
    })

    expect(answers).toEqual([
      expect.objectContaining(firstAnswer),
      expect.objectContaining(secondAnswer)
    ])
  })

  it('it should be able to fetch paginated question answers', async () => {

    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const firstAnswer = makeAnswer({
      questionId: question.id,
      createdAt: moment.utc().toDate()
    })
    const secondAnswer = makeAnswer({
      questionId: question.id,
      createdAt: moment.utc().add(1).toDate()
    })
    const thirtyAnswer = makeAnswer({
      questionId: question.id,
      createdAt: moment.utc().add(2).toDate()
    })

    await inMemoryAnswersRepository.create(firstAnswer)
    await inMemoryAnswersRepository.create(secondAnswer)
    await inMemoryAnswersRepository.create(thirtyAnswer)

    const { answers: firstPageAnswers } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      limit: 2
    })

    const { answers: secondPageAnswers } = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      limit: 2
    })

    expect(firstPageAnswers).toEqual([
      expect.objectContaining(thirtyAnswer),
      expect.objectContaining(secondAnswer)
    ])

    expect(secondPageAnswers).toEqual([
      expect.objectContaining(firstAnswer)
    ])

  })


})

