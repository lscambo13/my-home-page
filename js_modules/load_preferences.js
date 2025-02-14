import {
	BING_SEARCH_DOMAIN,
	DEF_CUSTOM_TEXT,
	DUCKDUCKGO_SEARCH_DOMAIN,
	GOOGLE_SEARCH_DOMAIN,
} from './constants.js';
import { displayClock, refreshGreeting } from './preferences.js';
import { fixBackgroundBlurOnResize } from './utils.js';
import { InputDialog } from './utils/inputDialog.js';
import { enableSubmitButton } from './utils/enableSubmitButton.js';
import { intersectionObserver } from './utils/intersectionObserver.js';

const PREF_MAP = {
	'bg-img-drop': backgroundImage,
	'bg-blur-drop': backgroundBlur,
	// 'bg-glow-drop': backgroundGlow,
	// 'weather-display-drop': displayWeather,
	'footer-display-drop': displayFooter,
	'def-widget-drop': defaultWidget,
	// 'widget-style-drop': widgetStyle,
	'greeting-display-drop': displayGreeting,
	'def-widget-display-drop': displayWidget,
	// 'show-seconds-drop': showSeconds,
	// 'clock-style-drop': clockStyle,
	// 'am-pm-style-drop': amPmStyle,
	'def-search-engine-drop': defaultSearchEngine,
	'searchbar-position-drop': defaultSearchbarPosition,
	'searchbar-color-theme-drop': searchbarTheme,
	'focus-search-drop': focusSearchBar,
	'search-display-drop': displaySearch,
	// 'show-titles-drop': showTitles,
	'movies-search-display-drop': moviesSearch,
	'tv-search-display-drop': tvSearch,
	'games-search-display-drop': gamesSearch,
	'ebooks-search-display-drop': ebooksSearch,
	'downloader-button-display-drop': downloaderButton,
	'add-bookmark-display-drop': displayAddBookmark,
	'bookmark-labels-display-drop': displayBookmarkLabels,
};

function backgroundImage(value) {
	const overlay = document.getElementById('overlay');
	switch (value) {
		case 'hidden': {
			overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
			// console.log(value);
			break;
		};
		case 'shown': {
			overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
			// console.log(value);
			break;
		};
	}
};

function backgroundBlur(value) {
	const overlay = document.getElementById('overlay');

	switch (value) {
		case 'off': {
			overlay.style.backdropFilter = 'blur(0em)';
			break;
		};
		case 'on': {
			overlay.style.backdropFilter = 'blur(1em)';
			fixBackgroundBlurOnResize('overlay');
			break;
		};
	}
};
// function backgroundGlow() { };

// function displayWeather() { };

function displayFooter(value) {
	const footer = document.getElementById('footer');

	switch (value) {
		case 'off': {
			footer.classList.add('hidden');
			break;
		};
		case 'on': {
			footer.classList.remove('hidden');
			break;
		};
	}
};

export function focusSearchBar(value) {
	sessionStorage.setItem('focus', value);

	// const searchbar = document.getElementById('searchTerm');
	// switch (value) {
	// 	case 'off': {
	// 		// searchbar.focus();
	// 		// sessionStorage.setItem('focus', 'off');
	// 		break;
	// 	};
	// 	case 'on': {
	// 		// searchbar.focus();
	// 		// searchbar.click();
	// 		break;
	// 	};
};

function displayWidget(value) {
	const widget = document.getElementById('main-heading-slider');
	const lArrow = document.getElementById('left-arrow');
	const rArrow = document.getElementById('right-arrow');

	function toggleDefaultWidgetButton(value) {
		switch (value) {
			case 'show': {
				document.getElementById('main-widget-children-container')
					.classList.remove('nested-close');
				break;
			};
			case 'hide': {
				document.getElementById('main-widget-children-container')
					.classList.add('nested-close');
				break;
			};
		}
	}
	switch (value) {
		case 'off': {
			widget.classList.add('hidden');
			lArrow.classList.add('hidden');
			rArrow.classList.add('hidden');
			toggleDefaultWidgetButton('hide');
			break;
		};
		case 'on': {
			widget.classList.remove('hidden');
			lArrow.classList.remove('hidden');
			rArrow.classList.remove('hidden');
			toggleDefaultWidgetButton('show');
			break;
		};
	}
};

