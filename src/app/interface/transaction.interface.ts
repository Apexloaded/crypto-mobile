export interface TransactionInterface {
    id: string;
    users_id: string;
    from_wallet?: string;
    to_wallet?: string;
    amount: string;
    payment_method: 'USDT' | 'BTC';
    transaction_type: 'CREDIT' | 'DEBIT' | 'EARNING';
    sector: string;
    plan: string;
    created_at: string;
    updated_at: string;
    status: 'PENDING' | 'SUCCESSFUL'
}