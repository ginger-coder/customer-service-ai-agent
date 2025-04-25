import { createParamDecorator, ExecutionContext, BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { pipeline } from 'stream';

const pump = util.promisify(pipeline);

// 确保上传目录存在
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const FastifyFiles = createParamDecorator(
  async (options: { field: string; maxCount?: number }, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }
    
    const fieldName = options?.field || 'files';
    const maxCount = options?.maxCount || 10;
    const uploadedFiles: Array<{
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
    }> = [];
    let fileCount = 0;
    
    const parts = req.parts();
    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === fieldName) {
        if (fileCount >= maxCount) {
          throw new BadRequestException(`Maximum number of files (${maxCount}) exceeded`);
        }
        
        fileCount++;
        
        // 生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + '-' + part.filename;
        const filepath = path.join(uploadDir, filename);
        
        // 创建写入流
        const writeStream = fs.createWriteStream(filepath);
        
        try {
          // 将文件内容写入文件系统
          await pump(part.file, writeStream);
          
          // 添加文件信息到上传文件列表
          uploadedFiles.push({
            fieldname: part.fieldname,
            originalname: part.filename,
            encoding: part.encoding,
            mimetype: part.mimetype,
            destination: uploadDir,
            filename: filename,
            path: filepath,
            size: writeStream.bytesWritten,
          });
        } catch (err) {
          if (err.code === 'FST_REQ_FILE_TOO_LARGE') {
            throw new PayloadTooLargeException('文件大小超出限制');
          }
          throw new Error(`File upload failed: ${err.message}`);
        }
      }
    }
    
    return uploadedFiles;
  },
);