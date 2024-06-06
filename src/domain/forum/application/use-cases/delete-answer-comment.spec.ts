
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryanswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answerComment', () => {
  beforeEach(() => {
    inMemoryanswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryanswerCommentsRepository)
  })

  it('it should be able to delete a answerComment', async () => {

    const newanswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('1')
      },
      new UniqueEntityID('answerComment-1')
    )

    await inMemoryanswerCommentsRepository.create(newanswerComment)

    await sut.execute({
      authorId: '1',
      answerCommentId: 'answerComment-1'
    })

    expect(inMemoryanswerCommentsRepository.items).toHaveLength(0)
  })

  it('it should not be able to delete a answerComment from another user', async () => {

    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('2')
      },
      new UniqueEntityID('answerComment-1')
    )

    await inMemoryanswerCommentsRepository.create(newAnswerComment)



    expect(async () => {
      return await sut.execute({
        authorId: '1',
        answerCommentId: 'answerComment-1'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

