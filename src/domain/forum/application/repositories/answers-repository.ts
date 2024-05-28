import { Answer } from "../../enterprise/entities/answer";


export interface AnswersRepository {
  create(answer: Answer): void;
}