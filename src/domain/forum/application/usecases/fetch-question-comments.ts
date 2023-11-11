import { Either, right } from '@/core/errors/either'
import { QuestionComment } from '../../enterprise/entities/question/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchRecentQuestionsRequest {
  questionId: string
  page: number
}

type FetchRecentQuestionsResponse = Either<
  null,
  {
    questionComments: Array<QuestionComment>
  }
>

export class FetchQuestionComments {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questionComments =
      await this.questionCommentRepository.findManyByQuestionId(questionId, {
        page,
      })

    return right({ questionComments })
  }
}
