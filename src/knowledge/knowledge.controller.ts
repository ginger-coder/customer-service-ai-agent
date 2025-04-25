import { Controller, Post, Body } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
	constructor(private readonly knowledgeService: KnowledgeService) {}

	@Post('add')
	async addKnowledge(@Body() data: { texts: string[]; metadata?: any }) {
		return this.knowledgeService.addKnowledge(data.texts, data.metadata);
	}
}
