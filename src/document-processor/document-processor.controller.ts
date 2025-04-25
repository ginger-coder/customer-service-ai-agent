import { Controller, Post, BadRequestException } from '@nestjs/common';
import { DocumentProcessorService } from './document-processor.service';
import { VectorStoreService } from '../langchain/vector-store.service';
import { FastifyFiles } from '../common/decorators/fastify-files.decorator';

@Controller('documents')
export class DocumentProcessorController {
	constructor(
		private readonly documentProcessorService: DocumentProcessorService,
		private readonly vectorStoreService: VectorStoreService,
	) {}

	@Post('upload')
	async uploadFiles(
		@FastifyFiles({ field: 'files', maxCount: 10 }) files: any[],
	) {
		if (!files || files.length === 0) {
			throw new BadRequestException('No files uploaded');
		}

		const filePaths = files.map((file) => file.path);

		try {
			// 处理上传的文档
			const documents =
				await this.documentProcessorService.processMultipleDocuments(
					filePaths,
				);

			// 将文档添加到向量存储
			const textChunks = documents.map((doc) => doc.pageContent);
			const result = await this.vectorStoreService.addDocuments(
				textChunks,
				{ source: 'uploaded_docs' },
			);

			if (result.length === 0) {
				return {
					success: false,
					message:
						'Files were processed but could not be added to vector store',
					files: files.map((file) => ({
						filename: file.originalname,
						size: file.size,
					})),
				};
			}

			return {
				success: true,
				message: `Successfully processed ${files.length} document(s)`,
				documentCount: documents.length,
				files: files.map((file) => ({
					filename: file.originalname,
					size: file.size,
				})),
			};
		} catch (error) {
			// 检查是否是 OpenAI API 配额错误
			if (
				error.message.includes('429') ||
				error.message.includes('quota')
			) {
				return {
					success: false,
					message:
						'上传文件已接收，但由于 OpenAI API 配额限制，无法处理文档。请联系管理员增加配额。',
					error: 'OpenAI API 配额限制',
					files: files.map((file) => ({
						filename: file.originalname,
						size: file.size,
					})),
				};
			}

			throw error;
		}
	}
}
