import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CommentOnQuestionUseCase

describe('Comment Question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository)
  })

  it('it should be able to comment on an question', async () => {

    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const { commentQuestion } = await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'New question comment!'
    })
  
    expect(commentQuestion).toMatchObject({
      content: 'New question comment!',
    })
    expect(inMemoryQuestionCommentsRepository.items[0].id).toEqual(commentQuestion.id)
  })

})

