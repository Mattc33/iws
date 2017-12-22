// defines the props that you want here
// names used here should match names from your json response

export interface Carrier {
    id: number;
    name: string;
    address: string;
    phone: string;
    taxable: boolean;
    tier: string;
    code: number;
}
