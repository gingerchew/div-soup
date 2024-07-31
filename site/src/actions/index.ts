import { defineAction, z } from 'astro:actions';

export const server = {
    getWebsite: defineAction({
        accept: 'form',
        input: z.object({
            website: z.string().url(),
        }),
        handler: async ({ website }) => {
            try {
                let url = new URL(website);
                switch(true) {
                    case url.protocol !== 'https:':
                        url.protocol = 'https:';
                    // add more url fixes and checks as necessary
                }
                const result = await fetch(url.href);
                const content = await result.text();
    
                return { success: true, content }
            } catch(e:any) {
                return { success: false, content: '', message: e.message }
            }
        }
    })
};