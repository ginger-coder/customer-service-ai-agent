import { Injectable } from '@nestjs/common';
import { VectorStoreService } from '../langchain/vector-store.service';

@Injectable()
export class KnowledgeService {
	constructor(private readonly vectorStoreService: VectorStoreService) {}

	async addKnowledge(texts: string[], metadata = {}) {
		await this.vectorStoreService.addDocuments(texts, metadata);
		return { success: true, count: texts.length };
	}
}