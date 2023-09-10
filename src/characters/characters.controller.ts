import { FastifyInstance } from 'fastify';
import { serializeStringToInteger } from '../shared/helper/serialize-string-numeric';
import { CharactersService, IQuery } from './characters.service';

export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  async findAll({ limit, name, offset, sort }: IQuerystring) {
    const isSorted = sort != undefined && sort != null && Boolean(sort);
    const query: IQuery = {
      offset: serializeStringToInteger(offset),
      limit: serializeStringToInteger(limit),
    };

    if (name) {
      return await this.charactersService.findByName(name);
    }

    if (isSorted) {
      return await this.charactersService.sortPopular(query);
    }

    const characters = await this.charactersService.findAll(query);

    return characters;
  }
  async findOne(index: number) {
    return await this.charactersService.findOneById(index);
  }
}

type IQuerystring = {
  name?: string;
  offset?: string;
  limit?: string;
  sort?: string;
};

export function charactersController(app: FastifyInstance, opts, done) {
  const characters = new CharactersController(new CharactersService());
  app.get<{ Querystring: IQuerystring }>('/', async (req, reply) => {
    const { name, offset, limit, sort } = req.query;
    const all = await characters.findAll({ limit, name, offset, sort });

    reply.code(200).send(all);
  });
  app.get('/:id', async (req, reply) => {
    // id = index
    const { id } = req.params as { id?: string };
    const isIndex = isNaN(parseInt(id));
    if (!isIndex) {
      // BadRequest
      return reply.code(300).send('BadRequest');
    }
    return characters.findOne(+id);
  });
  done();
}
