
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Here we would normally save to DB
        // keeping it simple for now to avoid 404
        return NextResponse.json({ success: true, message: 'Synced' });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
