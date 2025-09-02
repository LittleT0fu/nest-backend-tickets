import { Injectable } from '@nestjs/common';

@Injectable()
export class ConcertsService {
    private readonly concerts = [
        {id:1, name:"concert1" , description:"description1"},
        {id:2, name:"concert2" , description:"description2"},
        {id:3, name:"concert3" , description:"description3"},
    ];

    findAll() {
        return this.concerts
    }

    create(concert: {id: number, name: string, description: string}){
        this.concerts.push(concert)
        return this.concerts
    }
}
