import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface AQRequest {
  questionId: string
  instructorId: string
  content: string
}

export class AnswerQuestion {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ instructorId, questionId, content }: AQRequest) {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })
    await this.answersRepository.create(answer)

    return answer
  }
}
