import { NextResponse } from 'next/server';
import { getDb } from '@/lib/prisma';

export async function POST(req) {
    try {
        const body = await req.json();
        const { image, disease, confidence } = body;

        const db = await getDb();
        const scan = {
            image,
            disease,
            confidence: parseFloat(confidence),
            timestamp: new Date()
        };

        const result = await db.collection('scans').insertOne(scan);
        const savedScan = { ...scan, id: result.insertedId.toString(), _id: undefined };

        // Broadcast to WebSocket clients
        try {
            const broadcastUrl = process.env.BROADCAST_URL || 'http://localhost:8765/broadcast';
            await fetch(broadcastUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...savedScan, timestamp: scan.timestamp.toISOString() })
            });
        } catch (fetchError) {
            console.error('Failed to notify WebSocket server (non-fatal):', fetchError.message);
        }

        return NextResponse.json({ success: true, scan: savedScan }, { status: 201 });
    } catch (error) {
        console.error('Scan save error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process scan' }, { status: 500 });
    }
}
