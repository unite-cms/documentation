module.exports = {
    title: 'unite cms',
    description: '0.10',
    themeConfig: {
        logo: '/assets/logo.png',
        editLinks: true,
        displayAllHeaders: true,
        nav: [
            { text: 'Docs', link: '/docs/' },
            { text: 'Reference', link: '/reference/' },
            { text: 'Website', link: 'https://unitecms.io' },
            { text: 'Github', link: 'https://github.com/unite-cms/unite-cms' },
        ],
        sidebar: {
            '/docs/': [
                '',
                'fields/',
            ],
            '/reference/': [
                '',
            ]
        }
    },
};
