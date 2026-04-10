export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: { type: 'category' },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    // The newly registered views field!
    {
      name: 'views',
      title: 'Page Views',
      type: 'number',
      initialValue: 0,
      readOnly: true, 
      description: 'Number of times this post has been viewed.',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' }, 
        { type: 'code' },  
        {
          name: 'embeddedImage',
          title: 'Embedded Image URL',
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'Image URL',
              type: 'url',
              description: 'Paste the direct link to the image (e.g., from Google Drive)',
            },
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            }
          ]
        }
      ],
    },
  ],
}