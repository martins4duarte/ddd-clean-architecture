import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('it should be able to create a question', async () => {

    const result = await sut.execute({
      content: 'answer',
      authorId: '1',
      title: 'answer',
      attachmentsIds: ['1', '2']
    })

    const item = inMemoryQuestionsRepository.items[0]
  
    expect(result.isSuccess()).toBeTruthy()
    expect(item).toEqual(result.value?.question)
    expect(item.attachments).toHaveLength(2)
    expect(item.attachments).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})

