import { SupportedLocale } from '@src/types';
import { useEffect } from 'react';
import { PageList } from '@src/app/components/navigation/PageList';
import { preventScroll } from '@src/app/components/navigation/modals/utils';

export const NavModal = ({
	lang,
	toggleNavModal,
}: {
	lang: SupportedLocale;
	toggleNavModal: () => void;
}) => {
	useEffect(preventScroll);

	return (
		<div className="w-full h-full fixed flex justify-center bg-theme/90">
			<div className="w-10/12 h-full flex justify-center bg-theme pt-16">
				<PageList
					{...{ lang, toggleNavModal, classes: 'text-center' }}
				/>
			</div>
		</div>
	);
};
