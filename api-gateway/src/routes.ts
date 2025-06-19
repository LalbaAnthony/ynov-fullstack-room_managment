interface Route {
    url: string;
    auth: boolean;
    creditCheck: boolean;
    rateLimit?: {
        windowMs: number;
        max: number;
    };
    proxy: {
        target: string;
        router?: { [key: string]: string };
        changeOrigin: boolean;
        pathFilter?: string;
        pathRewrite?: { [key: string]: string };
    };
}

const routes: Route[] = [
    {
        url: '/user',
        auth: false,
        creditCheck: false,
        proxy: {
            target: "http://localhost:3002",
            changeOrigin: true,
        }
    },
];

export { routes, Route };