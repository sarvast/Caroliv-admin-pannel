
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: {
            showAd: true,
            id: 'promo_1',
            title: 'Premium Plan',
            description: 'Get 50% off on yearly subscription!',
            imageUrl: 'https://via.placeholder.com/300x200',
            link: 'caloriv://premium'
        }
    });
}
