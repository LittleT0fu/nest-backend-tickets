export class ReservationDto {
    userName: string;
    action: ReservationAction;
}

export enum ReservationAction {
    RESERVE = 'reserve',
    CANCEL = 'cancel'
}