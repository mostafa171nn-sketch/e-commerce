import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if ((response.status === 502 || response.status === 503 || response.status === 504) && attempt < MAX_RETRIES) {
          console.warn(`Attempt ${attempt} failed with ${response.status}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error: any) {
      if ((error.name === 'AbortError' || error.name === 'TypeError') && attempt < MAX_RETRIES) {
        console.warn(`Attempt ${attempt} failed with ${error.name}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        continue;
      }

      console.error('Error fetching categories after all retries:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: error.message },
        { status: 500 }
      );
    }
  }
}
