export interface Flight {
    flight_id: number;
    flight_number: number;
    start_airport: string;
    end_airport: string;
    start_time: Date;
    end_time: Date;
    price: number;
    seats_available: number;
}