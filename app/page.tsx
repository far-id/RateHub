'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightLeft, Plus } from 'lucide-react';
import Currency from '@/components/shared/currency';
import { useCurrencyValue } from '@/hooks/useCurrencyValue';
import { useState } from 'react';
import { useRates } from '@/hooks/useRates';
import { metaCurrency } from '@/constants/currency';
import { AddCurrency } from '@/components/shared/addCurrency';
import { useSelectedCurrency } from '@/hooks/useSelectedCurrency';

export default function Home() {
	const [open, setOpen] = useState<boolean>(false);
	const { rates, meta, loading, error, refresh } = useRates();
	const { selectedCurrency, addSelectedCurrency, removeSelectedCurrency } = useSelectedCurrency();

	// pick a small default set to show (if rates present)
	const initialRates = (() => {
		if (!rates) return null;
		const pick = selectedCurrency;
		const result: Record<string, number> = {};
		for (const p of pick) {
			if (rates[p]) result[p] = rates[p];
		}
		// ensure base USD included if missing
		if (!result['USD'] && rates['USD']) result['USD'] = rates['USD'];
		return result;
	})();

	const { values, updateCurrency } = useCurrencyValue(initialRates ?? {});

	if (loading) return <div>Loading rates…</div>;
	if (error && !rates) return <div>Error loading rates: {String(error)}</div>;
	if (!rates) return <div>No rates available</div>;

	return (
		<div className='min-h-screen bg-secondary/30'>
			<header className='bg-card border-b border-border'>
				<div className='max-w-4xl mx-auto px-6 py-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='size-10 rounded-xl bg-linear-to-br from-primary to-primary/90 flex items-center justify-center shadow-lg shadow-primary/20'>
								<ArrowRightLeft className='text-primary-foreground' />
							</div>
							<h1 className='text-2xl font-heading font-semibold tracking-tight'>RateHub</h1>
						</div>
						<Badge variant='secondary' className='gap-1.5'>
							Daily Rates
						</Badge>
						<div className='mb-3'>
							<strong>Base:</strong> {meta?.base_code ?? 'USD'} |<strong> Next update:</strong>{' '}
							{meta?.time_next_update_unix
								? new Date(meta.time_next_update_unix * 1000).toLocaleString()
								: 'unknown'}
							<button onClick={() => refresh()} style={{ marginLeft: 12 }}>
								Refresh
							</button>
						</div>
					</div>
				</div>
			</header>
			<main className='max-w-4xl mx-auto px-6 py-8'>
				<AddCurrency {...{ open, setOpen, selectedCurrency, addSelectedCurrency }} />
				<div className='space-y-6'>
					<div className='flex items-center justify-between'>
						<div>
							<h2 className='text-xl font-heading font-semibold tracking-tight'>
								Currency Converter
							</h2>
							<p className='text-sm text-muted-foreground mt-1'>
								Convert between multiple currencies in real-time
							</p>
						</div>
						<Button variant='default' size='sm' onClick={() => setOpen(true)}>
							Add Currency
						</Button>
					</div>
					<div className='space-y-3'>
						{selectedCurrency.map((code) => (
							<Currency
								key={code}
								value={values[code]?.toString() || ''}
								region={metaCurrency.find((c) => c.currencyCode === code)?.region || ''}
								regionCode={metaCurrency.find((c) => c.currencyCode === code)?.regionCode || ''}
								currencyName={metaCurrency.find((c) => c.currencyCode === code)?.currencyName || ''}
								currencyCode={code}
								flagUrl={metaCurrency.find((c) => c.currencyCode === code)?.flagUrl || ''}
								onChange={(value) => updateCurrency(code, value)}
								removeSelectedCurrency={() => removeSelectedCurrency(code)}
							/>
						))}
					</div>
					<Card className='bg-secondary/50 border-dashed' onClick={() => setOpen(true)}>
						<CardContent className='p-8'>
							<div className='flex flex-col items-center justify-center gap-3 text-center'>
								<div className='size-12 rounded-full bg-primary/10 flex items-center justify-center'>
									<div className='bg-primary rounded-full p-1'>
										<Plus className='text-primary-foreground' />
									</div>
								</div>
								<div>
									<h3 className='font-semibold text-sm'>Add More Currencies</h3>
									<p className='text-xs text-muted-foreground mt-1'>
										Click the button above to compare additional currencies
									</p>
									<p>or</p>
									<div className='text-xs text-muted-foreground mt-1'>
										Press{' '}
										<kbd className='bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
											<span className='text-xs'>Ctrl</span>k
										</kbd>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<div className='flex items-center gap-2 text-xs text-muted-foreground justify-center pt-4'>
						{/* <Icon icon='solar:shield-check-bold' className='size-4' /> */}
						<span>Exchange rates updated every 60 seconds</span>
					</div>
				</div>
			</main>
		</div>
	);
}
