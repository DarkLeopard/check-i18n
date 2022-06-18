export interface ICookedResult {
	foundedKeys: ICookedResultKeysProp;
	unfoundedKeys: ICookedResultKeysProp;
}

interface ICookedResultKeysProp {
	amount: number;
	keys: string[];
}
