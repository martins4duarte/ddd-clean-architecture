
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from './errors/not-allowed'

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

    const result = await sut.execute({
      authorId: '1',
      answerCommentId: 'answerComment-1'
    })

    expect(result.isSuccess()).toBeTruthy()
  })

  it('it should not be able to delete a answerComment from another user', async () => {

    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('2')
      },
      new UniqueEntityID('answerComment-1')
    )

    await inMemoryanswerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      authorId: '1',
      answerCommentId: 'answerComment-1'
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

