class Example {
	private testFns: {
		instant: (key: string | Array<string>) => any,
		stream: (key: string | Array<string>) => any,
	} = {
		instant: (key: string | Array<string>) => '',
		stream: (key: string | Array<string>) => '',
	};

	testFn() {
		this.testFns.instant('TS.instant');
		this.testFns.instant("TS.instant1");
		this.testFns.instant(`TS.instant2`);
		this.testFns.stream('TS.steam');
	}
}
