import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class DocumentProcessorService {
	async processWordDocument(filePath: string): Promise<Document[]> {
		try {
			// 读取Word文档
			const buffer = fs.readFileSync(filePath);

			// 将Word文档转换为纯文本
			const result = await mammoth.extractRawText({ buffer });
			const text = result.value;

			// 将文本分割成较小的块
			const textSplitter = new RecursiveCharacterTextSplitter({
				chunkSize: 1000,
				chunkOverlap: 100,
			});
			// 修正这里的参数格式，使用 metadata 对象
			const docs = await textSplitter.createDocuments(
				[text],
				[{ source: path.basename(filePath) }],
			);
			return docs;
		} catch (error) {
			console.error(`Error processing document: ${error}`);
			throw error;
		}
	}

	async processMultipleDocuments(filePaths: string[]): Promise<Document[]> {
		const allDocs: Document[] = [];

		for (const filePath of filePaths) {
			const docs = await this.processWordDocument(filePath);
			allDocs.push(...docs);
		}

		return allDocs;
	}
}
