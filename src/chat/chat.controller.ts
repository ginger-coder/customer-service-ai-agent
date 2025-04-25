import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post()
	async chat(
		@Body() chatRequestDto: ChatRequestDto,
	): Promise<ChatResponseDto> {
		return this.chatService.processChat(chatRequestDto);
	}
}
