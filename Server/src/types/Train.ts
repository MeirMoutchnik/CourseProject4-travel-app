export interface Train {
    train_id: number;
    train_number: number;
    start_station: string;
    end_station: string;
    start_time: Date;
    end_time: Date;
    price: number;
    available_seats: number;
}