export interface CustomerInfo {
    ten: string;        // Đổi từ hoTen -> ten (khớp với Backend)
    sdt: string;
    chiNhanh: string;
    khuVuc: string;
    tongBill: number;
}

export interface APIResponse {
    status: 'success' | 'error';
    giftName?: string;
    voucherCode?: string;
    message?: string;
    error?: string;
}

export interface GiftResult {
    name: string;
    code: string | null;
    type: 'voucher' | 'item';
}
