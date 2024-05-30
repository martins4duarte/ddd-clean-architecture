import { QuestionsRepository } from "../repositories/questions-repository"


interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
}

interface EditQuestionUseCaseResponse { }

export class EditQuestionUseCase {

  constructor(private questionRepository: QuestionsRepository) { }

  async execute({
    authorId,
    questionId,
    title,
    content
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {

    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new Error("Question not found")
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error("You can't edit a question that is not yours")
    }

    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return {}
  }
}