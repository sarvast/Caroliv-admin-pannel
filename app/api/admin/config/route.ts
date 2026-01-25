
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: {
            requiredVersion: '1.0.0',
            forceUpdate: false,
            updateMessage: 'Please update to the latest version for new features.',
            updateUrl: 'https://play.google.com/store/apps/details?id=com.caloriv.app'
        }
    });
}
