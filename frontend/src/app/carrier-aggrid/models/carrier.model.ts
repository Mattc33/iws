// defines the props that you want here
// names used here should match names from your json response

export interface Carrier {
    id: number;
    name: string;
    address: string;
    phone_number: number;
    taxable: boolean;
    tier_number: number;
    two_digit_unique_code: string;
    date: Date;
}
