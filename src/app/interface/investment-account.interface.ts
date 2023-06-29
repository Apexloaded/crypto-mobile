export interface InvestmentAccountInterface {
  id: string;
  users_id: string;
  account_plan: string;
  account_status: 'ACTIVE' | 'INACTIVE';
  active_investment: string;
  compounded_investment: string;
  earnings: string;
  percentage_earnings: string;
  total_balance: string;
  created_at: string;
  updated_at: string;
}
