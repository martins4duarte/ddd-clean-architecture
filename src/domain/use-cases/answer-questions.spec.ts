import { Answer } from '../entities/answer'
import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'

const fakeRepository: AnswersRepository = {
  create: async function (answer: Answer): Promise<void> {
    return
  }
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeRepository)

  const answer = await answerQuestion.execute({
    content: 'answer',
    instructorId: '1',
    questionId: '1',
  })

  expect(answer).toMatchObject({
    content: 'answer',
  })
})