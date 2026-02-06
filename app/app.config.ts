export default defineAppConfig({
   appName: "Boncos",
   ui: {
      colors: {
         primary: "purple",
         secondary: "lime",
         neutral: "slate"
      },
      pageHeader: {
         slots: {
            root: "border-0",
         },
      },
      modal: {
         variants: {
            fullscreen: {
               false: {
                  content: "max-w-2xl"
               }
            }
         }
      }
   },
})