function displaySearch(value) {
	const search = document.getElementById('searchbar');
	const searchChildren = document
		.getElementById('search-display-children-container');
	const searchEngineDrop = document
		.getElementById('def-search-engine-drop-container');

	function toggleSearchEngineButton(value) {
		switch (value) {
			case 'show': {
				searchChildren.classList.remove('nested-close');
				searchEngineDrop.classList.remove('nested-close');
				break;
			};
			case 'hide': {
				searchChildren.classList.add('nested-close');
				searchEngineDrop.classList.add('nested-close');
				break;
			};
		}
	}
	switch (value) {
		case 'off': {
			search.classList.add('hidden');
			toggleSearchEngineButton('hide');
			break;
		};
		case 'on': {
			search.classList.remove('hidden');
			toggleSearchEngineButton('show');
			break;
		};
	}
};

const widgetSlides = document.getElementsByClassName('widget-slide');

function applyText(input) {
	for (const i of widgetSlides) {
		i.textContent = input;
	}
};

function defaultWidget(value) {
	function loadCustomText() {
		let customText = localStorage.getItem('customWidgetText');
		if (customText == null) {
			localStorage.setItem('customWidgetText', DEF_CUSTOM_TEXT);
			customText = localStorage.getItem('customWidgetText');
			askCustomText();
		}
		applyText(customText);
		// return customText;
	}

	function toggleCustomTextButton(value) {
		switch (value) {
			case 'show': {
				document.getElementById('update-customtext-btn')
					.classList.remove('nested-close');
				break;
			};
			case 'hide': {
				document.getElementById('update-customtext-btn')
					.classList.add('nested-close');
				break;
			};
		}
	}

	switch (value) {
		case 'casamia': {
			toggleCustomTextButton('hide');
			displayClock('off');
			applyText('Casa Mia');
			break;
		};
		case 'search': {
			toggleCustomTextButton('hide');
			displayClock('off');
			applyText('Search');
			break;
		};
		case 'clock': {
			toggleCustomTextButton('hide');
			displayClock('on');
			break;
		};
		case 'custom': {
			displayClock('off');
			toggleCustomTextButton('show');
			loadCustomText();
			break;
		};
	}
};

export function askCustomText() {
	const savedText = localStorage.getItem('customWidgetText');
	InputDialog.show(
		'Custom widget text',
		'Enter text you want to set as the main widget.',
		['Custom text'],
		'Save',
		'Cancel',
		null,
		[enableSubmitButton, null],
		() => {
			InputDialog.getInputFields()[0].value = savedText;
		},
	).then((res) => {
		localStorage.setItem('customWidgetText', res.inputValues[0]);
		applyText(res.inputValues[0]);
		updateCustomTextPreview();
	}).catch((e) => {
		console.error(e);
	});
}

export function askCustomDomain() {
	const savedDomain = localStorage.getItem('customDomain');
	InputDialog.show(
		'Custom widget text',
		'Enter text you want to set as the main widget.',
		['Custom text'],
		'Save',
		'Cancel',
		null,
		[enableSubmitButton, null],
		() => {
			InputDialog.getInputFields()[0].value = savedDomain;
		},
	).then((res) => {
		localStorage.setItem('customDomain', res.inputValues[0]);
		applyDomain(res.inputValues[0]);
		updateCustomDomainPreview();
	}).catch((e) => {
		console.error(e);
	});
}

// function widgetStyle() { };

let greetingLoop = null;
function displayGreeting(value) {
	const subtitle = document.getElementById('subtitle');
	clearInterval(greetingLoop);
	switch (value) {
		case 'off': {
			subtitle.classList.add('collapsed');
			break;
		};
		case 'on': {
			subtitle.classList.remove('collapsed');
			refreshGreeting();
			greetingLoop = setInterval(refreshGreeting, 20000);
			break;
		};
	}
};

