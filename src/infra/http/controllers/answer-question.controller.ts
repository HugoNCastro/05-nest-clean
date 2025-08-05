import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayloadSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerquestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type AnswerquestionBodySchema = z.infer<typeof answerquestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerquestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(answerquestionBodySchema))
    body: AnswerquestionBodySchema,
    @CurrentUser() user: UserPayloadSchema,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body
    const userId = user.sub

    const result = await this.answerquestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
