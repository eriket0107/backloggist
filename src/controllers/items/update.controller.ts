import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateItemUseCase, UpdateItemRequest } from '@/useCases/items/update/index.js';
import { ItemType } from '@/types/index.js';

interface UpdateItemParams {
  id: string;
}

interface UpdateItemBody {
  title?: string;
  type?: ItemType;
  note?: string;
  imgUrl?: string;
}

export class UpdateItemController {
  constructor(private updateItemUseCase: UpdateItemUseCase) { }

  async handle(request: FastifyRequest<{ Params: UpdateItemParams; Body: UpdateItemBody }>, reply: FastifyReply) {
    try {
      // TODO: Add request validation
      // TODO: Add authentication/authorization

      const updateItemRequest: UpdateItemRequest = {
        id: request.params.id,
        ...request.body,
      };

      const result = await this.updateItemUseCase.execute(updateItemRequest);

      return reply.status(200).send({
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
