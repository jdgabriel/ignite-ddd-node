import { QuestionRepository } from '../repositories/question-repository'

interface UpdateQuestionRequest {
  questionId: string
  authorId: string
  title: string
  content: string
}

export class UpdateQuestion {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
  }: UpdateQuestionRequest): Promise<void> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) throw new Error('Question not found')

    if (authorId !== question.authorId.value) {
      throw new Error('Not allowed')
    }

    question.title = title
    question.content = content

    await this.questionRepository.save(question)
  }
}
