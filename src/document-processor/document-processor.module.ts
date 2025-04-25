import { Module } from '@nestjs/common';
import { DocumentProcessorController } from './document-processor.controller';
import { DocumentProcessorService } from './document-processor.service';
import { LangchainModule } from '../langchain/langchain.module';

@Module({
	imports: [LangchainModule],
	controllers: [DocumentProcessorController],
	providers: [DocumentProcessorService],
	exports: [DocumentProcessorService],
})
export class DocumentProcessorModule {}
