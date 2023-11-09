import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface UpdateAnswerRequest {
  answerId: string
  authorId: string
  content: string
}

interface UpdateAnswerResponse {
  answer: Answer
}

export class UpdateAnswer {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content,
  }: UpdateAnswerRequest): Promise<UpdateAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) throw new Error('Answer not found')

    if (authorId !== answer.authorId.value) {
      throw new Error('Not allowed')
    }

    answer.content = content

    await this.answerRepository.save(answer)
    return { answer }
  }
}
