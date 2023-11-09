import { QuestionRepository } from '../repositories/question-repository'

interface DeleteQuestionRequest {
  authorId: string
  questionId: string
}

export class DeleteQuestion {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionRequest): Promise<void> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) throw new Error('Question not found')

    if (authorId !== question.authorId.value) {
      throw new Error('Not allowed')
    }

    await this.questionRepository.delete(question)
  }
}
