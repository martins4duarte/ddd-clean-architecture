import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'



let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('it should be able to create an answer', async () => {
  
    const result = await sut.execute({
      content: 'answer',
      instructorId: '1',
      questionId: '1'
    })
  
    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryAnswersRepository.items[0].id).toEqual(result.value?.answer.id)
  })

})



