import { Injectable, NotFoundException } from '@nestjs/common';
import { PtBrService } from 'src/shared/pt-br.service';

import { Character } from '../shared/character.entity';

// const sortByName = ({ name: a1 }, { name: a2 }) =>
//   a1 < a2 ? -1 : a1 > a2 ? 1 : 0;

// const sortById = ({ id: a1 }, { id: a2 }) => a1 - a2;
const start = 0;
const limit = 100;

@Injectable()
export class CharactersService {
  async findAll(): Promise<Character[]> {
    const allCharacter = await new PtBrService().getAll();
    const limited = allCharacter.slice(start, limit);

    return limited;
  }

  async findOne(id: number): Promise<Character> {
    const allCharacter = await new PtBrService().getAll();
    const find = allCharacter.find(({ id: idInd }) => id === idInd);

    if (!find) {
      throw new NotFoundException();
    }

    return {
      ...find,
    };
  }
}
