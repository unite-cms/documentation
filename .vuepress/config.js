module.exports = {
    title: 'unite cms',
    description: 'v0.8.0',
    themeConfig: {
        nav: [
            {text: 'Unite cms', link: 'https://www.unitecms.io/index.html' },
            {text: 'Blog', link: 'https://medium.com/unite-cms' },
            {text: 'Git Hub', link: 'https://github.com/unite-cms/unite-cms' },
            {text: 'Gitter', link: 'https://gitter.im/unite-cms/Lobby'}
            
            
        ],

        sidebar: [
            {
                title: 'GETTING STARTED',
                path: '/docs/getting-started/'
            },
            
            {
                title: 'BASIC CONCEPTS',
                path: '/docs/basic-concepts/'
            },

            {
                title: 'FIELDS',
                path: '/docs/fields/'
            },

            {
                title: 'VIEWS',
                path: '/docs/views/'
            }
        ]      
    }
}