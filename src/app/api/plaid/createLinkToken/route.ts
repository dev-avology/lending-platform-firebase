import { NextRequest, NextResponse } from 'next/server';
import { linkItemToken } from '@/lib/plaid';

export async function POST(req: NextRequest) {
    try {
         const { userId, clientName} = await req.json();
        // const { userid, clientName} = body;
        console.log(userId,clientName);

        if (!userId || !clientName) {
            return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
        }

        // Fetch associated accounts
        const {linkToken} = await linkItemToken(userId,clientName);

        console.log(linkToken);

        return NextResponse.json({link_token:linkToken}, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
