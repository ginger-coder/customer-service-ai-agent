import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const fastifyAdapter = new FastifyAdapter({
		logger: process.env.NODE_ENV === 'development',
		bodyLimit: 10 * 1024 * 1024, // 10MB 限制
	});

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		fastifyAdapter,
	);

	// 注册multipart插件用于文件上传
	await app.register(fastifyMultipart, {
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB
		},
	});

	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors();

	await app.listen(3000, '0.0.0.0');
	console.log(`Application is running on: ${await app.getUrl()}`);

	return app;
}

bootstrap();
