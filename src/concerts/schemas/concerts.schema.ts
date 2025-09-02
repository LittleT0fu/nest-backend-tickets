 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConcertDocument = HydratedDocument<Concert>;

@Schema({timestamps : true})
export class Reservation {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  concertName: string;

  @Prop({ required: true, enum: ['reserve', 'cancel'] })
  action: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

@Schema({ timestamps: true })
export class Concert {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  seat: number;

  @Prop({ type: [ReservationSchema], default: [] })
  reserved: Reservation[];
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
