import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('it should be able to delete a answer', async () => {

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('1'),
      },
      new UniqueEntityID('answer-1')
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: '1',
      answerId: 'answer-1'
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('it should not be able to delete a answer from another user', async () => {

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('2')
      },
      new UniqueEntityID('answer-1')
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: '1',
      answerId: 'answer-1'
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

