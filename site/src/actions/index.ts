import { defineAction, z } from 'astro:actions';

export const server = {
    getWebsite: defineAction({
        accept: 'form',
        input: z.object({
            website: z.string().url(),
        }),
        handler: async ({ website }) => {
            if (website.indexOf('https://') < 0) return { success: false, content: '' };

            const result = await fetch(website);
            const content = await result.text();

            return { success: true, content }
        }
    })
};