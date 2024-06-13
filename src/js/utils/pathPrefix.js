export function pathPrefix() {
  const depth = location.pathname.split('/').filter(el => el).length - 1
  return depth > 0 ? '../'.repeat(depth) : ''
}