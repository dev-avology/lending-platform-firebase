import { NextRequest, NextResponse } from 'next/server';
import { exchangePublicToken } from '@/lib/plaid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { publicToken} = body;

        if (!publicToken) {
            return NextResponse.json({ error: 'Missing public token' }, { status: 400 });
        }

        // Fetch associated accounts
        const response = await exchangePublicToken(publicToken);

        console.log(response);

        return NextResponse.json({access_token:response.accessToken,item_id:response.itemId }, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
