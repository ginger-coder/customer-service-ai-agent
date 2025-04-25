import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';
import { LangchainService } from '../langchain/langchain.service';

@Injectable()
export class ChatService {
	constructor(private readonly langchainService: LangchainService) {}

	async processChat(
		chatRequestDto: ChatRequestDto,
	): Promise<ChatResponseDto> {
		const { question, sessionId = uuidv4() } = chatRequestDto;

		const response = await this.langchainService.chatWithAgent(question);

		return {
			sessionId,
			response,
			timestamp: new Date(),
		};
	}
}
