import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('it should be able to edit a question', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'new title',
      content: 'new content'
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'new title',
      content: 'new content'
    })
  })

  it('it should not be able to edit a question from another user', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-2')
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        authorId: 'author-1',
        questionId: 'question-1',
        title: 'new title',
        content: 'new content'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

