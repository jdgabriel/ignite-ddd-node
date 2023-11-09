import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface ChooseBestAnswerQuestionRequest {
  answerId: string
  authorId: string
}

interface ChooseBestAnswerQuestionResponse {
  question: Question
}

export class ChooseBestAnswerQuestion {
  constructor(
    private questionRepository: QuestionRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseBestAnswerQuestionRequest): Promise<ChooseBestAnswerQuestionResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) throw new Error('Answer not found')

    const question = await this.questionRepository.findById(
      answer.questionId.value,
    )
    if (!question) throw new Error('Question not found')

    if (authorId !== question.authorId.value) throw new Error('Not allowrd')

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return { question }
  }
}