// function showSeconds() { };

// function clockStyle() { };

// function amPmStyle() { };

function applyDomain(domain) {
	localStorage.setItem('default-search-url', domain);
}

export function defaultSearchEngine(value) {
	function loadCustomDomain() {
		let customDomain = localStorage.getItem('customDomain');
		if (customDomain == null) {
			localStorage.setItem('customDomain', GOOGLE_SEARCH_DOMAIN);
			customDomain = localStorage.getItem('customDomain');
			askCustomDomain();
		}
		applyDomain(customDomain);
		// return customText;
	}

	function applyIcon(value) {
		document.getElementById('search-btn-icon').className = value;
		localStorage.setItem('default-search-icon', value);
	}

	function toggleCustomDomainButton(value) {
		switch (value) {
			case 'show': {
				document.getElementById('update-customdomain-btn')
					.classList.remove('nested-close');
				break;
			};
			case 'hide': {
				document.getElementById('update-customdomain-btn')
					.classList.add('nested-close');
				break;
			};
		}
	}

	switch (value) {
		case 'google': {
			toggleCustomDomainButton('hide');
			applyDomain(GOOGLE_SEARCH_DOMAIN);
			applyIcon('fa-brands fa-google');
			break;
		};
		case 'bing': {
			toggleCustomDomainButton('hide');
			applyDomain(BING_SEARCH_DOMAIN);
			applyIcon('fa fa-magnifying-glass');
			break;
		};
		case 'duckduckgo': {
			toggleCustomDomainButton('hide');
			applyDomain(DUCKDUCKGO_SEARCH_DOMAIN);
			applyIcon('fa fa-magnifying-glass');
			break;
		};
		case 'custom': {
			toggleCustomDomainButton('show');
			loadCustomDomain();
			// applyDomain(GOOGLE_SEARCH_DOMAIN);
			applyIcon('fa fa-magnifying-glass');
			break;
		};
	}
};

function searchbarTheme(value) {
	const searchContainer = document.getElementById('searchContainer');
	sessionStorage.setItem('searchbar-color-theme-drop', value);
	switch (value) {
		case 'glass': {
			searchContainer.classList.add('searchbox-style-glass');
			searchContainer.classList.remove('searchbox-style-light');
			searchContainer.classList.remove('searchbox-style-dark');
			break;
		};
		case 'light': {
			searchContainer.classList.remove('searchbox-style-glass');
			searchContainer.classList.add('searchbox-style-light');
			searchContainer.classList.remove('searchbox-style-dark');
			break;
		};
		case 'dark': {
			searchContainer.classList.remove('searchbox-style-glass');
			searchContainer.classList.remove('searchbox-style-light');
			searchContainer.classList.add('searchbox-style-dark');
			break;
		};
	}
};

function defaultSearchbarPosition(value) {
	const searchbar = document.getElementById('searchbar');
	const autofillContainer = document.getElementById('autofillContainer');
	const wrap = document.getElementById('wrap');
	sessionStorage.setItem('searchbar-position-drop', value);

	switch (value) {
		case 'top': {
			searchbar.style.order = '0';
			autofillContainer.style.order = '1';
			autofillContainer.style.bottom = '0em';
			autofillContainer.style.top = '3.75em';
			wrap.style.margin = '0 auto auto auto';
			break;
		};
		case 'bottom': {
			searchbar.style.order = '1';
			autofillContainer.style.order = '0';
			autofillContainer.style.bottom = '3.75em';
			autofillContainer.style.top = '';
			wrap.style.margin = 'auto auto 0 auto';
			break;
		};
		case 'middle': {
			searchbar.style.order = '0';
			autofillContainer.style.order = '1';
			autofillContainer.style.bottom = '0em';
			autofillContainer.style.top = '3.75em';
			wrap.style.margin = 'auto auto auto auto';
			break;
		};
	}
};

