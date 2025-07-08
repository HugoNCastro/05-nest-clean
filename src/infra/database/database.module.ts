import { Module } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionsRepository } from '@/infra/database/prisma/repositories/prisma-questions-repository'
import { PrismaAnswersRepository } from '@/infra/database/prisma/repositories/prisma-answers-repository'
import { PrismaAnswerAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-comments-repository'
import { PrismaQuestionAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-question-attachaments-repository'
import { PrismaQuestionCommentsRepository } from '@/infra/database/prisma/repositories/prisma-question-comments-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
})
export class DatabaseModule {}
