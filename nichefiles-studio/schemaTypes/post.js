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
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' }, // Standard text formatting
        { type: 'code' },  // For code snippets (we'll need to install a plugin for this next)
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