export function scrollToBottom() {
	if (document.getElementById('searchbar').style.order == '1') {
		window.scrollTo(0, document.body.scrollHeight);
	}
}

// function showTitles() { };

export function applyPreferences() {
	const preferencesObj =
		JSON.parse(localStorage.getItem('advDropdownValues'));

	const preferencesArray = Object.entries(preferencesObj);
	for (const i of preferencesArray) {
		const func = PREF_MAP[i[0]];
		if (func) func(i[1]);
	}

	// apply previews
	updateUserNamePreview();
	updateCustomTextPreview();
	updateCustomDomainPreview();

	const lastSession = sessionStorage.getItem('input');
	if (lastSession) document.getElementById('searchTerm').value = lastSession;
}

export function loadDropdownPositions() {
	const loadedFromStorage =
		Object.entries(JSON.parse(localStorage.getItem('advDropdownValues')));
	// if (!loadButtonPreviews) return;
	for (const i of loadedFromStorage) {
		const elem = document.getElementById(i[0]);
		if (elem) {
			elem.value = i[1];
		}
	}
};

export function updateUserNamePreview() {
	document.getElementById('update-username-btn-preview').
		textContent = localStorage.getItem('userName');
}

export function updateCustomTextPreview() {
	document.getElementById('update-customtext-btn-preview').
		textContent = localStorage.getItem('customWidgetText');
}

export function updateCustomDomainPreview() {
	document.getElementById('update-customdomain-btn-preview').
		textContent = localStorage.getItem('customDomain');
}

export function loadSelectedWidgetStyle() {
	document.getElementById(localStorage.getItem('selected-widget-style'))
		.scrollIntoView({ behavior: 'instant' });

	setTimeout(() => {
		intersectionObserver('widget-slide');
	}, 500);
}

export function updateAmPmStyle(amPm) {
	const style = localStorage.getItem('selected-widget-style');
	if (style == 'widget-2' || style == 'widget-7' || style == 'widget-5') {
		return amPm.toLowerCase();
	}
	return amPm;
}

function moviesSearch(value) {
	const button = document.getElementById('movies-search');
	switch (value) {
		case 'hidden': {
			button.style.display = 'none';
			break;
		};
		case 'shown': {
			button.style.display = 'flex';
			break;
		};
	}
}
function tvSearch(value) {
	const button = document.getElementById('tv-search');
	switch (value) {
		case 'hidden': {
			button.style.display = 'none';
			break;
		};
		case 'shown': {
			button.style.display = 'flex';
			break;
		};
	}
}
function gamesSearch(value) {
	const button = document.getElementById('games-search');
	switch (value) {
		case 'hidden': {
			button.style.display = 'none';
			break;
		};
		case 'shown': {
			button.style.display = 'flex';
			break;
		};
	}
}
function ebooksSearch(value) {
	const button = document.getElementById('ebooks-search');
	switch (value) {
		case 'hidden': {
			button.style.display = 'none';
			break;
		};
		case 'shown': {
			button.style.display = 'flex';
			break;
		};
	}
}
function downloaderButton(value) {
	const button = document.getElementById('downloader-button');
	switch (value) {
		case 'hidden': {
			button.style.display = 'none';
			break;
		};
		case 'shown': {
			button.style.display = 'flex';
			break;
		};
	}
}
function displayAddBookmark(value) {
	const button = document.getElementById('add_bookmark_button');
	switch (value) {
		case 'hidden': {
			button.style.display = 'none';
			break;
		};
		case 'shown': {
			button.style.display = 'flex';
			break;
		};
	}
}

function displayBookmarkLabels(value) {
	const labels = document.getElementsByClassName('bookmark-title');
	sessionStorage.setItem('labels', value);
	switch (value) {
		case 'hidden': {
			for (const l of labels) {
				l.classList.add('hidden');
			};
			break;
		};
		case 'shown': {
			for (const l of labels) {
				l.classList.remove('hidden');
			};
			break;
		};
	}
}
