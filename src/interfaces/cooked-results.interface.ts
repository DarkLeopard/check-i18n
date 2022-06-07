export interface ICookedResult {
	foundedKeys: ICookedResultKeysProp;
	unfoundedKeys: ICookedResultKeysProp;
	specialReport: {
		cutKeys: {
			keys: string[];
			amount: number;
		};
	};
	excludedKeys: {
		manually: string[];
	};
}

interface ICookedResultKeysProp {
	amount: number;
	keys: string[];
}
