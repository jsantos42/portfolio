// THIS PAGE MUST BE ON THE SAME LEVEL AS THE PAGES/APP FOLDER !!!
import {Dictionary, SupportedLocale} from '@src/types';
import {NextRequest, NextResponse} from 'next/server';
import {match} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {getDictionaries, getNewPathname} from "@src/res/dictionaries";

//==============================================================================
// LOCALES
//==============================================================================
const defaultLocale = 'pt';
const locales: SupportedLocale[] = [defaultLocale, 'en', 'fr'];

//==============================================================================
// MIDDLEWARE CONFIG (use `?!` to exclude routes from the middleware)
//==============================================================================
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

//==============================================================================
// MIDDLEWARE
//==============================================================================
export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (!hasValidLocale(pathname)) {
		const header = req.headers.get('accept-language') ?? undefined;
		const negotiator = new Negotiator({
			headers: { 'accept-language': header },
		});
		const languages = negotiator.languages();

		// Protect against 'RangeError: Incorrect locale information provided'
		let locale;
		try {
			locale = match(languages, locales, defaultLocale);
		} catch (error) {
			console.log(error);
			locale = defaultLocale;
		}

		req.nextUrl.pathname = `/${locale}${pathname}`;
		return NextResponse.redirect(req.nextUrl);
	}

	// Redirect to homepage if root
	if (locales.includes(pathname.substring(1) as SupportedLocale)) {
		const lang = pathname.substring(1) as SupportedLocale;
		req.nextUrl.pathname = getNewPathname(lang, getDictionaries()[lang].home.pageName);
		return NextResponse.redirect(req.nextUrl);
	}

	const staticRoute = getStaticRoute(pathname);
	if (staticRoute.length === 0) {
		return NextResponse.error();
	}

	req.nextUrl.pathname = staticRoute;
	return NextResponse.rewrite(req.nextUrl);
}

const hasValidLocale = (pathname: string) => {
	return locales.some(
		locale =>
			pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);
};

const getStaticRoute = (pathname: string) => {
	let staticRoute = '';
	const dictEntries = Object.entries(getDictionaries()) as [
		SupportedLocale,
		Dictionary,
	][];

	dictEntries.find(([lang, dict]) =>
		Object.entries(dict).some(([page, {pageName}]) => {
			if (pathname === getNewPathname(lang, pageName)) {
				staticRoute = `/${lang}/${page}`;
				return true;
			}
		})
	);
	return staticRoute;
};
