describe('kaifa.unixEpochService', function () {
	var unixEpochService;
	beforeEach(module('kaifa'));
	beforeEach(inject(function ($injector) {
		unixEpochService = $injector.get('unixEpochService');
	}));
	it('Should output correct time', function () {
		var d = unixEpochService.formatUnixTimestamp(1426886641);
		console.log(d);
		expect(d).toBeTruthy();
	});
	it('Should output correct date', function () {
		var d = unixEpochService.formatUnixTimestampDate(1426886641);
		console.log(d);
		expect(d).toBeTruthy();
	});
});
describe('kaifa.state', function () {
	var state;
	beforeEach(module('kaifa'));
	beforeEach(inject(function ($injector) {
		state = $injector.get('state');
	}));
	it('Should get gas', function () {
		expect(state.gas).toBeTruthy();
	});
	it('Should get electricity', function () {
		expect(state.elektriciteit).toBeTruthy();
	});
});