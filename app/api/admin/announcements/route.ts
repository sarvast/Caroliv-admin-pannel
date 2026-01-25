
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: [
            {
                id: '1',
                title: 'Welcome to Caloriv!',
                message: 'Track your calories and workouts with ease.',
                type: 'info',
                createdAt: new Date().toISOString()
            }
        ]
    });
}
