// src/types.d.ts

/// <reference types="vite/client" />

// 解决 ?worker 后缀报错
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

// Export types for module usage
export * from './index'
