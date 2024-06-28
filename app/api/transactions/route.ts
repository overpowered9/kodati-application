import { NextResponse, type NextRequest } from 'next/server';
import { User, Transaction } from '@/database/models/index';
import { isValidDecimal } from '@/utils/server-helpers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user_id, amount } = await req.json();

    // Fetch the user from the database
    const user = await User.findByPk(user_id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse the amount and check if it's a valid number
    const transactionAmount = parseFloat(amount);

    if (isNaN(transactionAmount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Find the latest transaction for the user
    const latestTransaction = await Transaction.findOne({
      where: { user_id },
      order: [['created_at', 'DESC']],
    });

    // Calculate new balance based on the transaction amount and the latest transaction
    const previousBalance = latestTransaction ? parseFloat(latestTransaction.current_balance as any) : 0;
    const currentBalance = previousBalance + transactionAmount;

    // Check for overflow or underflow
    if (!isValidDecimal(previousBalance) || !isValidDecimal(transactionAmount) || !isValidDecimal(currentBalance)) {
      return NextResponse.json({ error: 'Limit reached' }, { status: 400 });
    }

    // Create a new transaction record
    const transaction = await Transaction.create({
      user_id,
      previous_balance: previousBalance,
      current_balance: currentBalance,
      transaction_amount: transactionAmount,
      reason: 'admin',
    });

    return NextResponse.json({ message: 'Transaction completed successfully', transaction }, { status: 200 });
  } catch (error) {
    console.error('Error in creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}