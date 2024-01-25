'use client'

/* eslint sort-keys: error */
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useRef } from 'react'
import type { z } from 'zod'
import { Anchor, Footer, Navbar, ThemeSwitch, TOC } from '../components'
import type { themeSchema } from '../schemas'
import { getGitIssueUrl, useGitEditUrl } from '../utils'
import { useConfig } from './config'

export type DocsThemeConfig = z.infer<typeof themeSchema>

const ThemeConfigContext = createContext<DocsThemeConfig>({} as DocsThemeConfig)
ThemeConfigContext.displayName = 'ThemeConfig'
export const useThemeConfig = () => useContext(ThemeConfigContext)

export function ThemeConfigProvider({
  value,
  children
}: {
  value: DocsThemeConfig
  children: ReactNode
}): ReactElement {
  const storeRef = useRef<DocsThemeConfig>()
  storeRef.current ||= {
    ...value,
    editLink: {
      component: function EditLink({ className, filePath, children }) {
        const editUrl = useGitEditUrl(filePath)
        if (!editUrl) {
          return null
        }
        return (
          <Anchor className={className} href={editUrl}>
            {children}
          </Anchor>
        )
      },
      ...value.editLink
    },
    feedback: {
      useLink() {
        const config = useConfig()
        const themeConfig = useThemeConfig()
        return getGitIssueUrl({
          labels: themeConfig.feedback.labels,
          repository: themeConfig.docsRepositoryBase,
          title: `Feedback for “${config.title}”`
        })
      },
      ...value.feedback
    },
    footer: {
      component: Footer,
      ...value.footer
    },
    navbar: {
      component: Navbar,
      ...value.navbar
    },
    themeSwitch: {
      component: ThemeSwitch,
      ...value.themeSwitch
    },
    toc: {
      component: TOC,
      ...value.toc
    }
  }
  return (
    <ThemeConfigContext.Provider value={storeRef.current}>
      {children}
    </ThemeConfigContext.Provider>
  )
}
