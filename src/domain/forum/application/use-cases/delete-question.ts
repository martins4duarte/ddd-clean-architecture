import { QuestionsRepository } from "../repositories/question-repository"


interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

interface DeleteQuestionUseCaseResponse { }

export class DeleteQuestionUseCase {

  constructor(private questionRepository: QuestionsRepository) { }

  async execute({
    authorId,
    questionId
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {

    const question = await this.questionRepository.findById(questionId)

    if(!question) {
      throw new Error("Question not found")
    }

    if(authorId !== question.authorId.toString()) {
      throw new Error("You can't delete a question that is not yours")
    }

    await this.questionRepository.delete(question)

    return {}
  }
}