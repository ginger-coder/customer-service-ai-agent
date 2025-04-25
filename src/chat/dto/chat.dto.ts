import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class ChatRequestDto {
	@IsNotEmpty()
	@IsString()
	question: string;

	@IsOptional()
	@IsUUID()
	sessionId?: string;
}

export class ChatResponseDto {
	sessionId: string;
	response: string;
	timestamp: Date;
}