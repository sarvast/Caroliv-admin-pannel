
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: {
            requiredVersion: '1.0.2',
            forceUpdate: true,
            updateMessage: 'A critical update is available! Please update immediately.',
            updateUrl: 'https://play.google.com/store/apps/details?id=com.caloriv.app'
        }
    });
}
