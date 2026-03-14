import { NextResponse } from 'next/server';
import { getDb } from '@/lib/prisma';

export async function GET() {
    try {
        const db = await getDb();
        const history = await db.collection('scans')
            .find({})
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        // Normalise _id to id string
        const normalised = history.map(s => ({
            ...s,
            id: s._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({ history: normalised });
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
