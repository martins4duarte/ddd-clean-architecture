import { QuestionComment } from "../../enterprise/entities/question-comment";


export interface QuestionCommentsRepository {
  create(commentQuestion: QuestionComment): Promise<void>;
}