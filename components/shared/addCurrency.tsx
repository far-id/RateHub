'use client';

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';
import { metaCurrency } from '@/constants/currency';
import Image from 'next/image';
import { useSelectedCurrency } from '@/hooks/useSelectedCurrency';

type propsType = Readonly<{
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedCurrency: string[];
	addSelectedCurrency: (currencyCode: string) => void;
}>;

export function AddCurrency(params: propsType) {
	const [errorFlag, setErrorFlag] = useState<boolean[]>([]);
	const { open, setOpen, selectedCurrency, addSelectedCurrency } = params;

	function addCurrency(event: React.MouseEvent<HTMLButtonElement>) {
		addSelectedCurrency((event?.currentTarget as HTMLElement).dataset.value || '');
		console.log('added', selectedCurrency);
		setOpen(false);
	}

	function handleErrorFlag(index: number) {
		setErrorFlag((prev) => {
			const newFlags = [...prev];
			newFlags[index] = true;
			return newFlags;
		});
	}

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(!open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder='Type a currency code or name...' />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading='Currencies'>
					{metaCurrency.map((currency, index) => (
						<CommandItem key={currency.currencyCode}>
							<button
								className='flex items-center w-full cursor-pointer'
								onClick={addCurrency}
								data-value={currency.currencyCode}
							>
								{errorFlag[index] ? (
									<span className='w-5 h-5 mr-2 rounded-sm'>{currency.regionCode}</span>
								) : (
									<Image
										src={currency.flagUrl}
										alt={currency.currencyCode}
										className='w-5 h-5 mr-2 rounded-sm'
										width={20}
										height={20}
										onError={() => handleErrorFlag(index)}
									/>
								)}
								<span>
									{currency.region} - {currency.currencyCode} - {currency.currencyName}
								</span>
							</button>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
