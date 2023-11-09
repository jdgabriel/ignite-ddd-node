import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerRequest {
  authorId: string
  answerId: string
}

export class DeleteAnswer {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({ authorId, answerId }: DeleteAnswerRequest): Promise<void> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) throw new Error('Answer not found')

    if (authorId !== answer.authorId.value) {
      throw new Error('Not allowed')
    }

    await this.answerRepository.delete(answer)
  }
}
