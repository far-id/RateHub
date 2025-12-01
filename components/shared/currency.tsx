'use client';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useSelectedCurrency } from '@/hooks/useSelectedCurrency';

type currenncyProps = Readonly<{
	value: string;
	region: string;
	regionCode: string;
	currencyName: string;
	currencyCode: string;
	flagUrl: string;
	onChange?: (value: string) => void;
	removeSelectedCurrency: (currencyCode: string) => void;
}>;

export default function Currency(params: currenncyProps) {
	return (
		<Card className='hover:shadow-md transition-shadow'>
			<CardTitle className='mx-auto'>{params.region}</CardTitle>
			<CardContent className='py-4 px-6'>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-3 min-w-[140px]'>
						<Avatar className='w-12 h-8 rounded-md border'>
							<AvatarImage src={params.flagUrl} />
							<AvatarFallback className='rounded-lg'>{params.regionCode}</AvatarFallback>
						</Avatar>
						<div>
							<div className='font-semibold text-sm'>{params.currencyCode}</div>
							<div className='text-xs text-muted-foreground'>{params.currencyName}</div>
						</div>
					</div>
					<div className='flex-1'>
						<Input
							type='text'
							placeholder='0.00'
							className='text-lg font-medium h-12 bg-input border-border'
							value={
								new Intl.NumberFormat('en-US').format(Number(Number(params.value).toFixed(2))) || 0
							}
							onChange={(e) => {
								const numericValue = e.target.value.replaceAll(/[^0-9]/g, '');
								params.onChange?.(numericValue);
							}}
							onKeyDown={(e) => {
								if (['e', 'E', '-', '+', '.'].includes(e.key)) {
									e.preventDefault();
								}
							}}
						/>
					</div>
					<Button
						variant='ghost'
						size='icon'
						className='text-muted-foreground hover:text-destructive'
						onClick={() => params.removeSelectedCurrency(params.currencyCode)}
					>
						<Trash />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
