
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Stub history - return empty arrays to prevent 404/JSON errors
    return NextResponse.json({
        success: true,
        data: {
            weight: [],
            workouts: [],
            nutrition: []
        }
    });
}
