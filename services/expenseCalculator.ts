
import type { Member, Expense, SimplifiedDebt } from '../types';

export const calculateBalances = (members: Member[], expenses: Expense[]): Map<string, number> => {
  const balances = new Map<string, number>();
  members.forEach(member => balances.set(member.id, 0));

  expenses.forEach(expense => {
    const payerId = expense.paidById;
    const amount = expense.amount;
    const splitForIds = expense.splitForIds;
    const splitCount = splitForIds.length;

    if (splitCount === 0) return;
    const share = amount / splitCount;

    // Ghi có cho người trả tiền
    balances.set(payerId, (balances.get(payerId) || 0) + amount);

    // Ghi nợ những người được chia tiền
    splitForIds.forEach(memberId => {
      balances.set(memberId, (balances.get(memberId) || 0) - share);
    });

    // Xử lý các khoản đã được thanh toán lại cho người trả tiền ban đầu
    const settledIds = expense.settledByIds || [];
    settledIds.forEach(settledMemberId => {
        // Người trả tiền ban đầu không cần thực hiện giao dịch với chính mình
        if (settledMemberId !== payerId) {
            // Việc một người thanh toán lại giống như một giao dịch:
            // 1. Ghi nợ người trả tiền ban đầu (vì họ đã nhận lại tiền, số dư nợ của người khác với họ giảm)
            balances.set(payerId, (balances.get(payerId) || 0) - share);
            // 2. Ghi có cho người vừa thanh toán (vì họ đã trả nợ, số dư nợ của họ giảm)
            balances.set(settledMemberId, (balances.get(settledMemberId) || 0) + share);
        }
    });
  });

  return balances;
};

export const simplifyDebts = (balances: Map<string, number>, members: Member[]): SimplifiedDebt[] => {
  const simplifiedDebts: SimplifiedDebt[] = [];
  const membersMap = new Map(members.map(m => [m.id, m]));

  const debtors = Array.from(balances.entries())
    .filter(([, balance]) => balance < -0.01)
    .map(([id, balance]) => ({ id, balance }));

  const creditors = Array.from(balances.entries())
    .filter(([, balance]) => balance > 0.01)
    .map(([id, balance]) => ({ id, balance }));
  
  debtors.sort((a, b) => a.balance - b.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountToSettle = Math.min(-debtor.balance, creditor.balance);

    const fromMember = membersMap.get(debtor.id);
    const toMember = membersMap.get(creditor.id);

    if (fromMember && toMember) {
        simplifiedDebts.push({
            from: fromMember,
            to: toMember,
            amount: amountToSettle,
        });
    }

    debtor.balance += amountToSettle;
    creditor.balance -= amountToSettle;

    if (Math.abs(debtor.balance) < 0.01) {
      debtorIndex++;
    }
    if (Math.abs(creditor.balance) < 0.01) {
      creditorIndex++;
    }
  }

  return simplifiedDebts;
};
