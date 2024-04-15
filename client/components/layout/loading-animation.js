import React from 'react'

// 定义样式对象
const styles = {
  loaderBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  imgStyle: {
    marginRight: '1rem',
    width: '180px',
    height: '180px',
  },
  // 注释掉的部分是你之前注释的CSS，这里暂时保留，以便你决定是否需要
  // line: {
  //   height: '150px',
  //   width: '3px',
  //   backgroundColor: '#003e52',
  // },
  loader: {
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: '30px',
    display: 'inline-grid',
    color: '#003e52', // 默认颜色
    position: 'relative', // 为了使用伪元素样式，我们通过JSX无法直接添加伪元素
  },
}

function LoadingAnimation() {
  // 注意：伪元素(`:before`, `:after`)不能直接在JSX中定义，它们需要在CSS文件中或通过全局样式添加
  return (
    <div className="loader-box" style={styles.loaderBox}>
      <img
        src="http://localhost:3005/img/logo-indigo-loading.png"
        alt=""
        style={styles.imgStyle}
      />
      <div className="loader" style={styles.loader}>
        Loading...
      </div>
    </div>
  )
}

export default LoadingAnimation
