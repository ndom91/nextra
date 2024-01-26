import { Layout } from 'nextra-theme-blog'

export const metadata = {
  // title: 'Next.js',
  // description: 'Generated by Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout
          pageOpts={{ frontMatter: {}, pageMap: [] }}
          themeConfig={{
            darkMode: true
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}