export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'zinc'
    },
    button: {
      slots: {
        base: 'hover:cursor-pointer'
      }
    },
    checkbox: {
      slots: {
        base: 'hover:cursor-pointer'
      }
    }
  }
})
