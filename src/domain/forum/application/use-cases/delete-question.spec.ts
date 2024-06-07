import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('it should be able to delete a question', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('1')
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: '1',
      questionId: 'question-1'
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })

  it('it should not be able to delete a question from another user', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('2')
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: '1',
      questionId: 'question-1'
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

