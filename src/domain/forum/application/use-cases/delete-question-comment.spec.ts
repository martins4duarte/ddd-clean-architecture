
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryquestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete questionComment', () => {
  beforeEach(() => {
    inMemoryquestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryquestionCommentsRepository)
  })

  it('it should be able to delete a questionComment', async () => {

    const newquestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('1')
      },
      new UniqueEntityID('questionComment-1')
    )

    await inMemoryquestionCommentsRepository.create(newquestionComment)

    await sut.execute({
      authorId: '1',
      questionCommentId: 'questionComment-1'
    })

    expect(inMemoryquestionCommentsRepository.items).toHaveLength(0)
  })

  it('it should not be able to delete a questionComment from another user', async () => {

    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('2')
      },
      new UniqueEntityID('questionComment-1')
    )

    await inMemoryquestionCommentsRepository.create(newQuestionComment)



    expect(async () => {
      return await sut.execute({
        authorId: '1',
        questionCommentId: 'questionComment-1'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

