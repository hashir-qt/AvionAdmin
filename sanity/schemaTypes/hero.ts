import { defineType,defineField } from "sanity";

export const Hero = defineType({
    name: 'heroImage',
    type: 'document',
    title: 'Two Hero Image',
    fields: [
        defineField({
            name: 'image1',
            type: 'image',
            title: '1st Image',
        }),
       defineField({
            name: 'image2',
            type: 'image',
            title: '2nd Image',
        }),
    ]
})