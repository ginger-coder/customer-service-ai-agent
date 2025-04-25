import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { LangchainModule } from '../langchain/langchain.module';

@Module({
	imports: [LangchainModule],
	controllers: [KnowledgeController],
	providers: [KnowledgeService],
})
export class KnowledgeModule {}
