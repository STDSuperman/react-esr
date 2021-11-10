
// 检测补全相对路径的前缀，兼容模块导入场景
export const checkRelativeModulePrefix = (path: string) => {
  const reg = /$(\.\/|\/|\.\.\/)/;
  if (!reg.test(path)) {
    return `./${path}`
  }
  return path;
}

// 统一转换文件路径分隔符
export const normalizePathSeparator = (path: string) => {
  return path.replace(/\\/g, '/')
}
