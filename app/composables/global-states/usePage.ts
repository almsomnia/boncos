type PageConfig = {
   title: string
}

export default function (init?: () => PageConfig): Ref<PageConfig | undefined> {
   return useState<PageConfig>("page", init)
}
