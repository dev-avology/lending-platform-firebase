import { NextRequest, NextResponse } from 'next/server';
import { getAccounts } from '@/lib/plaid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { accessToken} = body;

        if (!accessToken) {
            return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
        }

        // Fetch associated accounts
        const accounts = await getAccounts(accessToken);

        console.log(accounts);

        return NextResponse.json({accounts }, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
