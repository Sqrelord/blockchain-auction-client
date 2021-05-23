module.exports = {
	extends: [
		'stylelint-config-recommended',
		'stylelint-config-recess-order'
	],
	plugins: [
		'stylelint-scss',
		'stylelint-order'
	],
	rules: {
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['extends', 'ignores']
			}
		],
		'indentation': 2,
		'number-leading-zero': null,
		'max-empty-lines': 2,
		'selector-type-no-unknown': [
			true,
			{
				ignoreTypes: ['page', 'view']
			}
		],
		'unit-no-unknown': [
			true,
			{
				ignoreUnits: ['rpx', 'upx']
			}
		],
		'order/order': [
			[
				'custom-properties',
				'declarations'
			],
			{
				'disableFix': true
			}
		]
	}
}
