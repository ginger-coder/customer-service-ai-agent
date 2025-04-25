import { Module } from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { VectorStoreService } from './vector-store.service';

@Module({
  providers: [LangchainService, VectorStoreService],
  exports: [LangchainService, VectorStoreService],
})
export class LangchainModule {}