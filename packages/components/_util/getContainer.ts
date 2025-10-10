export function getContainer() {
  const head = document.querySelector('head')
  return head || document.body
}
