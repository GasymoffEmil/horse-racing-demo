/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts$': ['ts-jest', {
			tsconfig: './tsconfig.test.json',
		}],
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
	testMatch: ['**/__tests__/**/*.spec.ts'],
}
