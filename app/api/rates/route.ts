export async function GET() {
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`);
    if (!res.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return new Response('Error fetching exchange rates', { status: 500 });
  }

}
