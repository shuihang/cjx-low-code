import { computed, inject, provide, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export const dialogProviderKey = Symbol('dialogProviderKey')

type DialogProvide = ComputedRef<{
  isFullscreen: Ref<boolean>
  slotSuffix?: string
}>

export const useDialogProviderKey = (props: DialogProvide) => {
  return provide(dialogProviderKey, props)
}

export const useDialogInjectKey = (): DialogProvide => {
  return inject(
    dialogProviderKey,
    computed(() => ({
      isFullscreen: ref<boolean>(false),
      slotSuffix: '',
    }))
  ) as DialogProvide
}
