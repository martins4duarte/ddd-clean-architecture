import {InMemoryQuestionsRepository} from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

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
    })
  
    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(result.value?.question.id)
  })
})

