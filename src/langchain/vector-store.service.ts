import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from 'langchain/document';

@Injectable()
export class VectorStoreService implements OnModuleInit {
	private pineconeClient: Pinecone;
	private embeddings: OpenAIEmbeddings;
	private vectorStore: PineconeStore;

	constructor(private configService: ConfigService) {}

	async onModuleInit() {
		this.pineconeClient = new Pinecone({
			apiKey: this.configService.get<string>('PINECONE_API_KEY') || '',
		});

		this.embeddings = new OpenAIEmbeddings({
			openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
			modelName: 'text-embedding-3-small', // 从 text-embedding-ada-002 更改为 text-embedding-3-small
			dimensions: 1536, // 可选：指定向量维度，默认是 1536
		});

		const pineconeIndex = this.pineconeClient.Index(
			this.configService.get<string>('PINECONE_INDEX') || '',
		);

		this.vectorStore = await PineconeStore.fromExistingIndex(
			this.embeddings,
			{ pineconeIndex },
		);
	}

	// 创建一个自定义检索器接口，模拟 asRetriever 方法的功能
	async getRetriever(): Promise<{
		getRelevantDocuments: (query: string) => Promise<Document[]>;
	}> {
		// 返回一个符合 Retriever 接口的对象
		return {
			getRelevantDocuments: async (query: string) => {
				// 直接使用 similaritySearch 方法，这是一个更基础的 API，大多数版本中都有
				return await this.vectorStore.similaritySearch(query, 5);
			},
		};
	}

	async addDocuments(texts: string[], metadata = {}) {
		const documents = texts.map(
			(text) =>
				new Document({
					pageContent: text,
					metadata,
				}),
		);
		return this.vectorStore.addDocuments(documents);
	}
}
