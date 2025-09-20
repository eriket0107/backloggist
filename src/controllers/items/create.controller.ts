import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateItemUseCase, CreateItemRequest } from '@/useCases/items/create/index.js';
import { ItemType } from '@/types/index.js';

interface CreateItemBody {
  title: string;
  type: ItemType;
  note?: string;
  imgUrl?: string;
}

export class CreateItemController {
  constructor(private createItemUseCase: CreateItemUseCase) { }

  async handle(request: FastifyRequest<{ Body: CreateItemBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization if needed

      const createItemRequest: CreateItemRequest = {
        title: request.body.title,
        type: request.body.type,
        note: request.body.note,
        imgUrl: request.body.imgUrl,
      };

      const result = await this.createItemUseCase.execute(createItemRequest);

      return reply.status(201).send({
        success: true,
        data: result.item,
      });
    } catch (error) {
      // TODO: Add proper error handling
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
