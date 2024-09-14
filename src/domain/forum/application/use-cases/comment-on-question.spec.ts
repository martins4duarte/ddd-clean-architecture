import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-questions-comment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
// let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
// let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository)
  })

  it('it should be able to comment on an question', async () => {

    const question = makeQuestion()
    console.log(inMemoryQuestionCommentsRepository)
    console.log(sut)
    await inMemoryQuestionsRepository.create(question)
    console.log(inMemoryQuestionCommentsRepository)
   
    await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'New question comment!'
    })

    console.log(inMemoryQuestionCommentsRepository)
  
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('New question comment!')
  })

})

