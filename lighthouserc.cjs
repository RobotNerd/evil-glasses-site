const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

module.exports = {
	ci: {
		collect: {
			startServerCommand: 'npm run preview',
			startServerReadyPattern: '.',
			url: [
				'http://localhost:4173/',
				'http://localhost:4173/books/press-start-for-love',
				'http://localhost:4173/stories/the-lava-farmer'
			],
			numberOfRuns: 3
		},
		assert: {
			assertions: Object.fromEntries(
				categories.map((c) => [`categories:${c}`, ['error', { minScore: 0.95 }]])
			)
		},
		upload: { target: 'filesystem', outputDir: '.lighthouseci' }
	}
};
