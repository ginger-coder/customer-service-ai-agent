import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class LangchainService implements OnModuleInit {
	private chatModel: ChatOpenAI;
	private customerServiceChain: RunnableSequence;

	constructor(
		private configService: ConfigService,
		private vectorStoreService: VectorStoreService,
	) {}
	
	async onModuleInit() {
		console.log("this.configService.get<string>('OPENAI_API_KEY')", this.configService.get<string>('OPENAI_API_KEY'));
		
		this.chatModel = new ChatOpenAI({
			openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
			model: "gpt-4o-mini", // 使用最适合的模型
			temperature: 0.7,
		});

		await this.setupCustomerServiceChain();
	}

	async setupCustomerServiceChain() {
		// 创建检索器
		const retriever = await this.vectorStoreService.getRetriever();

		// 设置客服提示模板
		const customerServicePrompt = PromptTemplate.fromTemplate(`
    你是一位专业、友好的客服代表。请基于以下检索到的信息回答客户的问题。
    如果无法从检索信息中找到答案，请根据你的知识提供一个合理的回答，
    但要明确指出这是基于你的一般知识，而不是来自公司的特定信息。

    检索到的信息:
    {context}

    客户问题: {question}

    请用简洁、专业、友好的语气回答:
    `);

		// 构建链
		this.customerServiceChain = RunnableSequence.from([
			{
				question: (input) => input.question,
				context: async (input) => {
					const docs = await retriever.getRelevantDocuments(
						input.question,
					);
					return docs.map((doc) => doc.pageContent).join('\n');
				},
			},
			customerServicePrompt,
			this.chatModel,
			new StringOutputParser(),
		]);
	}

	async chatWithAgent(question: string): Promise<string> {
		try {
			return await this.customerServiceChain.invoke({ question });
		} catch (error) {
			console.error('Error in chatWithAgent:', error);
			return '很抱歉，我现在遇到了一些技术问题。请稍后再试或联系人工客服。';
		}
	}
}
