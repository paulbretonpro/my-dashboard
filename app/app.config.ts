export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
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
