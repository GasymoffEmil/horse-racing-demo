/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts$': ['ts-jest', {
			tsconfig: {
				strict: true,
				esModuleInterop: true,
				resolveJsonModule: true,
				skipLibCheck: true,
				module: 'CommonJS',
				moduleResolution: 'node',
				baseUrl: '.',
				paths: { '@/*': ['src/*'] },
			},
		}],
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
	testMatch: ['**/__tests__/**/*.spec.ts'],
}
