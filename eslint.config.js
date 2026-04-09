import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'

export default [
  js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
      {
          rules: {
          // Suas regras customizadas
            'vue/multi-word-component-names': 'warn',
            'no-unused-vars': 'warn',
            'no-console': 'warn',
          }
      }
]
