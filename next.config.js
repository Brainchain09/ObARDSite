module.exports = {
    async rewrites() {
        return [
            {
                source: '/:slug*',
                destination: 'http://melodi.irit.fr/graphdb/repositories/ObARDI?query:slug*',
            },
        ]
    },
};