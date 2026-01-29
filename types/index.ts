export interface CustomerInfo {
    hoTen: string;
    sdt: string;
    chiNhanh: string;
    khuVuc: string;
    tongBill: number;
}

export interface APIResponse {
    status: 'success' | 'error';
    giftName?: string;
    voucherCode?: string;
    error?: string;
}

export interface GiftResult {
    name: string;
    code: string | null;
    type: 'voucher' | 'item';
}
