import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    )
  })

  it('it should be able to edit a question', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2')
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'new title',
      content: 'new content',
      attachmentsIds: ['1', '3']
    })

    const item = inMemoryQuestionsRepository.items[0]

    expect(item).toMatchObject({
      title: 'new title',
      content: 'new content'
    })
    expect(item.attachments.currentItems).toHaveLength(2)
    expect(item.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('it should not be able to edit a question from another user', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-2')
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'new title',
      content: 'new content',
      attachmentsIds: []
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

