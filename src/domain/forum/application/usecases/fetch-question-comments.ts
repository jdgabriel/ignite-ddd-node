import { QuestionComment } from '../../enterprise/entities/comment/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchRecentQuestionsRequest {
  questionId: string
  page: number
}

interface FetchRecentQuestionsResponse {
  questionComments: Array<QuestionComment>
}

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

    return { questionComments }
  }
}
