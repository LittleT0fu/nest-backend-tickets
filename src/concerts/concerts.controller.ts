import { Controller , Get , Post , Body } from '@nestjs/common';
import { ConcertsService } from './concerts.service';

@Controller('concerts')
export class ConcertsController {
    constructor(private readonly concertsService: ConcertsService) {}
    @Get()
    getConcerts(){
        return this.concertsService.findAll()
    }

    @Post()
    addConcert(@Body() concert){
        return this.concertsService.create(concert)
    }
}
