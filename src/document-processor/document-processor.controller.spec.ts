import { Test, TestingModule } from '@nestjs/testing';
import { DocumentProcessorController } from './document-processor.controller';

describe('DocumentProcessorController', () => {
  let controller: DocumentProcessorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentProcessorController],
    }).compile();

    controller = module.get<DocumentProcessorController>(DocumentProcessorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
